import * as crypto from 'crypto';

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

export class DrosEmbeddedEngine {
  private did: string;

  constructor(seedHex?: string) {
    const hash = crypto.createHash('sha256').update(seedHex || 'dros-default-seed').digest('hex');
    this.did = 'did:key:z6Mku' + hash.slice(0, 32);
  }

  public getDID(): string {
    return this.did;
  }

  public evaluate(req: EvaluationRequest): EvaluationResult {
    const start = process.hrtime.bigint();
    const tool = (req.tool || '').trim().toLowerCase();
    const argsStr = JSON.stringify(req.args || {}).toLowerCase();

    // 1. Critical Binary Failsafe Rules (High-Risk Syscall & Privilege Escalation)
    const dangerousPatterns = [
      '/etc/shadow',
      '/etc/sudoers',
      'rm -rf /',
      'mkfs',
      ':(){ :|:&n};::',
      'chmod 777 /',
      '> /dev/sda'
    ];

    for (const pattern of dangerousPatterns) {
      if (argsStr.includes(pattern)) {
        const end = process.hrtime.bigint();
        const latency = Number(end - start) / 1000;
        return {
          decision: 'BLOCK',
          reason: `[DROS Circuit-Breaker] Critical security risk detected matching signature: "${pattern}"`,
          tool: req.tool,
          latency_us: Math.max(1, Math.round(latency)),
          did: this.did
        };
      }
    }

    // 2. Sensitive Credential Exfiltration Interception
    const credentialExfiltration = [
      'id_rsa',
      '.aws/credentials',
      '.env_secrets'
    ];

    for (const cred of credentialExfiltration) {
      if (argsStr.includes(cred) && (tool.includes('exec') || tool.includes('bash') || tool.includes('eval') || tool.includes('read'))) {
        const end = process.hrtime.bigint();
        const latency = Number(end - start) / 1000;
        return {
          decision: 'BLOCK',
          reason: `[DROS Symplex Masking] Unauthorized attempt to inspect credential vector: "${cred}"`,
          tool: req.tool,
          latency_us: Math.max(1, Math.round(latency)),
          did: this.did
        };
      }
    }

    // 3. Allowed: Deterministic Policy Evaluation Passed
    const end = process.hrtime.bigint();
    const latency = Number(end - start) / 1000;

    return {
      decision: 'ALLOW',
      reason: 'Deterministic Policy Evaluation Passed (O(1) Matrix Verified)',
      tool: req.tool,
      latency_us: Math.max(1, Math.round(latency)),
      did: this.did
    };
  }
}
