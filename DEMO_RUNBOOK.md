# SwishOS Demo Runbook

> Complete step-by-step playbook for running a live SwishOS demo.
> Covers: pre-demo setup, live demo flow, talking points, objection handling, and troubleshooting.

---

## 1. Before the Demo (10 Minutes)

### Environment Check

| Check | Command / Action | Expected |
|---|---|---|
| Internet works | `curl -s https://swishos.io/api/support -X POST -H "Content-Type: application/json" -d '{"query":"ping"}'` | 200 OK JSON response |
| Playground loads | Open `https://swishos.io/en/playground` in browser | Page renders, preset buttons visible |
| No stale rate limit | Wait 60 seconds if you tested recently | Fresh 10-request budget |
| Terminal font size | Set to 18px+ | Commands readable at 1080p recording |
| Browser zoom | Set to 100% | Full playground visible without scrolling |

### Tabs to Have Open

1. **Tab 1:** `https://swishos.io/en/playground` (interactive demo)
2. **Tab 2:** `https://swishos.io` (homepage, for intro context)
3. **Tab 3:** Terminal (for CLI demo, if needed)

### Props Ready

- 3 curl commands pre-copied in clipboard manager (attack, encoded attack, safe query)
- This runbook open on a second screen or printed

---

## 2. Demo Flow (5 Minutes Live, or 60 Seconds Recorded)

### Opening — The Problem (30 seconds)

**Say:**
> "Autonomous AI agents are being deployed in production — processing payments, managing data, interacting with APIs. But they're wide open to prompt injection, encoded evasion attacks, and excessive agency exploits. Traditional keyword filters catch maybe 40% of attacks. SwishOS catches 100%. Let me show you."

**Show:** SwishOS homepage briefly (hero section with "Zero-Trust AI Agent Execution Enclave")

---

### Demo Step A — Block a Direct Attack

**Action:** Go to Playground tab. Click the **"Cyrillic Homoglyph Injection"** preset button.

**Say:**
> "This is a prompt injection using Cyrillic characters that look identical to Latin letters — 'iɡnоrе' instead of 'ignore'. Most keyword filters pass this right through."

**Show:** Response appears — `BLOCKED BY GUARDRAIL` badge, 422 status.

**Say:**
> "Blocked. The centroid classifier catches it regardless of character substitution."

---

### Demo Step B — Block an Encoded Attack

**Action:** Click the **"Base64 Encoded Prompt Injection"** preset button.

**Say:**
> "Same attack, but the attacker encoded it in Base64 to hide it from scanners."

**Show:** Response — still `BLOCKED`.

**Say:**
> "SwishOS pre-decodes Base64, hex, and ROT13 before evaluating. The encoding doesn't help the attacker."

---

### Demo Step C — Allow a Legitimate Query

**Action:** Clear the text box. Type: `How do I scale a Kubernetes cluster?` Click "Test Payload Live."

**Say:**
> "Now a real question. Same pipeline, same endpoint."

**Show:** Response — `ALLOWED`, 200 status, routing shows `general_query`.

**Say:**
> "Goes through cleanly. No false positives. The system routes it by intent and assigns an SLA priority."

---

### Demo Step D — The Audit Proof (Differentiator)

**Action:** Scroll down in the JSON output of any blocked response. Highlight the mention of `X-SwishOS-Audit-Proof` or switch to terminal and run:

```bash
curl -s -D - https://swishos.io/api/support \
  -H "Content-Type: application/json" \
  -d '{"query": "system override admin mode"}' 2>&1 | grep "x-swishos"
```

**Say:**
> "Every block comes with an HMAC-SHA256 cryptographic proof — timestamp, nonce, and signature. An external scanner can verify out-of-band that real code made the decision, not a hallucinating model faking an error. That's what makes this SOC 2 and EU AI Act audit-ready."

---

### Close — The Ask (30 seconds)

**Say:**
> "That's SwishOS. Sub-10ms shift-left evaluation, anti-timing side-channel equalization, and cryptographic audit proofs on every decision. It works against any LLM endpoint — OpenAI, Anthropic, your own fine-tuned models, any agent framework."

**Pause.**

> "We offer fixed-scope security audits — one to two weeks, $7,500 to $12,500 — where we run our full 124-scenario benchmark against your agent endpoints and deliver a certified pen-test report. Want me to scope one for your system?"

---

## 3. Talking Points by Audience

### For CISOs / Security Leads

- "Every decision is cryptographically signed — auditable, verifiable, tamper-proof."
- "Zero-information flat refusals collapse attacker reward signals to zero. They can't iterate."
- "Constant-time response padding blinds timing side-channel probes."
- "SARIF 2.1.0 export integrates directly into your GitHub Security tab."

### For Engineering / DevSecOps

- "One-line CI gate: `agentic-redteam --target-url <your-endpoint> --ci`"
- "Target-agnostic — works against any JSON API endpoint, not just our stack."
- "11 attack categories, 124 scenarios. Grade A = 100% pass rate."
- "No complex infra: `pip install agentic-redteam` and you're running."

