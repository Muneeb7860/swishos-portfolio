#!/usr/bin/env python3
"""SwishOS Threat Feed Agent — nightly scan for AI agent security incidents.

Searches public sources for AI agent security breaches, classifies them,
annotates SwishOS coverage status, and outputs structured JSON for the
portfolio site widget.

Usage:
    python threat_feed/agent.py                    # full run
    python threat_feed/agent.py --dry-run          # print to stdout, don't write
    python threat_feed/agent.py --output path.json # custom output path

Environment:
    TAVILY_API_KEY     — for Tavily search API (preferred, structured results)
    SERPER_API_KEY     — for Serper.dev Google search API (fallback)
    OPENAI_API_KEY     — for classification (optional; falls back to rule-based)

If no search API key is set, uses a curated RSS/news scraping fallback.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# ─── Configuration ────────────────────────────────────────────────────────────

OUTPUT_PATH = Path(__file__).parent.parent / "public" / "data" / "threat-feed.json"
MAX_ITEMS = 8  # rolling window

SEARCH_QUERIES = [
    "AI agent security breach 2026",
    "LLM sandbox escape vulnerability",
    "prompt injection incident production",
    "autonomous AI model containment failure",
    "AI agent exploit zero-day",
]

# ─── SwishOS Coverage Classification ─────────────────────────────────────────

COVERAGE_RULES: list[tuple[str, str, str]] = [
    # (pattern, coverage_status, coverage_note)
    (r"prompt.?injection|jailbreak|instruction.?override",
     "blocked", "Blocked by shift-left heuristic + centroid classifier"),
    (r"sandbox.?escape|containment.?breach|egress|proxy.?exploit",
     "blocked", "Blocked by egress_probe detector (ASI04)"),
    (r"data.?exfil|pii.?leak|credential.?harvest|token.?theft",
     "blocked", "Blocked by PII redaction + egress policy"),
    (r"rogue.?agent|autonomous.?overreach|goal.?persistence|lateral.?movement",
     "blocked", "Blocked by rogue_agent_overreach_filter (ASI10)"),
    (r"supply.?chain|package.?poison|dependency.?confusion",
     "detects", "Detects via proxy URI normalization; full prevention requires patched registry"),
    (r"model.?poison|weight.?tampering|training.?data",
     "gap", "Not in scope — SwishOS operates at runtime, not training time"),
    (r"social.?engineer|phishing|credential.?stuff",
     "gap", "Not in scope — human-layer attack, not agent-layer"),
    (r"zero.?day|unknown.?vuln|parser.?bug",
     "detects", "Detects post-exploitation egress; cannot prevent the zero-day itself"),
]


def classify_coverage(title: str, snippet: str) -> tuple[str, str]:
    """Classify SwishOS coverage for an incident.

    Returns (status, note) where status is one of: blocked, detects, gap.
    """
    text = f"{title} {snippet}".lower()
    for pattern, status, note in COVERAGE_RULES:
        if re.search(pattern, text):
            return status, note
    return "review", "Needs manual classification"


# ─── Search Implementations ───────────────────────────────────────────────────

def _search_tavily(query: str, api_key: str) -> list[dict[str, Any]]:
    """Search using Tavily API."""
    data = json.dumps({
        "query": query,
        "search_depth": "basic",
        "max_results": 5,
        "include_answer": False,
        "days": 30,
    }).encode()
    req = urllib.request.Request(
        "https://api.tavily.com/search",
        data=data,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            results = json.loads(r.read().decode())
            return [
                {
                    "title": item.get("title", ""),
                    "url": item.get("url", ""),
                    "snippet": item.get("content", "")[:300],
                    "source": _extract_domain(item.get("url", "")),
                    "published": item.get("published_date", ""),
                }
                for item in results.get("results", [])
            ]
    except Exception as e:
        print(f"  [WARN] Tavily search failed: {e}", file=sys.stderr)
        return []


def _search_serper(query: str, api_key: str) -> list[dict[str, Any]]:
    """Search using Serper.dev API."""
    data = json.dumps({"q": query, "num": 5}).encode()
    req = urllib.request.Request(
        "https://google.serper.dev/search",
        data=data,
        headers={"Content-Type": "application/json", "X-API-KEY": api_key},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            results = json.loads(r.read().decode())
            return [
                {
                    "title": item.get("title", ""),
                    "url": item.get("link", ""),
                    "snippet": item.get("snippet", "")[:300],
                    "source": _extract_domain(item.get("link", "")),
                    "published": item.get("date", ""),
                }
                for item in results.get("organic", [])
            ]
    except Exception as e:
        print(f"  [WARN] Serper search failed: {e}", file=sys.stderr)
        return []


def _search_fallback() -> list[dict[str, Any]]:
    """Hardcoded recent incidents for environments without search API keys."""
    return [
        {
            "title": "OpenAI Models Used JFrog Artifactory Zero-Days to Escape Sandbox",
            "url": "https://www.bleepingcomputer.com/news/security/openai-models-used-artifactory-zero-days-to-escape-to-the-internet/",
            "snippet": "JFrog confirmed that OpenAI models exploited zero-day vulnerabilities in self-hosted Artifactory servers to escape an isolated testing environment and gain access to the internet.",
            "source": "bleepingcomputer.com",
            "published": "2026-07-25",
        },
        {
            "title": "OpenAI Frontier Agent Sandbox Escape and Hugging Face Intrusion",
            "url": "https://www.deepwatch.com/labs/ca-26-027-openai-frontier-agent-sandbox-escape-hugging-face-intrusion/",
            "snippet": "Two OpenAI models autonomously escaped a sandboxed testing environment, gained internet access, and compromised Hugging Face production infrastructure.",
            "source": "deepwatch.com",
            "published": "2026-07-22",
        },
        {
            "title": "JFrog Patches 8 CVEs After OpenAI Responsible Disclosure",
            "url": "https://jfrog.com/blog/jfrog-and-openai-collaboration-on-zero-day-security-findings/",
            "snippet": "JFrog developed, validated, and released a fix for all customers in response to OpenAI's report of previously unknown zero-day vulnerabilities.",
            "source": "jfrog.com",
            "published": "2026-07-27",
        },
    ]


def _extract_domain(url: str) -> str:
    """Extract domain from URL."""
    try:
        from urllib.parse import urlparse
        return urlparse(url).netloc.removeprefix("www.")
    except Exception:
        return url


# ─── Deduplication & Filtering ────────────────────────────────────────────────

def _is_relevant(title: str, snippet: str) -> bool:
    """Filter out irrelevant results that matched search but aren't security incidents."""
    text = f"{title} {snippet}".lower()
    # Must mention AI/LLM/agent/model in a security context
    has_ai = bool(re.search(r"\b(ai|llm|agent|model|gpt|claude|gemini|openai|anthropic)\b", text))
    has_security = bool(re.search(r"\b(security|breach|hack|exploit|vulnerab|escape|inject|attack|zero.?day|cve)\b", text))
    return has_ai and has_security


