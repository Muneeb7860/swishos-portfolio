'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function LoginPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${lang}`);
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="auth-box">
          <h2>{dict.loginPage.title}</h2>
          <p>{dict.loginPage.subtitle}</p>
          
          <form className="auth-form" onSubmit={handleLogin}>
            <div>
              <label>{dict.loginPage.emailLabel}</label>
              <input type="email" required placeholder={dict.loginPage.emailPlaceholder} />
            </div>
            <div>
              <label>{dict.loginPage.passwordLabel}</label>
              <input type="password" required placeholder={dict.loginPage.passwordPlaceholder} />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>{dict.loginPage.signInButton}</button>
          </form>
          
          <Link href={`/${lang}/signup`} className="auth-link">{dict.loginPage.noAccount}</Link>
        </div>
      </div>
    </main>
  );
}
