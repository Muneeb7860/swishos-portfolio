# Prospect List & Outreach Playbook

> Generated 2026-07-30. Targets: early-stage agentic AI companies most likely to
> need security governance before their next funding round or SOC2 audit.

---

## The Playbook (How to Approach Without Hurting Their Systems)

### Step 1: Identify Public-Facing Agent Endpoints

You do NOT scan/attack anyone's system. Instead:
- Look for companies with **public demos, playgrounds, or API docs**
- Run `agentic-redteam` against their **public demo endpoint only** (same as any user would)
- Or simply review their architecture from public docs and infer gaps

### Step 2: Produce a "Free Findings Preview"

Run their public endpoint through 3-5 basic payloads (prompt injection, Base64, jailbreak).
Capture the results. Write a 1-page summary:
- "We tested your public demo endpoint with 5 standard OWASP attacks"
- "3 of 5 were not blocked. Here's what that means for production."
- "Full audit available — or try our free CLI yourself: pip install agentic-redteam"

### Step 3: Cold DM on LinkedIn

Template:
```
Hey [Name],

Saw [Company] is building [their agent product]. Impressive work.

After the OpenAI/Artifactory breach last week, I ran a quick security scan
against [their public demo/playground]. Found [X] of 5 standard attacks weren't
blocked at the guardrail layer.

Not a sales pitch — just thought you'd want to know. Happy to share the
full findings (1-page, no strings).

Also: our scanner is free and open-source if you want to run it yourself:
pip install agentic-redteam

[Your name]
swishos.io
```

### Step 4: If They Respond

- Share the 1-page findings (the "taste of blood")
- Offer: "Want me to run the full 138-payload benchmark? Takes 10 minutes, free"
- If they say yes: `agentic-redteam --target-url <their-endpoint> --save --report`
- Deliver the report. Then: "Want us to fix these? That's our audit service."

---

## Tier 1: High-Value Targets (AI-native companies with public agent endpoints)

These companies have agents in production AND public-facing demos you can legitimately test.

| Company | What they build | Why they need you | Public endpoint / entry point |
|---------|----------------|-------------------|-------------------------------|
| **Beam.ai** | Enterprise AI agent platform | They sell agentic workflows to Fortune 500 — a breach kills their business | beam.ai (demo available) |
| **Relevance AI** | No-code AI agent builder | 200K+ users building agents with zero security tooling | relevanceai.com (free tier, public agents) |
| **CrewAI** | Multi-agent orchestration framework | 10.8M monthly installs, zero native security layer | Public docs + community agents |
| **Agno (prev. Phidata)** | Agent framework (formerly Phidata) | Growing fast, no security governance story | Public playground |
| **Supercog AI** | "Agentic" framework for autonomous agents | Small team, likely no dedicated security | GitHub + docs |
| **Callio.dev** | API gateway for AI agents | They ARE the infrastructure — need to prove security | Interactive API playground |
| **Auctor (YC)** | Agentic OS for system integrators | YC-backed, will need SOC2 for enterprise sales | ycombinator.com/companies/auctor |
| **Cerenovus (YC)** | Company knowledge graph + AI agents | Handles sensitive corporate documents | ycombinator.com/companies |

## Tier 2: Indian Agentic AI Startups (your timezone, warm market)

172 agentic AI companies in India, $60M raised in 2026. Most have zero security story.

| Company | What they build | Signal |
|---------|----------------|--------|
| **SwishX** (Bengaluru) | Agentic AI for pharma/medtech | Ex-Google/Amazon founders, $5M ARR target. Agents touch patient data. |
| **India YC AI batch** (30 companies) | Various agentic products | ycombinator.com/companies/industry/ai/india — 30 companies, most pre-security |
| **Google Startups Accelerator India 2026** (20 companies) | AI-first startups across climate/health/finance | blog.google/intl/en-in/ — prestigious cohort, all building agents |
| **Tracxn India agentic AI** (172 companies) | Full list of Indian agentic startups | livemint.com reports only 4 at Series B — most are early and security-unaware |

## Tier 3: Framework Users (developers who will hit security problems soon)

These aren't companies to sell audits to — they're developers who'll discover they need guardrails and find your CLI.

| Framework | Monthly installs | Where their users hang out |
|-----------|-----------------|---------------------------|
| **LangChain/LangGraph** | 309M / 66.5M | GitHub, Discord, r/LangChain |
| **CrewAI** | 10.8M | GitHub, Twitter/X, YouTube |
| **Pydantic AI** | Growing | GitHub, Python community |
| **Google ADK** | New | Cloud forums, GCP community |

**Approach for Tier 3:** Don't DM. Instead:
- Write a blog post: "I ran 138 attacks against a LangGraph agent. Here's what got through."
- Post it to r/LangChain, Hacker News, dev.to
- Include `pip install agentic-redteam` at the end
- The developers who care will self-select

---

## The "81% Stat" — Your Opening Line

From the Okta CISO report (2026):
> "81% of CISOs worry their AI agents are running with access no one is reviewing.
> Only 47% can identify every agent in their environment."

Use this in every cold outreach. It's not your claim — it's Okta's survey of 306 CISOs.
Source: cybersecurity-insiders.com/ai-governance-gap-cisos-ai-agents/

---

## The "1 in 5" Stat — Your Urgency Driver

From NeuralTrust (2026):
> "One in five has already experienced a security breach directly attributable to an AI agent."

Source: neuraltrust.ai/blog/the-state-of-ai-agent-security-2026

---

## What NOT to Do

1. **Don't scan private endpoints without permission.** Only test public demos/playgrounds that any user can access.
2. **Don't fabricate findings.** If their public demo blocks everything, say so. "Your public endpoint handled our basic tests well. Want us to run the advanced 138-payload suite?"
3. **Don't name CVEs you didn't find.** The Artifactory CVEs belong to OpenAI's researchers, not you.
4. **Don't spam.** 5 quality DMs per day > 50 templated ones.
5. **Don't claim you "hacked" them.** You tested a public endpoint. Frame it as helpful, not adversarial.

---

## Weekly Cadence

| Day | Action |
|-----|--------|
| Monday | Identify 5 new targets from Tier 1/2 with public endpoints |
| Tuesday | Run basic scans (5 payloads each), document findings |
| Wednesday | Send 5 LinkedIn DMs with findings previews |
| Thursday | Follow up on any responses, offer full scans |
| Friday | Post content (blog/LinkedIn) targeting Tier 3 framework users |

---

## Tools You Already Have

```bash
# Test a public endpoint (5 quick payloads)
agentic-redteam prompt_injection jailbreak --target-url https://their-demo.com/api --iterations 1

# Full audit for a prospect who says yes
agentic-redteam --target-url https://their-endpoint.com/api --save --report --client-name "Acme"

# Generate the report
cat audit_report.md  # ← this is what you send them
```
