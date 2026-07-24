import React from 'react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { CodeBlockTerminal } from '@/components/CodeBlockTerminal';
import { Terminal, Cpu, GitFork, ShieldCheck, Terminal as TerminalIcon, FileCode, CheckCircle2 } from 'lucide-react';

export default async function DevelopersPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;

  return (
    <main style={{ background: '#0B0F17', color: '#F8FAFC', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* HIGH-CONTRAST TERMINAL HEADER */}
        <section style={{ textAlign: 'left', padding: '20px 0 40px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38BDF8',
            fontSize: '11px',
            fontWeight: 800,
            padding: '6px 14px',
            borderRadius: '6px',
            letterSpacing: '0.06em',
            marginBottom: '16px',
          }}>
            <TerminalIcon size={14} color="#38BDF8" />
            OPEN-SOURCE RED-TEAM HARNESS & SDK SPECS
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1.15, marginBottom: '12px', letterSpacing: '-0.03em', color: '#F8FAFC' }}>
                SwishOS Developer Documentation
              </h1>
              <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '780px', lineHeight: 1.6, margin: 0 }}>
                Target-agnostic HTTP red-teaming harness, WASM runtime memory sandboxing, and AST payload taint analysis for production AI agents.
              </p>
            </div>

            <a
              href="https://github.com/Muneeb7860/agentic-redteam"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#38BDF8',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#0F172A',
                padding: '12px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              <GitFork size={16} /> View GitHub Repository →
            </a>
          </div>
        </section>

        {/* STRUCTURED TWO-COLUMN TECHNICAL DASHBOARD */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          
          {/* Column 1: Installation & Quickstart Terminal */}
          <div style={{ background: '#0F172A', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '16px', padding: '32px', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <FileCode size={20} color="#38BDF8" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>Package Installation & CLI Harness</h2>
            </div>
            
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px', lineHeight: 1.5 }}>
              Install the open-source PyPI package to evaluate local or remote agent HTTP endpoints against OWASP LLM Top 10 vulnerabilities.
            </p>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.05em', marginBottom: '6px' }}>1. INSTALLATION (PyPI)</div>
                <CodeBlockTerminal
                  language="bash"
                  filename="PyPI Release v1.0.0"
                  code="$ pip install agentic-redteam==1.0.0"
                />
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.05em', marginBottom: '6px' }}>2. CLI EXECUTION & SARIF EXPORT</div>
                <CodeBlockTerminal
                  language="bash"
                  filename="Terminal Triage"
                  code={`$ agentic-redteam run --target https://api.agent.internal/v1/chat \\\n  --preset owasp-llm-2026 --output report.sarif.json`}
                />
              </div>
            </div>
          </div>

          {/* Column 2: Python SDK Integration */}
          <div style={{ background: '#0F172A', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '16px', padding: '32px', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldCheck size={20} color="#34D399" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>Python SDK Runtime Integration</h2>
            </div>

            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px', lineHeight: 1.5 }}>
              Embed zero-trust WASM sandboxing and stream redactors directly into LangChain, CrewAI, or AutoGen execution loops.
            </p>

            <CodeBlockTerminal
              language="python"
              filename="agent_guardrail.py"
              code={`from agentic_redteam import RedTeamEngine, StreamGuardrail\n\n# Instantiate 256-char sliding window redactor\nguardrail = StreamGuardrail(window_size=256, mode="block")\n\n# Evaluate payload AST against spend & isolation rules\nengine = RedTeamEngine()\nresult = engine.evaluate_payload(payload)\nif result.is_violation:\n    raise SystemError("AST Taint Security Breach Blocked")`}
            />

            <div style={{ display: 'flex', gap: '16px', marginTop: '20px', fontSize: '12px', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#34D399" /> 0-Memory-Bleed WASM
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#34D399" /> SARIF v2.1 Output
              </div>
            </div>
          </div>

        </section>

        {/* TECHNICAL ARCHITECTURE SPECIFICATION */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu color="#38BDF8" size={22} /> Hardened Technical Architecture
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

            {/* Architecture Card 1 */}
            <div style={{ background: '#0F172A', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '16px', padding: '28px', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>WASM MEMORY ISOLATION</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>Deterministic Runtime Sandbox</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
                Executes untrusted agent code in a 0-memory-bleed Wasmtime sandbox with strict fuel limits (max 50,000 instructions) and zero filesystem access.
              </p>
              <div style={{ marginTop: 'auto' }}>
                <CodeBlockTerminal
                  language="rust"
                  filename="src/sandbox/wasm.rs"
                  code={`let mut config = wasmtime::Config::new();\nconfig.wasm_memory(true);\nconfig.consume_fuel(true);\nlet engine = Engine::new(&config)?;`}
                />
              </div>
            </div>

            {/* Architecture Card 2 */}
            <div style={{ background: '#0F172A', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '16px', padding: '28px', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>AST TAINT ANALYSIS</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>Static Action Token Tracking</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
                Parses incoming JSON tool call payloads against Abstract Syntax Tree rules, catching indirect prompt injections before LLM invocation.
              </p>
              <div style={{ marginTop: 'auto' }}>
                <CodeBlockTerminal
                  language="typescript"
                  filename="src/guard/ast-parser.ts"
                  code={`const ast = parseGraphQLQuery(payload);\nconst taint = analyzeTaint(ast, schema);\nif (taint.hasViolation) throw new TaintError();`}
                />
              </div>
            </div>

            {/* Architecture Card 3 */}
            <div style={{ background: '#0F172A', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '16px', padding: '28px', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#FB923C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>STREAM GUARDRAIL</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>256-Char Sliding Window</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
                Inspects Server-Sent Events (SSE) and WebSocket streams in real-time, redacting credential tokens split across adjacent chunks.
              </p>
              <div style={{ marginTop: 'auto' }}>
                <CodeBlockTerminal
                  language="python"
                  filename="agentic_redteam/stream.py"
                  code={`guardrail = StreamGuardrail(window_size=256, mode="redact")\nfor chunk in stream:\n    redacted_chunk = guardrail.process_chunk(chunk)`}
                />
              </div>
            </div>

          </div>
        </section>

        {/* BENCHMARK LEADERBOARD INTEGRATION */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>Framework Security Benchmarks</h2>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Empirical OWASP LLM 0–100 vulnerability benchmarks across top open-source agent frameworks.</p>
          </div>
          <LeaderboardTable />
        </section>

      </div>
    </main>
  );
}
