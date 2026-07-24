import React from 'react';
import Link from 'next/link';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { CodeBlockTerminal } from '@/components/CodeBlockTerminal';
import { Terminal, Code, Cpu, ShieldAlert, GitFork, ExternalLink, Check } from 'lucide-react';

export default async function DevelopersPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* HERO */}
        <section style={{ textAlign: 'center', padding: '40px 0 50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: '#4ADE80',
            fontSize: '12px',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '6px',
            letterSpacing: '0.06em',
            marginBottom: '20px',
          }}>
            <Terminal size={14} color="#4ADE80" />
            OPEN-SOURCE RED-TEAM HARNESS & SDK
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.03em', color: 'var(--txt)' }}>
            SwishOS Developer Documentation
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--muted)', maxWidth: '780px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Target-agnostic HTTP red-teaming harness, WASM runtime memory sandboxing, and AST payload taint analysis for production AI agents.
          </p>

          {/* Quick Install Terminal Box */}
          <div style={{ maxWidth: '680px', margin: '0 auto 32px' }}>
            <CodeBlockTerminal
              language="bash"
              filename="PyPI Release v1.0.0"
              code="$ pip install agentic-redteam==1.0.0"
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
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
                  gap: '6px',
                  background: '#0F172A',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                }}
              >
                <GitFork size={14} /> View GitHub Repository →
              </a>
            </div>
          </div>
        </section>

        {/* TECHNICAL ARCHITECTURE SPECIFICATION */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--txt)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu color="#38BDF8" size={24} /> Hardened Technical Architecture
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
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--txt)', marginBottom: '8px' }}>Framework Security Benchmarks</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Empirical OWASP LLM 0–100 vulnerability benchmarks across top open-source agent frameworks.</p>
          </div>
          <LeaderboardTable />
        </section>

      </div>
    </main>
  );
}
