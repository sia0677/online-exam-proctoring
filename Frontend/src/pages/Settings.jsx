import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Palette, Bell, Lock, User, Save, CheckCircle, Camera, Shield, AlertTriangle, ChevronRight, Eye, EyeOff, Zap, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const themes = [
  { id: 'dark',      name: 'Dark Gold',       bg: '#0f0f12', primary: '#d4af37', tag: 'Default' },
  { id: 'light',     name: 'Light Snow',      bg: '#f8f9fa', primary: '#d4af37', tag: 'Light' },
  { id: 'midnight',  name: 'Midnight Blue',   bg: '#020617', primary: '#38bdf8', tag: 'Cool' },
  { id: 'emerald',   name: 'Emerald',         bg: '#064e3b', primary: '#10b981', tag: 'Nature' },
  { id: 'matcha',    name: 'Matcha',          bg: '#f3f4f1', primary: '#869d7a', tag: 'Zen' },
  { id: 'minecraft', name: 'Minecraft',       bg: '#1e1e1e', primary: '#52a535', tag: 'Game' },
  { id: 'cloud',     name: 'Cloud UI',        bg: '#e8ecf4', primary: '#5b7ec9', tag: '☁️ Soft' },
  { id: 'kawaii',    name: 'Lavender',         bg: '#f3f0ff', primary: '#8b5cf6', tag: '💜 Dreamy' },
];

const notifItems = [
  { label: 'Exam reminders',       desc: 'Get notified 30 min before your exam', defaultOn: true },
  { label: 'New exam published',   desc: 'When admins publish a new exam',        defaultOn: true },
  { label: 'Score released',       desc: 'When your result is available',         defaultOn: false },
  { label: 'Community mentions',   desc: 'When someone replies to you',           defaultOn: false },
];

const sections = [
  { id: 'Profile',       icon: User,    desc: 'Edit your personal info' },
  { id: 'Appearance',    icon: Palette, desc: 'Theme & display' },
  { id: 'Notifications', icon: Bell,    desc: 'Manage alerts' },
  { id: 'Security',      icon: Lock,    desc: 'Password & protection' },
];

const Toggle = ({ on, onToggle }) => (
  <button
    onClick={onToggle}
    style={{
      width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer',
      background: on ? 'var(--primary)' : 'var(--border-color)',
      position: 'relative', transition: 'background 0.25s', flexShrink: 0,
      boxShadow: on ? '0 0 10px rgba(212,175,55,0.35)' : 'none',
    }}
    aria-checked={on} role="switch"
  >
    <span style={{
      position: 'absolute', top: '3px',
      left: on ? '25px' : '3px',
      width: '20px', height: '20px', borderRadius: '50%',
      background: '#fff', transition: 'left 0.25s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
    }} />
  </button>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
    <div style={{
      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 14px rgba(212,175,55,0.25)',
    }}>
      <Icon size={20} color="#000" />
    </div>
    <div>
      <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '2px' }}>{title}</h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</p>
    </div>
  </div>
);

