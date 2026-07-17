'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function SignupPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${lang}/login`);
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="auth-box">
          <h2>{dict.signupPage.title}</h2>
          <p>{dict.signupPage.subtitle}</p>
          
          <form className="auth-form" onSubmit={handleSignup}>
            <div>
              <label>{dict.signupPage.nameLabel}</label>
              <input type="text" required placeholder={dict.signupPage.namePlaceholder} />
            </div>
            <div>
              <label>{dict.signupPage.emailLabel}</label>
              <input type="email" required placeholder={dict.signupPage.emailPlaceholder} />
            </div>
            <div>
              <label>{dict.signupPage.companyLabel}</label>
              <input type="text" required placeholder={dict.signupPage.companyPlaceholder} />
            </div>
            <div>
              <label>{dict.signupPage.passwordLabel}</label>
              <input type="password" required placeholder={dict.signupPage.passwordPlaceholder} />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>{dict.signupPage.createAccountButton}</button>
          </form>
          
          <Link href={`/${lang}/login`} className="auth-link">{dict.signupPage.hasAccount}</Link>
        </div>
      </div>
    </main>
  );
}
