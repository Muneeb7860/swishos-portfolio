'use client';

import React from 'react';
import Link from 'next/link';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { Check, ArrowRight } from 'lucide-react';

const dictionaries: Record<string, typeof en> = { en, ar };

const OSS_REPO_PUBLISHED = true;
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

export default function PricingClient({ lang }: { lang: string }) {
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
      href: `/${lang}/contact?plan=audit`,
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
      href: `/${lang}/contact?plan=retainer`,
    },
  ];

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* HERO */}
        <section style={{ textAlign: 'center', padding: '40px 0 50px' }}>
          <span style={{
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
            {p.badge}
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.03em', color: 'var(--txt)' }}>
            {p.title1} {p.title2}
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '780px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            {p.subtitle}
          </p>
        </section>

        {/* OFFER LADDER */}
        <section style={{ paddingTop: '20px', marginBottom: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {tiers.map((tier) => (
              <div
                key={tier.name}
                style={{
                  background: '#0F172A',
                  border: tier.featured ? '2px solid #2563EB' : '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '16px',
                  padding: '36px',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                {tier.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      right: '24px',
                      background: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 14px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                    }}
                  >
                    {p.popularBadge}
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>{tier.name}</h3>
                  <p style={{ minHeight: '52px', fontSize: '14px', color: '#94A3B8', lineHeight: 1.5 }}>{tier.desc}</p>

                  <div style={{ margin: '24px 0 10px', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '36px', fontWeight: 800, color: '#F8FAFC', fontFamily: 'Sora', lineHeight: 1.1 }}>
                      {tier.price}
                    </span>
                    <span style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500 }}>{tier.unit}</span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 700, marginBottom: '24px', minHeight: '32px' }}>
                    {tier.note}
                  </p>

                  <hr style={{ borderColor: 'rgba(255, 255, 255, 0.12)', marginBottom: '24px' }} />

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'grid', gap: '12px', fontSize: '14px', color: '#CBD5E1' }}>
                    {tier.features.map((feature, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.external ? (
                  <a
                    href={tier.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px 20px',
                      borderRadius: '10px',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38BDF8',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                      marginTop: 'auto',
                    }}
                  >
                    {tier.cta} <ArrowRight size={14} />
                  </a>
                ) : (
                  <Link
                    href={tier.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px 20px',
                      borderRadius: '10px',
                      background: tier.featured ? '#2563EB' : '#1E293B',
                      border: tier.featured ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                      marginTop: 'auto',
                    }}
                  >
                    {tier.cta} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
