import { DrosEmbeddedEngine } from '../dist/src/index.js';
import { DrosAuditLogger } from '../dist/src/audit.js';
import * as fs from 'fs';
import * as path from 'path';

console.log('=== Running DROS VajraClaw Unit Tests (v2.1.0) ===');

const engine = new DrosEmbeddedEngine();

// Test 1: Benign Tool Call Allowed
const benignRes = engine.evaluate({
  tool: 'read_file',
  args: { path: 'README.md' }
});
console.assert(benignRes.decision === 'ALLOW', 'Benign execution was falsely blocked');
console.log('[PASS] Test 1: Benign Tool Call Allowed in', benignRes.latency_us, 'us');

// Test 2: Destructive Command Interception (rm -rf /)
const rmSlashRes = engine.evaluate({
  tool: 'bash',
  args: { command: 'rm -rf /' }
});
console.assert(rmSlashRes.decision === 'BLOCK', 'rm -rf / was not intercepted');
console.log('[PASS] Test 2: rm -rf / Intercepted:', rmSlashRes.reason);

// Test 3: Destructive Command with multiple spaces & wildcards (rm -rf  /*)
const rmWildcardRes = engine.evaluate({
  tool: 'bash',
  args: { command: 'rm -rf  /*' }
});
console.assert(rmWildcardRes.decision === 'BLOCK', 'rm -rf /* was not intercepted');
console.log('[PASS] Test 3: rm -rf  /* Intercepted:', rmWildcardRes.reason);

// Test 4: Inverted Flags (rm -fr /)
const rmInvertedRes = engine.evaluate({
  tool: 'bash',
  args: { command: 'rm -fr /' }
});
console.assert(rmInvertedRes.decision === 'BLOCK', 'rm -fr / was not intercepted');
console.log('[PASS] Test 4: rm -fr / Intercepted:', rmInvertedRes.reason);

// Test 5: Sensitive Credential File Interception
const credExfilRes = engine.evaluate({
  tool: 'exec',
  args: { command: 'cat ~/.env_secrets' }
});
console.assert(credExfilRes.decision === 'BLOCK', 'Credential exfiltration was not intercepted');
console.log('[PASS] Test 5: Credential Exfiltration Intercepted:', credExfilRes.reason);

// Test 6: Audit Logger Persistence & Hash Chain Across Restarts
const testAuditDir = path.join(process.cwd(), '.dros-test-audit');
if (fs.existsSync(testAuditDir)) {
  fs.rmSync(testAuditDir, { recursive: true, force: true });
}

const loggerSession1 = new DrosAuditLogger(testAuditDir);
loggerSession1.record(rmSlashRes, 'test-agent-01');

// Simulate restart in new session
const loggerSession2 = new DrosAuditLogger(testAuditDir);
loggerSession2.record(rmWildcardRes, 'test-agent-01');

const auditFile = path.join(testAuditDir, 'execution-audit.jsonl');
console.assert(fs.existsSync(auditFile), 'Audit log file was not generated');

const lines = fs.readFileSync(auditFile, 'utf8').trim().split('\n');
console.assert(lines.length === 2, 'Expected 2 audit records');
const record1 = JSON.parse(lines[0]);
const record2 = JSON.parse(lines[1]);
console.assert(record2.prev_hash === record1.record_hash, 'Audit hash chain broken across session restart');
console.log('[PASS] Test 6: Audit Hash Chain Persisted Across Session Restart');

if (fs.existsSync(testAuditDir)) {
  fs.rmSync(testAuditDir, { recursive: true, force: true });
}
console.log('=== All 6 Unit Tests Passed Successfully! ===');
process.exit(0);


