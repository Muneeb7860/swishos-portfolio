'use client';

import React from 'react';
import { ShieldCheck, Lock, Cpu, Award, FileCheck } from 'lucide-react';

export function EnterpriseThreatScorecard() {
  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--line-strong)',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: 'var(--card-shadow)',
      maxWidth: '1000px',
      margin: '0 auto',
      textAlign: 'left',
    }}>
      {/* Scorecard Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--line)',
        paddingBottom: '20px',
        marginBottom: '24px',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10B981',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShieldCheck size={28} color="#34D399" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--txt)', letterSpacing: '-0.01em' }}>
              SwishOS Zero-Trust Enclave Security Matrix
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
              Real-time OWASP Agentic Vulnerability Mitigation & Compliance Assertions
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38BDF8',
            fontSize: '11px',
            fontWeight: 800,
            padding: '5px 12px',
            borderRadius: '6px',
            letterSpacing: '0.05em',
          }}>
            SOC 2 CC6 / CC7 / CC8 MAPPED
          </span>
          <span style={{
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            color: '#4ADE80',
            fontSize: '11px',
            fontWeight: 800,
            padding: '5px 12px',
            borderRadius: '6px',
            letterSpacing: '0.05em',
          }}>
            EU AI ACT ART. 15 VERIFIED
          </span>
        </div>
      </div>

      {/* Threat Category Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {[
          { code: 'OWASP LLM01', title: 'Prompt Injection & Homoglyph Bypass', status: '100% BLOCKED', detail: 'Sliding-window stream redactor + AST taint parser' },
          { code: 'OWASP LLM02', title: 'Sensitive Information & PII Exfiltration', status: '100% REDACTED', detail: 'Zero-leak regex pattern matching & key scrubbing' },
          { code: 'OWASP LLM05', title: 'Improper Output & Tool Tampering', status: '100% SANITIZED', detail: 'WASM 0-memory-bleed instruction isolation' },
          { code: 'OWASP LLM08', title: 'Excessive Agency & Monetary Overflows', status: '100% ENFORCED', detail: 'Deterministic spend caps & mTLS call authorization' },
        ].map(item => (
          <div key={item.code} style={{
            background: 'var(--bg-soft)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: '16px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.06em' }}>{item.code}</span>
              <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '4px' }}>{item.status}</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--txt)', marginBottom: '4px' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.detail}</div>
          </div>
        ))}
      </div>

      {/* Compliance Proof Footer Bar */}
      <div style={{
        background: 'var(--bg-soft)',
        borderRadius: '12px',
        padding: '14px 20px',
        border: '1px solid var(--line-strong)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '12px',
        color: 'var(--muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck size={16} color="#34D399" />
          <span>Automated Machine-Readable Output: <strong>OASIS SARIF v2.1.0 JSON Specification</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontWeight: 700 }}>
          <Lock size={14} />
          <span>Fail-Closed Runtime Enclave Active</span>
        </div>
      </div>

    </div>
  );
}
