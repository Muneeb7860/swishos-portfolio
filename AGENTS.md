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
- **Enterprise Vector SVG Icon Invariant**: Security & governance applications targeting enterprise buyers MUST NOT use raw consumer emojis (`📦`, `🎯`, `🐙`, `📊`, `💻`, `🛠️`). Always use clean vector SVG line-art micro-icons (e.g. `Icons.tsx`).
- **3-Level CTA Visual Hierarchy**: Maintain strict visual button hierarchy to prevent viewport competition — Level 1 (Solid Primary Gradient) for main audit booking, Level 2 (Secondary Outline) for developer playground/repo links, and Level 3 (Ghost / Header Outline) for navbar actions.
- **Timeboxed Diagnostic Framing**: Frame fixed-price consulting as a "Timeboxed Diagnostic" with explicit scope caps (e.g. up to 3 tool workflows, OWASP threat map, 1 PR patch) and a mandatory intake triage notice before contract finalization.
- **High-Contrast Light Theme Tokens (WCAG AAA)**: Enforce Deep Slate Black (`#0F172A`) for headings and Slate Dark Muted (`#334155`) for body text, maintaining an 8.5:1 WCAG AAA contrast ratio in Light Mode.
