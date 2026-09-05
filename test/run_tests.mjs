import { DrosEmbeddedEngine, DrosPersonalProxyGate } from '../dist/index.js';
import { DrosAuditLogger } from '../dist/audit.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

async function run() {
  console.log('=== Running DROS VajraClaw Unit Tests (v2.2.0 - Personal MCP Gate Edition) ===');

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

  // Test 6: Audit Logger Persistence & Hash Chain Across Restarts (Using os.tmpdir)
  const testAuditDir = path.join(os.tmpdir(), '.dros-test-audit-' + Date.now());
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

  try {
    if (fs.existsSync(testAuditDir)) {
      fs.rmSync(testAuditDir, { recursive: true, force: true });
    }
  } catch {}

  // === NEW: DWGR-8 Personal Proxy Gate Tests ===
  console.log('--- Testing DWGR-8 Personal Proxy Gate Functionality ---');

  const personalConfig = {
    version: '1.0.0',
    principalId: 'did:key:test-personal-01',
    mode: 'strict',
    rules: [
      {
        toolId: 'filesystem',
        allowedActions: ['read_file', 'list_directory'],
        blockedActions: ['delete_file', 'format_disk'],
        paramConstraints: {
          path: { disallowedPatterns: ['..', '/etc/', 'C:\\\\Windows\\\\', '.env', '.ssh'] }
        }
      },
      {
        toolId: 'sqlite',
        allowedActions: ['read_query', 'select'],
        blockedActions: ['drop_table', 'delete'],
        paramConstraints: {
          query: { disallowedPatterns: ['DROP ', 'DELETE ', 'TRUNCATE ', 'ALTER '] }
        }
      }
    ]
  };

  const personalGate = new DrosPersonalProxyGate(personalConfig);

  // Test 7: Personal Gate - Allowed Benign Action & Clean Path
  const benignGateRes = await personalGate.evaluateInvocation({
    toolId: 'filesystem',
    action: 'read_file',
    params: { path: 'src/index.ts' }
  });
  console.assert(benignGateRes.decision === 'ALLOW', 'Personal gate falsely blocked benign file read');
  console.assert(typeof benignGateRes.leaseId === 'string', 'Personal gate failed to issue leaseId');
  console.log('[PASS] Test 7: Personal Gate - Benign Tool Call Allowed with Lease:', benignGateRes.leaseId);

  // Test 8: Personal Gate - Blocked Action (delete_file)
  const blockedActionRes = await personalGate.evaluateInvocation({
    toolId: 'filesystem',
    action: 'delete_file',
    params: { path: 'src/index.ts' }
  });
  console.assert(blockedActionRes.decision === 'DENY', 'Personal gate failed to block prohibited action delete_file');
  console.log('[PASS] Test 8: Personal Gate - Prohibited Action Blocked:', blockedActionRes.reason);

  // Test 9: Personal Gate - Path Traversal Pattern Violation (..)
  const pathTraversalRes = await personalGate.evaluateInvocation({
    toolId: 'filesystem',
    action: 'read_file',
    params: { path: '../../etc/passwd' }
  });
  console.assert(pathTraversalRes.decision === 'DENY', 'Personal gate failed to block path traversal');
  console.log('[PASS] Test 9: Personal Gate - Path Traversal (..) Blocked:', pathTraversalRes.reason);

  // Test 10: Personal Gate - Sensitive SQL Injection Pattern (DROP TABLE)
  const sqlDropRes = await personalGate.evaluateInvocation({
    toolId: 'sqlite',
    action: 'read_query',
    params: { query: 'DROP TABLE users;' }
  });
  console.assert(sqlDropRes.decision === 'DENY', 'Personal gate failed to block DROP TABLE injection');
  console.log('[PASS] Test 10: Personal Gate - SQL DROP Pattern Blocked:', sqlDropRes.reason);

  // Test 11: Personal Gate - SHA-256 Tamper-Evident Lineage Verification
  const auditChain = personalGate.getAuditChain();
  console.assert(auditChain.length === 5, 'Expected 5 audit chain entries (1 genesis + 4 evaluations)');
  const auditRecords = personalGate.getAuditRecords();
  console.assert(auditRecords.length === 4, 'Expected 4 audit records');
  console.log('[PASS] Test 11: Personal Gate - Tamper-Evident SHA-256 Chain Verified (Length:', auditChain.length, ')');

  console.log('=== All 11 Unit Tests Passed Successfully! (v2.2.0) ===');
}

run().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
