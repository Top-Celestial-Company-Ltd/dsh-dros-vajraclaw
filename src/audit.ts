import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { EvaluationResult } from './engine.js';

export class DrosAuditLogger {
  private logPath: string;
  private lastHash: string = '0000000000000000000000000000000000000000000000000000000000000000';

  constructor(baseDir?: string) {
    const dir = baseDir || path.join(process.cwd(), '.dros-audit');
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {}
    }
    this.logPath = path.join(dir, 'execution-audit.jsonl');
  }

  public record(entry: EvaluationResult, agentId: string = 'dsh-agent'): void {
    try {
      const recordData = {
        timestamp: new Date().toISOString(),
        did: entry.did,
        agent_id: agentId,
        tool: entry.tool,
        decision: entry.decision,
        reason: entry.reason,
        latency_us: entry.latency_us,
        prev_hash: this.lastHash
      };

      const hash = crypto.createHash('sha256').update(JSON.stringify(recordData)).digest('hex');
      this.lastHash = hash;

      const line = JSON.stringify({ ...recordData, record_hash: hash }) + '\n';
      fs.appendFileSync(this.logPath, line, 'utf8');
    } catch {}
  }
}
