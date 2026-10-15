# aiship

> Local readiness check for AI-generated code before you ship.  
> Zero-install. One command. Runs entirely on your machine.

```bash
npx aiship
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

## What it does

AI coding agents (Cursor, Claude Code, Copilot, etc.) are fast at producing working code. They are less consistent at the boring but dangerous parts:

- Hardcoded secrets and tokens
- Debug leftovers (`console.log` with keys, `debugger`)
- Basic patterns that commonly slip through in vibe-coded projects

**aiship** scans your local folder, gives a simple 0–100 readiness score, and lists findings with a concrete fix suggestion.

It is intentionally small. It is the open-source subset of the checks I care about most when reviewing AI-generated code.

## Quick start

```bash
npx aiship
# or
npx aiship ./my-project
```

Exit code is non-zero if the score is below 80.

## Example output

```
🚀 aiship — readiness check for AI-generated code

Scanning: /path/to/project

Score: 65/100
Verdict: NEEDS ATTENTION

[high] src/config.js:12
  Possible Stripe live key found
  Fix: Move to environment variable and rotate the key immediately.

[medium] src/api.js:47
  Possible secret in console.log
  Fix: Remove debug leftover before shipping.
```

## Relationship to SHIPSAFE

This tool is **not** a replacement for SHIPSAFE.

SHIPSAFE is the full local Mac scanner (148 checks covering secrets, debug config, unprotected admin routes, dependencies, destructive migrations, and more). It is a paid app on the Mac App Store.

**aiship** is the free, open-source, zero-install CLI that covers a focused subset of the most common issues in AI-generated code. It exists so more developers can catch the obvious problems quickly. The complete, polished experience stays in SHIPSAFE.

## Roadmap

- [ ] More secret patterns and context (agent instruction files)
- [ ] Pre-commit hook template
- [ ] GitHub Action
- [ ] JSON / SARIF output
- [ ] Better scoring and severity tuning

## License

MIT © Ilyas Akbar Almadani

---

Built by [Ilyas Almadani](https://github.com/ilyasaalmadani). For the full local Mac scanner, see SHIPSAFE.
