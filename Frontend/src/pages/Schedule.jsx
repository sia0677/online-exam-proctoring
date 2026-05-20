import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Calendar, Clock, BookOpen, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { examsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Schedule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await examsAPI.getAll();
        const sorted = (res.data.data || []).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
        setExams(sorted);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const now = new Date();
  const upcoming = exams.filter(e => new Date(e.scheduledAt) >= now);
  const past = exams.filter(e => new Date(e.scheduledAt) < now);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const daysUntil = (d) => {
    const diff = Math.ceil((new Date(d) - now) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  };

  const statusColors = { published: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' }, draft: { bg: 'rgba(212,175,55,0.1)', color: '#d4af37' }, completed: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' } };

  const ExamRow = ({ exam, isPast }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem', background: isPast ? 'rgba(255,255,255,0.01)' : 'rgba(212,175,55,0.03)', borderRadius: '12px', border: `1px solid ${isPast ? 'var(--border-color)' : 'rgba(212,175,55,0.15)'}`, marginBottom: '0.75rem', opacity: isPast ? 0.6 : 1 }}>
      <div style={{ textAlign: 'center', minWidth: '52px', padding: '0.75rem', background: isPast ? 'var(--card-bg)' : 'rgba(212,175,55,0.1)', borderRadius: '10px' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: isPast ? 'var(--text-muted)' : 'var(--primary)', lineHeight: 1 }}>
          {new Date(exam.scheduledAt).getDate()}
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {new Date(exam.scheduledAt).toLocaleString('default', { month: 'short' })}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
          <h3 style={{ fontWeight: '700', fontSize: '1rem' }}>{exam.title}</h3>
          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'capitalize', background: statusColors[exam.status]?.bg, color: statusColors[exam.status]?.color }}>{exam.status}</span>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={13} />{formatDate(exam.scheduledAt)}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={13} />{formatTime(exam.scheduledAt)} · {exam.durationMinutes} min</span>
        </div>
      </div>

      {!isPast && (
        <div style={{ textAlign: 'right', minWidth: '100px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.5rem' }}>{daysUntil(exam.scheduledAt)}</div>
          {user?.role !== 'admin' && exam.status === 'published' && (
            <button className="btn-premium" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }} onClick={() => navigate(`/exam/${exam._id}`)}>
              <Play size={12} fill="currentColor" /> Start
            </button>
          )}
        </div>
      )}
    </motion.div>
  );

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '700' }}>Schedule</h1>
            <p style={{ color: 'var(--text-muted)' }}>View and plan your upcoming examination sessions.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="widget-card" style={{ padding: '0.75rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{upcoming.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Upcoming</div>
            </div>
            <div className="widget-card" style={{ padding: '0.75rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-muted)' }}>{past.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Past</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading schedule...</div>
        ) : (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="var(--primary)" /> Upcoming Sessions
              </h2>
              {upcoming.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, color: 'var(--primary)' }} />
                  <p style={{ color: 'var(--text-muted)' }}>No upcoming exams scheduled. Enjoy the break!</p>
                </div>
              ) : upcoming.map(e => <ExamRow key={e._id} exam={e} isPast={false} />)}
            </div>

            {past.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} /> Past Sessions
                </h2>
                {past.map(e => <ExamRow key={e._id} exam={e} isPast={true} />)}
              </div>
            )}
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Schedule;
