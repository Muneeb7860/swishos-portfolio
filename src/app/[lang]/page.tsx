'use client';

import React from 'react';
import Link from 'next/link';
import en from '../../dictionaries/en.json';
import ar from '../../dictionaries/ar.json';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { EnterpriseThreatScorecard } from '../../components/EnterpriseThreatScorecard';
import { AuditSampleDeliverable } from '../../components/AuditSampleDeliverable';
import { CodeIcon, GithubIcon, TargetIcon, CheckCircleIcon } from '../../components/Icons';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function Home(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;
  const isAr = lang === 'ar';

  useScrollReveal();

  return (
    <>
      <main id="main-content">
        {/* HERO */}
        <section className="hero" style={{ paddingBottom: '60px' }}>
          <div className="wrap">
            <span className="pill reveal"><span className="dot"></span>{dict.hero.badge}</span>
            <h1 className="reveal">{dict.hero.title1}<br /><span style={{ color: 'var(--txt)', fontWeight: 800 }}>{dict.hero.title2}</span></h1>
            <p className="sub reveal" style={{ maxWidth: '780px', margin: '16px auto 28px auto' }}>{dict.hero.subtitle}</p>

            {/* Executive CTAs - Clean Single Row */}
            <div className="hero-cta reveal" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', margin: '28px 0 52px' }}>
              <Link href={`/${lang}/contact?plan=audit`} className="btn-pri" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '15px' }}>
                <TargetIcon size={16} /> {isAr ? 'جدولة تدقيق أمان للمؤسسات' : 'Schedule Security Audit'}
              </Link>
              <Link href={`/${lang}/advisory`} className="btn-sec" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '15px' }}>
                {isAr ? 'استكشاف خدمات الاستشارات' : 'Explore Enterprise Advisory →'}
              </Link>
            </div>

            {/* Enterprise Threat Mitigation Scorecard & Anchored Compliance Seals */}
            <div className="reveal">
              {/* Hardened Compliance Lead-In Header Bar */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '16px',
              }}>
                <div style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  color: '#38BDF8',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  🛡️ SOC 2 TYPE II CC6/CC7/CC8 MAPPED
                </div>
                <div style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  color: '#38BDF8',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  ⚖️ EU AI ACT ARTICLE 15 COMPLIANT
                </div>
                <div style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  color: '#38BDF8',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  📄 OASIS SARIF V2.1.0 READY
                </div>
              </div>

              <EnterpriseThreatScorecard />
            </div>
          </div>
        </section>

        {/* PRODUCT IDENTITY: OPEN SOURCE CORE VS ENTERPRISE AUDIT */}
        <section style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">{isAr ? 'النموذج والأداء' : 'ENGAGEMENT MODELS'}</span>
              <h2>{isAr ? 'المحرك المفتوح مقابل تدقيق المؤسسات' : 'Open-Source Security Platform vs. Enterprise Advisory Audit'}</h2>
              <p>{isAr ? 'اختر بين أدوات المطورين المجانية المفتوحة المصدر وتدقيق الأمان المباشر للمؤسسات' : 'Deploy our open-source security SDK / PyPI scanner or engage our security research team for a high-touch 1-week threat audit.'}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
              {/* Option 1: Open Source Core (Clean Panel Background) */}
              <div className="glass-card reveal" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="badge-pill" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <CodeIcon size={14} color="#10B981" /> FOR ENGINEERING TEAMS / FREE
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'monospace' }}>pip / npm / WASM</span>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>SwishOS Security Platform & SDK</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {isAr
                    ? 'حزمة حماية مفتوحة المصدر لمطوري LangChain و CrewAI و AutoGen لتطبيق معايير NFKC وحدود الإنفاق ($5/يوم).'
                    : 'Open-source PyPI scanner (agentic-redteam), zero-trust WASM enclave, and runtime guardrails for action-taking AI agents.'}
                </p>
                
                {/* Dark IDE Code Container */}
                <div style={{ background: '#0F172A', color: '#F8FAFC', padding: '14px 16px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '13px', border: '1px solid rgba(255, 255, 255, 0.15)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <code>$ pip install agentic-redteam</code>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>v1.0.0</span>
                </div>

                {/* Key Bullets */}
                <div style={{ display: 'grid', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircleIcon size={15} color="#10B981" /> {isAr ? 'معايير NFKC وحدود الإنفاق اليومي ($5/يوم)' : 'SARIF v2.1 Output + OWASP LLM 0–100 Scoring Engine'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircleIcon size={15} color="#10B981" /> {isAr ? 'حاوية WASM وإعادة التوجيه إلى المضيف المحلي' : 'Zero-Trust WASM Sandbox Container & Stream Redactor'}
                  </div>
                </div>

                {/* Card Button */}
                <a href="https://github.com/Muneeb7860/agentic-redteam" target="_blank" rel="noopener noreferrer" className="btn-sec" style={{ width: '100%', justifyContent: 'center', gap: '8px', marginTop: 'auto' }}>
                  <GithubIcon size={16} /> {isAr ? 'عرض الحزمة على GitHub' : 'View GitHub & CLI Docs'}
                </a>
              </div>

              {/* Option 2: Enterprise Security Audit (Soft Tinted Background, Crisp Neutral Border) */}
              <div className="glass-card-tinted reveal" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--txt)' }}>
                    <TargetIcon size={14} color="var(--brand)" /> FOR CISOS & SECURITY LEADERSHIP
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--txt)' }}>$7,500 – $12,500</span>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>AI Agent Security Audit</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {isAr
                    ? 'تدقيق أمني شامل لمدة أسبوع واحد بواسطة فريق أبحاث أمن الذكاء الاصطناعي مع تقرير تنفيذي للرئيس التنفيذي للأمن.'
                    : 'Fixed 1-week threat modeling, adversarial red-teaming, guardrail gap analysis, and CISO debrief led by senior security architects.'}
                </p>

                {/* Audit Highlight Container - Neutral Dark IDE Style */}
                <div style={{ background: '#0F172A', color: '#F8FAFC', padding: '14px 16px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '13px', border: '1px solid rgba(255, 255, 255, 0.15)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>1-Week Delivery + PR-Ready Fixes</span>
                  <span style={{ fontSize: '11px', background: '#334155', color: '#F8FAFC', padding: '2px 8px', borderRadius: '4px' }}>CISO Ready</span>
                </div>

                {/* Key Bullets */}
                <div style={{ display: 'grid', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircleIcon size={15} color="#10B981" /> {isAr ? 'خريطة حرارية لمخاطر OWASP LLM 2026 + سجلات هجوم curl' : 'OWASP Agentic Risk Heatmap + Exploit Logs'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircleIcon size={15} color="#10B981" /> {isAr ? 'تقرير تنفيذي ومراجعة شفهية مع رئيس قطاع الأمن (CISO)' : '1-Week Delivery + Executive CISO Debrief'}
                  </div>
                </div>

                {/* Card Button */}
                <Link href={`/${lang}/contact?plan=audit`} className="btn-pri" style={{ width: '100%', justifyContent: 'center', gap: '8px', marginTop: 'auto' }}>
                  <TargetIcon size={16} /> {isAr ? 'احجز تدقيق الأمان المباشر' : 'Book a 1-Week Audit'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SWISH APP */}
        <section id="swishapp">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">{dict.sections.swishapp.eyebrow}</span>
              <h2>{dict.sections.swishapp.title}</h2>
              <p>{dict.sections.swishapp.subtitle}</p>
            </div>
            
            <div className="grid-layout">
              {/* Core Platform */}
              <div className="feature reveal">
                <h3>{dict.sections.swishapp.core.title}</h3>
                <ul style={{ listStyle: 'none', marginTop: '16px', display: 'grid', gap: '16px' }}>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>{dict.sections.swishapp.core.inventory}</strong>
                    <p style={{ marginTop: '4px' }}>{dict.sections.swishapp.core.inventoryDesc}</p>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>{dict.sections.swishapp.core.warehouse}</strong>
                    <p style={{ marginTop: '4px' }}>{dict.sections.swishapp.core.warehouseDesc}</p>
                  </li>
                </ul>
              </div>

              {/* AI-Native Layer */}
              <div className="feature reveal">
                <h3>{dict.sections.swishapp.ai.title}</h3>
                <ul style={{ listStyle: 'none', marginTop: '16px', display: 'grid', gap: '16px' }}>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>{dict.sections.swishapp.ai.agentic}</strong>
                    <p style={{ marginTop: '4px' }}>{dict.sections.swishapp.ai.agenticDesc}</p>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>{dict.sections.swishapp.ai.guardrails}</strong>
                    <p style={{ marginTop: '4px' }}>{dict.sections.swishapp.ai.guardrailsDesc}</p>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>{dict.sections.swishapp.ai.custom}</strong>
                    <p style={{ marginTop: '4px' }}>{dict.sections.swishapp.ai.customDesc}</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sample Deliverable Preview Component */}
            <div className="reveal">
              <AuditSampleDeliverable lang={lang} />
            </div>
          </div>
        </section>

        {/* PLATFORM INFRASTRUCTURE */}
        <section id="infrastructure">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">{dict.sections.infrastructure.eyebrow}</span>
              <h2>{dict.sections.infrastructure.title}</h2>
              <p>{dict.sections.infrastructure.subtitle}</p>
            </div>
            <div className="grid-layout">
              <div className="feature reveal">
                <h3>{dict.sections.infrastructure.arch.title}</h3>
                <ul style={{ listStyle: 'none', marginTop: '16px', display: 'grid', gap: '16px' }}>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>{dict.sections.infrastructure.arch.cloud}</strong>
                    <p style={{ marginTop: '4px' }}>{dict.sections.infrastructure.arch.cloudDesc}</p>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>{dict.sections.infrastructure.arch.threat}</strong>
                    <p style={{ marginTop: '4px' }}>{dict.sections.infrastructure.arch.threatDesc}</p>
                  </li>
                </ul>
              </div>
              <div className="feature reveal">
                <h3>{dict.sections.infrastructure.ops.title}</h3>
                <ul style={{ listStyle: 'none', marginTop: '16px', display: 'grid', gap: '16px' }}>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>{dict.sections.infrastructure.ops.compliance}</strong>
                    <p style={{ marginTop: '4px' }}>{dict.sections.infrastructure.ops.complianceDesc}</p>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>{dict.sections.infrastructure.ops.billing}</strong>
                    <p style={{ marginTop: '4px' }}>{dict.sections.infrastructure.ops.billingDesc}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
