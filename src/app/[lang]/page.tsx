'use client';
import React from 'react';
import Link from 'next/link';
import en from '../../dictionaries/en.json';
import ar from '../../dictionaries/ar.json';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function Home(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;

  useScrollReveal();

  return (
    <>
      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <span className="pill reveal"><span className="dot"></span>{dict.hero.badge}</span>
            <h1 className="reveal">{dict.hero.title1}<br /><span className="grad">{dict.hero.title2}</span></h1>
            <p className="sub reveal">{dict.hero.subtitle}</p>
            <div className="hero-cta reveal">
              <Link href={`/${lang}/contact`} className="btn-primary">{dict.hero.ctaPrimary}</Link>
              <Link href={`/${lang}/features`} className="btn-secondary">{dict.hero.ctaSecondary}</Link>
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

        {/* BRAND & WORKFORCE */}
        <section id="workforce">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">{dict.sections.workforce.eyebrow}</span>
              <h2>{dict.sections.workforce.title}</h2>
              <p>{dict.sections.workforce.subtitle}</p>
            </div>
            <div className="grid-layout">
              <div className="feature reveal">
                <h3>{dict.sections.workforce.brand.title}</h3>
                <p style={{ marginTop: '16px' }}>{dict.sections.workforce.brand.desc}</p>
              </div>
              <div className="feature reveal">
                <h3>{dict.sections.workforce.staffing.title}</h3>
                <p style={{ marginTop: '16px' }}>{dict.sections.workforce.staffing.desc}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