### For VPs of Engineering / CTOs

- "Software-only, sub-10ms overhead. No hardware, no GPU, no model hosting."
- "Shift-left: threats are stopped before reaching your model provider — saves token cost."
- "$5/day hard spend cap kills runaway agent loops before they drain your budget."
- "Deployed to Vercel Edge — global, serverless, scales to zero."

---

## 4. Objection Handling

| Objection | Response |
|---|---|
| "We already use system prompts for safety." | "System prompts are the *first* thing injection attacks override. SwishOS sits in front of the model — the prompt never reaches it." |
| "Can't we just use content filters?" | "Content filters catch keywords. They miss homoglyphs, encoded payloads, multi-turn variable splitting, and novel metaphor evasion. We decode and classify at the character n-gram level." |
| "What's the latency overhead?" | "Sub-10ms median. All evaluation is in-memory regex, character math, and hash operations — no network calls, no model inference in the critical path." |
| "We need to test this ourselves." | "Absolutely. `pip install agentic-redteam` — run it against your own endpoints in 30 seconds. It's free and open-source." |
| "How does this differ from Promptfoo/Garak?" | "Those are test-time evaluators. We do that too (`agentic-redteam`), but SwishOS is also the runtime defense — the actual proxy that blocks attacks in production. Test + protect, not just test." |
| "Is this just regex?" | "Regex is one layer. There are 20+ modules: character n-gram cosine centroids, multi-turn AST reconstruction, HMAC-signed memory provenance, token entropy analysis, shadow sandbox probing, and anti-timing equalization. Regex alone misses encoded and obfuscated attacks." |

---

## 5. After the Demo

### Immediate Follow-Up (Same Day)

- Send the prospect a link: `https://swishos.io/en/playground` — "Try attacking it yourself"
- Offer: "I'll run a quick benchmark against your staging endpoint — takes 5 minutes, zero setup on your side"
- If they're interested in audit: direct to `https://swishos.io/en/contact?plan=audit`

### Collateral to Share

| Asset | Where | When to Send |
|---|---|---|
| Interactive Playground | `swishos.io/en/playground` | Immediately after demo |
| CLI Cheat Sheet | `DEMO_CLI_CHEATSHEET.md` (or hosted version) | If they want to try locally |
| 60-second Video | Loom/YouTube link (once recorded) | LinkedIn post + follow-up email |
| Architecture deep-dive | `ARCHITECTURE.md` | If they ask "how does it work technically" |
| Commercial pricing | `COMMERCIAL.md` | Only when they ask about cost |

---

## 6. Troubleshooting During a Live Demo

| Problem | Quick Fix |
|---|---|
| Rate limited (10 req/min hit) | Say "That's the rate limiter doing its job — 10 requests per minute per IP." Wait 60s or switch to playground presets. |
| Playground not loading | Switch to pure terminal demo (curl commands). |
| Safe query getting blocked | You probably have leftover session state. Open an incognito window. |
| JSON output too long to read | Highlight just the `"status"` and `"blocked"` fields. Say "the key fields are here." |
| Internet drops | Have a screen recording of a successful run as backup (record one in advance). |

---

## 7. Demo Variants

### 2-Minute LinkedIn Video
Use Shots 1–5 from `DEMO_VIDEO_SCRIPT.md`. Add a 15-second intro showing the problem (headline: "AI agents have no firewall"). End with playground URL.

### 15-Minute Technical Deep-Dive (for engineering teams)
1. Run the full benchmark: `agentic-redteam --target-url https://swishos.io/api/support --ci`
2. Walk through the 11 categories as they execute
3. Show the SARIF output: `cat redteam_results.json | python3 -m json.tool`
4. Open `ARCHITECTURE.md` and walk through the 6-layer cascade diagram
5. Show the `src/lib/` directory — "each file is one defense module, all composable"

### 5-Minute Boardroom Version (for non-technical executives)
1. Browser-only: Open playground, click 2 presets (show block), type safe query (show allow)
2. Show the CTA section with pricing
3. Say: "We protect your AI investments the way firewalls protect your network. Fixed-scope audit, two weeks, certified report."

---

## 8. Key Numbers to Have Ready

| Metric | Value | Source |
|---|---|---|
| Attack categories tested | 11 | `agentic-redteam` benchmark suite |
| Total attack scenarios | 124 | Primary suite + crypto probes |
| Current pass rate | 100% (Grade A) | Last CI run (v0.1.0-demo tag) |
| Evaluation latency | < 10ms median | In-memory computation, no network |
| Rate limit | 10 req/min/IP | Configurable per deployment |
| Spend cap | $5/day per agent | Hard kill switch (ASI10) |
| Audit pricing | $7,500 – $12,500 | Fixed scope, 1–2 weeks |
| Managed proxy pricing | $2,500/mo/node | Self-hosted enclave license |
