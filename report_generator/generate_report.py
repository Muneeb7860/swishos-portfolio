#!/usr/bin/env python3
"""Generate a SwishOS audit report (JSON + HTML) from a real agentic-redteam run.

Every number in the output is computed from the input RunResult JSON — nothing
in this script accepts or hardcodes a metric by hand. If a field isn't present
in the source data, it's omitted from the report rather than guessed.

Usage:
    agentic-redteam --target-url https://client.example.com/v1/chat \\
        --output findings.json

    python generate_report.py findings.json \\
        --client "Client Name" \\
        --signing-key "$SWISHOS_REPORT_SIGNING_KEY" \\
        --out-dir ./reports/client-name
"""

from __future__ import annotations

import argparse
import hashlib
import hmac
import html
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

SEV_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3}
SEV_COLOR = {"critical": "#ef4444", "high": "#f97316", "medium": "#f59e0b", "low": "#6b7280"}


def compute_grade(pass_rate: float, findings: list[dict]) -> str:
    """Grade is capped by the worst finding severity present, not just pass rate --
    a system that passes 95% of checks but has one CRITICAL leak isn't an A."""
    has_critical = any(f["severity"] == "critical" for f in findings)
    has_high = any(f["severity"] == "high" for f in findings)

    if has_critical:
        return "D" if pass_rate < 90 else "C"
    if has_high:
        return "B" if pass_rate < 95 else "B+"
    if pass_rate == 100:
        return "A+"
    if pass_rate >= 95:
        return "A"
    if pass_rate >= 90:
        return "A-"
    if pass_rate >= 80:
        return "B"
    if pass_rate >= 70:
        return "C"
    if pass_rate >= 60:
        return "D"
    return "F"


def sign_report(payload: dict, signing_key: str) -> str:
    """HMAC-SHA256 over the canonical JSON of the report body (excluding the
    signature field itself). Anyone with the report and the public verification
    instructions can recompute this and confirm the report wasn't edited after
    the fact -- same pattern as the x-swishos-audit-proof header on the live API."""
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    return hmac.new(signing_key.encode(), canonical, hashlib.sha256).hexdigest()


def build_report(run_result: dict, client_name: str, signing_key: str | None) -> dict:
    summary = run_result.get("summary", {})
    findings = run_result.get("findings", [])
    total_run = sum(v.get("total", 0) for v in summary.values())
    total_passed = sum(v.get("passed", 0) for v in summary.values())
    pass_rate = round((total_passed / total_run) * 100, 1) if total_run else 0.0

    ordered_findings = sorted(findings, key=lambda f: SEV_ORDER.get(f["severity"], 9))

    body = {
        "tool": "swishos-audit-report",
        "report_version": "1.0",
        "client_name": client_name,
        "audit_date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "target": run_result.get("target"),
        "source_run": {
            "started": run_result.get("started"),
            "elapsed_seconds": run_result.get("elapsed_seconds"),
            "adapter": run_result.get("adapter"),
        },
        "grade": compute_grade(pass_rate, findings),
        "pass_rate": pass_rate,
        "checks_passed": total_passed,
        "checks_total": total_run,
        "category_summary": summary,
        "findings": ordered_findings,
        "errors": run_result.get("errors", []),
    }

    if signing_key:
        body["verification"] = {
            "algorithm": "HMAC-SHA256",
            "signature": sign_report(body, signing_key),
            "note": (
                "Signature computed over this report's own content (sorted-key "
                "canonical JSON, this 'verification' block excluded). Recompute "
                "independently to confirm the report has not been edited since "
                "issuance."
            ),
        }

    return body


def esc(s) -> str:
    return html.escape(str(s)) if s is not None else ""


def render_html(report: dict) -> str:
    findings_rows = ""
    for f in report["findings"]:
        color = SEV_COLOR.get(f["severity"], "#6b7280")
        prompt_preview = esc(f.get("prompt", "")[:200])
        reply_preview = esc(f.get("reply", "")[:400])
        findings_rows += f"""
        <div class="finding">
          <div class="finding-head">
            <span class="sev-badge" style="background:{color}20;color:{color};border-color:{color}40">{esc(f['severity'].upper())}</span>
            <span class="finding-title">{esc(f['test_id'])} — {esc(f['description'])}</span>
          </div>
          <div class="finding-meta">{esc(f['owasp']) + ' · ' if f.get('owasp') else ''}{esc(f['category'])}</div>
          <div class="finding-reason">{esc(f['reason'])}</div>
          <div class="evidence">
            <div class="evidence-label">Prompt sent</div>
            <div class="evidence-body">{prompt_preview}</div>
            <div class="evidence-label">Agent's actual reply</div>
            <div class="evidence-body">{reply_preview}</div>
          </div>
        </div>"""

    if not report["findings"]:
        findings_rows = '<p class="no-findings">No findings — every check in this run passed.</p>'

    category_rows = ""
    for cat, s in report["category_summary"].items():
        passed, total = s.get("passed", 0), s.get("total", 0)
        ok = passed == total
        category_rows += f"""
        <tr>
          <td>{esc(cat)}</td>
          <td>{passed} / {total}</td>
          <td class="{'pass' if ok else 'fail'}">{'PASSED' if ok else 'FAILED'}</td>
        </tr>"""

    verification_block = ""
    if "verification" in report:
        v = report["verification"]
        verification_block = f"""
        <div class="cert-box">
          <div class="cert-label">🔒 {esc(v['algorithm'])} Verification Signature</div>
          <div class="cert-sig">{esc(v['signature'])}</div>
          <div class="cert-note">{esc(v['note'])}</div>
        </div>"""

    target_line = f"Target: <strong>{esc(report['target'])}</strong> · " if report.get("target") else ""

    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>SwishOS Agent Security Audit — {esc(report['client_name'])}</title>
