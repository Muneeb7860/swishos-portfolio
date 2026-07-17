'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { Check, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function PricingPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;

  useScrollReveal();

  const [isAnnual, setIsAnnual] = useState(false);
  const [orders, setOrders] = useState(15000);

  // Discount factor for annual
  const discount = isAnnual ? 0.8 : 1.0;

  // Real-time pricing calculator calculations
  const calculateEstimate = (volume: number) => {
    let tier = 'Starter';
    let basePrice = 499;
    let perOrderFee = 0.35;

    if (volume > 5000 && volume <= 35000) {
      tier = 'Growth';
      basePrice = 1499;
      perOrderFee = 0.25;
    } else if (volume > 35000) {
      tier = 'Enterprise';
      basePrice = 3499;
      perOrderFee = 0.15;
    }

    const monthlyBase = Math.round(basePrice * discount);
    const volumeCost = Math.round(volume * perOrderFee);
    const totalMonthly = monthlyBase + volumeCost;

    return { tier, monthlyBase, perOrderFee, volumeCost, totalMonthly };
  };

  const est = calculateEstimate(orders);

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero" style={{ paddingBottom: '30px' }}>
        <div className="wrap">
          <span className="pill reveal">
            <span className="dot"></span>
            {dict.pricingPage.badge}
          </span>
          <h1 className="reveal">
            {dict.pricingPage.title1} <br />
            <span className="grad">{dict.pricingPage.title2}</span>
          </h1>
          <p className="sub reveal" style={{ maxWidth: '720px' }}>
            {dict.pricingPage.subtitle}
          </p>

          {/* BILLING TOGGLE */}
          <div
            className="reveal"
            style={{
              marginTop: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'var(--panel-2)',
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1px solid var(--line-strong)',
            }}
          >
            <span style={{ fontSize: '14px', color: !isAnnual ? 'var(--txt)' : 'var(--muted)', fontWeight: !isAnnual ? 700 : 500 }}>
              {lang === 'ar' ? 'شهري' : 'Monthly'}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                background: isAnnual ? 'var(--brand)' : 'rgba(255,255,255,0.2)',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: isAnnual ? '23px' : '3px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.2s',
                }}
              />
            </button>
            <span style={{ fontSize: '14px', color: isAnnual ? 'var(--txt)' : 'var(--muted)', fontWeight: isAnnual ? 700 : 500 }}>
              {lang === 'ar' ? 'سنوي (توفير 20%)' : 'Annual (Save 20%)'}
            </span>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section style={{ paddingTop: '20px' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* STARTER CARD */}
            <div
              className="feature reveal"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
            >
              <div>
                <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>{dict.pricingPage.starterName}</h3>
                <p style={{ minHeight: '48px', fontSize: '14px' }}>{dict.pricingPage.starterDesc}</p>
                <div style={{ margin: '24px 0 16px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--txt)', fontFamily: 'Sora' }}>
                    ${Math.round(499 * discount)}
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: '14px' }}>{dict.pricingPage.starterUnit}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--brand)', fontWeight: 600, marginBottom: '24px' }}>
                  {dict.pricingPage.perOrderFee}
                </div>
                <hr style={{ borderColor: 'var(--line)', margin: '16px 0' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', fontSize: '14px' }}>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> 1 – 3 Dark Stores / Nodes
                  </li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> Swish App Core WMS & Inventory Sync
                  </li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> Standard Order Dispatch Engine
                  </li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> Email & Portal Support
                  </li>
                </ul>
              </div>
              <Link href={`/${lang}/signup`} className="btn btn-secondary" style={{ marginTop: '32px', width: '100%', justifyContent: 'center' }}>
                {dict.pricingPage.ctaStart}
              </Link>
            </div>

            {/* GROWTH CARD (POPULAR) */}
            <div
              className="feature reveal"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                borderColor: 'var(--brand)',
                boxShadow: '0 0 30px var(--glow)',
              }}
            >
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
                {dict.pricingPage.popularBadge}
              </div>
              <div>
                <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>{dict.pricingPage.growthName}</h3>
                <p style={{ minHeight: '48px', fontSize: '14px' }}>{dict.pricingPage.growthDesc}</p>
                <div style={{ margin: '24px 0 16px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--txt)', fontFamily: 'Sora' }}>
                    ${Math.round(1499 * discount)}
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: '14px' }}>{dict.pricingPage.growthUnit}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--brand)', fontWeight: 600, marginBottom: '24px' }}>
                  + $0.25 per order processed
                </div>
                <hr style={{ borderColor: 'var(--line)', margin: '16px 0' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', fontSize: '14px' }}>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> Up to 12 Dark Stores / Facilities
                  </li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> AI Agentic Exception Handling (Short-ships)
                  </li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> FEFO Cold-Chain & Expiry Tracking
                  </li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> Priority 24/7 Slack & Phone Support
                  </li>
                </ul>
              </div>
              <Link href={`/${lang}/signup`} className="btn btn-primary" style={{ marginTop: '32px', width: '100%', justifyContent: 'center' }}>
                {dict.pricingPage.ctaStart}
              </Link>
            </div>

            {/* ENTERPRISE CARD */}
            <div
              className="feature reveal"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
            >
              <div>
                <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>{dict.pricingPage.enterpriseName}</h3>
                <p style={{ minHeight: '48px', fontSize: '14px' }}>{dict.pricingPage.enterpriseDesc}</p>
                <div style={{ margin: '24px 0 16px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--txt)', fontFamily: 'Sora' }}>
                    {dict.pricingPage.enterprisePrice}
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: '14px' }}>{dict.pricingPage.enterpriseUnit}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--brand)', fontWeight: 600, marginBottom: '24px' }}>
                  Custom Volume Discounts & Value-Share
                </div>
                <hr style={{ borderColor: 'var(--line)', margin: '16px 0' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', fontSize: '14px' }}>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> Unlimited Dark Stores & Facilities
                  </li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> Custom LLM Agentic Workflows & ERP Sync
                  </li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> Dedicated Staffing & Workforce Solutions
                  </li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Check size={16} color="var(--brand)" /> Guaranteed 99.99% Uptime SLA
                  </li>
                </ul>
              </div>
              <Link href={`/${lang}/contact`} className="btn btn-secondary" style={{ marginTop: '32px', width: '100%', justifyContent: 'center' }}>
                {dict.pricingPage.ctaEnterprise}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC ESTIMATOR SLIDER SECTION */}
      <section style={{ background: 'var(--bg-soft)', marginTop: '48px', padding: '64px 0' }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">{lang === 'ar' ? 'حاسبة التكلفة المباشرة' : 'Volume Cost Estimator'}</span>
            <h2>{lang === 'ar' ? 'تقدير التكلفة الشهرية لمؤسستك' : 'Estimate Your Monthly Investment'}</h2>
            <p>{lang === 'ar' ? 'حرك المؤشر بناءً على عدد الطلبات الشهرية لمشاهدة التكلفة الإجمالية.' : 'Drag the slider to match your expected monthly order volume.'}</p>
          </div>

          <div
            className="feature reveal"
            style={{ maxWidth: '840px', margin: '0 auto', background: 'var(--panel)', padding: '40px' }}
          >
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--txt)', fontSize: '15px' }}>
                  {lang === 'ar' ? 'حجم الطلبات الشهري المتوقع:' : 'Monthly Order Volume:'}
                </span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand)', fontFamily: 'Sora' }}>
                  {orders.toLocaleString()} {lang === 'ar' ? 'طلب' : 'orders'}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={orders}
                onChange={(e) => setOrders(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  accentColor: 'var(--brand)',
                  cursor: 'pointer',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                <span>1,000 / mo</span>
                <span>50,000 / mo</span>
                <span>100,000+ / mo</span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                background: 'var(--panel-2)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid var(--line-strong)',
              }}
            >
              <div>
                <span style={{ fontSize: '13px', color: 'var(--muted)', display: 'block' }}>{lang === 'ar' ? 'الباقة الموصى بها' : 'Recommended Plan'}</span>
                <strong style={{ fontSize: '20px', color: 'var(--txt)' }}>{est.tier}</strong>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--muted)', display: 'block' }}>{lang === 'ar' ? 'الرسوم الشهرية الثابتة' : 'Monthly Base SaaS'}</span>
                <strong style={{ fontSize: '20px', color: 'var(--txt)' }}>${est.monthlyBase}</strong>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--muted)', display: 'block' }}>{lang === 'ar' ? 'رسوم التكنولوجيا لكل طلب' : 'Tech Fee / Order'}</span>
                <strong style={{ fontSize: '20px', color: 'var(--brand)' }}>${est.perOrderFee.toFixed(2)}</strong>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--muted)', display: 'block' }}>{lang === 'ar' ? 'إجمالي التقدير الشهري' : 'Total Monthly Estimate'}</span>
                <strong style={{ fontSize: '24px', color: 'var(--brand)', fontFamily: 'Sora' }}>${est.totalMonthly.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Link href={`/${lang}/contact`} className="btn btn-primary" style={{ gap: '8px' }}>
                {lang === 'ar' ? 'طلب عرض سعر مخصص' : 'Request Official Quote'}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
