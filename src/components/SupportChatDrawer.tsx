'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareIcon } from './Icons';
import { usePathname } from 'next/navigation';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTag?: string;
  actionUrl?: string;
  actionLabel?: string;
}

function generateMsgId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export function SupportChatDrawer({ lang = 'en' }: { lang?: string }) {
  const pathname = usePathname();
  const isExcludedRoute = pathname?.includes('/advisory') || pathname?.includes('/developers');

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
    if (isExcludedRoute) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isExcludedRoute]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: generateMsgId('user'),
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
        body: JSON.stringify({ message: query, lang }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: generateMsgId('assistant'),
        sender: 'assistant',
        text: data.reply || (lang === 'ar' ? 'تم استلام استفسارك. سنقوم بالرد عليك قريباً.' : 'Thank you. Our security team has received your query.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag: data.actionTag,
        actionUrl: data.actionUrl,
        actionLabel: data.actionLabel,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: generateMsgId('assistant'),
        sender: 'assistant',
        text: lang === 'ar'
          ? 'عذراً، حدث خطأ أثناء الاتصال. يرجى المحاولة مرة أخرى أو مراسلتنا عبر البريد الإلكتروني hello@swishos.io'
          : 'Communication fallback error. Please try again or email hello@swishos.io directly.',
        timestamp: 'Now',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Pure React return null on excluded routes after all hooks have been invoked
  if (isExcludedRoute) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: isRtl ? 'auto' : '24px', left: isRtl ? '24px' : 'auto', zIndex: 9999 }}>
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label={isRtl ? 'فتح المحادثة المباشرة' : 'Toggle Live Support Chat'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, boxShadow 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <MessageSquareIcon size={24} color="#FFFFFF" />
        </button>
      )}

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          style={{
            width: '380px',
            maxHeight: '560px',
            height: '80vh',
            background: 'var(--panel)',
            border: '1px solid var(--line-strong)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'var(--bg-soft)',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--txt)' }}>
                {isRtl ? 'الدعم المباشر - SwishOS' : 'SwishOS Security AI'}
              </div>
              <div style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                {isRtl ? 'متصل الآن' : 'Active Security Agent'}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label={isRtl ? 'إغلاق المحادثة' : 'Close Support Chat'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    background: msg.sender === 'user' ? '#2563EB' : 'var(--bg-soft)',
                    color: msg.sender === 'user' ? '#FFFFFF' : 'var(--txt)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--line)',
                  }}
                >
                  {msg.text}
                  {msg.actionUrl && (
                    <div style={{ marginTop: '8px' }}>
                      <a
                        href={msg.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          background: 'rgba(56, 189, 248, 0.15)',
                          color: '#38BDF8',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        {msg.actionLabel || 'View Resource'} →
                      </a>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', background: 'var(--panel)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={isRtl ? 'اكتب رسالتك هنا...' : 'Ask about agent security or audit scopes...'}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--line-strong)',
                  background: 'var(--bg)',
                  color: 'var(--txt)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? '...' : (isRtl ? 'إرسال' : 'Send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
