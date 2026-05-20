import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Users, Search, Trash2, Shield, GraduationCap, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Students = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/dashboard'); return; }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.getAll();
      setStudents(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load students.');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this user?')) return;
    try {
      await usersAPI.delete(id);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch { alert('Failed to remove user.'); }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '700' }}>Students</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your student roster and accounts.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Users', value: students.length, icon: <Users size={22} />, color: '#d4af37' },
            { label: 'Students', value: students.filter(s => s.role === 'student').length, icon: <GraduationCap size={22} />, color: '#10b981' },
            { label: 'Admins', value: students.filter(s => s.role === 'admin').length, icon: <Shield size={22} />, color: '#818cf8' },
          ].map((stat, i) => (
            <div key={i} className="widget-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.9rem', background: `${stat.color}15`, borderRadius: '14px', color: stat.color }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: stat.color }}>{loading ? '...' : stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.5rem', maxWidth: '380px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '0.95rem' }} />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="widget-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4].map(i => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    {[1,2,3,4,5].map(j => (
                      <td key={j} style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ height: '1rem', width: '80%', borderRadius: '4px', background: 'var(--border-color)', opacity: 0.5 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td></tr>
              ) : (
                filtered.map((s, i) => (
                  <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#000', flexShrink: 0 }}>
                          {s.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '600' }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={13} />{s.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'capitalize', background: s.role === 'admin' ? 'rgba(129,140,248,0.15)' : 'rgba(16,185,129,0.12)', color: s.role === 'admin' ? '#818cf8' : '#10b981' }}>
                        {s.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={13} />{new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {s._id !== user?.id && (
                        <button onClick={() => handleDelete(s._id)} className="icon-btn" title="Remove" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.75rem' }}>Showing {filtered.length} of {students.length} users</p>}
      </motion.div>
    </DashboardLayout>
  );
};

export default Students;
