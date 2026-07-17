'use client';
import React, { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    // scroll reveal logic
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { 
        if (e.isIntersecting) { 
          e.target.classList.add('in'); 
          io.unobserve(e.target); 
        } 
      });
    }, { threshold: 0.12 });
    
    document.querySelectorAll('.reveal').forEach((el: any, i) => {
      el.style.transitionDelay = (i % 6 * 60) + 'ms';
      io.observe(el);
    });
  }, []);

  return (
    <>
      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <span className="pill reveal"><span className="dot"></span>B2B Partners & Clients</span>
            <h1 className="reveal">Service Catalog,<br /><span className="grad">built for scale.</span></h1>
            <p className="sub reveal">Swishos delivers a unified, AI-native platform for B2B supply chain and quick commerce — supported by the infrastructure, security, and talent needed to run it at scale.</p>
          </div>
        </section>

        {/* SWISH APP */}
        <section id="swishapp">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Flagship Product</span>
              <h2>Swish App</h2>
              <p>B2B Supply Chain & Quick Commerce Platform, now AI-native</p>
            </div>
            
            <div className="grid-layout">
              {/* Core Platform */}
              <div className="feature reveal">
                <h3>Core Platform</h3>
                <ul style={{ listStyle: 'none', marginTop: '16px', display: 'grid', gap: '16px' }}>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>Inventory & Distribution Management</strong>
                    <p style={{ marginTop: '4px' }}>Structured distribution, inventory control, and supply chain tracking.</p>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>Warehouse Support</strong>
                    <p style={{ marginTop: '4px' }}>Storage optimization and fulfillment management for physical supply chains.</p>
                  </li>
                </ul>
              </div>

              {/* AI-Native Layer */}
              <div className="feature reveal">
                <h3>AI-Native Layer</h3>
                <ul style={{ listStyle: 'none', marginTop: '16px', display: 'grid', gap: '16px' }}>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>Agentic Systems Integration</strong>
                    <p style={{ marginTop: '4px' }}>Autonomous agents that plan and execute multi-step workflows within the platform.</p>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>AI Guardrails & Evaluation</strong>
                    <p style={{ marginTop: '4px' }}>Safety layers, alignment protocols, and continuous evaluation to keep AI outputs accurate, secure, and compliant.</p>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>Custom AI Integration</strong>
                    <p style={{ marginTop: '4px' }}>LLMs embedded across the platform to automate workflows and support decision-making.</p>
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
              <span className="eyebrow">Ecosystem</span>
              <h2>Platform Infrastructure</h2>
              <p>Supporting services that power and secure Swish App</p>
            </div>
            <div className="grid-layout">
              <div className="feature reveal">
                <h3>Architecture & Security</h3>
                <ul style={{ listStyle: 'none', marginTop: '16px', display: 'grid', gap: '16px' }}>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>Cloud Architecture & Services</strong>
                    <p style={{ marginTop: '4px' }}>Migration, hybrid/multi-cloud management.</p>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>Threat Protection & Monitoring</strong>
                    <p style={{ marginTop: '4px' }}>Proactive monitoring, vulnerability assessments, and incident response.</p>
                  </li>
                </ul>
              </div>
              <div className="feature reveal">
                <h3>Operations</h3>
                <ul style={{ listStyle: 'none', marginTop: '16px', display: 'grid', gap: '16px' }}>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>Compliance & Governance</strong>
                    <p style={{ marginTop: '4px' }}>Infrastructure aligned to industry security standards and data privacy regulations.</p>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--txt)' }}>Billing & Invoicing Automation</strong>
                    <p style={{ marginTop: '4px' }}>Secure, automated invoicing and subscription billing.</p>
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
              <span className="eyebrow">Growth</span>
              <h2>Brand & Workforce Solutions</h2>
              <p>Delivered alongside Swish App to support client growth</p>
            </div>
            <div className="grid-layout">
              <div className="feature reveal">
                <h3>Corporate Branding</h3>
                <p style={{ marginTop: '16px' }}>Identity design, market positioning, and messaging strategy.</p>
              </div>
              <div className="feature reveal">
                <h3>Strategic Staffing</h3>
                <p style={{ marginTop: '16px' }}>Specialized technical and operational talent for scaling.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
