import React from 'react';
import Link from 'next/link';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';
import { AuditSampleDeliverable } from '@/components/AuditSampleDeliverable';
import { Check, Shield, FileText, ArrowRight, Lock, Award } from 'lucide-react';

const dictionaries: Record<string, typeof en> = { en, ar };

export default async function AdvisoryPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const isRtl = lang === 'ar';

  return (
    <main style={{ background: '#0B0F17', color: '#F8FAFC', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* HERO */}
        <section style={{ textAlign: 'center', padding: '40px 0 60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38BDF8',
            fontSize: '12px',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '999px',
            letterSpacing: '0.06em',
            marginBottom: '20px',
          }}>
            <Shield size={14} />
            ENTERPRISE AI SECURITY ADVISORY & AUDIT
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.03em', color: '#F8FAFC' }}>
            {isRtl ? 'تدقيق وأمن وكلاء الذكاء الاصطناعي المؤسسي' : '1-Week AI Agent Threat Model & Compliance Audit'}
          </h1>
          <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '820px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            {isRtl
              ? 'مراجعة أمنية شاملة للنماذج واختبار الاختراق التكتيكي بواسطة مهندسين سابقين في كبرى شركات التقنية.'
              : 'Deterministic threat modeling, adversarial red-teaming, and SOC 2 / EU AI Act compliance verification conducted by senior AI security architects.'}
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={`/${lang}/contact?plan=audit`}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB, #0891B2)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(37, 99, 235, 0.35)',
              }}
            >
              {isRtl ? 'احجز تدقيقاً أمنياً ($7,500 – $12,500)' : 'Schedule Security Audit ($7,500 – $12,500)'}
            </Link>
          </div>
        </section>

        {/* ENGAGEMENT TIERS */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

            {/* Fixed Audit Tier */}
            <div style={{
              background: '#0F172A',
              border: '2px solid #3B82F6',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '-14px',
                right: '24px',
                background: '#2563EB',
                color: '#FFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 14px',
                borderRadius: '999px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                MOST POPULAR
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>1-Week AI Threat Model Audit</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Deep-dive adversarial evaluation of tool calling, prompt injection resilience, and spend boundaries.</p>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>$7,500 – $12,500</div>
              <div style={{ fontSize: '13px', color: '#38BDF8', fontWeight: 700, marginBottom: '24px' }}>Fixed-Scope Deliverable · 5-Day SLA</div>

              <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: '24px' }} />

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
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563EB, #0891B2)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Book 1-Week Audit →
              </Link>
            </div>

            {/* Monthly Retainer Tier */}
            <div style={{
              background: '#0F172A',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '20px',
              padding: '36px',
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>Guardrail & Red-Team Retainer</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Continuous attack simulation, custom AST policy tuning, and active incident support.</p>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>$4,500 <span style={{ fontSize: '16px', color: '#94A3B8', fontWeight: 500 }}>/ month</span></div>
              <div style={{ fontSize: '13px', color: '#38BDF8', fontWeight: 700, marginBottom: '24px' }}>Continuous Advisory · P1 Critical SLA</div>

              <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: '24px' }} />

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
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: '#1E293B',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Inquire About Retainer →
              </Link>
            </div>

          </div>
        </section>

        {/* SOC 2 & EU AI ACT COMPLIANCE MATRIX */}
        <section style={{
          background: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '20px',
          padding: '36px',
          marginBottom: '60px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Award color="#38BDF8" size={24} />
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>Verifiable Compliance & Trust Framework</h2>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '28px', maxWidth: '780px' }}>
            SwishOS advisory deliverables map directly to Trust Services Criteria (TSC) and international AI safety regulations.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { code: 'SOC 2 CC6.1', name: 'Logical Access Controls', desc: 'Deterministic mTLS agent identity & session token validation to prevent inter-agent spoofing.' },
              { code: 'SOC 2 CC6.8', name: 'Software Threat Defense', desc: 'AST static analysis & sliding-window prompt injection red-teaming against OWASP LLM Top 10.' },
              { code: 'SOC 2 CC7.1', name: 'Vulnerability Management', desc: 'Automated SARIF v2.1.0 report generation with CVSS v3.1 impact vector scoring.' },
              { code: 'EU AI Act Art 15', name: 'Robustness & Accuracy', desc: 'Technical robustness, error logging, and fail-closed runtime enclave boundary verification.' },
            ].map(ctrl => (
              <div key={ctrl.code} style={{ background: '#1E293B', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{ctrl.code}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>{ctrl.name}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>{ctrl.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* DELIVERABLES SAMPLE PREVIEW */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>Sample Executive Deliverables</h2>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Inspect sample SARIF v2.1.0 audit reports and vulnerability matrices generated by SwishOS.</p>
          </div>
          <AuditSampleDeliverable lang={lang} />
        </section>

      </div>
    </main>
  );
}
