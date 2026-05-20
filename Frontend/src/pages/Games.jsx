import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { Gamepad2, Play, RefreshCw, Lightbulb, Target, BrainCircuit, CheckCircle2, XCircle } from 'lucide-react';

const Games = () => {
  // --- Ohm's law game state ---
  const [voltage, setVoltage] = useState(10);
  const [resistance, setResistance] = useState(5);
  const [targetCurrent, setTargetCurrent] = useState(4);
  const [bulbSolved, setBulbSolved] = useState(false);

  useEffect(() => {
    if (voltage / resistance === targetCurrent) {
      setBulbSolved(true);
    } else {
      setBulbSolved(false);
    }
  }, [voltage, resistance, targetCurrent]);

  const nextBulbLevel = () => {
    const newCurrent = Math.floor(Math.random() * 8) + 2;
    setTargetCurrent(newCurrent);
    setVoltage(10);
    setResistance(5);
    setBulbSolved(false);
  };

  // --- Focus Game State ---
  const [gameState, setGameState] = useState('start'); // start, memorize, input, result
  const [difficulty, setDifficulty] = useState(5); // 3=Easy, 5=Medium, 7=Hard
  const [sequence, setSequence] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let timer;
    if (gameState === 'input' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameState === 'input' && timeLeft === 0) {
      handleSubmitFocus();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startFocusGame = (diff) => {
    setDifficulty(diff);
    let seq = '';
    for (let i = 0; i < diff; i++) {
      seq += Math.floor(Math.random() * 10).toString();
    }
    setSequence(seq);
    setGameState('memorize');
    setUserAnswer('');
    
    setTimeout(() => {
      setGameState('input');
      setTimeLeft(10);
    }, 3000);
  };

  const handleSubmitFocus = () => {
    if (userAnswer === sequence) {
      setScore(prev => prev + 1);
    }
    setGameState('result');
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '1.5rem', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Gamepad2 size={32} /> Concept Mini-Games
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Play interactive games to strengthen your understanding of core concepts and improve cognitive focus.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
          
          {/* Game 1: Ohm's Law */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Lightbulb size={20} color={bulbSolved ? "#f59e0b" : "var(--text-muted)"} /> Ohm's Law Puzzle
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>10th Physics - Electricity</p>
              </div>
              <div style={{ background: 'var(--primary)', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                Level {targetCurrent - 1}
              </div>
            </div>

            <p style={{ fontSize: '0.9rem' }}>
              Adjust Voltage (V) and Resistance (R) to match the target current of <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{targetCurrent} A</strong>.
              <br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hint: I = V / R</span>
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
              <motion.div 
                animate={{ 
                  boxShadow: bulbSolved ? '0 0 50px rgba(245, 158, 11, 0.6), inset 0 0 20px rgba(245, 158, 11, 0.4)' : '0 0 0px transparent',
                  background: bulbSolved ? 'rgba(245, 158, 11, 0.15)' : 'var(--card-bg)',
                  borderColor: bulbSolved ? '#f59e0b' : 'var(--border-color)'
                }}
                style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
              >
                <Lightbulb size={45} color={bulbSolved ? "#f59e0b" : "var(--text-muted)"} strokeWidth={bulbSolved ? 2.5 : 1.5} />
              </motion.div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span>Voltage (V)</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{voltage} V</span>
                </div>
                <input type="range" min="2" max="80" step="2" value={voltage} onChange={e => setVoltage(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span>Resistance (R)</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{resistance} Ω</span>
                </div>
                <input type="range" min="1" max="40" step="1" value={resistance} onChange={e => setResistance(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--secondary)' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Current Output (I)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: bulbSolved ? '#10b981' : 'var(--text-main)' }}>
                  {(voltage / resistance).toFixed(1)} A
                </div>
              </div>
              {bulbSolved && (
                <button onClick={nextBulbLevel} className="btn-premium shine-effect" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Next Level <Play size={14} />
                </button>
              )}
            </div>
            
            {bulbSolved && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#10b981', color: '#fff', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                Solved! 🎉
              </motion.div>
            )}
          </div>

          {/* Game 2: Focus Challenge */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <BrainCircuit size={20} color="var(--primary)" /> Focus Challenge
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cognitive Memory Training</p>
              </div>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                Score: {score}
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '220px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)', padding: '1.5rem', textAlign: 'center' }}>
              
              {gameState === 'start' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Target size={48} color="var(--primary)" opacity={0.8} />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    Memorize the sequence that appears. Improves short-term memory before an exam.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '250px', margin: '0 auto' }}>
                    <button className="btn-outline" style={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => startFocusGame(3)}>
                      <span>Easy</span> <span style={{ opacity: 0.5 }}>(3 digits)</span>
                    </button>
                    <button className="btn-outline" style={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => startFocusGame(5)}>
                      <span>Medium</span> <span style={{ opacity: 0.5 }}>(5 digits)</span>
                    </button>
                    <button className="btn-outline" style={{ display: 'flex', justifyContent: 'space-between' }} onClick={() => startFocusGame(7)}>
                      <span>Hard</span> <span style={{ opacity: 0.5 }}>(7 digits)</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {gameState === 'memorize' && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <h1 style={{ fontSize: '3.5rem', letterSpacing: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)', textShadow: '0 0 20px rgba(212,175,55,0.4)' }}>
                    {sequence}
                  </h1>
                  <p style={{ color: 'var(--primary)', marginTop: '1rem', fontWeight: '600', animation: 'pulse 1s infinite' }}>
                    Memorize this!
                  </p>
                </motion.div>
              )}

              {gameState === 'input' && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>What was the sequence?</span>
                    <span style={{ color: timeLeft <= 3 ? '#ef4444' : 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       ⏱️ {timeLeft}s
                    </span>
                  </div>
                  <input 
                    autoFocus
                    type="text" 
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value.replace(/\D/g, ''))} // only numbers
                    onKeyDown={e => e.key === 'Enter' && handleSubmitFocus()}
                    placeholder="Enter digits..."
                    style={{ width: '100%', padding: '1rem', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.2rem', background: 'rgba(0,0,0,0.2)', border: '2px solid var(--primary)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }}
                  />
                  <button className="btn-premium shine-effect" style={{ marginTop: '1.25rem', width: '100%', padding: '0.85rem' }} onClick={handleSubmitFocus}>
                    Submit Answer
                  </button>
                </motion.div>
              )}

              {gameState === 'result' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '100%' }}>
                  {userAnswer === sequence ? (
                    <div>
                      <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                      <h2 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Perfect!</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Great focus!</p>
                    </div>
                  ) : (
                    <div>
                      <XCircle size={56} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
                      <h2 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Incorrect</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>You entered: <span style={{ color: 'var(--text-main)' }}>{userAnswer || 'nothing'}</span></p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Correct sequence:</p>
                      <h3 style={{ margin: '0.5rem 0', letterSpacing: '0.3rem', fontSize: '1.5rem' }}>{sequence}</h3>
                    </div>
                  )}
                  <button className="btn-outline" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setGameState('start')}>
                    Play Again
                  </button>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </motion.div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Games;
