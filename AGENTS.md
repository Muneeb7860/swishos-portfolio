<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## AI Agent Security & Governance Invariants
- **Authentic Solution Positioning**: Always position security products and services around verifiable architecture, realistic guardrail pipelines, and productized audit deliverables ($7.5k–$12.5k fixed audit, $4.5k/mo retainer). Avoid vaporware branding.
- **Multi-Stage Shift-Left Validation**: Web API routes accepting LLM prompts MUST apply NFKC normalization, homoglyph mapping, Base64 payload decoding, Markdown side-channel exfiltration blocking, and AST tool argument range validation (OWASP LLM06 Excessive Agency) before reaching downstream models.
- **Stateful Infrastructure & Hard Spend Caps (ASI10)**: Enforce hard $5/day per-agent spend limits with emergency kill switches, sliding-window rate limits (10 req/min per IP), and structured forensic logging matching the `security_incidents` database schema.
- **5-Layer Sandbox Escape Hardening (ASI06)**: Agent runtimes MUST enforce gVisor user-space kernel isolation (`--runtime=runsc`), `--read-only` root filesystems, `--tmpfs /tmp:rw,noexec,nosuid,size=64m`, `--memory=256m`, `--pids-limit=20`, capability WASI (zero ambient `env` inheritance), and Cloud Metadata egress blocking (`169.254.169.254`).
- **Zero-Trust Secret Leak Prevention**: Confidential API keys MUST NEVER be prefixed with `NEXT_PUBLIC_` or imported into Client Components (`'use client'`). Enforce build-time assertions (`secret-guard.ts`).
- **Statistical Multi-Run Red-Team Evals & CI/CD**: Always run red-team evaluations across multiple iterations (`--iterations N`) to compute statistical pass probabilities over non-deterministic LLM outputs, and expose 1-line reusable GitHub Actions (`action.yml`).
