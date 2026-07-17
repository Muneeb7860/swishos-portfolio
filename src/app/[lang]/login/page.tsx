'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="auth-box">
          <h2>Welcome Back</h2>
          <p>Sign in to your SwishOS console</p>
          
          <form className="auth-form" onSubmit={handleLogin}>
            <div>
              <label>Work Email</label>
              <input type="email" required placeholder="you@company.com" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" required placeholder="••••••••" />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Sign In</button>
          </form>
          
          <Link href="/signup" className="auth-link">Don't have an account? Sign up</Link>
        </div>
      </div>
    </main>
  );
}
