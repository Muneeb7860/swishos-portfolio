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
    "channel": "api",
    "category": "security_incident",
    "name": "Security Lead",
    "email": "sec-ops@company.com",
    "subject": "Guardrail evaluation log trace",
    "message": "Adversarial bypass trace detected on endpoint."
  }'`;

  const channelIcons: Record<string, string> = { web: '🌐', api: '⚡', audit_desk: '🛡️', slack: '💬', email: '📧' };
  const categoryIcons: Record<string, string> = { bug: '🐛', feature_request: '✨', security_incident: '🚨', general: '💬' };

  return (
    <main className="support-page">
      <div className="wrap">

        {/* Hero */}
        <div className="support-hero reveal">
          <span className="pill"><span className="dot" />{t.badge}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {/* Telemetry Section */}
        <div className="support-sec-head reveal">
          <div>
            <h2>⚡ {t.insightsTitle}</h2>
            <p>{t.insightsSubtitle}</p>
          </div>
          <span className="live-badge"><span className="live-dot" />Live Stream</span>
        </div>

        <div className="metrics-grid reveal">
          <div className="metric-card">
            <div className="metric-label" style={{ color: '#10b981' }}>⚡ {t.slaLabel}</div>
            <div className="metric-value">{t.slaMetric}</div>
            <div className="metric-bar-bg">
              <div className="metric-bar-fill" style={{ width: '95%', background: 'linear-gradient(90deg, #10b981, #14b8a6)' }} />
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label" style={{ color: '#3b82f6' }}>🎯 {t.resolutionLabel}</div>
            <div className="metric-value">{t.resolutionMetric}</div>
            <div className="metric-bar-bg">
              <div className="metric-bar-fill" style={{ width: '98%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label" style={{ color: '#a855f7' }}>⭐ {t.satisfactionLabel}</div>
            <div className="metric-value">{t.satisfactionMetric}</div>
            <div className="metric-bar-bg">
              <div className="metric-bar-fill" style={{ width: '98%', background: 'linear-gradient(90deg, #a855f7, #6366f1)' }} />
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label" style={{ color: '#f59e0b' }}>📡 {t.activeChannelsLabel}</div>
            <div className="metric-value">{t.activeChannelsMetric}</div>
            <div className="metric-dots">
              {[0,1,2,3,4].map(i => <span key={i} className="metric-dot" />)}
            </div>
          </div>
        </div>

        {/* Open-Source Connectors */}
        <div className="support-sec-head reveal">
          <div>
            <h2>🔗 {t.openSourceStack.title}</h2>
            <p>{t.openSourceStack.subtitle}</p>
          </div>
          <a href="https://github.com/chatwoot/chatwoot" target="_blank" rel="noopener noreferrer" className="copy-btn">
            {t.openSourceStack.viewConnectorsBtn || 'View Open-Source Connectors →'}
          </a>
        </div>

        <div className="connectors-grid reveal">
          {[
            { name: 'Chatwoot', href: 'https://github.com/chatwoot/chatwoot', badge: t.openSourceStack.chatwootBadge, tag: t.openSourceStack.chatwootTag, desc: t.openSourceStack.chatwootDesc },
            { name: 'FreeScout', href: 'https://github.com/freescout-helpdesk/freescout', badge: t.openSourceStack.freescoutBadge, tag: t.openSourceStack.freescoutTag, desc: t.openSourceStack.freescoutDesc },
            { name: 'Zammad', href: 'https://github.com/zammad/zammad', badge: t.openSourceStack.zammadBadge, tag: t.openSourceStack.zammadTag, desc: t.openSourceStack.zammadDesc },
            { name: 'Papercups', href: 'https://github.com/papercups-io/papercups', badge: t.openSourceStack.papercupsBadge, tag: t.openSourceStack.papercupsTag, desc: t.openSourceStack.papercupsDesc },
          ].map(c => (
            <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer" className="connector-card">
              <div className="connector-card-top">
                <span className="connector-name">{c.name}</span>
                <span className="connector-badge">{c.badge}</span>
              </div>
              <p className="connector-desc">{c.desc}</p>
              <div className="connector-footer">
                <span>{c.tag || 'External Connector'}</span>
                <span>→</span>
              </div>
            </a>
          ))}
        </div>

        {/* Webhook Box */}
        <div className="webhook-box reveal">
          <div className="webhook-box-head">
            <div>
              <div className="webhook-title">💻 {t.openSourceStack.webhookTitle}</div>
              <p className="webhook-sub">{t.openSourceStack.webhookDesc}</p>
            </div>
            <button type="button" className="copy-btn" onClick={() => { navigator.clipboard.writeText(webhookSnippet); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
              {copied ? 'Copied!' : t.openSourceStack.copyBtn}
            </button>
          </div>
          <pre className="webhook-code">{webhookSnippet}</pre>
        </div>

        {/* Two-column layout */}
        <div className="support-cols reveal">

          {/* Left: Form */}
          <div className="support-panel">
            <h3>{t.form.title}</h3>
            <p className="support-panel-sub">{t.form.subtitle}</p>

            <div className="sel-label">{t.form.channelLabel}</div>
            <div className="channel-grid">
              {(['web', 'api', 'audit_desk', 'slack', 'email'] as const).map(ch => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setActiveChannel(ch)}
                  className={`sel-btn ${activeChannel === ch ? 'active-green' : ''}`}
                >
                  <span>{channelIcons[ch]}</span>
                  <span>{t.channels[ch]}</span>
                </button>
              ))}
            </div>

            <div className="sel-label">{t.form.categoryLabel}</div>
            <div className="category-grid">
              {(['bug', 'feature_request', 'security_incident', 'general'] as const).map(cat => (
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
                <span>✨</span>
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
                  <strong style={{ color: '#10b981', display: 'block', marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Triage Response</strong>
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

          {/* Right column */}
          <div>
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

            <div className="contacts-panel">
              <h4>{t.openSourceStack.contactsTitle || 'Direct Omni-Channel Contacts'}</h4>
              <a href="mailto:hello@swishos.io" className="contact-item">
                <div className="contact-item-left">
                  <span className="contact-item-icon">📧</span>
                  <div>
                    <div className="contact-item-name">Direct Email</div>
                    <div className="contact-item-sub">hello@swishos.io</div>
                  </div>
                </div>
                <span className="contact-arrow">→</span>
              </a>
              <a href="https://github.com/Muneeb7860/agentic-redteam" target="_blank" rel="noopener noreferrer" className="contact-item">
                <div className="contact-item-left">
                  <span className="contact-item-icon">🐙</span>
                  <div>
                    <div className="contact-item-name">SwishOS Open Source Harness</div>
                    <div className="contact-item-sub">Public GitHub</div>
                  </div>
                </div>
                <span className="contact-arrow">→</span>
              </a>
              <a href={`/${lang}/contact`} className="contact-item">
                <div className="contact-item-left">
                  <span className="contact-item-icon">🛡️</span>
                  <div>
                    <div className="contact-item-name">Security Audit Booking</div>
                    <div className="contact-item-sub">Schedule executive briefing</div>
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
