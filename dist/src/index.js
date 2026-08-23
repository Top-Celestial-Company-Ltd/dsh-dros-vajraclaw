import { z } from 'zod';
import { DrosEmbeddedEngine } from './engine.js';
import { DrosAuditLogger } from './audit.js';
export const name = 'dsh-plugin-vajraclaw';
export const ConfigSchema = z.object({
    gatewayUrl: z.string().default('http://localhost:8080'),
    enableEmbeddedEngine: z.boolean().default(true),
    strictFailClosed: z.boolean().default(false),
    licenseKey: z.string().optional().default(''),
    auditLogDir: z.string().default('.dros-audit')
});
export function apply(ctx, config) {
    const engine = new DrosEmbeddedEngine();
    const logger = new DrosAuditLogger(config.auditLogDir);
    const loggerService = ctx.logger ? ctx.logger('dros-governance') : console;
    loggerService.info?.('[DROS VajraClaw] Initializing Deterministic Agent Runtime Governance layer...');
    loggerService.info?.('[DROS VajraClaw] Bound Identity: ' + engine.getDID());
    // Intercept beforeToolCall / tool evaluation via Cordis event bus
    ctx.on('tool/call', async (data) => {
        const tool = data?.name || data?.tool || 'unknown-tool';
        const args = data?.args || data?.arguments || {};
        const agentId = data?.agentId || 'dsh-agent';
        const req = { tool, args, agentId };
        let evaluated = false;
        if (config.gatewayUrl) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1500);
                const res = await fetch(config.gatewayUrl + '/evaluate', {
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
                        loggerService.warn?.('[DROS Circuit-Breaker] Blocked tool ' + tool + ': ' + remoteData.reason);
                        if (data.abort)
                            data.abort(new Error('[DROS Physical Interception] ' + remoteData.reason));
                        return;
                    }
                }
            }
            catch (err) {
                if (config.strictFailClosed) {
                    loggerService.error?.('[DROS Strict-Failsafe] Gateway unreachable at ' + config.gatewayUrl + '. Blocking execution.');
                    if (data.abort)
                        data.abort(new Error('[DROS Strict-Failsafe] Gateway unreachable. Execution blocked.'));
                    return;
                }
            }
        }
        if (!evaluated && config.enableEmbeddedEngine) {
            const localResult = engine.evaluate(req);
            logger.record(localResult, agentId);
            if (localResult.decision === 'BLOCK') {
                loggerService.warn?.('[DROS Embedded Fuse] Blocked tool ' + tool + ': ' + localResult.reason);
                if (data.abort)
                    data.abort(new Error('[DROS Embedded Fuse] ' + localResult.reason));
            }
        }
    });
}
