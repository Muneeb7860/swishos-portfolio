'use client';

import React from 'react';
import Link from 'next/link';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { Check, ArrowRight } from 'lucide-react';

const dictionaries: Record<string, typeof en> = { en, ar };

// The agentic-redteam harness currently lives inside the Swish_App repo and has not
// been published as a standalone public repo yet. Until it is, the OSS card must not
// link out — a 404 on the free tier is the worst first impression for a
// credibility-led offer. When the repo is public: flip this to true and confirm the URL.
const OSS_REPO_PUBLISHED = false;
const OSS_REPO_URL = 'https://github.com/Muneeb7860/agentic-redteam';

type Tier = {
  name: string;
  desc: string;
  price: string;
  unit: string;
  note: string;
  features: string[];
  cta: string;
  href: string;
  external?: boolean;
  featured?: boolean;
};

export default function PricingPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;
  const p = dict.pricingPage;

  useScrollReveal();

  const tiers: Tier[] = [
    {
      name: p.ossName,
      desc: p.ossDesc,
      price: p.ossPrice,
      unit: p.ossUnit,
      note: OSS_REPO_PUBLISHED ? p.ossNote : p.ossNotePending,
      features: p.ossFeatures,
      cta: OSS_REPO_PUBLISHED ? p.ossCta : p.ossCtaPending,
      href: OSS_REPO_PUBLISHED ? OSS_REPO_URL : `/${lang}/contact`,
      external: OSS_REPO_PUBLISHED,
    },
    {
      name: p.auditName,
      desc: p.auditDesc,
      price: p.auditPrice,
      unit: p.auditUnit,
      note: p.auditNote,
      features: p.auditFeatures,
      cta: p.auditCta,
      href: `/${lang}/contact`,
      featured: true,
    },
    {
      name: p.retainerName,
      desc: p.retainerDesc,
      price: p.retainerPrice,
      unit: p.retainerUnit,
      note: p.retainerNote,
      features: p.retainerFeatures,
      cta: p.retainerCta,
      href: `/${lang}/contact`,
    },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="hero" style={{ paddingBottom: '30px' }}>
        <div className="wrap">
          <span className="pill reveal">
            <span className="dot"></span>
            {p.badge}
          </span>
          <h1 className="reveal">
            {p.title1} <br />
            <span className="grad">{p.title2}</span>
          </h1>
          <p className="sub reveal" style={{ maxWidth: '760px' }}>
            {p.subtitle}
          </p>
        </div>
      </section>

      {/* OFFER LADDER */}
      <section style={{ paddingTop: '20px' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="feature reveal"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  ...(tier.featured
                    ? { borderColor: 'var(--brand)', boxShadow: '0 0 30px var(--glow)' }
                    : {}),
                }}
              >
                {tier.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      insetInlineEnd: '24px',
                      background: 'var(--brand)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 14px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {p.popularBadge}
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>{tier.name}</h3>
                  <p style={{ minHeight: '60px', fontSize: '14px' }}>{tier.desc}</p>

                  <div style={{ margin: '24px 0 10px', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '34px', fontWeight: 800, color: 'var(--txt)', fontFamily: 'Sora', lineHeight: 1.1 }}>
                      {tier.price}
                    </span>
                    <span style={{ color: 'var(--muted)', fontSize: '14px' }}>{tier.unit}</span>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--brand)', fontWeight: 600, marginBottom: '24px' }}>
                    {tier.note}
                  </div>

                  <hr style={{ borderColor: 'var(--line)', margin: '16px 0' }} />

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', fontSize: '14px' }}>
                    {tier.features.map((f) => (
                      <li key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <Check size={16} color="var(--brand)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.external ? (
                  <a
                    href={tier.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ marginTop: '32px', width: '100%', justifyContent: 'center' }}
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <Link
                    href={tier.href}
                    className={tier.featured ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ marginTop: '32px', width: '100%', justifyContent: 'center', gap: '8px' }}
                  >
                    {tier.cta}
                    {tier.featured && <ArrowRight size={16} />}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <p
            className="reveal"
            style={{ maxWidth: '760px', margin: '40px auto 0', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}
          >
            {p.footnote}
          </p>
        </div>
      </section>
    </main>
  );
}
