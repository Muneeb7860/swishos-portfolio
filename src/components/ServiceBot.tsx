'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';

export function ServiceBot({ dict }: { dict: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: dict.botGreeting || 'Hello! How can SwishOS help you scale today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: dict.botReply || "I'm a demo bot! In production, I'll connect to the SwishOS AI Agent network to resolve this." }]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bot-window"
          >
            <div className="bot-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="bot-avatar">
                  <MessageSquare size={16} color="#fff" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px' }}>SwishOS Agent</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{dict.botStatus || 'Online'}</p>
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
            </div>
            
            <form className="bot-input-area" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder={dict.botPlaceholder || "Type a message..."} 
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit">
                <Send size={18} />
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
        {isOpen ? <X size={24} color="#fff" /> : <MessageSquare size={24} color="#fff" />}
      </motion.button>
    </>
  );
}
