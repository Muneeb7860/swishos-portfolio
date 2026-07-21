'use client';

import React from 'react';
import Link from 'next/link';

export function AuditSampleDeliverable({ lang }: { lang?: string }) {
  const isAr = lang === 'ar';

  return (
    <div
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--line-strong)',
        borderRadius: '20px',
        padding: '36px',
        boxShadow: 'var(--card-shadow)',
        margin: '48px 0',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 32px auto' }}>
        <span className="badge-pill" style={{ marginBottom: '12px' }}>
          📄 {isAr ? 'معاينة مخرجات التدقيق الأمني' : 'SAMPLE AUDIT DELIVERABLE PREVIEW'}
        </span>
        <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>
          {isAr ? 'ما الذي تحصل عليه في تدقيق أمن وكيل الذكاء الاصطناعي؟' : 'What You Receive in a 1-Week Security Audit'}
        </h3>
        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6 }}>
          {isAr
            ? 'تقرير تنفيذي مباشر يركز على المخاطر الفعلية مع سجلات استغلال هجومية قابلة للتكرار وتعديلات برمجية جاهزة للدمج.'
            : 'An executive CISO sign-off report featuring reproducible payload logs, OWASP LLM risk heatmaps, and PR-ready remediation diffs.'}
        </p>
      </div>

      {/* Deliverable Grid Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Item 1 */}
        <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
            {isAr ? 'خريطة حرارية لمخاطر OWASP LLM 2026' : 'OWASP Agentic Risk Heatmap'}
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
            {isAr
              ? 'تقييم شامل لجميع الفئات العشر لمخاطر الذكاء الاصطناعي مع قياس الوكالة المفرطة (LLM06) وحدود الإنفاق (ASI10).'
              : 'Complete threat mapping across OWASP Agentic Top 10 risks with quantified Excessive Agency and spend limit scores.'}
          </p>
        </div>

        {/* Item 2 */}
        <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>💻</div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
            {isAr ? 'سجلات هجوم قابلة للتكرار (curl)' : 'Reproducible Payload Exploits'}
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
            {isAr
              ? 'سجلات استغلال كاملة بأوامر curl شفافة تسمح لفريقك الهندسي بإعادة تنفيذ وفحص كل هجمات الحقن المخفية.'
              : 'Transparent payload curl commands allowing engineering teams to reproduce every prompt injection and side-channel leak.'}
          </p>
        </div>

        {/* Item 3 */}
        <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🛠️</div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
            {isAr ? 'تعديلات برمجية جاهزة للدمج (PR-Ready)' : 'PR-Ready Remediation Diffs'}
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
            {isAr
              ? 'أكواد برمجية وتعديلات جاهزة مباشرة للدمج مع سحب الحقوق لحظر تجاوز الهوموجليف وسرقة البيانات المباشرة.'
              : 'Drop-in TypeScript/Python code patches resolving Excessive Agency, Unicode homoglyphs, and metadata egress leaks.'}
          </p>
        </div>
      </div>

      {/* CTA Line */}
      <div style={{ textAlign: 'center' }}>
        <Link href={`/${lang || 'en'}/contact?plan=audit`} className="btn-pri">
          🎯 {isAr ? 'احجز تدقيق الأمان المباشر ($7,500 - $12,500)' : 'Book a 1-Week Security Audit ($7,500 – $12,500)'}
        </Link>
      </div>
    </div>
  );
}
