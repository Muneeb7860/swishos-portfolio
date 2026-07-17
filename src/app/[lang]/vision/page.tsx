'use client';
import React from 'react';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function VisionPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;

  useScrollReveal();

  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <span className="pill reveal"><span className="dot"></span>{dict.visionPage.heroBadge}</span>
          <h1 className="reveal">{dict.visionPage.heroTitle1}<br /><span className="grad">{dict.visionPage.heroTitle2}</span></h1>
          <p className="sub reveal">{dict.visionPage.heroSubtitle}</p>
        </div>
      </section>

      <section>
        <div className="wrap" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="feature reveal" style={{ padding: '60px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>{dict.visionPage.contentTitle}</h2>
            <p style={{ fontSize: '18px', color: 'var(--muted)', marginBottom: '24px' }}>
              {dict.visionPage.contentP1}
            </p>
            <p style={{ fontSize: '18px', color: 'var(--muted)' }}>
              {dict.visionPage.contentP2}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
