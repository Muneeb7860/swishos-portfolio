'use client';
import React, { useEffect } from 'react';

export default function FeaturesPage() {
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
          <span className="pill reveal"><span className="dot"></span>Deep Dive</span>
          <h1 className="reveal">Features &<br /><span className="grad">Services.</span></h1>
          <p className="sub reveal">Explore the comprehensive capabilities of SwishOS, designed to modernize your B2B supply chain with AI-native intelligence.</p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="grid-layout">
            <div className="feature reveal">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
              <h3>Automated Replenishment</h3>
              <p>Retailers reorder in seconds. Our predictive AI flags stockouts and builds baskets proactively based on historical velocity.</p>
            </div>
            <div className="feature reveal">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🧭</div>
              <h3>Dynamic Routing</h3>
              <p>Optimize fulfillment across multiple warehouses. Routes and delivery windows are calculated in real time to minimize fuel and time.</p>
            </div>
            <div className="feature reveal">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🤖</div>
              <h3>Agentic Resolution</h3>
              <p>Autonomous agents chase exceptions, resolve short-ships, and communicate with suppliers without human intervention.</p>
            </div>
            <div className="feature reveal">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>📊</div>
              <h3>Real-Time Ledger</h3>
              <p>A single source of truth for inventory and invoicing, seamlessly integrated with your existing ERPs and accounting tools.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
