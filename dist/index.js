import { DrosEmbeddedEngine } from './engine.js';
import { DrosAuditLogger } from './audit.js';
export { DrosEmbeddedEngine, DrosAuditLogger };
export const name = 'dsh-plugin-vajraclaw';
export const ConfigSchema = {
    type: 'object',
    properties: {
        gatewayUrl: { type: 'string', default: '' },
        enableEmbeddedEngine: { type: 'boolean', default: true },
        strictFailClosed: { type: 'boolean', default: false },
        licenseKey: { type: 'string', default: '' },
        auditLogDir: { type: 'string', default: '.dros-audit' }
    }
};
export function apply(ctx, config) {
    const engine = new DrosEmbeddedEngine();
    const logger = new DrosAuditLogger(config.auditLogDir);
    const loggerService = ctx && ctx.logger ? ctx.logger('dros-governance') : console;
    loggerService.info?.('[DROS VajraClaw] Initializing local tool-call pattern failsafe layer...');
    if (ctx && typeof ctx.on === 'function') {
        ctx.on('tool/call', async (data) => {
            const tool = data?.name || data?.tool || 'unknown-tool';
            const args = data?.args || data?.arguments || {};
            const agentId = data?.agentId || 'dsh-agent';
            const req = { tool, args, agentId };
            let evaluated = false;
            const targetUrl = (config.gatewayUrl || '').trim();
            // Only attempt remote Gateway evaluation if gatewayUrl is explicitly configured by user
            if (targetUrl) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 1500);
                    const res = await fetch(targetUrl.replace(/\/+$/, '') + '/evaluate', {
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
                        const remoteData = (await res.json());
                        logger.record(remoteData, agentId);
                        evaluated = true;
                        if (remoteData.decision === 'BLOCK') {
                            loggerService.warn?.('[DROS Gateway Interception] Blocked tool ' + tool + ': ' + remoteData.reason);
                            if (typeof data?.abort === 'function') {
                                data.abort(new Error('[DROS Gateway Interception] ' + remoteData.reason));
                            }
                            else {
                                throw new Error('[DROS Gateway Interception] ' + remoteData.reason);
                            }
                            return;
                        }
                    }
                }
                catch (err) {
                    if (config.strictFailClosed) {
                        loggerService.error?.('[DROS Strict-Failsafe] Gateway unreachable at ' + targetUrl + '. Blocking execution.');
                        if (typeof data?.abort === 'function') {
                            data.abort(new Error('[DROS Strict-Failsafe] Gateway unreachable. Execution blocked.'));
                        }
                        else {
                            throw new Error('[DROS Strict-Failsafe] Gateway unreachable. Execution blocked.');
                        }
                        return;
                    }
                }
            }
            if (!evaluated && config.enableEmbeddedEngine) {
                const localResult = engine.evaluate(req);
                logger.record(localResult, agentId);
                if (localResult.decision === 'BLOCK') {
                    loggerService.warn?.('[DROS Pattern Failsafe] Blocked tool ' + tool + ': ' + localResult.reason);
                    if (typeof data?.abort === 'function') {
                        data.abort(new Error('[DROS Pattern Failsafe] ' + localResult.reason));
                    }
                    else {
                        throw new Error('[DROS Pattern Failsafe] ' + localResult.reason);
                    }
                }
            }
        });
    }
}
