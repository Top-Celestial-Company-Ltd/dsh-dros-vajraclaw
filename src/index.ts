import { DrosEmbeddedEngine, EvaluationRequest, EvaluationResult } from './engine.js';
import { DrosAuditLogger } from './audit.js';
import { DrosPersonalProxyGate, loadPersonalConfig, DrosPersonalConfig } from './personal.js';
import * as fs from 'fs';
import * as path from 'path';

export { DrosEmbeddedEngine, EvaluationRequest, EvaluationResult, DrosAuditLogger, DrosPersonalProxyGate };

export const name = 'dsh-plugin-vajraclaw';

export interface Config {
  gatewayUrl?: string;
  enableEmbeddedEngine?: boolean;
  strictFailClosed?: boolean;
  licenseKey?: string;
  auditLogDir?: string;
  personalConfigFile?: string;
}

export const ConfigSchema = {
  type: 'object',
  properties: {
    gatewayUrl: { type: 'string', default: '' },
    enableEmbeddedEngine: { type: 'boolean', default: true },
    strictFailClosed: { type: 'boolean', default: false },
    licenseKey: { type: 'string', default: '' },
    auditLogDir: { type: 'string', default: '.dros-audit' },
    personalConfigFile: { type: 'string', default: 'dros.personal.config.json' }
  }
};

export function apply(ctx: any, config: Config) {
  const engine = new DrosEmbeddedEngine();
  const logger = new DrosAuditLogger(config.auditLogDir);
  const loggerService = ctx && ctx.logger ? ctx.logger('dros-governance') : console;

  let personalGate: DrosPersonalProxyGate | null = null;
  const personalConfigPath = path.resolve(process.cwd(), config.personalConfigFile || 'dros.personal.config.json');

  if (fs.existsSync(personalConfigPath)) {
    try {
      const raw = fs.readFileSync(personalConfigPath, 'utf8');
      const pConfig = loadPersonalConfig(raw);
      personalGate = new DrosPersonalProxyGate(pConfig);
      loggerService.info?.('[DROS Personal] Loaded DWGR-8 local governance config from: ' + personalConfigPath);
    } catch (err: any) {
      loggerService.warn?.('[DROS Personal] Failed to parse personal config: ' + err.message);
    }
  }

  loggerService.info?.('[DROS VajraClaw] Initializing local tool-call governance layer...');

  if (ctx && typeof ctx.on === 'function') {
    ctx.on('tool/call', async (data: any) => {
      const tool = data?.name || data?.tool || 'unknown-tool';
      const args = data?.args || data?.arguments || {};
      const agentId = data?.agentId || 'dsh-agent';

      // 1. DWGR-8 Personal Local Proxy Gate (if config file exists)
      if (personalGate) {
        const action = args?.action || args?.command || args?.operation || 'execute';
        const evalRes = await personalGate.evaluateInvocation({
          toolId: tool,
          action: typeof action === 'string' ? action : 'execute',
          params: typeof args === 'object' && args !== null ? args : {}
        });

        if (evalRes.decision === 'DENY') {
          loggerService.warn?.('[DROS Personal Interception] Blocked tool ' + tool + ': ' + evalRes.reason);
          const blockErr = new Error('[DROS Personal Interception] ' + evalRes.reason);
          if (typeof data?.abort === 'function') {
            data.abort(blockErr);
          } else {
            throw blockErr;
          }
          return;
        }
      }

      const req: EvaluationRequest = { tool, args, agentId };
      let evaluated = false;
      const rawTargetUrl = (config.gatewayUrl || '').trim();

      // 2. Only attempt remote Gateway evaluation if gatewayUrl is explicitly configured by user
      if (rawTargetUrl) {
        const normalizedUrl = rawTargetUrl.endsWith('/') ? rawTargetUrl.slice(0, -1) : rawTargetUrl;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1500);

          const res = await fetch(normalizedUrl + '/evaluate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(config.licenseKey ? { 'Authorization': 'Bearer ' + config.licenseKey } : {})
            },
            body: JSON.stringify(req),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const remoteData = (await res.json()) as EvaluationResult;
            logger.record(remoteData, agentId);
            evaluated = true;

            if (remoteData.decision === 'BLOCK') {
              loggerService.warn?.('[DROS Gateway Interception] Blocked tool ' + tool + ': ' + remoteData.reason);
              if (typeof data?.abort === 'function') {
                data.abort(new Error('[DROS Gateway Interception] ' + remoteData.reason));
              } else {
                throw new Error('[DROS Gateway Interception] ' + remoteData.reason);
              }
              return;
            }
          }
        } catch (err: any) {
          if (config.strictFailClosed) {
            loggerService.error?.('[DROS Strict-Failsafe] Gateway unreachable at ' + rawTargetUrl + '. Blocking execution.');
            if (typeof data?.abort === 'function') {
              data.abort(new Error('[DROS Strict-Failsafe] Gateway unreachable. Execution blocked.'));
            } else {
              throw new Error('[DROS Strict-Failsafe] Gateway unreachable. Execution blocked.');
            }
            return;
          }
        }
      }

      // 3. Embedded Regex Pattern Failsafe (Baseline defense)
      if (!evaluated && config.enableEmbeddedEngine) {
        const localResult = engine.evaluate(req);
        logger.record(localResult, agentId);

        if (localResult.decision === 'BLOCK') {
          loggerService.warn?.('[DROS Pattern Failsafe] Blocked tool ' + tool + ': ' + localResult.reason);
          if (typeof data?.abort === 'function') {
            data.abort(new Error('[DROS Pattern Failsafe] ' + localResult.reason));
          } else {
            throw new Error('[DROS Pattern Failsafe] ' + localResult.reason);
          }
        }
      }
    });
  }
}
