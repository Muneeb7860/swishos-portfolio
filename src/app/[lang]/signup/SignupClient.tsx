'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function SignupClient({ lang }: { lang: string }) {
  const dict = dictionaries[lang] || en;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '' });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Send contact submission in background to capture lead details
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.name,
          lastName: '(Sign Up Request)',
          email: form.email,
          company: form.company,
          message: `Portal Registration Request for company: ${form.company}`,
        }),
      });
    } catch (err) {
      console.error('Sign up logging error:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="auth-box">
          <h2>{dict.signupPage.title}</h2>
          <p>{dict.signupPage.subtitle}</p>

          {submitted ? (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <div style={{ fontSize: '42px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--txt)' }}>
                {lang === 'ar' ? 'تم تقديم طلب الحساب بنجاح' : 'Registration Request Received'}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
                {lang === 'ar'
                  ? 'شكراً لك ' + form.name + '. تم تسجيل مؤسستك (' + form.company + ') في قائمة انتظار الانضمام لمنصة SwishOS.'
                  : 'Thank you, ' + form.name + '. ' + form.company + ' has been added to the SwishOS early access queue.'}
              </p>
              <div style={{ marginTop: '24px' }}>
                <Link href={`/${lang}/roi`} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                  {lang === 'ar' ? 'احسب عائد الاستثمار لمؤسستك' : 'Calculate Your ROI'}
                </Link>
              </div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSignup}>
              <div>
                <label>{dict.signupPage.nameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={dict.signupPage.namePlaceholder}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label>{dict.signupPage.emailLabel}</label>
                <input
                  type="email"
                  required
                  placeholder={dict.signupPage.emailPlaceholder}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label>{dict.signupPage.companyLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={dict.signupPage.companyPlaceholder}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div>
                <label>{dict.signupPage.passwordLabel}</label>
                <input
                  type="password"
                  required
                  placeholder={dict.signupPage.passwordPlaceholder}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ marginTop: '12px', width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (lang === 'ar' ? 'جاري التسجيل...' : 'Submitting Request...') : dict.signupPage.createAccountButton}
              </button>
            </form>
          )}

          {!submitted && (
            <Link href={`/${lang}/login`} className="auth-link">
              {dict.signupPage.hasAccount}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