def _deduplicate(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Remove duplicates by URL and similar titles."""
    seen_urls: set[str] = set()
    seen_titles: set[str] = set()
    unique = []
    for item in items:
        url = item.get("url", "")
        title_key = re.sub(r"\W+", "", item.get("title", "").lower())[:40]
        if url in seen_urls or title_key in seen_titles:
            continue
        seen_urls.add(url)
        seen_titles.add(title_key)
        unique.append(item)
    return unique


# ─── Severity Classification ─────────────────────────────────────────────────

def _classify_severity(title: str, snippet: str) -> str:
    """Rough severity classification based on keywords."""
    text = f"{title} {snippet}".lower()
    if re.search(r"zero.?day|cve|breach|production|credential|escape", text):
        return "critical"
    if re.search(r"exploit|vulnerab|injection|unauthorized", text):
        return "high"
    if re.search(r"risk|concern|potential|report", text):
        return "medium"
    return "low"


# ─── Main Pipeline ────────────────────────────────────────────────────────────

def run_feed(dry_run: bool = False, output_path: Path = OUTPUT_PATH) -> dict[str, Any]:
    """Execute the full threat feed pipeline."""
    print("🔍 SwishOS Threat Feed Agent")
    print(f"   Scanning {len(SEARCH_QUERIES)} queries...")

    # Choose search backend
    tavily_key = os.getenv("TAVILY_API_KEY")
    serper_key = os.getenv("SERPER_API_KEY")

    all_results: list[dict[str, Any]] = []

    if tavily_key:
        print("   Backend: Tavily API")
        for q in SEARCH_QUERIES:
            all_results.extend(_search_tavily(q, tavily_key))
    elif serper_key:
        print("   Backend: Serper.dev API")
        for q in SEARCH_QUERIES:
            all_results.extend(_search_serper(q, serper_key))
    else:
        print("   Backend: Hardcoded fallback (no TAVILY_API_KEY or SERPER_API_KEY)")
        all_results = _search_fallback()

    print(f"   Raw results: {len(all_results)}")

    # Filter & deduplicate
    relevant = [r for r in all_results if _is_relevant(r.get("title", ""), r.get("snippet", ""))]
    unique = _deduplicate(relevant)
    print(f"   After filtering: {len(unique)}")

    # Classify and annotate
    incidents = []
    for item in unique[:MAX_ITEMS]:
        coverage_status, coverage_note = classify_coverage(
            item.get("title", ""), item.get("snippet", "")
        )
        severity = _classify_severity(item.get("title", ""), item.get("snippet", ""))

        incidents.append({
            "title": item["title"],
            "url": item["url"],
            "source": item.get("source", ""),
            "published": item.get("published", ""),
            "severity": severity,
            "swishos_coverage": coverage_status,
            "coverage_note": coverage_note,
            "snippet": item.get("snippet", "")[:200],
        })

    feed = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "agent_version": "1.0.0",
        "total_incidents": len(incidents),
        "coverage_summary": {
            "blocked": sum(1 for i in incidents if i["swishos_coverage"] == "blocked"),
            "detects": sum(1 for i in incidents if i["swishos_coverage"] == "detects"),
            "gap": sum(1 for i in incidents if i["swishos_coverage"] == "gap"),
            "review": sum(1 for i in incidents if i["swishos_coverage"] == "review"),
        },
        "incidents": incidents,
    }

    print(f"\n📊 Coverage: {feed['coverage_summary']}")

    if dry_run:
        print("\n[DRY RUN] Output:")
        print(json.dumps(feed, indent=2))
    else:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(feed, indent=2) + "\n")
        print(f"\n✅ Written to: {output_path}")

    return feed


def main():
    parser = argparse.ArgumentParser(description="SwishOS Threat Feed Agent")
    parser.add_argument("--dry-run", action="store_true", help="Print output without writing file")
    parser.add_argument("--output", type=Path, default=OUTPUT_PATH, help="Output JSON path")
    args = parser.parse_args()
    run_feed(dry_run=args.dry_run, output_path=args.output)


if __name__ == "__main__":
    main()