const Divider = () => (
  <div style={{ height: '1px', background: 'var(--border-color)', margin: '1.5rem 0', opacity: 0.6 }} />
);

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user, login } = useAuth();
  const [activeSection, setActiveSection] = useState('Profile');
  const [name, setName]   = useState(user?.name  || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole]   = useState(user?.role  || 'student');
  const [board, setBoard] = useState(user?.board || '');
  const [age, setAge]     = useState(user?.age   || '');
  const [school, setSchool] = useState(user?.school || '');
  const [stateLoc, setStateLoc] = useState(user?.state || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState('');
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [toggles, setToggles] = useState(notifItems.map(n => n.defaultOn));
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const fileRef = useRef();

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const res = await authAPI.updateMe({ name, email, role, board, age, school, state: stateLoc, address });
      if (res.data?.token) {
        login(res.data.token);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile.');
    } finally { setSaving(false); }
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarSrc(URL.createObjectURL(file));
  };

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const panelVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
    exit:   { opacity: 0, y: -8, transition: { duration: 0.15 } },
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%' }}>

        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage your profile, appearance, and account security.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── Sidebar nav ── */}
          <div className="glass-card" style={{ padding: '0.75rem', position: 'sticky', top: '1.5rem' }}>
            {sections.map(({ id, icon: Icon, desc }) => {
              const active = activeSection === id;
              return (
                <button key={id} onClick={() => setActiveSection(id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    marginBottom: '0.25rem', textAlign: 'left',
                    background: active ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))' : 'transparent',
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.18s',
                    boxShadow: active ? 'inset 0 0 0 1px rgba(212,175,55,0.25)' : 'none',
                  }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                    background: active ? 'rgba(212,175,55,0.12)' : 'var(--glass-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${active ? 'rgba(212,175,55,0.3)' : 'var(--border-color)'}`,
                    transition: 'all 0.18s',
                  }}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: active ? '700' : '500', lineHeight: 1 }}>{id}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>
                  </div>
                  {active && <ChevronRight size={14} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>

          {/* ── Content panel ── */}
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} variants={panelVariants} initial="hidden" animate="visible" exit="exit"
              className="glass-card" style={{ padding: '2rem' }}>

              {/* ═══ PROFILE ═══ */}
              {activeSection === 'Profile' && (
                <>
                  <SectionHeader icon={User} title="Profile Settings" subtitle="Update your display name and email address" />

                  {/* Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: avatarSrc ? 'none' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        border: '3px solid var(--primary)',
                        boxShadow: '0 0 20px rgba(212,175,55,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: '800', color: '#000',
                        overflow: 'hidden',
                      }}>
                        {avatarSrc ? <img src={avatarSrc} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                      </div>
                      <button onClick={() => fileRef.current?.click()} style={{
                        position: 'absolute', bottom: '-4px', right: '-4px',
                        width: '26px', height: '26px', borderRadius: '50%', border: '2px solid var(--bg-color)',
                        background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}>
                        <Camera size={12} color="#000" />
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>{user?.name || 'Your Name'}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>{user?.email}</div>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        marginTop: '6px', padding: '2px 10px', borderRadius: '20px',
                        background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)',
                        fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        <Zap size={10} /> {role}
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {error && <div className="alert alert-danger">{error}</div>}
                  {saved && (
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <CheckCircle size={15} /> Profile saved successfully!
                    </div>
                  )}

                  <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                      {[
                        { label: 'Display Name', type: 'text', value: name, onChange: e => setName(e.target.value), placeholder: 'Your full name' },
                        { label: 'Email Address', type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'your@email.com' },
                        { label: 'Age', type: 'number', value: age, onChange: e => setAge(e.target.value), placeholder: 'e.g. 16' },
                        { label: 'Board', type: 'text', value: board, onChange: e => setBoard(e.target.value), placeholder: 'e.g. CBSE' },
                        { label: 'School / Institution', type: 'text', value: school, onChange: e => setSchool(e.target.value), placeholder: 'School Name' },
                        { label: 'State / Region', type: 'text', value: stateLoc, onChange: e => setStateLoc(e.target.value), placeholder: 'e.g. California' },
                        { label: 'Address', type: 'text', value: address, onChange: e => setAddress(e.target.value), placeholder: 'Full Address', fullWidth: true },
                      ].map(f => (
                        <div key={f.label} style={{ gridColumn: f.fullWidth ? 'span 2' : 'span 1' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                          <input className="form-input" type={f.type} value={f.value} onChange={f.onChange} placeholder={f.placeholder} required={f.label === 'Display Name' || f.label === 'Email Address'}
                            style={{ width: '100%', borderRadius: '10px', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.75rem', outline: 'none', transition: 'border-color 0.2s' }} />
                        </div>
                      ))}
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
                        <select className="form-input" value={role} onChange={e => setRole(e.target.value)}
                          style={{ width: '100%', borderRadius: '10px', backgroundColor: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.75rem', outline: 'none', cursor: 'pointer' }}>
                          <option value="student" style={{ color: '#000', backgroundColor: '#fff' }}>Student</option>
                          <option value="teacher" style={{ color: '#000', backgroundColor: '#fff' }}>Teacher</option>
                          <option value="admin" style={{ color: '#000', backgroundColor: '#fff' }}>Admin</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <button type="submit" className="btn-premium shine-effect" disabled={saving}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}>
                        {saving ? (
                          <><span style={{ width: '14px', height: '14px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Saving…</>
                        ) : (
                          <><Save size={15} /> Save Changes</>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* ═══ APPEARANCE ═══ */}
              {activeSection === 'Appearance' && (
                <>
                  <SectionHeader icon={Palette} title="Appearance" subtitle="Choose a theme that fits your style" />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {themes.map(t => {
                      const active = theme === t.id;
                      const lightTheme = t.id === 'light' || t.id === 'matcha' || t.id === 'cloud' || t.id === 'kawaii';
                      return (
                        <button key={t.id} onClick={() => setTheme(t.id)} style={{
                          padding: '1.25rem 1rem', borderRadius: '14px', cursor: 'pointer',
                          border: active ? `2px solid ${t.primary}` : '1px solid rgba(255,255,255,0.06)',
                          background: t.bg,
                          color: lightTheme ? '#333' : '#fff',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
                          transition: 'all 0.2s', position: 'relative',
                          boxShadow: active ? `0 0 20px ${t.primary}44` : '0 2px 8px rgba(0,0,0,0.3)',
                          transform: active ? 'scale(1.03)' : 'scale(1)',
                        }}>
                          {/* Tag */}
                          <span style={{
                            position: 'absolute', top: '8px', left: '10px',
                            fontSize: '0.6rem', fontWeight: '700', textTransform: 'uppercase',
                            padding: '1px 7px', borderRadius: '20px',
                            background: `${t.primary}33`, color: t.primary, letterSpacing: '0.05em',
                          }}>{t.tag}</span>
                          {active && <CheckCircle size={14} color={t.primary} style={{ position: 'absolute', top: '8px', right: '10px' }} />}
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: `conic-gradient(${t.primary} 0deg 200deg, ${t.bg} 200deg)`,
                            border: `2px solid ${t.primary}55`,
                          }} />
                          <span style={{ fontSize: '0.78rem', fontWeight: '700' }}>{t.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <Divider />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {theme === 'light' || theme === 'matcha' ? <Sun size={15} /> : <Moon size={15} />}
                    Currently using <strong style={{ color: 'var(--primary)' }}>{themes.find(t => t.id === theme)?.name}</strong>. Theme is applied instantly.
                  </div>
                </>
              )}

              {/* ═══ NOTIFICATIONS ═══ */}
              {activeSection === 'Notifications' && (
                <>
                  <SectionHeader icon={Bell} title="Notifications" subtitle="Control what alerts you receive" />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {notifItems.map((item, i) => (
                      <React.Fragment key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>{item.label}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                          </div>
                          <Toggle on={toggles[i]} onToggle={() => setToggles(prev => prev.map((v, j) => j === i ? !v : v))} />
                        </div>
                        {i < notifItems.length - 1 && <div style={{ height: '1px', background: 'var(--border-color)', opacity: 0.5 }} />}
                      </React.Fragment>
                    ))}
                  </div>

                  <Divider />
                  <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    💡 Email notifications are sent to <strong style={{ color: 'var(--text-main)' }}>{user?.email}</strong>.
                    Update your email in Profile settings.
                  </div>
                </>
              )}

              {/* ═══ SECURITY ═══ */}
              {activeSection === 'Security' && (
                <>
                  <SectionHeader icon={Lock} title="Security" subtitle="Manage your password and account protection" />

                  {/* Security badge */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', borderRadius: '12px',
                    background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)',
                    marginBottom: '1.75rem',
                  }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Shield size={18} color="#10b981" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block' }} />
                        Account Secured
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.77rem', marginTop: '2px' }}>
                        Protected with JWT authentication &amp; bcrypt password hashing.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[
                      { label: 'Current Password', show: showOld, setShow: setShowOld, value: oldPwd, onChange: e => setOldPwd(e.target.value) },
                      { label: 'New Password',     show: showNew, setShow: setShowNew, value: newPwd, onChange: e => setNewPwd(e.target.value) },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                        <div style={{ position: 'relative' }}>
                          <input className="form-input" type={f.show ? 'text' : 'password'}
                            value={f.value} onChange={f.onChange} placeholder="••••••••"
                            style={{ width: '100%', borderRadius: '10px', paddingRight: '2.5rem' }} />
                          <button type="button" onClick={() => f.setShow(v => !v)} style={{
                            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                            display: 'flex', alignItems: 'center',
                          }}>
                            {f.show ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="btn-premium shine-effect" style={{ width: 'fit-content', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}>
                      <Lock size={14} /> Update Password
                    </button>
                  </div>

                  <Divider />

                  {/* Danger zone */}
                  <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      <AlertTriangle size={15} /> Danger Zone
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '1rem' }}>
                      Deleting your account is permanent and cannot be undone.
                    </p>
                    <button className="btn-outline" style={{
                      borderColor: '#ef4444', color: '#ef4444', padding: '0.5rem 1.25rem',
                      fontSize: '0.8rem', borderRadius: '8px',
                    }}>
                      Delete Account
                    </button>
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </DashboardLayout>
  );
};

export default Settings;
