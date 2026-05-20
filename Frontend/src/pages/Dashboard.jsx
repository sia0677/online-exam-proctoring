import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import useProctoring from '../hooks/useProctoring';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ClipboardList, TrendingUp, BookOpen, Award } from 'lucide-react';
import { examsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#d4af37', 'rgba(212, 175, 55, 0.1)'];


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { violations } = useProctoring((type) => {
    console.warn(`Proctoring Event: ${type}`);
  });

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await examsAPI.getAll();
        setExams(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch exams', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const published = exams.filter(e => e.status === 'published').length;
  const draft = exams.filter(e => e.status === 'draft').length;
  const total = exams.length;

  const pieData = total > 0
    ? [{ name: 'Published', value: published }, { name: 'Other', value: Math.max(draft, 1) }]
    : [{ name: 'Completed', value: 0 }, { name: 'Remaining', value: 100 }];

  // Build bar data from exam schedule (last 5 upcoming)
  const upcoming = [...exams]
    .filter(e => new Date(e.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
    .slice(0, 5);

  const barData = upcoming.length > 0
    ? upcoming.map(e => ({
        name: new Date(e.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: e.durationMinutes
      }))
    : [
        { name: 'Mon', value: 0 }, { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 }, { name: 'Thu', value: 0 }, { name: 'Fri', value: 0 },
      ];

  const progressPct = total > 0 ? Math.round((published / total) * 100) : 0;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-header"
        style={{ marginBottom: '2rem' }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
          Welcome back, <span className="text-gradient">{user?.name || 'Explorer'}</span>! <Sparkles size={24} style={{ color: 'var(--primary)', verticalAlign: 'middle' }} />
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening on your platform today.</p>
      </motion.div>

      <div className="dashboard-grid">

        {/* CTA Banner */}
        <div className="widget-card shine-effect" style={{ gridColumn: 'span 12', background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.12), transparent)', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {(user?.role === 'admin' || user?.role === 'teacher') ? 'Manage your exams and students' : 'Ready for your next exam?'}
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                {(user?.role === 'admin' || user?.role === 'teacher')
                  ? `You have ${published} published exam${published !== 1 ? 's' : ''} and ${draft} draft${draft !== 1 ? 's' : ''}.`
                  : `${published} exam${published !== 1 ? 's' : ''} available. Start now to track your progress.`}
              </p>
            </div>
            <button className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/exams')}>
              {(user?.role === 'admin' || user?.role === 'teacher') ? 'Manage Exams' : 'View Exams'} <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        {[
          { label: 'Total Exams', value: loading ? '...' : total, icon: <BookOpen size={24} />, color: '#d4af37' },
          { label: 'Published', value: loading ? '...' : published, icon: <Award size={24} />, color: '#10b981' },
          { label: 'Security Events', value: violations, icon: <ClipboardList size={24} />, color: violations > 0 ? '#ef4444' : '#6b7280' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="widget-card"
            style={{ gridColumn: 'span 4' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="widget-title">{stat.label}</div>
                <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
              </div>
              <div style={{ color: stat.color, opacity: 0.7, padding: '0.75rem', background: `${stat.color}15`, borderRadius: '12px' }}>{stat.icon}</div>
            </div>
          </motion.div>
        ))}

        {/* Pie Chart */}
        <div className="widget-card" style={{ gridColumn: 'span 4' }}>
          <div className="widget-title">Exam Progress</div>
          <div style={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value" stroke="none" startAngle={90} endAngle={450}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{progressPct}%</div>
              <div className="stat-label">Published</div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="widget-card" style={{ gridColumn: 'span 8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="widget-title">Upcoming Exam Schedule</div>
              <div className="stat-value">{upcoming.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>upcoming</span></div>
            </div>
            <TrendingUp size={24} color="var(--primary)" style={{ opacity: 0.6 }} />
          </div>
          <div style={{ height: '150px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip cursor={{ fill: 'rgba(212, 175, 55, 0.05)' }} contentStyle={{ backgroundColor: '#1e1e24', borderColor: 'var(--border-color)', borderRadius: '8px' }} formatter={(v) => [`${v} min`, 'Duration']} />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Exams */}
        <div className="widget-card" style={{ gridColumn: 'span 7' }}>
          <div className="widget-title">Recent Exams</div>
          {loading ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</div>
          ) : exams.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '160px', gap: '1rem' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1rem', borderRadius: '50%' }}>
                <ClipboardList size={32} color="var(--primary)" opacity={0.5} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No exams yet. Create one to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {exams.slice(0, 4).map(exam => (
                <div key={exam._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{exam.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{exam.durationMinutes} min · {new Date(exam.scheduledAt).toLocaleDateString()}</div>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: exam.status === 'published' ? 'rgba(16,185,129,0.15)' : 'rgba(212,175,55,0.1)',
                    color: exam.status === 'published' ? '#10b981' : 'var(--primary)'
                  }}>
                    {exam.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Status */}
        <div className="widget-card" style={{ gridColumn: 'span 5' }}>
          <div className="widget-title">Security Status</div>
          <div style={{ height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              backgroundColor: violations > 0 ? '#ef4444' : '#10b981',
              boxShadow: `0 0 12px ${violations > 0 ? '#ef4444' : '#10b981'}`
            }}></div>
            <div className="stat-value" style={{ color: violations > 0 ? '#ef4444' : '#10b981', fontSize: '1.5rem' }}>
              {violations > 0 ? `${violations} Alert${violations > 1 ? 's' : ''}` : 'Secure'}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', maxWidth: '200px' }}>
              {violations > 0
                ? `${violations} tab-switch event${violations > 1 ? 's' : ''} detected during this session.`
                : 'AI proctoring is active and all systems are nominal.'}
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
