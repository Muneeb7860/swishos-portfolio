'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function LoginPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;

  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="auth-box">
          <h2>{dict.loginPage.title}</h2>
          <p>{dict.loginPage.subtitle}</p>

          {submitted ? (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <div style={{ fontSize: '42px', marginBottom: '16px' }}>🔒</div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--txt)' }}>
                {lang === 'ar' ? 'البوابة المغلقة (Private Beta)' : 'Client Portal (Private Beta)'}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
                {lang === 'ar'
                  ? 'تم استلام طلب الدخول لـ ' + email + '. يتم مراجعة الحسابات والتأكد من بيانات المؤسسة قبل تفعيل الوصول للبوابة.'
                  : 'Access request logged for ' + email + '. Enterprise client accounts are onboarded manually during Private Beta.'}
              </p>
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link href={`/${lang}/contact`} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                  {lang === 'ar' ? 'تواصل مع فريق الدعم' : 'Request Accelerated Onboarding'}
                </Link>
              </div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleLogin}>
              <div>
                <label>{dict.loginPage.emailLabel}</label>
                <input
                  type="email"
                  required
                  placeholder={dict.loginPage.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label>{dict.loginPage.passwordLabel}</label>
                <input
                  type="password"
                  required
                  placeholder={dict.loginPage.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ marginTop: '12px', width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (lang === 'ar' ? 'جاري التحقق...' : 'Authenticating...') : dict.loginPage.signInButton}
              </button>
            </form>
          )}

          {!submitted && (
            <Link href={`/${lang}/signup`} className="auth-link">
              {dict.loginPage.noAccount}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
