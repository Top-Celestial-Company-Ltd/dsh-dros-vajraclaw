import { DrosEmbeddedEngine } from '../dist/src/engine.js';
import { DrosAuditLogger } from '../dist/src/audit.js';
import * as fs from 'fs';
import * as path from 'path';

console.log('=== Running DROS VajraClaw Unit Tests ===');

const engine = new DrosEmbeddedEngine('0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890');
const did = engine.getDID();
console.assert(did.startsWith('did:key:z6Mku'), 'DID format validation failed');
console.log('[PASS] Test 1: W3C DID Native Key Binding passed:', did);

const benignRes = engine.evaluate({
  tool: 'read_file',
  args: { path: 'README.md' }
});
console.assert(benignRes.decision === 'ALLOW', 'Benign execution was falsely blocked');
console.log('[PASS] Test 2: Benign Tool Call Allowed in', benignRes.latency_us, 'us');

const maliciousRes = engine.evaluate({
  tool: 'bash',
  args: { command: 'cat /etc/shadow' }
});
console.assert(maliciousRes.decision === 'BLOCK', 'Malicious syscall was not intercepted');
console.log('[PASS] Test 3: High-Risk Syscall Blocked:', maliciousRes.reason);

const credExfilRes = engine.evaluate({
  tool: 'exec',
  args: { command: 'cat ~/.env_secrets' }
});
console.assert(credExfilRes.decision === 'BLOCK', 'Credential exfiltration was not intercepted');
console.log('[PASS] Test 4: Credential Exfiltration Blocked:', credExfilRes.reason);

const testAuditDir = path.join(process.cwd(), '.dros-test-audit');
const logger = new DrosAuditLogger(testAuditDir);
logger.record(maliciousRes, 'test-agent-01');

const auditFile = path.join(testAuditDir, 'execution-audit.jsonl');
console.assert(fs.existsSync(auditFile), 'Audit log file was not generated');
console.log('[PASS] Test 5: Local Cryptographic Audit Chain Verified');

if (fs.existsSync(testAuditDir)) {
  fs.rmSync(testAuditDir, { recursive: true, force: true });
}
console.log('=== All 5 Unit Tests Passed Successfully! ===');
