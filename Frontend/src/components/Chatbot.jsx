import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

/* ── Mozzie Robot SVG Character ── */
const MozzieCharacter = ({ isTalking, isThinking }) => {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const go = () => setTimeout(() => {
      setBlink(true);
      setTimeout(() => { setBlink(false); go(); }, 140);
    }, 2200 + Math.random() * 1800);
    const t = go(); return () => clearTimeout(t);
  }, []);

  return (
    <motion.svg width="76" height="80" viewBox="0 0 120 130"
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>

      {/* Glow */}
      <motion.ellipse cx="60" cy="125" rx="32" ry="5" fill="rgba(124,58,237,0.25)"
        animate={{ rx: [32,36,32] }} transition={{ duration:2.8,repeat:Infinity }} />

      {/* Body */}
      <ellipse cx="60" cy="98" rx="30" ry="26" fill="url(#bodyG)" />
      <ellipse cx="60" cy="94" rx="20" ry="14" fill="rgba(255,255,255,0.25)" />

      {/* Belly circle */}
      <circle cx="60" cy="104" r="10" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <motion.circle cx="60" cy="104" r="5" fill="rgba(196,181,253,0.6)"
        animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:1.5,repeat:Infinity }} />

      {/* Left arm */}
      <motion.g animate={{ rotate: isTalking ? [-5,5,-5] : [0,3,0] }}
        transition={{ duration:0.4, repeat:Infinity }} style={{ originX:'42px', originY:'90px' }}>
        <ellipse cx="34" cy="95" rx="9" ry="14" fill="url(#armG)" transform="rotate(-15 34 95)" />
        <ellipse cx="30" cy="107" rx="7" ry="7" fill="#e0d7f8" />
      </motion.g>

      {/* Right arm (waving) */}
      <motion.g animate={{ rotate: [0,-20,0] }} transition={{ duration:1.8,repeat:Infinity,ease:'easeInOut' }}
        style={{ originX:'86px', originY:'88px' }}>
        <ellipse cx="88" cy="93" rx="9" ry="14" fill="url(#armG)" transform="rotate(15 88 93)" />
        <ellipse cx="92" cy="105" rx="7" ry="7" fill="#e0d7f8" />
      </motion.g>

      {/* Neck */}
      <rect x="51" y="58" width="18" height="10" rx="4" fill="#8b5cf6" />

      {/* Head */}
      <rect x="22" y="12" width="76" height="54" rx="16" fill="url(#headG)" />
      {/* Screen visor */}
      <rect x="28" y="18" width="64" height="42" rx="10" fill="#1a0533" />
      {/* Screen glare */}
      <ellipse cx="47" cy="24" rx="12" ry="4" fill="rgba(255,255,255,0.07)" />

      {/* Eyes */}
      <motion.ellipse cx="46" cy="40" rx="12" ry={blink ? 1 : 12}
        fill="url(#eyeG)" style={{ originY:'40px' }}
        animate={{ scaleY: blink ? 0.08 : 1 }} />
      <motion.ellipse cx="74" cy="40" rx="12" ry={blink ? 1 : 12}
        fill="url(#eyeG)" style={{ originY:'40px' }}
        animate={{ scaleY: blink ? 0.08 : 1 }} />
      {/* Pupil shine */}
      {!blink && <>
        <circle cx="41" cy="35" r="3.5" fill="rgba(255,255,255,0.6)" />
        <circle cx="69" cy="35" r="3.5" fill="rgba(255,255,255,0.6)" />
      </>}

      {/* Ear pieces */}
      <rect x="10" y="28" width="14" height="22" rx="7" fill="#7c3aed" />
      <rect x="96" y="28" width="14" height="22" rx="7" fill="#7c3aed" />
      <rect x="13" y="34" width="8" height="10" rx="4" fill="#a78bfa" />
      <rect x="99" y="34" width="8" height="10" rx="4" fill="#a78bfa" />

      {/* Antenna */}
      <rect x="78" y="4" width="4" height="14" rx="2" fill="#7c3aed" />
      <motion.circle cx="80" cy="4" r="5" fill="#f59e0b"
        animate={{ scale:[1,1.3,1], opacity:[0.8,1,0.8] }}
        transition={{ duration:1.2,repeat:Infinity }} />
      {/* Propeller */}
      <motion.g animate={{ rotate:360 }} transition={{ duration:2,repeat:Infinity,ease:'linear' }}
        style={{ originX:'80px', originY:'4px' }}>
        <ellipse cx="80" cy="-3" rx="8" ry="3" fill="#a78bfa" opacity="0.8" />
        <ellipse cx="80" cy="11" rx="8" ry="3" fill="#a78bfa" opacity="0.8" />
      </motion.g>

      {/* Corner brackets on head */}
      {[[28,18],[82,18],[28,52],[82,52]].map(([x,y],i)=>(
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x={i%2===0?0:-6} y="0" width="6" height="1.5" fill="rgba(167,139,250,0.6)" />
          <rect x="0" y={i<2?0:-6} width="1.5" height="6" fill="rgba(167,139,250,0.6)" />
        </g>
      ))}

      {/* Mouth */}
      {isThinking
        ? <line x1="49" y1="57" x2="71" y2="57" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
        : isTalking
          ? <motion.ellipse cx="60" cy="57" rx="8" ry="4" fill="#7c3aed"
              animate={{ ry:[2,5,2] }} transition={{ duration:0.3,repeat:Infinity }} />
          : <path d="M 49 55 Q 60 62 71 55" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
      }

      {/* Thinking dots */}
      {isThinking && [0,1,2].map(i=>(
        <motion.circle key={i} cx={54+i*8} cy={6} r={2.5} fill="#a78bfa"
          animate={{ y:[0,-6,0], opacity:[0.3,1,0.3] }}
          transition={{ duration:0.6,repeat:Infinity,delay:i*0.18 }} />
      ))}

      <defs>
        <radialGradient id="headG" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
        <radialGradient id="bodyG" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </radialGradient>
        <radialGradient id="armG" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
        <radialGradient id="eyeG" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="70%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

