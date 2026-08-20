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

export class DrosDshPlugin {
  private settings: DrosPluginSettings;

  constructor(settings?: Partial<DrosPluginSettings>) {
    this.settings = {
      gatewayUrl: settings?.gatewayUrl || "http://localhost:8080",
      licenseKey: settings?.licenseKey || "",
      strictFailClosed: settings?.strictFailClosed ?? true,
    };
  }

  /**
   * DSH Lifecycle Hook: Called before any Agent executes a Tool Call
   */
  async beforeToolCall(context: ToolCallContext): Promise<{ proceed: boolean; error?: string }> {
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

      const data = (await response.json()) as DrosEvaluationResponse;

      if (data.decision === "BLOCK") {
        return {
          proceed: false,
          error: `[DROS Physical Interception] Tool '${tool}' was blocked by policy. Reason: ${data.reason}`,
        };
      }

      // Allowed
      return { proceed: true };
    } catch (err: any) {
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
  async activateLicense(key: string): Promise<{ success: boolean; message: string }> {
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
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
}

// Default export for DSH loader
export default function initDrosPlugin(config: DrosPluginSettings) {
  const plugin = new DrosDshPlugin(config);
  return {
    id: "celestial.dros.guard",
    name: "DROS Agent Governance",
    hooks: {
      beforeToolCall: (ctx: ToolCallContext) => plugin.beforeToolCall(ctx),
    },
  };
}
