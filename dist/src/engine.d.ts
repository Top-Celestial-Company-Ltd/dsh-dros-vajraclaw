export interface EvaluationRequest {
    tool: string;
    args?: Record<string, any>;
    agentId?: string;
    sessionId?: string;
}
export interface EvaluationResult {
    decision: 'ALLOW' | 'BLOCK' | 'WARN';
    reason: string;
    tool: string;
    latency_us: number;
    did: string;
}
export declare class DrosEmbeddedEngine {
    private did;
    constructor(seedHex?: string);
    getDID(): string;
    evaluate(req: EvaluationRequest): EvaluationResult;
}
