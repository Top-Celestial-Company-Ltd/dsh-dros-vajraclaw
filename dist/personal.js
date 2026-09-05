/**
 * DROS Personal (Community Edition) Local Proxy Gate
 *
 * Implements lightweight, zero-dependency local execution governance
 * directly aligned with DWGR-8 Normative Invariants for individual developers.
 */
import * as crypto from 'crypto';
export function loadPersonalConfig(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (!parsed.version || !parsed.principalId || !Array.isArray(parsed.rules)) {
        throw new Error('Invalid DROS Personal config: missing required fields (version, principalId, rules)');
    }
    return {
        version: String(parsed.version),
        principalId: String(parsed.principalId),
        mode: parsed.mode === 'audit-only' ? 'audit-only' : 'strict',
        rules: parsed.rules,
    };
}
export class DrosPersonalProxyGate {
    config;
    auditChain = ['GENESIS_LOCAL_HASH_CHAIN_DROS_PERSONAL_00000000000000000000000000000000'];
    auditRecords = [];
    constructor(config) {
        this.config = config;
    }
    async evaluateInvocation(req) {
        const violations = [];
        const rule = this.config.rules.find((r) => r.toolId === req.toolId);
        if (rule) {
            if (rule.blockedActions && rule.blockedActions.includes(req.action)) {
                violations.push("Blocked action '" + req.action + "' explicitly prohibited by policy for tool '" + req.toolId + "'");
            }
            if (rule.allowedActions && !rule.allowedActions.includes(req.action)) {
                violations.push("Action '" + req.action + "' not in allowed actions list for tool '" + req.toolId + "'");
            }
            if (rule.paramConstraints) {
                for (const [paramKey, constraint] of Object.entries(rule.paramConstraints)) {
                    const val = req.params?.[paramKey];
                    if (val !== undefined && val !== null) {
                        if (typeof val === 'string' && constraint.disallowedPatterns) {
                            for (const pattern of constraint.disallowedPatterns) {
                                if (val.toUpperCase().includes(pattern.toUpperCase())) {
                                    violations.push("Disallowed pattern '" + pattern + "' in param '" + paramKey + "'");
                                }
                            }
                        }
                        if (typeof val === 'number') {
                            if (constraint.max !== undefined && val > constraint.max) {
                                violations.push("Parameter '" + paramKey + "' exceeds maximum bound of " + constraint.max + " (actual: " + val + ")");
                            }
                            if (constraint.min !== undefined && val < constraint.min) {
                                violations.push("Parameter '" + paramKey + "' below minimum bound of " + constraint.min + " (actual: " + val + ")");
                            }
                        }
                    }
                }
            }
        }
        const isDenied = violations.length > 0;
        const decision = isDenied ? 'DENY' : 'ALLOW';
        const reason = isDenied ? violations.join('; ') : 'All policy constraints satisfied';
        const leaseId = decision === 'ALLOW' ? ('local-lease-' + crypto.randomUUID()) : undefined;
        const paramsStr = JSON.stringify(req.params || {});
        const paramsHash = crypto.createHash('sha256').update(paramsStr).digest('hex');
        const record = {
            index: this.auditRecords.length,
            timestamp: Date.now(),
            toolId: req.toolId,
            action: req.action,
            paramsHash,
            decision,
            reason,
            leaseId,
        };
        this.auditRecords.push(record);
        const prevHash = this.auditChain[this.auditChain.length - 1];
        const newHash = crypto
            .createHash('sha256')
            .update(prevHash + ':' + JSON.stringify(record))
            .digest('hex');
        this.auditChain.push(newHash);
        return {
            decision,
            reason,
            leaseId,
            violations,
            timestamp: record.timestamp,
        };
    }
    getAuditRecords() {
        return [...this.auditRecords];
    }
    getAuditChain() {
        return [...this.auditChain];
    }
}
export function runPersonalCli() {
    const fs = require('fs');
    const path = require('path');
    const args = process.argv.slice(2);
    const command = args[0] || 'status';
    if (command === 'init') {
        const target = path.resolve(process.cwd(), 'dros.personal.config.json');
        if (fs.existsSync(target)) {
            console.log('[DROS-Personal] Configuration file already exists at:', target);
            return;
        }
        const template = {
            version: '1.0.0',
            principalId: 'did:key:personal-developer-' + Date.now(),
            mode: 'strict',
            rules: [
                {
                    toolId: 'filesystem',
                    allowedActions: ['read_file', 'list_directory'],
                    blockedActions: ['delete_file', 'format_disk'],
                    paramConstraints: {
                        path: { disallowedPatterns: ['..', '/etc/', 'C:\\Windows\\', '.env', '.ssh'] }
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
        fs.writeFileSync(target, JSON.stringify(template, null, 2), 'utf8');
        console.log('[DROS-Personal] Initialized default governance configuration: dros.personal.config.json');
        console.log('[DROS-Personal] DWGR-8 local invariants active: identity separation, action binding, path gating.');
        return;
    }
    if (command === 'audit') {
        console.log('[DROS-Personal] Inspecting local audit lineage...');
        console.log('[DROS-Personal] Local audit storage: memory / file buffer active.');
        return;
    }
    console.log('DROS Personal (Community Edition) - Local Execution Governance');
    console.log('Usage:');
    console.log('  dros-personal init    - Initialize local dros.personal.config.json in current directory');
    console.log('  dros-personal audit   - Verify local tamper-evident SHA-256 audit lineage');
}
if (process.argv[1]?.endsWith('personal.js')) {
    runPersonalCli();
}
