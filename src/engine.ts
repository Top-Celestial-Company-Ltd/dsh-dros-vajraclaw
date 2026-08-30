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

export class DrosEmbeddedEngine {
  constructor() {}

  public evaluate(req: EvaluationRequest): EvaluationResult {
    const start = process.hrtime.bigint();
    const tool = (req.tool || '').trim().toLowerCase();
    const argsStr = JSON.stringify(req.args || {}).toLowerCase();

    // 1. High-Risk Shell Command & Destructive Pattern Regex Failsafe
    const dangerousPatterns: { regex: RegExp; desc: string }[] = [
      { regex: /\brm\s+-[a-z]*r[a-z]*f[a-z]*\s+(\/|\/\*|\.\/|~)/i, desc: 'Recursive forced deletion of root or workspace' },
      { regex: /\brm\s+-[a-z]*f[a-z]*r[a-z]*\s+(\/|\/\*|\.\/|~)/i, desc: 'Recursive forced deletion of root or workspace' },
      { regex: /\b(mkfs(\.[a-z0-9]+)?|dd\s+if=.*of=\/dev\/[a-z0-9]+)/i, desc: 'Disk formatting or direct block overwrite' },
      { regex: /(:(\(\)\{\s*:\|:&\s*\};:))/i, desc: 'Fork bomb execution' },
      { regex: /\bchmod\s+(-[a-z]+\s+)?777\s+\//i, desc: 'Global permission deregulation' },
      { regex: /\b(cat|head|tail|less|more|nano|vi|vim)\s+[^|;]*\/etc\/(shadow|sudoers)/i, desc: 'Direct inspection of sensitive system credential paths' }
    ];

    for (const item of dangerousPatterns) {
      if (item.regex.test(argsStr)) {
        const end = process.hrtime.bigint();
        const latency = Number(end - start) / 1000;
        return {
          decision: 'BLOCK',
          reason: `[DROS Pattern Failsafe] High-risk shell pattern detected: ${item.desc}`,
          tool: req.tool,
          latency_us: Math.max(1, Math.round(latency))
        };
      }
    }

    // 2. Sensitive Credential File Inspection Interception
    const credentialExfiltration = [
      'id_rsa',
      'id_ed25519',
      '.aws/credentials',
      '.env_secrets',
      '.bash_history'
    ];

    for (const cred of credentialExfiltration) {
      if (argsStr.includes(cred) && (tool.includes('exec') || tool.includes('bash') || tool.includes('eval') || tool.includes('read') || tool.includes('fs'))) {
        const end = process.hrtime.bigint();
        const latency = Number(end - start) / 1000;
        return {
          decision: 'BLOCK',
          reason: `[DROS Pattern Failsafe] Attempt to read sensitive credential path: "${cred}"`,
          tool: req.tool,
          latency_us: Math.max(1, Math.round(latency))
        };
      }
    }

    // 3. Allowed
    const end = process.hrtime.bigint();
    const latency = Number(end - start) / 1000;

    return {
      decision: 'ALLOW',
      reason: 'Local pattern check passed',
      tool: req.tool,
      latency_us: Math.max(1, Math.round(latency))
    };
  }
}

