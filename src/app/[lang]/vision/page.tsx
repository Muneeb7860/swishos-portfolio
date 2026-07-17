'use client';
import React, { useEffect } from 'react';

export default function VisionPage() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { 
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } 
      });
    }, { threshold: 0.12 });
    
    document.querySelectorAll('.reveal').forEach((el: any, i) => {
      el.style.transitionDelay = (i % 6 * 60) + 'ms';
      io.observe(el);
    });
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <span className="pill reveal"><span className="dot"></span>Our Trajectory</span>
          <h1 className="reveal">The Future of<br /><span className="grad">Commerce.</span></h1>
          <p className="sub reveal">We believe that within five years, manual supply chain management will be obsolete. SwishOS is building the autonomous backbone of global trade.</p>
        </div>
      </section>

      <section>
        <div className="wrap" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="feature reveal" style={{ padding: '60px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Autonomous Supply Chains</h2>
            <p style={{ fontSize: '18px', color: 'var(--muted)', marginBottom: '24px' }}>
              The modern supply chain is a web of isolated systems, spreadsheets, and reactive decisions. We envisioned a different reality: a unified operating system where AI agents manage the micro-decisions of procurement, routing, and reconciliation.
            </p>
            <p style={{ fontSize: '18px', color: 'var(--muted)' }}>
              By embedding Large Language Models directly into the fulfillment ledger, SwishOS transforms static software into an active participant. It negotiates, it reroutes, and it learns. This is not just a tool; it is the new standard for B2B distribution.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
