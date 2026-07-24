'use client';

import React from 'react';
import Link from 'next/link';
import en from '../../dictionaries/en.json';
import ar from '../../dictionaries/ar.json';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { EnterpriseThreatScorecard } from '../../components/EnterpriseThreatScorecard';
import { AuditSampleDeliverable } from '../../components/AuditSampleDeliverable';
import { CodeIcon, GithubIcon, TargetIcon, CheckCircleIcon } from '../../components/Icons';
import { Shield } from 'lucide-react';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function Home(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;
  const isAr = lang === 'ar';

  useScrollReveal();

  return (
    <main id="main-content" style={{ background: 'var(--bg)', color: 'var(--txt)', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* HERO */}
      <section className="hero" style={{ padding: '60px 0 60px' }}>
        <div className="wrap" style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Badge */}
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
            marginBottom: '24px',
          }}>
            <Shield size={14} color="#38BDF8" />
            {dict.hero.badge}
          </div>

          <h1 style={{
            fontSize: '52px',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            marginBottom: '20px',
            color: 'var(--txt)',
          }}>
            {dict.hero.title1} <br />
            <span style={{ color: '#F8FAFC', fontWeight: 900 }}>
              {dict.hero.title2}
            </span>
          </h1>

          <p style={{
            fontSize: '19px',
            color: 'var(--muted)',
            maxWidth: '800px',
            margin: '0 auto 36px',
            lineHeight: 1.6,
            fontWeight: 500,
          }}>
            {dict.hero.subtitle}
          </p>

          {/* Executive CTAs - Clean Single Row */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '52px' }}>
            <Link
              href={`/${lang}/contact?plan=audit`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                borderRadius: '10px',
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
              }}
            >
              <TargetIcon size={16} /> {isAr ? 'جدولة تدقيق أمان للمؤسسات' : 'Schedule Security Audit'}
            </Link>
            <Link
              href={`/${lang}/advisory`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                borderRadius: '10px',
                background: 'var(--bg-soft)',
                border: '1px solid var(--line-strong)',
                color: 'var(--txt)',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              {isAr ? 'استكشاف خدمات الاستشارات' : 'Explore Enterprise Advisory →'}
            </Link>
          </div>

          {/* Enterprise Threat Mitigation Scorecard & Anchored Compliance Seals */}
          <div>
            {/* Hardened Compliance Seals Bar */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}>
              {[
                '🛡️ SOC 2 TYPE II CC6/CC7/CC8 MAPPED',
                '⚖️ EU AI ACT ARTICLE 15 COMPLIANT',
                '📄 OASIS SARIF V2.1.0 READY',
              ].map(seal => (
                <div key={seal} style={{
                  background: '#0F172A',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  color: '#38BDF8',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                }}>
                  {seal}
                </div>
              ))}
            </div>

            <EnterpriseThreatScorecard />
          </div>

        </div>
      </section>

      {/* PRODUCT IDENTITY: OPEN SOURCE CORE VS ENTERPRISE AUDIT */}
      <section style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isAr ? 'النموذج والأداء' : 'ENGAGEMENT MODELS'}
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--txt)', margin: '8px 0 12px' }}>
              {isAr ? 'المحرك المفتوح مقابل تدقيق المؤسسات' : 'Open-Source Security Platform vs. Enterprise Advisory Audit'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '780px', margin: '0 auto' }}>
              {isAr ? 'اختر بين أدوات المطورين المجانية المفتوحة المصدر وتدقيق الأمان المباشر للمؤسسات' : 'Deploy our open-source security SDK / PyPI scanner or engage our security research team for a high-touch 1-week threat audit.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
            {/* Option 1: Open Source Core (Defense Enclave Card) */}
            <div style={{
              background: '#0F172A',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                  FOR ENGINEERING TEAMS / FREE
                </span>
                <span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace' }}>pip / npm / WASM</span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', marginBottom: '12px' }}>SwishOS Security Platform & SDK</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
                {isAr
                  ? 'حزمة حماية مفتوحة المصدر لمطوري LangChain و CrewAI و AutoGen لتطبيق معايير NFKC وحدود الإنفاق ($5/يوم).'
                  : 'Open-source PyPI scanner (agentic-redteam), zero-trust WASM enclave, and runtime guardrails for action-taking AI agents.'}
              </p>
              
              {/* Dark IDE Code Container */}
              <div style={{ background: '#0B0F17', color: '#F8FAFC', padding: '14px 16px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '13px', border: '1px solid rgba(255, 255, 255, 0.15)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code>$ pip install agentic-redteam</code>
                <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 700 }}>v1.0.0</span>
              </div>

              {/* Key Bullets */}
              <div style={{ display: 'grid', gap: '10px', marginBottom: '28px', fontSize: '13px', color: '#CBD5E1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleIcon size={15} color="#10B981" /> {isAr ? 'معايير NFKC وحدود الإنفاق اليومي ($5/يوم)' : 'SARIF v2.1 Output + OWASP LLM 0–100 Scoring Engine'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleIcon size={15} color="#10B981" /> {isAr ? 'حاوية WASM وإعادة التوجيه إلى المضيف المحلي' : 'Zero-Trust WASM Sandbox Container & Stream Redactor'}
                </div>
              </div>

              {/* Card Button */}
              <a
                href="https://github.com/Muneeb7860/agentic-redteam"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38BDF8',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  marginTop: 'auto',
                }}
              >
                <GithubIcon size={16} /> {isAr ? 'عرض الحزمة على GitHub' : 'View GitHub & CLI Docs'}
              </a>
            </div>

            {/* Option 2: Enterprise Security Audit (Defense Enclave Card) */}
            <div style={{
              background: '#0F172A',
              border: '2px solid #2563EB',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 16px 48px rgba(37, 99, 235, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(56, 189, 248, 0.15)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
                  FOR CISOS & SECURITY LEADERSHIP
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC' }}>$7,500 – $12,500</span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', marginBottom: '12px' }}>AI Agent Security Audit</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
                {isAr
                  ? 'تدقيق أمني شامل لمدة أسبوع واحد بواسطة فريق أبحاث أمن الذكاء الاصطناعي مع تقرير تنفيذي للرئيس التنفيذي للأمن.'
                  : 'Fixed 1-week threat modeling, adversarial red-teaming, guardrail gap analysis, and CISO debrief led by senior security architects.'}
              </p>

              {/* Audit Highlight Container */}
              <div style={{ background: '#0B0F17', color: '#F8FAFC', padding: '14px 16px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '13px', border: '1px solid rgba(255, 255, 255, 0.15)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>1-Week Delivery + PR-Ready Fixes</span>
                <span style={{ fontSize: '11px', background: '#2563EB', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>CISO Ready</span>
              </div>

              {/* Key Bullets */}
              <div style={{ display: 'grid', gap: '10px', marginBottom: '28px', fontSize: '13px', color: '#CBD5E1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleIcon size={15} color="#10B981" /> {isAr ? 'خريطة حرارية لمخاطر OWASP LLM 2026 + سجلات هجوم curl' : 'OWASP Agentic Risk Heatmap + Exploit Logs'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleIcon size={15} color="#10B981" /> {isAr ? 'تقرير تنفيذي ومراجعة شفهية مع رئيس قطاع الأمن (CISO)' : '1-Week Delivery + Executive CISO Debrief'}
                </div>
              </div>

              {/* Card Button */}
              <Link
                href={`/${lang}/contact?plan=audit`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  marginTop: 'auto',
                }}
              >
                <TargetIcon size={16} /> {isAr ? 'احجز تدقيق الأمان المباشر' : 'Book a 1-Week Audit'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE DELIVERABLES SECTION */}
      <section style={{ padding: '40px 0 60px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <AuditSampleDeliverable lang={lang} />
        </div>
      </section>
    </main>
  );
}
