'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="auth-box">
          <h2>Join SwishOS</h2>
          <p>Get started with the unified AI-native B2B platform</p>
          
          <form className="auth-form" onSubmit={handleSignup}>
            <div>
              <label>Full Name</label>
              <input type="text" required placeholder="Jane Doe" />
            </div>
            <div>
              <label>Work Email</label>
              <input type="email" required placeholder="jane@company.com" />
            </div>
            <div>
              <label>Company Name</label>
              <input type="text" required placeholder="Acme Logistics" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" required placeholder="••••••••" />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Create Account</button>
          </form>
          
          <Link href="/login" className="auth-link">Already have an account? Sign in</Link>
        </div>
      </div>
    </main>
  );
}
