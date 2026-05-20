import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MessageSquare, Users, Hash, Send, Smile, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

const Community = () => {
  const [messages, setMessages] = useState([]); // Empty for fresh start
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: messages.length + 1, user: 'You', text: input, time: 'Just now' }]);
    setInput('');
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="app-container"
        style={{ height: 'calc(100vh - 150px)' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1.5rem', height: '100%' }}>
          
          {/* Channels Sidebar */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} /> Communities
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['general', 'calculus-help', 'exam-prep', 'career-talk', 'study-groups'].map(c => (
                <div key={c} style={{ 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  background: c === 'general' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  color: c === 'general' ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem'
                }}>
                  <Hash size={14} /> {c}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>#general</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>The main hub for all ARVO students.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Users size={18} color="var(--text-muted)" />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>1,248 Online</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '1rem', opacity: 0.7 }}>
                  <div style={{ padding: '1.5rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '50%' }}>
                    <MessageSquare size={48} color="var(--primary)" />
                  </div>
                  <div>
                    <h3>Welcome to the ARVO Community!</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '300px', marginTop: '0.5rem' }}>
                      This is the beginning of something great. Say hello to your fellow students or start a study group!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', opacity: 0.2 }}></div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{m.user}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.time}</span>
                      </div>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>{m.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '12px', alignItems: 'center' }}>
                <Paperclip size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Message #general"
                  style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '0.5rem', fontSize: '1rem' }}
                />
                <Smile size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                <button 
                  onClick={handleSend}
                  style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', padding: '0.6rem', color: '#000', cursor: 'pointer' }}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Community;
