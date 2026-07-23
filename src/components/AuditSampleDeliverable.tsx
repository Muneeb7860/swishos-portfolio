'use client';

import React from 'react';
import Link from 'next/link';
import { FileTextIcon, TargetIcon, ShieldIcon, CodeIcon, CheckCircleIcon } from './Icons';

export function AuditSampleDeliverable({ lang }: { lang?: string }) {
  const isAr = lang === 'ar';

  return (
    <div
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--line-strong)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: 'var(--card-shadow)',
        margin: '56px 0',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px auto' }}>
        <span className="badge-pill" style={{ marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FileTextIcon size={14} color="#3B82F6" /> {isAr ? 'معاينة مخرجات التقرير المباشر' : 'SAMPLE AUDIT DELIVERABLE PREVIEW'}
        </span>
        <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '14px' }}>
          {isAr ? 'ما الذي تحصل عليه في تدقيق أمن وكيل الذكاء الاصطناعي؟' : 'What You Receive in a 1-Week Security Audit'}
        </h3>
        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6 }}>
          {isAr
            ? 'تقرير تنفيذي شامل يجمع بين الخريطة الحرارية للمخاطر، وسجلات الهجوم المباشرة، وتعديلات كود برمجية جاهزة للدمج.'
            : 'An executive CISO sign-off report featuring a visual OWASP risk heatmap, reproducible payload logs, and PR-ready code diffs.'}
        </p>
      </div>

      {/* Deliverable Grid Preview with Visual Mockups */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        {/* Mockup 1: OWASP Risk Heatmap */}
        <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38BDF8', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldIcon size={14} color="#38BDF8" /> ARTIFACT 01
            </span>
            <span style={{ fontSize: '11px', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.18)', color: '#F8FAFC', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, letterSpacing: '0.06em' }}>
              CISO MATRIX
            </span>
          </div>
          <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>
            {isAr ? 'خريطة حرارية لمخاطر OWASP LLM 2026' : 'OWASP Agentic Risk Heatmap'}
          </h4>

          {/* Visual Heatmap Card */}
          <div style={{ background: '#0F172A', borderRadius: '10px', padding: '14px', marginTop: 'auto', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '12px' }}>
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
        <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38BDF8', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CodeIcon size={14} color="#38BDF8" /> ARTIFACT 02
            </span>
            <span style={{ fontSize: '11px', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.18)', color: '#F8FAFC', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, letterSpacing: '0.06em' }}>
              EXPLOIT LOGS
            </span>
          </div>
          <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>
            {isAr ? 'سجلات هجوم قابلة للتكرار (curl)' : 'Reproducible Payload Exploits'}
          </h4>

          {/* Visual Terminal Log Card */}
          <div style={{ background: '#0F172A', borderRadius: '10px', padding: '14px', marginTop: 'auto', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '11px', color: '#F8FAFC', lineHeight: 1.5 }}>
            <div style={{ color: '#94A3B8', marginBottom: '4px' }}># Red-Team Attack Vector #812</div>
            <div style={{ color: '#38BDF8' }}>$ curl -X POST https://api.agent/v1/tool \</div>
            <div style={{ color: '#F8FAFC', paddingLeft: '12px' }}>-d &apos;{"{"}&quot;tool&quot;: &quot;db_drop&quot;, &quot;override&quot;: true{"}"}&apos;</div>
            <div style={{ color: '#EF4444', marginTop: '6px', fontWeight: 700 }}>
              HTTP/1.1 422 Unprocessable Entity
            </div>
            <div style={{ color: '#10B981' }}>[SwishOS Intercept]: AST_POLICY_BLOCK</div>
          </div>
        </div>

        {/* Mockup 3: PR-Ready Remediation Diffs */}
        <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38BDF8', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircleIcon size={14} color="#38BDF8" /> ARTIFACT 03
            </span>
            <span style={{ fontSize: '11px', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.18)', color: '#F8FAFC', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, letterSpacing: '0.06em' }}>
              PR DIFF PATCH
            </span>
          </div>
          <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>
            {isAr ? 'تعديلات برمجية جاهزة للدمج (PR-Ready)' : 'PR-Ready Remediation Diffs'}
          </h4>

          {/* Visual Git Diff Card */}
          <div style={{ background: '#0F172A', borderRadius: '10px', padding: '14px', marginTop: 'auto', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.6 }}>
            <div style={{ color: '#94A3B8', marginBottom: '4px' }}>--- a/src/agent/executor.ts</div>
            <div style={{ color: '#94A3B8', marginBottom: '4px' }}>+++ b/src/agent/executor.ts</div>
            <div style={{ background: 'rgba(239,68,68,0.2)', color: '#F87171', padding: '2px 4px', borderRadius: '2px' }}>
              - const res = await tool.execute(rawArgs);
            </div>
            <div style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399', padding: '2px 4px', borderRadius: '2px', marginTop: '4px' }}>
              + const res = await guard.wrap(tool, rawArgs);
            </div>
          </div>
        </div>

      </div>

      {/* CTA Line */}
      <div style={{ textAlign: 'center' }}>
        <Link href={`/${lang || 'en'}/contact?plan=audit`} className="btn-pri" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '15px' }}>
          <TargetIcon size={16} /> {isAr ? 'جدولة تدقيق الأمان' : 'Schedule Security Audit'}
        </Link>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
          {isAr ? 'حزمة استشارية ثابتة لمدة أسبوع واحد: $7,500 – $12,500' : '$7,500 – $12,500 fixed 1-week engagement'}
        </div>
      </div>
    </div>
  );
}
