import { EvaluationResult } from './engine.js';
export declare class DrosAuditLogger {
    private logPath;
    private lastHash;
    constructor(baseDir?: string);
    record(entry: EvaluationResult, agentId?: string): void;
}
