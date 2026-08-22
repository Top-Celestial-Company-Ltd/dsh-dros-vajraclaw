/**
 * DROS Agent Governance Plugin for DSH (DeepSeek Harness)
 * --------------------------------------------------------
 * Intercepts tool calls and evaluates deterministic policies via DROS Gateway (Docker).
 */
export interface DrosPluginSettings {
    gatewayUrl: string;
    licenseKey?: string;
    strictFailClosed: boolean;
}
export interface ToolCallContext {
    tool: string;
    args: Record<string, any>;
    agentId?: string;
    sessionId?: string;
}
export interface DrosEvaluationResponse {
    decision: "ALLOW" | "BLOCK";
    tool: string;
    agent_id: string;
    reason: string;
    latency_us?: number;
}
export declare class DrosDshPlugin {
    private settings;
    constructor(settings?: Partial<DrosPluginSettings>);
    /**
     * DSH Lifecycle Hook: Called before any Agent executes a Tool Call
     */
    beforeToolCall(context: ToolCallContext): Promise<{
        proceed: boolean;
        error?: string;
    }>;
    /**
     * Activate Gumroad License
     */
    activateLicense(key: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
export default function initDrosPlugin(config: DrosPluginSettings): {
    id: string;
    name: string;
    hooks: {
        beforeToolCall: (ctx: ToolCallContext) => Promise<{
            proceed: boolean;
            error?: string;
        }>;
    };
};
