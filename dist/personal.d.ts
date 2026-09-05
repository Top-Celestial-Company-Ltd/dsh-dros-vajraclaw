/**
 * DROS Personal (Community Edition) Local Proxy Gate
 *
 * Implements lightweight, zero-dependency local execution governance
 * directly aligned with DWGR-8 Normative Invariants for individual developers.
 */
export interface ParamConstraint {
    disallowedPatterns?: string[];
    max?: number;
    min?: number;
    requiredFields?: string[];
}
export interface ToolRule {
    toolId: string;
    allowedActions?: string[];
    blockedActions?: string[];
    paramConstraints?: Record<string, ParamConstraint>;
}
export interface DrosPersonalConfig {
    version: string;
    principalId: string;
    mode?: 'strict' | 'audit-only';
    rules: ToolRule[];
}
export interface InvocRequest {
    toolId: string;
    action: string;
    params: Record<string, any>;
}
export interface GateEvaluationResult {
    decision: 'ALLOW' | 'DENY';
    reason: string;
    leaseId?: string;
    violations: string[];
    timestamp: number;
}
export interface LocalAuditRecord {
    index: number;
    timestamp: number;
    toolId: string;
    action: string;
    paramsHash: string;
    decision: 'ALLOW' | 'DENY';
    reason: string;
    leaseId?: string;
}
export declare function loadPersonalConfig(jsonString: string): DrosPersonalConfig;
export declare class DrosPersonalProxyGate {
    private config;
    private auditChain;
    private auditRecords;
    constructor(config: DrosPersonalConfig);
    evaluateInvocation(req: InvocRequest): Promise<GateEvaluationResult>;
    getAuditRecords(): LocalAuditRecord[];
    getAuditChain(): string[];
}
export declare function runPersonalCli(): void;
