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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', message: '' });

  useScrollReveal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send. Please email us directly at hello@swishos.io';
      setError(message);
    } finally {
      setLoading(false);
    }
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
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--txt)' }}>{dict.contactPage.successTitle}</h3>
                <p style={{ color: 'var(--muted)' }}>{dict.contactPage.successMessage}</p>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label>{dict.contactPage.firstName}</label>
                    <input
                      type="text" name="firstName" required
                      placeholder={dict.contactPage.placeholderJane}
                      value={form.firstName} onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>{dict.contactPage.lastName}</label>
                    <input
                      type="text" name="lastName" required
                      placeholder={dict.contactPage.placeholderDoe}
                      value={form.lastName} onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label>{dict.contactPage.workEmail}</label>
                  <input
                    type="email" name="email" required
                    placeholder={dict.contactPage.placeholderEmail}
                    value={form.email} onChange={handleChange}
                  />
                </div>
                <div>
                  <label>{dict.contactPage.company}</label>
                  <input
                    type="text" name="company"
                    placeholder={dict.contactPage.placeholderCompany}
                    value={form.company} onChange={handleChange}
                  />
                </div>
                <div>
                  <label>{dict.contactPage.message}</label>
                  <textarea
                    rows={4} name="message" required
                    placeholder={dict.contactPage.placeholderMessage}
                    value={form.message} onChange={handleChange}
                  />
                </div>

                {error && (
                  <p style={{ color: '#E10600', fontSize: '14px', marginTop: '4px' }}>{error}</p>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ marginTop: '8px', width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Sending...' : dict.contactPage.sendButton}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
