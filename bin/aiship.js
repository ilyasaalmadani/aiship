#!/usr/bin/env node

const path = require('path');
const { scan } = require('../src/scan');

const target = process.argv[2] || process.cwd();

console.log(`\n🚀 aiship — readiness check for AI-generated code\n`);
console.log(`Scanning: ${path.resolve(target)}\n`);

const result = scan(target);

console.log(`Score: ${result.score}/100`);
console.log(`Verdict: ${result.verdict}\n`);

if (result.findings.length === 0) {
  console.log('No issues found. Looking good for a first pass.');
} else {
  result.findings.forEach((f) => {
    console.log(`[${f.severity}] ${f.file}:${f.line}`);
    console.log(`  ${f.message}`);
    console.log(`  Fix: ${f.fix}\n`);
  });
}

console.log('\nThis is the open-source subset. For the full 148-check local Mac scanner, see SHIPSAFE.');
process.exit(result.score >= 80 ? 0 : 1);
