const fs = require('fs');
const path = require('path');

const SECRET_PATTERNS = [
  { re: /sk_live_[a-zA-Z0-9]{20,}/g, name: 'Stripe live key' },
  { re: /sk_test_[a-zA-Z0-9]{20,}/g, name: 'Stripe test key' },
  { re: /AKIA[0-9A-Z]{16}/g, name: 'AWS access key' },
  { re: /ghp_[a-zA-Z0-9]{36}/g, name: 'GitHub personal access token' },
  { re: /xox[baprs]-[0-9a-zA-Z-]{10,}/g, name: 'Slack token' },
  { re: /AIza[0-9A-Za-z\\-_]{35}/g, name: 'Google API key' },
];

const DEBUG_PATTERNS = [
  { re: /console\.log\s*\(.*?(key|secret|token|password)/gi, name: 'Possible secret in console.log' },
  { re: /debugger;/g, name: 'debugger statement' },
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (/\.(js|ts|tsx|jsx|mjs|cjs|json|md|env)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function scan(root) {
  const files = walk(root);
  const findings = [];

  for (const file of files) {
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      for (const p of SECRET_PATTERNS) {
        if (p.re.test(line)) {
          findings.push({
            severity: 'high',
            file: path.relative(root, file),
            line: idx + 1,
            message: `Possible ${p.name} found`,
            fix: 'Move to environment variable and rotate the key immediately.'
          });
          p.re.lastIndex = 0;
        }
      }
      for (const p of DEBUG_PATTERNS) {
        if (p.re.test(line)) {
          findings.push({
            severity: 'medium',
            file: path.relative(root, file),
            line: idx + 1,
            message: p.name,
            fix: 'Remove debug leftover before shipping.'
          });
          p.re.lastIndex = 0;
        }
      }
    });
  }

  const high = findings.filter(f => f.severity === 'high').length;
  const score = Math.max(0, 100 - high * 25 - findings.length * 5);
  const verdict = score >= 80 ? 'READY' : score >= 50 ? 'NEEDS ATTENTION' : 'NOT READY';

  return { score, verdict, findings };
}

module.exports = { scan };
