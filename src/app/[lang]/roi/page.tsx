'use client';
import React, { useState } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function ROIPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;
  
  const [orders, setOrders] = useState(5000);
  const [cost, setCost] = useState(15);
  
  useScrollReveal();

  // Basic ROI Logic (Assuming AI reduces cost by 25% and saves 5 mins per order)
  const currentAnnualCost = orders * cost * 12;
  const newAnnualCost = orders * (cost * 0.75) * 12;
  const annualSavings = currentAnnualCost - newAnnualCost;
  const hoursSaved = Math.round((orders * 5 * 12) / 60);
  const roiPercentage = 320; // Static for demo purposes

  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <span className="pill reveal"><span className="dot"></span>{dict.roiPage.heroBadge}</span>
          <h1 className="reveal">{dict.roiPage.heroTitle1} <br /><span className="grad">{dict.roiPage.heroTitle2}</span></h1>
          <p className="sub reveal">{dict.roiPage.heroSubtitle}</p>
        </div>
      </section>

      <section style={{ paddingBottom: '80px' }}>
        <div className="wrap">
          <div className="grid-layout reveal" style={{ alignItems: 'start' }}>
            
            {/* INPUTS */}
            <div className="feature" style={{ padding: '40px' }}>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ fontWeight: 600, fontSize: '15px' }}>{dict.roiPage.monthlyOrders}</label>
                  <span style={{ color: 'var(--brand)', fontWeight: 'bold' }}>{orders.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" max="100000" step="1000" 
                  value={orders} 
                  onChange={(e) => setOrders(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--brand)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ fontWeight: 600, fontSize: '15px' }}>{dict.roiPage.avgCost}</label>
                  <span style={{ color: 'var(--brand)', fontWeight: 'bold' }}>${cost}</span>
                </div>
                <input 
                  type="range" 
                  min="5" max="50" step="1" 
                  value={cost} 
                  onChange={(e) => setCost(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--brand)' }}
                />
              </div>
            </div>

            {/* OUTPUTS */}
            <div style={{ display: 'grid', gap: '20px' }}>
              <div className="feature" style={{ padding: '30px', background: 'linear-gradient(135deg, var(--brand), var(--brand-2))', color: '#fff', border: 'none' }}>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{dict.roiPage.projectedSavings}</p>
                <h2 style={{ fontSize: '48px', margin: '8px 0 0 0' }}>${annualSavings.toLocaleString()}</h2>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="feature" style={{ padding: '30px' }}>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px', fontWeight: 600 }}>{dict.roiPage.hoursSaved}</p>
                  <h3 style={{ fontSize: '32px', margin: '8px 0 0 0', color: 'var(--txt)' }}>{hoursSaved.toLocaleString()}</h3>
                </div>
                
                <div className="feature" style={{ padding: '30px' }}>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px', fontWeight: 600 }}>{dict.roiPage.roiPercentage}</p>
                  <h3 style={{ fontSize: '32px', margin: '8px 0 0 0', color: 'var(--txt)' }}>{roiPercentage}%</h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