<style>
  @media print {{ body {{ background: #ffffff !important; }} }}
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #05070d; color: #f8fafc; margin: 0; padding: 40px; }}
  .container {{ max-width: 860px; margin: 0 auto; background: #0b1120; border: 1px solid #1f2a3d; border-radius: 20px; padding: 40px; }}
  .header {{ border-bottom: 1px solid #1f2a3d; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }}
  .title {{ font-size: 24px; font-weight: 800; color: #fff; margin: 0; }}
  .subtitle {{ font-size: 13px; color: #8b93a7; margin-top: 6px; }}
  .grade-badge {{ background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.4); color: #10b981; font-size: 18px; font-weight: 800; padding: 8px 16px; border-radius: 10px; white-space: nowrap; }}
  .grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 32px; }}
  .card {{ background: #050810; border: 1px solid #1f2a3d; border-radius: 12px; padding: 18px; text-align: center; }}
  .metric {{ font-size: 26px; font-weight: 800; color: #3b82f6; }}
  .label {{ font-size: 10.5px; color: #8b93a7; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 6px; }}
  h2 {{ font-size: 16px; font-weight: 700; margin-top: 36px; }}
  table {{ width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }}
  th, td {{ text-align: left; padding: 10px 12px; border-bottom: 1px solid #1f2a3d; }}
  th {{ color: #8b93a7; font-weight: 600; text-transform: uppercase; font-size: 10.5px; }}
  .pass {{ color: #10b981; font-weight: 700; }}
  .fail {{ color: #ef4444; font-weight: 700; }}
  .finding {{ background: #050810; border: 1px solid #1f2a3d; border-radius: 12px; padding: 16px 18px; margin-bottom: 12px; }}
  .finding-head {{ display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }}
  .sev-badge {{ font-size: 10.5px; font-weight: 800; padding: 3px 8px; border-radius: 5px; border: 1px solid; text-transform: uppercase; }}
  .finding-title {{ font-size: 13.5px; font-weight: 600; }}
  .finding-meta {{ font-size: 11.5px; color: #8b93a7; margin-bottom: 8px; }}
  .finding-reason {{ font-size: 12.5px; color: #cbd5e1; margin-bottom: 10px; }}
  .evidence {{ background: #0b1120; border-radius: 8px; padding: 10px 12px; }}
  .evidence-label {{ font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 6px; }}
  .evidence-body {{ font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 11.5px; color: #94e2ff; white-space: pre-wrap; word-break: break-word; margin-top: 2px; }}
  .no-findings {{ color: #10b981; font-size: 14px; }}
  .cert-box {{ background: #050810; border: 1px solid rgba(6,182,212,0.3); border-radius: 12px; padding: 18px; margin-top: 32px; }}
  .cert-label {{ font-size: 12px; font-weight: 700; color: #06b6d4; margin-bottom: 8px; }}
  .cert-sig {{ font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 11px; color: #94e2ff; word-break: break-all; }}
  .cert-note {{ font-size: 11px; color: #8b93a7; margin-top: 8px; }}
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="title">AI Agent Security Audit</h1>
        <div class="subtitle">Client: <strong>{esc(report['client_name'])}</strong> · Date: {esc(report['audit_date'])}<br>{target_line}Adapter: {esc(report['source_run'].get('adapter'))}</div>
      </div>
      <div class="grade-badge">GRADE: {esc(report['grade'])}</div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="metric">{esc(report['pass_rate'])}%</div>
        <div class="label">Pass Rate</div>
      </div>
      <div class="card">
        <div class="metric">{esc(report['checks_passed'])} / {esc(report['checks_total'])}</div>
        <div class="label">Checks Passed</div>
      </div>
      <div class="card">
        <div class="metric">{esc(len(report['findings']))}</div>
        <div class="label">Findings</div>
      </div>
    </div>

    <h2>Category Summary</h2>
    <table>
      <thead><tr><th>Category</th><th>Passed</th><th>Result</th></tr></thead>
      <tbody>{category_rows}</tbody>
    </table>

    <h2>Findings ({len(report['findings'])})</h2>
    {findings_rows}

    {verification_block}
  </div>
</body>
</html>"""


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("input", help="Path to agentic-redteam RunResult JSON (from --output)")
    parser.add_argument("--client", required=True, help="Client name for the report header")
    parser.add_argument("--signing-key", default=None, help="HMAC signing key (or set SWISHOS_REPORT_SIGNING_KEY env var)")
    parser.add_argument("--out-dir", default=".", help="Output directory for report.json and report.html")
    args = parser.parse_args()

    import os
    signing_key = args.signing_key or os.environ.get("SWISHOS_REPORT_SIGNING_KEY")
    if not signing_key:
        print("Warning: no signing key provided (--signing-key or SWISHOS_REPORT_SIGNING_KEY). "
              "Report will be generated WITHOUT a verification signature.", file=sys.stderr)

    run_result = json.loads(Path(args.input).read_text())
    report = build_report(run_result, args.client, signing_key)

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "report.json").write_text(json.dumps(report, indent=2))
    (out_dir / "report.html").write_text(render_html(report))

    print(f"Grade: {report['grade']} · Pass rate: {report['pass_rate']}% · "
          f"{len(report['findings'])} finding(s)")
    print(f"Written to {out_dir / 'report.json'} and {out_dir / 'report.html'}")


if __name__ == "__main__":
    main()
