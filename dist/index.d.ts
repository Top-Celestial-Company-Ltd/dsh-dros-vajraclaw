import { DrosEmbeddedEngine, EvaluationRequest, EvaluationResult } from './engine.js';
import { DrosAuditLogger } from './audit.js';
import { DrosPersonalProxyGate } from './personal.js';
export { DrosEmbeddedEngine, EvaluationRequest, EvaluationResult, DrosAuditLogger, DrosPersonalProxyGate };
export declare const name = "dsh-plugin-vajraclaw";
export interface Config {
    gatewayUrl?: string;
    enableEmbeddedEngine?: boolean;
    strictFailClosed?: boolean;
    licenseKey?: string;
    auditLogDir?: string;
    personalConfigFile?: string;
}
export declare const ConfigSchema: {
    type: string;
    properties: {
        gatewayUrl: {
            type: string;
            default: string;
        };
        enableEmbeddedEngine: {
            type: string;
            default: boolean;
        };
        strictFailClosed: {
            type: string;
            default: boolean;
        };
        licenseKey: {
            type: string;
            default: string;
        };
        auditLogDir: {
            type: string;
            default: string;
        };
        personalConfigFile: {
            type: string;
            default: string;
        };
    };
};
export declare function apply(ctx: any, config: Config): void;
