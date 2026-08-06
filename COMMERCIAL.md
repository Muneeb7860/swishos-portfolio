# 💼 SwishOS Platform: Commercial Offerings

## Executive Summary
SwishOS is a security guardrail for AI agents that take real-world actions — it evaluates requests before tool execution and blocks unsafe ones with a cryptographically signed audit trail.

The commercial model is a funnel, not three independent products: the free open-source harness drives awareness, the audit converts a prospect into a paying customer, and the audit converts into the retainer — the actual recurring product. **This document must stay in sync with the live pricing page** (`src/dictionaries/en.json` → `pricingPage`); if they diverge, the site is the source of truth.

---

## 💰 Commercial Pricing & Service Tiers

| Tier | What it is | Price | Role in the funnel |
| :--- | :--- | :--- | :--- |
| **1. `agentic-redteam` (OSS)** | Self-serve red-team harness — clone and run against your own agent | **Free** (Apache 2.0) | Top of funnel. No sales contact required. |
| **2. 1-Week Timeboxed Security Audit** | Fixed-scope diagnostic: up to 3 core agentic tool workflows, OWASP Agentic Top 10 threat map, 1 PR-ready patch, 60-min executive debrief | **$7,500 – $12,500** per engagement | Converts a qualified prospect into a paying customer. Priced to be affordable enough to say yes to, not to be the main revenue line. |
| **3. Guardrail & Red-Team Retainer** | Continuous protection: red-team sweeps on every release, guardrail/eval maintenance as new attacks emerge, regression telemetry, direct architecture access | **$4,500 / month** | The actual recurring business. Retainer sales usually start right after an audit — the audit's findings are the sales pitch for the retainer. |

Every engagement begins with an intake triage call. If a prospect's architecture exceeds standard audit scope, we provide a custom proposal before any contract is finalized.

---

## 📑 What the audit actually tests

Run via the `agentic-redteam` harness against the prospect's real endpoint — **138 payloads across 14 check categories** (verified against the live GitHub repo and the published PyPI package; update this line if the harness's real scope changes, not the other way around):

`jailbreak`, `prompt_injection`, `indirect_injection`, `pii_leakage`, `code_safety`, `schema_compliance`, `action_level`, `mcp_security`, `clean_queries`, `multi_turn`, `centroid_probes`, `crypto_probes`, `asi04_sandbox_escape`, `asi10_rogue_persistence`

Plus optional GART adaptive LLM-attacker mode (`--use-llm-attacker`), which mutates payloads based on the target's actual refusal text rather than sending a fixed list.

Deliverables:
- Severity-ranked OWASP LLM Top 10 threat report, with the actual payload and the agent's actual response as evidence (not just pass/fail)
- SARIF v2.1.0 export (GitHub Code Scanning / SonarQube compatible) alongside the structured JSON report
- Reproducible exploit scripts (curl-runnable)
- 1 PR-ready remediation patch
- 60-minute executive/CISO debrief

---

## 🔒 What we can currently back up

Only claims that are true of the shipped product belong here:

- Blocked requests carry an HMAC-SHA256 signed audit header (`x-swishos-audit-proof`), verifiable out-of-band — not every request, only blocked ones.
- Black-box, gray-box, or white-box testing supported — full source access is not required (repo access improves the depth of guardrail PR recommendations, but red-teaming can run purely against a staging API endpoint under NDA).
- Works against any HTTP-exposed agent: custom Python/Node stacks, LangChain, AutoGen, CrewAI, LlamaIndex, or proprietary orchestration layers.

Do not add latency SLAs, uptime guarantees, or compliance certifications (SOC2, ISO 27001, HIPAA, etc.) to this document unless they've actually been obtained or contractually committed to — none currently have.

---

## 📬 Contact & Sales Inquiries

- **Website**: [https://swishos.io](https://swishos.io)
- **Live demo**: [https://swishos.io/en/demo](https://swishos.io/en/demo)
- **Pricing / book an audit**: `swishos.io/en/pricing`
