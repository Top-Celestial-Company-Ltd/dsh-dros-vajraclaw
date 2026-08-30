import { z } from 'zod';
import { DrosEmbeddedEngine, EvaluationRequest, EvaluationResult } from './engine.js';
import { DrosAuditLogger } from './audit.js';
export { DrosEmbeddedEngine, EvaluationRequest, EvaluationResult, DrosAuditLogger };
export declare const name = "dsh-plugin-vajraclaw";
export declare const ConfigSchema: z.ZodObject<{
    gatewayUrl: z.ZodDefault<z.ZodString>;
    enableEmbeddedEngine: z.ZodDefault<z.ZodBoolean>;
    strictFailClosed: z.ZodDefault<z.ZodBoolean>;
    licenseKey: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    auditLogDir: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type Config = z.infer<typeof ConfigSchema>;
export declare function apply(ctx: any, config: Config): void;