/* ── Knowledge base ── */
const knowledge = [
  { keys:['hello','hi','hey','greet'], reply:"Hey there! 🤖 I'm Mozzie, your ARVO study bot! Ask me about exams, results, study tips, schedule, or anything else!" },
  { keys:['exam','test','quiz'], reply:"📝 Exams auto-submit when the timer ends. Stay in fullscreen throughout — leaving it flags your session! Need prep tips?" },
  { keys:['result','score','grade','mark'], reply:"🏆 Results appear instantly after submission! Check your **Dashboard** for scores and performance charts." },
  { keys:['time','timer','duration'], reply:"⏱️ Each exam has a fixed time limit shown at the top. Your progress auto-saves every 30 seconds!" },
  { keys:['tab','switch','cheat'], reply:"👀 Tab switches are monitored. Three violations can flag your session for admin review. Stay focused!" },
  { keys:['fullscreen','screen','window'], reply:"🖥️ Stay in fullscreen during exams (F11). Leaving it is flagged as a violation!" },
  { keys:['password','login','account','register'], reply:"🔐 Secured with JWT + bcrypt. Change your password in **Settings → Security**." },
  { keys:['schedule','upcoming','calendar','when'], reply:"📅 Check the **Schedule** page in the sidebar for all upcoming exams with dates and times!" },
  { keys:['leaderboard','rank','top'], reply:"🥇 The **Leaderboard** updates in real-time after each exam. Keep scoring high to climb the ranks!" },
  { keys:['study','tip','prepare','learn'], reply:"📚 Mozzie's tips:\n1. Review past exam questions\n2. Pomodoro: 25 min work, 5 min break\n3. Teach concepts aloud\n4. Check the Community!" },
  { keys:['stress','anxious','nervous','worried'], reply:"💙 Feeling nervous is normal! Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. You've got this! 🌟" },
  { keys:['theme','appearance','color'], reply:"🎨 Go to **Settings → Appearance** to pick from 8 themes: Dark Gold, Lavender, Cloud UI, Minecraft and more!" },
  { keys:['community','chat','discuss'], reply:"💬 The **Community** page lets you chat with other students and share resources!" },
  { keys:['dashboard','home','overview'], reply:"📊 Your **Dashboard** shows recent scores, performance charts, and upcoming exams at a glance!" },
];

