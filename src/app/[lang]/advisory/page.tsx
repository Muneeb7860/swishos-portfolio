import React from 'react';
import Link from 'next/link';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';
import { AuditSampleDeliverable } from '@/components/AuditSampleDeliverable';
import { Check, Shield, Award, CheckCircle2 } from 'lucide-react';

const dictionaries: Record<string, typeof en> = { en, ar };

export default async function AdvisoryPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const isRtl = lang === 'ar';

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* HERO */}
        <section style={{ textAlign: 'center', padding: '40px 0 48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38BDF8',
            fontSize: '12px',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '6px',
            letterSpacing: '0.06em',
            marginBottom: '20px',
          }}>
            <Shield size={14} color="#38BDF8" />
            ENTERPRISE AI SECURITY ADVISORY & AUDIT
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.03em', color: 'var(--txt)' }}>
            {isRtl ? 'تدقيق وأمن وكلاء الذكاء الاصطناعي المؤسسي' : '1-Week AI Agent Threat Model & Compliance Audit'}
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '820px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            {isRtl
              ? 'مراجعة أمنية شاملة للنماذج واختبار الاختراق التكتيكي بواسطة مهندسين سابقين في كبرى شركات التقنية.'
              : 'Deterministic threat modeling, adversarial red-teaming, and SOC 2 / EU AI Act compliance verification conducted by senior AI security architects.'}
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={`/${lang}/contact?plan=audit`}
              style={{
                padding: '14px 28px',
                borderRadius: '10px',
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
              }}
            >
              {isRtl ? 'جدولة تدقيق أمان للمؤسسات' : 'Schedule Security Audit'}
            </Link>
          </div>
        </section>

        {/* 1. DEFENSE ENCLAVE COMPLIANCE TRUST ANCHORS (ALWAYS HIGH-CONTRAST SLATE CARDS) */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Award color="#38BDF8" size={24} />
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--txt)', margin: 0 }}>
              {isRtl ? 'إطار الامتثال والثقة القابل للتحقق' : 'Verifiable Compliance & Trust Framework'}
            </h2>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px', maxWidth: '840px', lineHeight: 1.6 }}>
            SwishOS advisory deliverables map directly to Trust Services Criteria (TSC) and international AI safety regulations before any engagement begins.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
            {[
              { code: 'SOC 2 CC6.1', name: 'Logical Access Controls', desc: 'Deterministic mTLS agent identity & session token validation to prevent inter-agent spoofing.' },
              { code: 'SOC 2 CC6.8', name: 'Software Threat Defense', desc: 'AST static analysis & sliding-window prompt injection red-teaming against OWASP LLM Top 10.' },
              { code: 'SOC 2 CC7.1', name: 'Vulnerability Management', desc: 'Automated SARIF v2.1.0 report generation with CVSS v3.1 impact vector scoring.' },
              { code: 'EU AI Act Art 15', name: 'Robustness & Accuracy', desc: 'Technical robustness, error logging, and fail-closed runtime enclave boundary verification.' },
            ].map(ctrl => (
              <div key={ctrl.code} style={{ background: '#0F172A', padding: '22px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.35)', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(56, 189, 248, 0.15)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                    {ctrl.code}
                  </span>
                  <CheckCircle2 size={16} color="#10B981" />
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>{ctrl.name}</div>
                <div style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>{ctrl.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. ENGAGEMENT TIERS (HIGH-CONTRAST DEFENSE SLATE CARDS) */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--txt)', marginBottom: '8px' }}>
              {isRtl ? 'نماذج التعاقد المباشر' : 'Advisory Engagement Scopes'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
              Select a fixed 1-week threat audit or continuous guardrail retainer.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

            {/* Fixed Audit Tier */}
            <div style={{
              background: '#0F172A',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38BDF8',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '6px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}>
                  FIXED SCOPE ENGAGEMENT
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>1-Week AI Threat Model Audit</h3>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>Deep-dive adversarial evaluation of tool calling, prompt injection resilience, and spend boundaries.</p>
                
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#F8FAFC', marginBottom: '24px' }}>
                  $7,500 – $12,500 <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8' }}>(Fixed 1-Week Engagement)</span>
                </div>
              </div>

              <hr style={{ borderColor: 'rgba(255, 255, 255, 0.12)', marginBottom: '24px' }} />

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'grid', gap: '12px', fontSize: '14px', color: '#CBD5E1' }}>
                {[
                  'Full AST Taint & Prompt Injection Penetration Audit',
                  'OASIS SARIF v2.1.0 Machine-Readable Findings Export',
                  'SOC 2 CC6/CC7/CC8 & EU AI Act Compliance Mapping',
                  'Executive CISO Summary & Remediation Architecture',
                  '90-Minute Technical Briefing with Security Architects',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${lang}/contact?plan=audit`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  background: '#2563EB',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  marginTop: 'auto',
                }}
              >
                Schedule Security Audit →
              </Link>
            </div>

            {/* Monthly Retainer Tier */}
            <div style={{
              background: '#0F172A',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38BDF8',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '6px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}>
                  CONTINUOUS ADVISORY
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>Guardrail & Red-Team Retainer</h3>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>Continuous attack simulation, custom AST policy tuning, and active incident support.</p>

                <div style={{ fontSize: '20px', fontWeight: 700, color: '#F8FAFC', marginBottom: '24px' }}>
                  $4,500 <span style={{ fontSize: '14px', fontWeight: 500 }}>/ month</span> <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8' }}>(Continuous Advisory)</span>
                </div>
              </div>

              <hr style={{ borderColor: 'rgba(255, 255, 255, 0.12)', marginBottom: '24px' }} />

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'grid', gap: '12px', fontSize: '14px', color: '#CBD5E1' }}>
                {[
                  'Continuous Automated Attack Payload Sweeps',
                  'Dedicated Slack Connect Channel with Security Team',
                  '< 15 Minute Emergency Incident Response Paging',
                  'Custom AST Guardrail & Spend Governor Rule Updates',
                  'Quarterly SOC 2 Audit Readiness Verification',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${lang}/contact?plan=retainer`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: '#1E293B',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  marginTop: 'auto',
                }}
              >
                Inquire About Retainer →
              </Link>
            </div>

          </div>
        </section>

        {/* 3. DELIVERABLES SAMPLE PREVIEW */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--txt)', marginBottom: '8px' }}>Sample Executive Deliverables</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Inspect sample SARIF v2.1.0 audit reports and vulnerability matrices generated by SwishOS.</p>
          </div>
          <AuditSampleDeliverable lang={lang} />
        </section>

      </div>
    </main>
  );
}
