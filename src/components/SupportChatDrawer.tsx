'use client';
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTag?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export function SupportChatDrawer({ lang = 'en' }: { lang?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isRtl = lang === 'ar';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: lang === 'ar'
        ? 'مرحباً بك! أنا مساعد أمن الذكاء الاصطناعي من SwishOS. كيف يمكنني مساعدتك في اختبار الاختراق وحواجز الحماية اليوم؟'
        : 'Welcome! I am your SwishOS AI Security Assistant. How can I help you with agent red-teaming, guardrail rules, or SLA triage today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Live Chat Visitor',
          email: 'live-chat@swishos.io',
          channel: 'web',
          category: /audit|book|pricing/i.test(query) ? 'general' : /vulnerability|jailbreak|threat|exploit/i.test(query) ? 'security_incident' : 'bug',
          subject: 'Live Chat Support Query',
          message: query,
          lang,
        }),
      });

      const data = await res.json();
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.automatedReply || (lang === 'ar' ? 'تم استلام طلبك وتصنيفه بنجاح.' : 'Your request has been triaged and dispatched.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag: data.ticketId ? `Ticket: ${data.ticketId} (${data.sla})` : undefined,
        actionUrl: data.actionUrl,
        actionLabel: data.actionLabel,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Support chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickPills = lang === 'ar'
    ? [
        { label: '🛡️ احجز تدقيقاً أمنياً', query: 'أود حجز تدقيق أمني لوكلاء الذكاء الاصطناعي.' },
        { label: '⚡ الإبلاغ عن ثغرة حماية', query: 'أود الإبلاغ عن ثغرة أمنية أو تجاوز لحاجز الحماية.' },
        { label: '🔍 الاستعلام عن اتفاقية SLA', query: 'ما هي اتفاقيات مستوى الخدمة (SLA) للاستجابة؟' },
      ]
    : [
        { label: '🛡️ Book Security Audit', query: 'I want to book an AI Agent Security Audit.' },
        { label: '⚡ Report Guardrail Bypass', query: 'I want to report a guardrail vulnerability or threat.' },
        { label: '🔍 Check Response SLA', query: 'What are the response SLA parameters for security tickets?' },
      ];

  const posStyle: React.CSSProperties = isRtl
    ? { left: '24px', right: 'auto' }
    : { right: '24px', left: 'auto' };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Toggle Live Support Chat"
        style={{
          position: 'fixed',
          bottom: '24px',
          ...posStyle,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          borderRadius: '999px',
          background: 'var(--brand, #E10600)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '13px',
          border: '1px solid var(--brand-2, #FF332A)',
          boxShadow: '0 8px 30px rgba(225, 6, 0, 0.4), 0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
      >
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#4ade80',
          boxShadow: '0 0 8px #4ade80',
          display: 'inline-block'
        }} />
        <span style={{ whiteSpace: 'nowrap' }}>
          {isOpen
            ? (lang === 'ar' ? 'إغلاق المحادثة' : 'Close Chat')
            : (lang === 'ar' ? '💬 مساعد SwishOS الأمني • متصل' : '💬 Live AI Assistant • Online')}
        </span>
      </button>

      {/* Slide-Out Chat Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '84px',
            ...posStyle,
            zIndex: 9999,
            width: 'min(380px, calc(100vw - 32px))',
            height: '520px',
            maxHeight: 'calc(85vh - 84px)',
            background: 'var(--panel, #1a1a1a)',
            border: '1px solid var(--line-strong, rgba(255,255,255,0.18))',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px var(--glow, rgba(225,6,0,0.25))',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            direction: isRtl ? 'rtl' : 'ltr',
          }}
        >
          {/* Drawer Header */}
          <div style={{
            padding: '14px 16px',
            background: 'var(--bg-soft, #141414)',
            borderBottom: '1px solid var(--line, rgba(255,255,255,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(225, 6, 0, 0.15)',
                border: '1px solid var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}>
                🛡️
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--txt, #fff)', margin: 0, lineHeight: 1.2 }}>
                  {lang === 'ar' ? 'مساعد SwishOS الأمني' : 'SwishOS Security AI'}
                </h4>
                <div style={{ fontSize: '11px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  {lang === 'ar' ? 'متصل الآن · استجابة فوريّة' : 'Online · Instant Triage'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted, #a3a3a3)',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user'
                      ? (isRtl ? '16px 16px 16px 2px' : '16px 16px 2px 16px')
                      : (isRtl ? '16px 16px 2px 16px' : '16px 16px 16px 2px'),
                    fontSize: '13px',
                    lineHeight: '1.5',
                    background: msg.sender === 'user'
                      ? 'var(--brand, #E10600)'
                      : 'var(--bg-soft, #242424)',
                    color: msg.sender === 'user' ? '#ffffff' : 'var(--txt, #ffffff)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--line)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {msg.text}
                  
                  {msg.actionUrl && (
                    <div style={{ marginTop: '10px' }}>
                      <a
                        href={msg.actionUrl}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: 'var(--brand, #E10600)',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px var(--glow, rgba(225,6,0,0.4))',
                        }}
                      >
                        {msg.actionLabel || (lang === 'ar' ? 'الانتقال للحجز المباشر' : 'Book Audit Now')}
                      </a>
                    </div>
                  )}

                  {msg.actionTag && (
                    <div style={{
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid rgba(255,255,255,0.15)',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      color: '#4ade80',
                      fontWeight: 700,
                    }}>
                      {msg.actionTag}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--muted-2, #888888)', marginTop: '4px', padding: '0 4px' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--brand)',
                background: 'var(--bg-soft)',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                width: 'fit-content',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand)' }} />
                <span>{lang === 'ar' ? 'جاري التحليل والتصنيف...' : 'Triaging security request...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Pills */}
          <div style={{
            padding: '10px 12px',
            background: 'var(--bg-soft, #141414)',
            borderTop: '1px solid var(--line, rgba(255,255,255,0.1))',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}>
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(pill.query)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'var(--panel, #1A1A1A)',
                  border: '1px solid var(--line)',
                  fontSize: '11px',
                  color: 'var(--txt, #ffffff)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.25s ease',
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '12px',
              background: 'var(--bg-soft, #141414)',
              borderTop: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type your security query...'}
              style={{
                flex: 1,
                background: 'var(--panel, #1a1a1a)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '13px',
                color: 'var(--txt, #ffffff)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: 'var(--brand, #E10600)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1,
                transition: 'all 0.25s ease',
              }}
            >
              {lang === 'ar' ? 'إرسال' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
