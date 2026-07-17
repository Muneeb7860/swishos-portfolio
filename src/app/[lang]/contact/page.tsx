'use client';
import React, { useState } from 'react';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function ContactPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;
  const [submitted, setSubmitted] = useState(false);

  useScrollReveal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <section className="hero" style={{ paddingBottom: '20px' }}>
        <div className="wrap">
          <span className="pill reveal"><span className="dot"></span>{dict.contactPage.heroBadge}</span>
          <h1 className="reveal">{dict.contactPage.heroTitle1} <br /><span className="grad">{dict.contactPage.heroTitle2}</span></h1>
        </div>
      </section>

      <section style={{ paddingTop: '20px' }}>
        <div className="wrap">
          <div className="auth-box reveal" style={{ marginTop: '0', maxWidth: '600px' }}>
            {submitted ? (
              <div style={{ padding: '40px 0', color: 'var(--accent)' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>{dict.contactPage.successTitle}</h3>
                <p>{dict.contactPage.successMessage}</p>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label>{dict.contactPage.firstName}</label>
                    <input type="text" required placeholder={dict.contactPage.placeholderJane} />
                  </div>
                  <div>
                    <label>{dict.contactPage.lastName}</label>
                    <input type="text" required placeholder={dict.contactPage.placeholderDoe} />
                  </div>
                </div>
                <div>
                  <label>{dict.contactPage.workEmail}</label>
                  <input type="email" required placeholder={dict.contactPage.placeholderEmail} />
                </div>
                <div>
                  <label>{dict.contactPage.company}</label>
                  <input type="text" placeholder={dict.contactPage.placeholderCompany} />
                </div>
                <div>
                  <label>{dict.contactPage.message}</label>
                  <textarea rows={4} required placeholder={dict.contactPage.placeholderMessage}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>{dict.contactPage.sendButton}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
