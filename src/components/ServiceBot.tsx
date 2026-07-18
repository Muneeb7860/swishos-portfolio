'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export function ServiceBot({ dict }: { dict: Record<string, string> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: dict.botGreeting }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm having trouble connecting right now. Please try the Contact page to reach our team!";
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "I'm offline at the moment. Please reach out via the Contact page — our team responds within 24 hours!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bot-window"
          >
            <div className="bot-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="bot-avatar">
                  <MessageSquare size={16} color="#fff" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px' }}>SwishOS Agent</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: 6, height: 6, background: '#26e6c3', borderRadius: '50%', display: 'inline-block' }} />
                    {dict.botStatus}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="bot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`bot-bubble ${msg.role === 'user' ? 'user-bubble' : ''}`}>
                  {msg.text}
                </div>
              ))}
              {isLoading && (
                <div className="bot-bubble" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)' }}>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '13px' }}>Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="bot-input-area" onSubmit={handleSend}>
              <input
                type="text"
                placeholder={dict.botPlaceholder}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
              />
              <button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="service-bot"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={24} color="#fff" /></motion.span>
            : <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageSquare size={24} color="#fff" /></motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </>
  );
}
