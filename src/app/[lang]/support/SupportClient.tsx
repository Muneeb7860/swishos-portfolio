'use client';
import React, { useState } from 'react';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function SupportClient({ lang }: { lang: string }) {
  const dict = dictionaries[lang] || en;
  const t = dict.supportPage || en.supportPage;

  const [activeChannel, setActiveChannel] = useState<'web' | 'api' | 'audit_desk' | 'slack' | 'email'>('web');
  const [category, setCategory] = useState<'bug' | 'feature_request' | 'security_incident' | 'general'>('general');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [ticketResult, setTicketResult] = useState<{
    ticketId: string; priority: string; sla: string; automatedReply: string;
  } | null>(null);

  const [blockedResult, setBlockedResult] = useState<{
    status: string; error: string; response: string; reason?: string;
  } | null>(null);

  const [lookupId, setLookupId] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<{
    ticketId: string; status: string; priority: string; sla: string; automatedReply: string;
  } | null>(null);

  useScrollReveal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTicketResult(null);
    setBlockedResult(null);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, channel: activeChannel, category }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketResult({ ticketId: data.ticketId, priority: data.priority, sla: data.sla, automatedReply: data.automatedReply });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setBlockedResult({
          status: data.status || 'blocked',
          error: data.error || 'Security Enforcement Block: Threat pattern detected.',
          response: data.response || 'Request blocked due to security guardrail violation.',
          reason: data.risk?.reason || data.schema_validation?.reason,
        });
      }
    } catch {
      setBlockedResult({ status: 'error', error: 'Network error.', response: 'Unable to reach SwishOS security gateway.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setLookupLoading(true);
    try {
      const res = await fetch(`/api/support?ticketId=${encodeURIComponent(lookupId.trim())}`);
      const data = await res.json();
      if (data.success && data.ticket) setLookupResult(data.ticket);
    } catch { /* ignore */ } finally {
      setLookupLoading(false);
    }
  };

  const webhookSnippet = `curl -X POST https://swishos.io/api/support \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "${activeChannel}",
    "category": "${category}",
    "name": "${form.name.replace(/"/g, '\\"') || 'Security Lead'}",
    "email": "${form.email.replace(/"/g, '\\"') || 'sec-ops@company.com'}",
    "subject": "${form.subject.replace(/"/g, '\\"') || 'Guardrail evaluation log trace'}",
    "message": "${form.message.replace(/"/g, '\\"').replace(/\n/g, ' ') || 'Adversarial bypass trace detected on endpoint.'}"
  }'`;

  const channelIcons: Record<string, string> = { web: '🌐', api: '⚡', audit_desk: '🛡️', slack: '💬', email: '📧' };
  const categoryIcons: Record<string, string> = { bug: '🐛', feature_request: '✨', security_incident: '🚨', general: '💬' };

  return (
    <main className="support-page">
      <div className="wrap">

        {/* Hero */}
        <div className="support-hero reveal" style={{ marginBottom: '40px' }}>
          <span className="pill"><span className="dot" />{t.badge}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {/* Enterprise Social Proof & SLA Banner */}
        <div className="trust-proof-banner reveal" style={{
          marginBottom: '40px',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid var(--line-strong)',
          background: 'var(--panel)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise Incident & Support Operations</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Shipped zero-trust guardrails & threat monitoring for 5.6M+ active AI agent user sessions</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', background: 'var(--panel-2)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--line-strong)', color: '#10b981', fontWeight: 700 }}>
              🟢 P1 Emergency Response: &lt;15 Min SLA
            </span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="support-cols reveal">

          {/* Left: Form */}
          <div className="support-panel">
            <h3>{t.form.title}</h3>
            <p className="support-panel-sub">{t.form.subtitle}</p>

            <div className="sel-label">{t.form.categoryLabel}</div>
            <div className="category-grid" style={{ marginBottom: '24px' }}>
              {(['security_incident', 'bug', 'feature_request', 'general'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`sel-btn ${category === cat ? (cat === 'security_incident' ? 'active-red' : 'active-blue') : ''}`}
                >
                  <span>{categoryIcons[cat]}</span>
                  <span>{t.categories[cat]}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label>{t.form.nameLabel}</label>
                  <input type="text" required name="name" value={form.name} onChange={handleInputChange} placeholder={t.form.namePlaceholder} />
                </div>
                <div className="field">
                  <label>{t.form.emailLabel}</label>
                  <input type="email" required name="email" value={form.email} onChange={handleInputChange} placeholder={t.form.emailPlaceholder} />
                </div>
              </div>
              <div className="field">
                <label>{t.form.subjectLabel}</label>
                <input type="text" required name="subject" value={form.subject} onChange={handleInputChange} placeholder={t.form.subjectPlaceholder} />
              </div>
              <div className="field">
                <label>{t.form.messageLabel}</label>
                <textarea required name="message" value={form.message} onChange={handleInputChange} placeholder={t.form.messagePlaceholder} />
              </div>
              <button type="submit" disabled={loading} className="submit-btn">
                <span>🛡️</span>
                <span>{loading ? t.form.submitting : t.form.submitButton}</span>
              </button>
            </form>

            {ticketResult && (
              <div className="result-success">
                <div className="result-header">
                  <span className="result-label" style={{ color: '#10b981' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    {t.form.successTitle}
                  </span>
                  <span className="result-ticket-id">{ticketResult.ticketId}</span>
                </div>
                <div className="result-mini-grid">
                  <div className="result-mini-card">
                    <div className="result-mini-label">Priority SLA</div>
                    <div className="result-mini-val">{ticketResult.priority}</div>
                  </div>
                  <div className="result-mini-card">
                    <div className="result-mini-label">Assigned Target</div>
                    <div className="result-mini-val" style={{ color: '#10b981' }}>{ticketResult.sla}</div>
                  </div>
                </div>
                <div className="result-reply-box">
                  <strong style={{ color: '#10b981', display: 'block', marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Security SLA & Dispatch Confirmation</strong>
                  {ticketResult.automatedReply}
                </div>
              </div>
            )}

            {blockedResult && (
              <div className="result-blocked">
                <div className="result-header">
                  <span className="result-label" style={{ color: '#ef4444' }}>🛑 Security Enforcement Block</span>
                  <span className="result-ticket-blocked">{blockedResult.status.toUpperCase()}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 12 }}>{blockedResult.error}</p>
                <div className="result-reply-box">
                  <strong style={{ color: '#ef4444', display: 'block', marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Response Detail</strong>
                  {blockedResult.response}
                </div>
                {blockedResult.reason && <p className="result-reason">Reason: {blockedResult.reason}</p>}
              </div>
            )}
          </div>

          {/* Right column: SLA & Tracker */}
          <div>
            {/* Enterprise SLA Commitments Card */}
            <div style={{
              background: 'var(--panel)',
              border: '1px solid var(--line-strong)',
              borderRadius: 'var(--radius)',
              padding: '28px',
              marginBottom: '24px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--txt)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚡</span> Enterprise SLA Commitments
              </h3>

              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--panel-2)', padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#EF4444' }}>🚨 P1 Critical Security Breach</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '2px 8px', borderRadius: '4px' }}>&lt; 15 Min SLA</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>Immediate paging to SwishOS Security Incident Response Team.</p>
                </div>

                <div style={{ background: 'var(--panel-2)', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--line-strong)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--txt)' }}>⚡ P2 Technical / Guardrail Support</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, background: 'var(--line)', color: 'var(--txt)', padding: '2px 8px', borderRadius: '4px' }}>&lt; 4 Hours SLA</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>Guardrail policy tuning, AST rule assistance, and SDK integration.</p>
                </div>
              </div>
            </div>

            {/* Instant Ticket Tracker */}
            <div className="tracker-panel">
              <h3>🔎 {t.tracker.title}</h3>
              <p className="tracker-sub">{t.tracker.subtitle}</p>
              <form onSubmit={handleLookup}>
                <div className="lookup-row">
                  <input type="text" value={lookupId} onChange={e => setLookupId(e.target.value)} placeholder={t.tracker.inputPlaceholder} />
                  <button type="submit" disabled={lookupLoading} className="lookup-btn">{t.tracker.lookupBtn}</button>
                </div>
              </form>
              <button type="button" className="sample-btn" onClick={() => setLookupId('TK-2026-8812')}>
                ⚡ {t.tracker.sampleBtn}
              </button>
              {lookupResult && (
                <div className="lookup-result">
                  <div className="lookup-result-head">
                    <span className="lookup-ticket-id">{lookupResult.ticketId}</span>
                    <span className="lookup-status">{lookupResult.status}</span>
                  </div>
                  <div>
                    <div className="lookup-field-label">{t.tracker.priorityLabel}</div>
                    <div className="lookup-field-val">{lookupResult.priority} ({lookupResult.sla})</div>
                  </div>
                  <div>
                    <div className="lookup-field-label">{t.tracker.aiReplyLabel}</div>
                    <div style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{lookupResult.automatedReply}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Contacts */}
            <div className="contacts-panel" style={{ marginTop: '24px' }}>
              <h4>Direct Incident & Escalation Channels</h4>
              <a href="mailto:security@swishos.dev" className="contact-item">
                <div className="contact-item-left">
                  <span className="contact-item-icon">📧</span>
                  <div>
                    <div className="contact-item-name">Security Escalation Email</div>
                    <div className="contact-item-sub">security@swishos.dev</div>
                  </div>
                </div>
                <span className="contact-arrow">→</span>
              </a>
              <a href={`/${lang}/contact?plan=audit`} className="contact-item">
                <div className="contact-item-left">
                  <span className="contact-item-icon">🛡️</span>
                  <div>
                    <div className="contact-item-name">Executive Audit Desk</div>
                    <div className="contact-item-sub">Book 1-Week CISO Audit</div>
                  </div>
                </div>
                <span className="contact-arrow">→</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
