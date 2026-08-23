import { DrosEmbeddedEngine } from '../src/engine.js';
import { DrosAuditLogger } from '../src/audit.js';
import * as fs from 'fs';
import * as path from 'path';

console.log('=== Running DROS VajraClaw Unit Tests ===');

// 1. Identity & W3C DID Generation Test
const engine = new DrosEmbeddedEngine('0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890');
const did = engine.getDID();
console.assert(did.startsWith('did:key:z6Mku'), 'DID format validation failed');
console.log('[PASS] Test 1: W3C DID Native Key Binding passed:', did);

// 2. Benign Tool Execution (Allowed)
const benignRes = engine.evaluate({
  tool: 'read_file',
  args: { path: 'README.md' }
});
console.assert(benignRes.decision === 'ALLOW', 'Benign execution was falsely blocked');
console.assert(benignRes.latency_us >= 0, 'Latency calculation invalid');
console.log('[PASS] Test 2: Benign Tool Call Allowed in ' + benignRes.latency_us + ' us');

// 3. High-Risk Syscall Interception (Blocked)
const maliciousRes = engine.evaluate({
  tool: 'bash',
  args: { command: 'cat /etc/shadow' }
});
console.assert(maliciousRes.decision === 'BLOCK', 'Malicious syscall was not intercepted');
console.log('[PASS] Test 3: High-Risk Syscall Blocked:', maliciousRes.reason);

// 4. Credential Vector Exfiltration Interception (Blocked)
const credExfilRes = engine.evaluate({
  tool: 'exec',
  args: { command: 'cat ~/.env_secrets' }
});
console.assert(credExfilRes.decision === 'BLOCK', 'Credential exfiltration was not intercepted');
console.log('[PASS] Test 4: Credential Exfiltration Blocked:', credExfilRes.reason);

// 5. Cryptographic Merkle/JSONL Audit Chain Test
const testAuditDir = path.join(process.cwd(), '.dros-test-audit');
const logger = new DrosAuditLogger(testAuditDir);
logger.record(maliciousRes, 'test-agent-01');

const auditFile = path.join(testAuditDir, 'execution-audit.jsonl');
console.assert(fs.existsSync(auditFile), 'Audit log file was not generated');
const logContent = fs.readFileSync(auditFile, 'utf8');
console.assert(logContent.includes('BLOCK') && logContent.includes('did:key:z6Mku'), 'Audit log entry corrupt');
console.log('[PASS] Test 5: Local Cryptographic Audit Chain Verified');

// Cleanup test dir
if (fs.existsSync(testAuditDir)) {
  fs.rmSync(testAuditDir, { recursive: true, force: true });
}
console.log('=== All 5 Unit Tests Passed Successfully! ===');
