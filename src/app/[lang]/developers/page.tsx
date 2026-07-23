import React from 'react';
import Link from 'next/link';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { Terminal, Code, Cpu, ShieldAlert, GitFork, ExternalLink, Check } from 'lucide-react';

export default async function DevelopersPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;

  return (
    <main style={{ background: '#0B0F17', color: '#F8FAFC', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* HERO */}
        <section style={{ textAlign: 'center', padding: '40px 0 50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#4ADE80',
            fontSize: '12px',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '999px',
            letterSpacing: '0.06em',
            marginBottom: '20px',
          }}>
            <Terminal size={14} />
            OPEN-SOURCE RED-TEAM HARNESS & SDK
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.03em', color: '#F8FAFC' }}>
            SwishOS Developer Documentation
          </h1>
          <p style={{ fontSize: '17px', color: '#94A3B8', maxWidth: '780px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Target-agnostic HTTP red-teaming harness, WASM runtime memory sandboxing, and AST payload taint analysis for production AI agents.
          </p>

          {/* Quick Install Terminal Box */}
          <div style={{
            background: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '14px',
            padding: '20px 28px',
            maxWidth: '640px',
            margin: '0 auto 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'monospace',
            fontSize: '14px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
          }}>
            <span style={{ color: '#34D399', fontWeight: 700 }}>$ pip install agentic-redteam==1.0.0</span>
            <a
              href="https://github.com/Muneeb7860/agentic-redteam"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#38BDF8',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              <GitFork size={14} /> GitHub Repo →
            </a>
          </div>
        </section>

        {/* TECHNICAL ARCHITECTURE SPECIFICATION */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#F8FAFC', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu color="#38BDF8" size={24} /> Hardened Technical Architecture
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>

            {/* Architecture Card 1 */}
            <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>WASM MEMORY ISOLATION</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>Deterministic Runtime Sandbox</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>
                Executes untrusted agent code in a 0-memory-bleed Wasmtime sandbox with strict fuel limits (max 50,000 instructions) and zero filesystem access.
              </p>
              <pre style={{ background: '#1E293B', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace' }}>
                {`wasmtime::Config::new().wasm_memory(true);`}
              </pre>
            </div>

            {/* Architecture Card 2 */}
            <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>AST TAINT ANALYSIS</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>Static Action Token Tracking</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>
                Parses incoming JSON tool call payloads against Abstract Syntax Tree rules, catching indirect prompt injections before LLM invocation.
              </p>
              <pre style={{ background: '#1E293B', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#34D399', fontFamily: 'monospace' }}>
                {`parseAST(payload).assertNoTaint();`}
              </pre>
            </div>

            {/* Architecture Card 3 */}
            <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FB923C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>STREAM GUARDRAIL</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>256-Char Sliding Window</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>
                Inspects Server-Sent Events (SSE) and WebSocket streams in real-time, redacting credential tokens split across adjacent chunks.
              </p>
              <pre style={{ background: '#1E293B', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#FB923C', fontFamily: 'monospace' }}>
                {`StreamGuardrail({ windowSize: 256 })`}
              </pre>
            </div>

          </div>
        </section>

        {/* BENCHMARK LEADERBOARD INTEGRATION */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>Framework Security Benchmarks</h2>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Empirical OWASP LLM 0–100 vulnerability benchmarks across top open-source agent frameworks.</p>
          </div>
          <LeaderboardTable />
        </section>

      </div>
    </main>
  );
}
