/**
 * DROS Agent Governance Plugin for DSH (DeepSeek Harness)
 * --------------------------------------------------------
 * Intercepts tool calls and evaluates deterministic policies via DROS Gateway (Docker).
 */
export class DrosDshPlugin {
    settings;
    constructor(settings) {
        this.settings = {
            gatewayUrl: settings?.gatewayUrl || "http://localhost:8080",
            licenseKey: settings?.licenseKey || "",
            strictFailClosed: settings?.strictFailClosed ?? true,
        };
    }
    /**
     * DSH Lifecycle Hook: Called before any Agent executes a Tool Call
     */
    async beforeToolCall(context) {
        const { tool, args, agentId = "dsh-agent" } = context;
        try {
            const response = await fetch(`${this.settings.gatewayUrl}/evaluate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(this.settings.licenseKey ? { "Authorization": `Bearer ${this.settings.licenseKey}` } : {}),
                },
                body: JSON.stringify({
                    tool,
                    args,
                    agent_id: agentId,
                }),
            });
            if (!response.ok) {
                if (this.settings.strictFailClosed) {
                    return {
                        proceed: false,
                        error: `[DROS Security Gateway] Gateway returned HTTP ${response.status}. Strict Fail-Closed enforced.`,
                    };
                }
                return { proceed: true };
            }
            const data = (await response.json());
            if (data.decision === "BLOCK") {
                return {
                    proceed: false,
                    error: `[DROS Physical Interception] Tool '${tool}' was blocked by policy. Reason: ${data.reason}`,
                };
            }
            // Allowed
            return { proceed: true };
        }
        catch (err) {
            if (this.settings.strictFailClosed) {
                return {
                    proceed: false,
                    error: `[DROS Failsafe] Failed to reach DROS Gateway at ${this.settings.gatewayUrl}. Execution blocked (Strict Fail-Closed).`,
                };
            }
            return { proceed: true };
        }
    }
    /**
     * Activate Gumroad License
     */
    async activateLicense(key) {
        try {
            const res = await fetch(`${this.settings.gatewayUrl}/api/license/activate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ license_key: key }),
            });
            const data = await res.json();
            if (data.success) {
                this.settings.licenseKey = key;
                return { success: true, message: data.message };
            }
            return { success: false, message: data.error || "Activation failed" };
        }
        catch (e) {
            return { success: false, message: e.message };
        }
    }
}
// Default export for DSH loader
export default function initDrosPlugin(config) {
    const plugin = new DrosDshPlugin(config);
    return {
        id: "celestial.dros.guard",
        name: "DROS Agent Governance",
        hooks: {
            beforeToolCall: (ctx) => plugin.beforeToolCall(ctx),
        },
    };
}
