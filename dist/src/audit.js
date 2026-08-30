import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
export class DrosAuditLogger {
    logPath;
    lastHash = '0000000000000000000000000000000000000000000000000000000000000000';
    constructor(baseDir) {
        const dir = baseDir || path.join(process.cwd(), '.dros-audit');
        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir, { recursive: true });
            }
            catch { }
        }
        this.logPath = path.join(dir, 'execution-audit.jsonl');
        this.recoverLastHash();
    }
    recoverLastHash() {
        try {
            if (fs.existsSync(this.logPath)) {
                const content = fs.readFileSync(this.logPath, 'utf8').trim();
                if (content) {
                    const lines = content.split('\n');
                    const lastLine = lines[lines.length - 1];
                    if (lastLine) {
                        const parsed = JSON.parse(lastLine);
                        if (parsed && typeof parsed.record_hash === 'string') {
                            this.lastHash = parsed.record_hash;
                        }
                    }
                }
            }
        }
        catch { }
    }
    record(entry, agentId = 'dsh-agent') {
        try {
            const recordData = {
                timestamp: new Date().toISOString(),
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
        }
        catch { }
    }
}
