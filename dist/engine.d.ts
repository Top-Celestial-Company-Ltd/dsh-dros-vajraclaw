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
}
export declare class DrosEmbeddedEngine {
    constructor();
    evaluate(req: EvaluationRequest): EvaluationResult;
}