const getReply = (input) => {
  const lower = input.toLowerCase();
  for (const e of knowledge) if (e.keys.some(k => lower.includes(k))) return e.reply;
  return "🤖 Hmm, I'm not sure about that! Try asking me about exams, results, schedules, or study tips — that's my specialty! 💜";
};

const CHIPS = ['📝 Exam tips','⏱️ Timer','🏆 Leaderboard','📚 Study tips','😰 Stressed'];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role:'bot', text:"Beep boop! 🤖 I'm Mozzie, your ARVO guide! Ask me about exams, results, schedules, or anything else. I'm here to help!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  const send = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages(p => [...p, { role:'user', text:msg }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const reply = getReply(msg);
      setIsTyping(false); setIsTalking(true);
      setMessages(p => [...p, { role:'bot', text:reply }]);
      setTimeout(() => setIsTalking(false), Math.min(reply.length * 38, 3200));
    }, 800 + Math.random() * 600);
  };

  return (
    <div style={{ position:'fixed', bottom:'2rem', right:'2rem', zIndex:1000, display:'flex', flexDirection:'column', alignItems:'flex-end' }}>

      <AnimatePresence>
        {isOpen && (
          <motion.div key="chat"
            initial={{ opacity:0, y:28, scale:0.92 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:28, scale:0.92 }}
            transition={{ type:'spring', stiffness:300, damping:28 }}
            style={{ width:'390px', height:'570px', marginBottom:'1rem', display:'flex', flexDirection:'column', borderRadius:'24px', overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(124,58,237,0.4)', background:'var(--bg-color)' }}>

            {/* Header */}
            <div style={{ background:'linear-gradient(135deg,#3b0764 0%,#6d28d9 55%,#8b5cf6 100%)', padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem', flexShrink:0 }}>
              <MozzieCharacter isTalking={isTalking} isThinking={isTyping} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:'900', fontSize:'1.1rem', color:'#fff', letterSpacing:'-0.3px' }}>Mozzie</div>
                <div style={{ fontSize:'0.7rem', color:'#ddd6fe' }}>Your ARVO Study Bot 🤖</div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.3rem', marginTop:'4px' }}>
                  <motion.div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#34d399' }}
                    animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }} transition={{ duration:1.4,repeat:Infinity }} />
                  <span style={{ fontSize:'0.68rem', color:'#a7f3d0' }}>Online · Ready to help</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'50%', width:'30px', height:'30px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.7rem' }}>
              {messages.map((m,i) => (
                <motion.div key={i} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }}
                  style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:'0.5rem' }}>
                  {m.role==='bot' && (
                    <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'linear-gradient(135deg,#6d28d9,#a78bfa)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem' }}>🤖</div>
                  )}
                  <div style={{ maxWidth:'78%', padding:'0.65rem 0.9rem',
                    borderRadius:m.role==='user'?'18px 18px 4px 18px':'4px 18px 18px 18px',
                    background:m.role==='user'?'linear-gradient(135deg,#6d28d9,#8b5cf6)':'var(--card-bg)',
                    color:m.role==='user'?'#fff':'var(--text-main)',
                    fontSize:'0.83rem', lineHeight:'1.5',
                    boxShadow:m.role==='user'?'0 4px 14px rgba(109,40,217,0.4)':'0 2px 8px rgba(0,0,0,0.08)',
                    border:m.role==='bot'?'1px solid var(--border-color)':'none',
                    whiteSpace:'pre-line' }}>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  style={{ display:'flex', alignItems:'flex-end', gap:'0.5rem' }}>
                  <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'linear-gradient(135deg,#6d28d9,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem' }}>🤖</div>
                  <div style={{ padding:'0.65rem 1rem', borderRadius:'4px 18px 18px 18px', background:'var(--card-bg)', border:'1px solid var(--border-color)', display:'flex', gap:'4px', alignItems:'center' }}>
                    {[0,1,2].map(i => (
                      <motion.div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#8b5cf6' }}
                        animate={{ y:[0,-5,0] }} transition={{ duration:0.55, repeat:Infinity, delay:i*0.15 }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Chips */}
            <div style={{ padding:'0.4rem 1rem 0', display:'flex', gap:'0.4rem', flexWrap:'wrap', flexShrink:0 }}>
              {CHIPS.map(c => (
                <button key={c} onClick={() => send(c)}
                  style={{ padding:'0.25rem 0.65rem', borderRadius:'20px', border:'1px solid rgba(109,40,217,0.3)', background:'rgba(109,40,217,0.07)', color:'var(--text-muted)', fontSize:'0.7rem', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
                  onMouseEnter={e => { e.target.style.background='rgba(109,40,217,0.18)'; e.target.style.color='#8b5cf6'; }}
                  onMouseLeave={e => { e.target.style.background='rgba(109,40,217,0.07)'; e.target.style.color='var(--text-muted)'; }}>
                  {c}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding:'0.75rem 1rem', borderTop:'1px solid var(--border-color)', flexShrink:0 }}>
              <div style={{ display:'flex', gap:'0.5rem', background:'var(--card-bg)', border:'1px solid rgba(109,40,217,0.25)', borderRadius:'14px', padding:'0.4rem 0.4rem 0.4rem 0.9rem', alignItems:'center' }}>
                <input ref={inputRef} type="text" value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && send()}
                  placeholder="Ask Mozzie anything…"
                  style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text-main)', fontSize:'0.85rem', fontFamily:'inherit' }} />
                <motion.button onClick={() => send()} whileTap={{ scale:0.88 }} whileHover={{ scale:1.06 }}
                  style={{ background:'linear-gradient(135deg,#6d28d9,#8b5cf6)', border:'none', borderRadius:'10px', padding:'0.5rem 0.65rem', cursor:'pointer', color:'#fff', display:'flex', alignItems:'center' }}>
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.div style={{ position:'relative', cursor:'pointer' }} onClick={() => setIsOpen(v => !v)}
        whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}>
        {!isOpen && (
          <motion.div style={{ position:'absolute', inset:'-6px', borderRadius:'50%', border:'2px solid rgba(109,40,217,0.5)' }}
            animate={{ scale:[1,1.3,1], opacity:[0.6,0,0.6] }} transition={{ duration:2,repeat:Infinity }} />
        )}
        <div style={{ width:'66px', height:'66px', borderRadius:'50%', background:'linear-gradient(135deg,#3b0764,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 28px rgba(109,40,217,0.6)', border:'2px solid rgba(167,139,250,0.5)', overflow:'hidden' }}>
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="x" initial={{ rotate:-90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:90,opacity:0 }}>
                <X size={26} color="#fff" />
              </motion.div>
            ) : (
              <motion.div key="bot" initial={{ scale:0.6,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0.6,opacity:0 }}>
                <svg width="42" height="42" viewBox="0 0 120 120">
                  <circle cx="60" cy="65" r="34" fill="url(#fabBody)" />
                  <rect x="28" y="18" width="64" height="46" rx="14" fill="url(#fabHead)" />
                  <rect x="34" y="24" width="52" height="34" rx="8" fill="#1a0533" />
                  <ellipse cx="47" cy="42" rx="10" ry="10" fill="#fb7185" />
                  <ellipse cx="73" cy="42" rx="10" ry="10" fill="#fb7185" />
                  <circle cx="43" cy="38" r="3" fill="rgba(255,255,255,0.6)" />
                  <circle cx="69" cy="38" r="3" fill="rgba(255,255,255,0.6)" />
                  <rect x="82" y="10" width="4" height="10" rx="2" fill="#a78bfa" />
                  <circle cx="84" cy="9" r="4" fill="#f59e0b" />
                  <defs>
                    <radialGradient id="fabHead" cx="35%" cy="30%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#6d28d9"/></radialGradient>
                    <radialGradient id="fabBody" cx="35%" cy="30%"><stop offset="0%" stopColor="#ede9fe"/><stop offset="100%" stopColor="#8b5cf6"/></radialGradient>
                  </defs>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {!isOpen && (
          <motion.div initial={{ opacity:0,x:8 }} animate={{ opacity:1,x:0 }}
            style={{ position:'absolute', right:'74px', top:'50%', transform:'translateY(-50%)', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', color:'#fff', fontSize:'0.72rem', fontWeight:'700', padding:'0.3rem 0.75rem', borderRadius:'20px', whiteSpace:'nowrap', boxShadow:'0 4px 14px rgba(109,40,217,0.45)', pointerEvents:'none' }}>
            Ask Mozzie 🤖
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Chatbot;
