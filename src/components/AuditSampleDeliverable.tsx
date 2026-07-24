'use client';

import React from 'react';
import Link from 'next/link';
import { FileTextIcon, TargetIcon, ShieldIcon, CodeIcon, CheckCircleIcon } from './Icons';

export function AuditSampleDeliverable({ lang }: { lang?: string }) {
  const isAr = lang === 'ar';

  return (
    <div
      style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        margin: '56px 0',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px auto' }}>
        <span
          style={{
            marginBottom: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38BDF8',
            fontSize: '12px',
            fontWeight: 800,
            padding: '6px 14px',
            borderRadius: '6px',
            letterSpacing: '0.06em',
          }}
        >
          <FileTextIcon size={14} color="#38BDF8" /> {isAr ? 'معاينة مخرجات التقرير المباشر' : 'SAMPLE AUDIT DELIVERABLE PREVIEW'}
        </span>
        <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '14px', color: '#F8FAFC' }}>
          {isAr ? 'ما الذي تحصل عليه في تدقيق أمن وكيل الذكاء الاصطناعي؟' : 'What You Receive in a 1-Week Security Audit'}
        </h3>
        <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.6 }}>
          {isAr
            ? 'تقرير تنفيذي شامل يجمع بين الخريطة الحرارية للمخاطر، وسجلات الهجوم المباشرة، وتعديلات كود برمجية جاهزة للدمج.'
            : 'An executive CISO sign-off report featuring a visual OWASP risk heatmap, reproducible payload logs, and PR-ready code diffs.'}
        </p>
      </div>

      {/* Deliverable Grid Preview with Visual Mockups */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        {/* Mockup 1: OWASP Risk Heatmap */}
        <div style={{ background: '#161E2E', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38BDF8', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldIcon size={14} color="#38BDF8" /> ARTIFACT 01
            </span>
            <span style={{ fontSize: '11px', background: '#0B0F17', border: '1px solid rgba(255, 255, 255, 0.18)', color: '#F8FAFC', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, letterSpacing: '0.06em' }}>
              CISO MATRIX
            </span>
          </div>
          <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px', color: '#F8FAFC' }}>
            {isAr ? 'خريطة حرارية لمخاطر OWASP LLM 2026' : 'OWASP Agentic Risk Heatmap'}
          </h4>

          {/* Visual Heatmap Card */}
          <div style={{ background: '#0B0F17', borderRadius: '10px', padding: '14px', marginTop: 'auto', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: '#94A3B8' }}>LLM06 Excessive Agency</span>
              <span style={{ color: '#EF4444', fontWeight: 700 }}>CRITICAL (0.94)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: '#94A3B8' }}>ASI10 Spend Cap Limit</span>
              <span style={{ color: '#F59E0B', fontWeight: 700 }}>HIGH ($450/hr)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: '#94A3B8' }}>LLM01 Prompt Injection</span>
              <span style={{ color: '#EF4444', fontWeight: 700 }}>EXPOSED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#94A3B8' }}>ASI06 WASM Isolation</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>MITIGATED</span>
            </div>
          </div>
        </div>

        {/* Mockup 2: Reproducible Payload Exploits */}
        <div style={{ background: '#161E2E', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F59E0B', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <TargetIcon size={14} color="#F59E0B" /> ARTIFACT 02
            </span>
            <span style={{ fontSize: '11px', background: '#0B0F17', border: '1px solid rgba(255, 255, 255, 0.18)', color: '#F8FAFC', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, letterSpacing: '0.06em' }}>
              PAYLOAD LOGS
            </span>
          </div>
          <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px', color: '#F8FAFC' }}>
            {isAr ? 'حمولات الهجوم وخرطوم الإثبات' : 'Reproducible Attack Payloads'}
          </h4>

          {/* Terminal Code Mockup */}
          <div style={{ background: '#0B0F17', borderRadius: '10px', padding: '14px', marginTop: 'auto', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '11px', color: '#CBD5E1' }}>
            <div style={{ color: '#EF4444', marginBottom: '4px' }}>$ swishos-redteam --target agent_v2</div>
            <div style={{ color: '#94A3B8' }}>[+] Injecting multi-turn payload...</div>
            <div style={{ color: '#F59E0B' }}>[!] Vulnerability Confirmed: Tool Call Bypass</div>
            <div style={{ color: '#38BDF8' }}>[&gt;] Exporting trace to SARIF v2.1.0...</div>
          </div>
        </div>

        {/* Mockup 3: PR-Ready Remediation Diffs */}
        <div style={{ background: '#161E2E', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CodeIcon size={14} color="#10B981" /> ARTIFACT 03
            </span>
            <span style={{ fontSize: '11px', background: '#0B0F17', border: '1px solid rgba(255, 255, 255, 0.18)', color: '#F8FAFC', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, letterSpacing: '0.06em' }}>
              REMEDIATION
            </span>
          </div>
          <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px', color: '#F8FAFC' }}>
            {isAr ? 'تعديلات الكود الجاهزة للدمج' : 'PR-Ready Remediation Diffs'}
          </h4>

          {/* Git Diff Mockup */}
          <div style={{ background: '#0B0F17', borderRadius: '10px', padding: '14px', marginTop: 'auto', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '11px' }}>
            <div style={{ color: '#EF4444', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 4px', borderRadius: '2px', marginBottom: '2px' }}>
              - agent.execute(tool_name, unvalidated_args)
            </div>
            <div style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 4px', borderRadius: '2px' }}>
              + enclave.validate_and_call(tool_name, args, ast_rules)
            </div>
          </div>
        </div>

      </div>

      {/* Audit Guarantee Banner */}
      <div
        style={{
          background: '#161E2E',
          borderRadius: '16px',
          padding: '24px 32px',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <CheckCircleIcon size={32} color="#10B981" />
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8FAFC' }}>
              {isAr ? 'ضمان الأمان بزمن استجابة أقل من 5 أيام' : '100% Deterministic Guarantee or 100% Refund'}
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
              {isAr
                ? 'إذا لم نكتشف ثغرة واحدة قابلة للتكرار في وكيلك، فستسترد مبلغ التدقيق بالكامل.'
                : 'If our red-team fails to identify at least 1 actionable tool bypass or prompt injection vulnerability, you pay $0.'}
            </div>
          </div>
        </div>

        <Link
          href={`/${lang}/contact?plan=audit`}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            background: '#2563EB',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {isAr ? 'طلب التقرير الجاهز' : 'Schedule Audit Deliverable →'}
        </Link>
      </div>
    </div>
  );
}
