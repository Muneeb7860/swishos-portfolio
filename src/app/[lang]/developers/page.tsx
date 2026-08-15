import React from 'react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { CodeBlockTerminal } from '@/components/CodeBlockTerminal';
import { Cpu, GitFork, ShieldCheck, Terminal as TerminalIcon, FileCode, CheckCircle2 } from 'lucide-react';

export default async function DevelopersPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* HIGH-CONTRAST TERMINAL HEADER */}
        <section style={{ textAlign: 'left', padding: '20px 0 40px', borderBottom: '1px solid var(--line-strong)', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--badge-bg)',
            border: '1px solid var(--badge-border)',
            color: 'var(--badge-txt)',
            fontSize: '11px',
            fontWeight: 800,
            padding: '6px 14px',
            borderRadius: '6px',
            letterSpacing: '0.06em',
            marginBottom: '16px',
          }}>
            <TerminalIcon size={14} color="var(--badge-txt)" />
            OPEN-SOURCE RED-TEAM HARNESS & SDK SPECS
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1.15, marginBottom: '12px', letterSpacing: '-0.03em', color: 'var(--txt)' }}>
                SwishOS Developer Documentation
              </h1>
              <p style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '780px', lineHeight: 1.6, margin: 0 }}>
                Target-agnostic HTTP red-teaming harness, deterministic shape-based detection, and tool-call sequence analysis for production AI agents.
              </p>
            </div>

            <a
              href="https://github.com/Muneeb7860/agentic-redteam"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--badge-txt)',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--card-bg)',
                padding: '12px 20px',
                borderRadius: '10px',
                border: '1px solid var(--card-border)',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <GitFork size={16} /> View GitHub Repository →
            </a>
          </div>
        </section>

        {/* STRUCTURED TWO-COLUMN TECHNICAL DASHBOARD */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          
          {/* Column 1: Installation & Quickstart Terminal */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <FileCode size={20} color="var(--brand)" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--txt)', margin: 0 }}>Package Installation & CLI Harness</h2>
            </div>
            
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              Install the open-source PyPI package to evaluate local or remote agent HTTP endpoints against OWASP LLM Top 10 vulnerabilities.
            </p>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--badge-txt)', letterSpacing: '0.05em', marginBottom: '6px' }}>1. INSTALLATION (PyPI)</div>
                <CodeBlockTerminal
                  language="bash"
                  filename="PyPI Release (publishing soon)"
                  code="$ pip install agentic-redteam  # publishing soon"
                />
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--badge-txt)', letterSpacing: '0.05em', marginBottom: '6px' }}>2. CLI EXECUTION & SARIF EXPORT</div>
                <CodeBlockTerminal
                  language="bash"
                  filename="Terminal Triage"
                  code={`$ agentic-redteam run --target https://api.agent.internal/v1/chat \\\n  --preset owasp-llm-2026 --output report.sarif.json`}
                />
              </div>
            </div>
          </div>

          {/* Column 2: Python SDK Integration */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldCheck size={20} color="#10B981" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--txt)', margin: 0 }}>Python SDK Runtime Integration</h2>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              Embed ingress blocking and egress redaction directly into LangChain, CrewAI, or AutoGen execution loops.
            </p>

            <CodeBlockTerminal
              language="python"
              filename="agent_guardrail.py"
              code={`from agentic_redteam.patching.guardrails import check_ingress, sanitize_egress\n\n# Ingress: refuse the request before the agent ever sees it\nblocked, rule_id, reason = check_ingress(user_input)\nif blocked:\n    raise SecurityError(f"{rule_id}: {reason}")\n\n# Egress: scrub API keys and PII out of the response\nsafe_output, redactions = sanitize_egress(agent_response)`}
            />

            <div style={{ display: 'flex', gap: '16px', marginTop: '20px', fontSize: '12px', color: 'var(--muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#10B981" /> Deterministic & Offline
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#10B981" /> SARIF v2.1 Output
              </div>
            </div>
          </div>

        </section>

        {/* TECHNICAL ARCHITECTURE SPECIFICATION */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--txt)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu color="var(--brand)" size={22} /> Hardened Technical Architecture
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

            {/* Architecture Card 1 */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '28px', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>SANDBOX HARDENING</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--txt)', marginBottom: '10px' }}>Deterministic Runtime Sandbox</h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                Generates hardened container configuration for running agents under gVisor (runsc) user-space kernel isolation, with read-only root, cgroup memory caps, and iptables rules dropping cloud metadata egress.
              </p>
              <div style={{ marginTop: 'auto' }}>
                <CodeBlockTerminal
                  language="python"
                  filename="agentic_redteam/sandbox_config.py"
                  code={`service = generate_gvisor_docker_compose_service(\n    image="your-agent:latest",\n    memory_limit="256m",\n)\n# runtime: runsc  |  read_only: true  |  cap_drop: ALL`}
                />
              </div>
            </div>

            {/* Architecture Card 2 */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '28px', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--badge-txt)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>SHAPE-BASED DETECTION</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--txt)', marginBottom: '10px' }}>Deterministic Response Analysis</h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                Inspects responses for the shape of a leak -- validated card numbers, IBANs, cloud metadata, dangerous code -- rather than asking a model whether the answer looked unsafe. The same input always produces the same finding.
              </p>
              <div style={{ marginTop: 'auto' }}>
                <CodeBlockTerminal
                  language="python"
                  filename="agentic_redteam/detectors.py"
                  code={`hits = find_pii(response)          # Luhn / mod-97 validated\nif reveals_cloud_metadata(response):\n    flag("SSRF: cloud metadata reached")`}
                />
              </div>
            </div>

            {/* Architecture Card 3 */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '28px', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>EGRESS REDACTION</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--txt)', marginBottom: '10px' }}>Response Body Scrubbing</h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                Strips provider API keys and PII from agent responses before they leave the process, covering current key formats such as Stripe, AWS, and GitHub tokens.
              </p>
              <div style={{ marginTop: 'auto' }}>
                <CodeBlockTerminal
                  language="python"
                  filename="agentic_redteam/patching/guardrails.py"
                  code={`safe, redactions = sanitize_egress(response_body)\nif redactions:\n    log.warning("redacted %d secret(s) from egress", len(redactions))`}
                />
              </div>
            </div>

          </div>
        </section>

        {/* BENCHMARK LEADERBOARD INTEGRATION */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--txt)', marginBottom: '8px' }}>Framework Security Benchmarks</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Empirical OWASP LLM 0–100 vulnerability benchmarks across top open-source agent frameworks.</p>
          </div>
          <LeaderboardTable />
        </section>

      </div>
    </main>
  );
}
