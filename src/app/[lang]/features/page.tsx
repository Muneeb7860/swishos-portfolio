'use client';
import React from 'react';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function FeaturesPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;

  useScrollReveal();

  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <span className="pill reveal"><span className="dot"></span>{dict.featuresPage.heroBadge}</span>
          <h1 className="reveal">{dict.featuresPage.heroTitle1}<br /><span className="grad">{dict.featuresPage.heroTitle2}</span></h1>
          <p className="sub reveal">{dict.featuresPage.heroSubtitle}</p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="grid-layout">
            <div className="feature reveal">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡️</div>
              <h3>{dict.featuresPage.agenticTitle}</h3>
              <p>{dict.featuresPage.agenticDesc}</p>
            </div>
            <div className="feature reveal">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>📊</div>
              <h3>{dict.featuresPage.ledgerTitle}</h3>
              <p>{dict.featuresPage.ledgerDesc}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
