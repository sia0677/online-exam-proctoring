import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const students = []; // Empty for fresh start

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="app-container"
      >
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            New Season is Here! 🏆
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>The leaderboard has been reset. Take your first exam to claim the #1 spot!</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Current Leader', value: 'Waiting for you...', icon: <Medal color="var(--text-muted)" /> },
            { label: 'Top Accuracy', value: '--%', icon: <Star color="var(--text-muted)" /> },
            { label: 'Season Ends', value: '30 Days', icon: <TrendingUp color="var(--text-muted)" /> },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: 'var(--primary)', marginBottom: '1.5rem', opacity: 0.5 }}
          >
            <Trophy size={80} style={{ margin: '0 auto' }} />
          </motion.div>
          <h2>No Rankings Yet</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '400px', margin: '1rem auto' }}>
            Be the first to finish an exam and etch your name in ARVO history!
          </p>
          <button className="btn-premium shine-effect" style={{ marginTop: '2rem' }}>
            Take an Exam Now
          </button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Leaderboard;
