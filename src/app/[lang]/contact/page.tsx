'use client';
import React, { useEffect, useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <section className="hero" style={{ paddingBottom: '20px' }}>
        <div className="wrap">
          <span className="pill reveal"><span className="dot"></span>Connect With Us</span>
          <h1 className="reveal">Reach out to <br /><span className="grad">SwishOS.</span></h1>
        </div>
      </section>

      <section style={{ paddingTop: '20px' }}>
        <div className="wrap">
          <div className="auth-box reveal" style={{ marginTop: '0', maxWidth: '600px' }}>
            {submitted ? (
              <div style={{ padding: '40px 0', color: 'var(--accent)' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Message Received</h3>
                <p>Thank you for reaching out. A SwishOS representative will contact you shortly.</p>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label>First Name</label>
                    <input type="text" required placeholder="Jane" />
                  </div>
                  <div>
                    <label>Last Name</label>
                    <input type="text" required placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label>Work Email</label>
                  <input type="email" required placeholder="jane@company.com" />
                </div>
                <div>
                  <label>Company</label>
                  <input type="text" placeholder="Acme Corp" />
                </div>
                <div>
                  <label>Message</label>
                  <textarea rows={4} required placeholder="How can we help you scale?"></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
