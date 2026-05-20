import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BookOpen, Plus, Clock, Calendar, Users, X, ChevronRight, Play, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { examsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  published: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  draft:     { bg: 'rgba(212,175,55,0.12)', color: '#d4af37' },
  completed: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
};

const CreateExamModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: '', description: '', durationMinutes: 60,
    scheduledAt: '', status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await examsAPI.create({
        ...form,
        durationMinutes: Number(form.durationMinutes),
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      onCreated(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create exam.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Create New Exam</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Exam Title</label>
            <input className="form-input" type="text" placeholder="e.g. JavaScript Fundamentals" required
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} placeholder="What will this exam cover?"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ resize: 'vertical' }} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Duration (minutes)</label>
              <input className="form-input" type="number" min="5" max="300" required
                value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Scheduled Date & Time</label>
            <input className="form-input" type="datetime-local" required
              value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-premium shine-effect" disabled={loading}>
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Exams = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await examsAPI.getAll();
      const backendExams = res.data.data || [];
      const localExams = JSON.parse(localStorage.getItem('localExams') || '[]').map(e => ({
        ...e,
        _id: e.id, // map localStorage id to _id for consistency
        status: 'published' // auto-publish local exams
      }));
      setExams([...localExams, ...backendExams]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam? This cannot be undone.')) return;
    try {
      await examsAPI.delete(id);
      setExams(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete exam.');
    }
  };

  const handlePublish = async (exam) => {
    try {
      const newStatus = exam.status === 'published' ? 'draft' : 'published';
      const res = await examsAPI.update(exam._id, { ...exam, status: newStatus });
      setExams(prev => prev.map(e => e._id === exam._id ? res.data.data : e));
    } catch (err) {
      alert('Failed to update exam status.');
    }
  };

  const filtered = exams.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || e.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '700' }}>Exams</h1>
            <p style={{ color: 'var(--text-muted)' }}>{isTeacherOrAdmin ? 'Create and manage your examinations.' : 'Browse and take available exams.'}</p>
          </div>
          {isTeacherOrAdmin && (
            <button className="btn-premium shine-effect" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => navigate('/create-exam')}>
              <Plus size={20} /> Create Exam
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            className="form-input"
            type="text"
            placeholder="Search exams..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'published', 'draft', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  background: filter === f ? 'var(--primary)' : 'transparent',
                  color: filter === f ? '#000' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: filter === f ? '700' : '400',
                  fontSize: '0.875rem',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Exam Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="widget-card" style={{ height: '220px', opacity: 0.4 }}>
                <div className="skeleton" style={{ height: '1.5rem', width: '60%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '1rem', width: '90%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '1rem', width: '75%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: '5rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem', opacity: 0.4 }}>
              <BookOpen size={64} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>No Exams Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {isTeacherOrAdmin ? 'Click "Create Exam" to add your first exam.' : 'No published exams available yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((exam, i) => (
              <motion.div
                key={exam._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="widget-card exam-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span className="status-badge" style={{ background: statusColors[exam.status]?.bg, color: statusColors[exam.status]?.color }}>
                    {exam.status}
                  </span>
                  {isTeacherOrAdmin && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handlePublish(exam)} title={exam.status === 'published' ? 'Unpublish' : 'Publish'} className="icon-btn">
                        <CheckCircle size={16} color={exam.status === 'published' ? '#10b981' : 'var(--text-muted)'} />
                      </button>
                      <button onClick={() => handleDelete(exam._id)} title="Delete" className="icon-btn">
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.4' }}>{exam.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.25rem', flexGrow: 1 }}>
                  {exam.description?.length > 100 ? exam.description.slice(0, 100) + '...' : exam.description}
                </p>

                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Clock size={14} /> {exam.durationMinutes} min
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Calendar size={14} /> {new Date(exam.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                {!isTeacherOrAdmin && exam.status === 'published' && (
                  <button
                    className="btn-premium shine-effect"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    onClick={() => navigate(`/exam/${exam._id}`)}
                  >
                    <Play size={16} fill="currentColor" /> Start Exam <ChevronRight size={16} />
                  </button>
                )}

                {isTeacherOrAdmin && (
                  <button
                    className="btn-outline"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    onClick={() => navigate(`/exam/${exam._id}`)}
                  >
                    <Edit3 size={16} /> Preview Exam
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {/* Modal removed to use dedicated Create Exam page */}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Exams;
