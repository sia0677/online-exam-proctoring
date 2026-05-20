import React, { useState } from 'react';
import { Menu, Search, Bell, LogOut, Home, LayoutDashboard, BookOpen, Trophy, MessageSquare, Users, Gamepad2, Calendar, Settings as SettingsIcon, Play, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentRole = user?.role || 'student';
  const navItems = [
    { icon: <LayoutDashboard size={22} />, path: '/dashboard', label: 'Dashboard', roles: ['student', 'teacher', 'admin'] },
    { icon: <BookOpen size={22} />, path: '/exams', label: 'Exams', roles: ['student', 'teacher', 'admin'] },
    { icon: <Trophy size={22} />, path: '/leaderboard', label: 'Leaderboard', roles: ['student'] },
    { icon: <MessageSquare size={22} />, path: '/community', label: 'Community', roles: ['student', 'teacher', 'admin'] },
    { icon: <Users size={22} />, path: '/students', label: 'Students', roles: ['teacher', 'admin'] },
    { icon: <Gamepad2 size={22} />, path: '/games', label: 'Mini Games', roles: ['student'] },
    { icon: <Calendar size={22} />, path: '/schedule', label: 'Schedule', roles: ['student', 'teacher', 'admin'] },
  ].filter(item => item.roles.includes(currentRole));

  return (
    <>
      <div className="navbar">
        {/* Left side: Hamburger and Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => setDrawerOpen(true)}
            style={{ 
              background: 'var(--glass-bg)', 
              border: '1px solid var(--border-color)', 
              color: 'var(--text-main)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--border-color)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Menu size={22} />
          </button>
          
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '36px', height: '36px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative',
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)'
            }}>
              <Play size={18} color="#000" fill="#000" style={{ zIndex: 1 }} />
              <img src={logoImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 2, position: 'absolute' }} onError={(e) => e.target.style.display = 'none'} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '1px' }}>ARVO</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="search-bar glass-panel" style={{ width: '400px', display: 'flex', margin: '0 2rem' }}>
          <Search size={20} color="var(--text-muted)" />
          <input type="text" placeholder="Search exams, students, settings..." style={{ fontSize: '0.95rem', flex: 1 }} />
        </div>

        {/* Right side: User Profile */}
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
          {/* Notifications Dropdown Container */}
          <div style={{ position: 'relative' }}>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }} style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={22} color="var(--text-muted)" />
              <div style={{ position: 'absolute', top: '0px', right: '0px', width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%', border: '2px solid var(--sidebar-bg)' }}></div>
            </motion.div>
            
            <AnimatePresence>
              {showNotifs && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowNotifs(false)} />
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="glass-card" style={{ position: 'absolute', top: '40px', right: '-10px', width: '320px', zIndex: 50, padding: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ padding: '0.75rem', background: 'rgba(212,175,55,0.05)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.1)' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Exam Reminder</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Physics Midterm starts in 30 mins.</div>
                      </div>
                      <div style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>System Update</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Platform maintenance scheduled for tonight.</div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown Container */}
          <div style={{ position: 'relative' }}>
            <div onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <div style={{ textAlign: 'right', display: 'none', '@media(minWidth: 768px)': { display: 'block' } }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>{user?.name || 'Student Name'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role || 'Guest'}</div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="avatar" 
                style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '1.1rem', borderRadius: '50%' }}
              >
                {(user?.name || 'S').charAt(0).toUpperCase()}
              </motion.div>
            </div>
            
            <AnimatePresence>
              {showProfile && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowProfile(false)} />
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="glass-card" style={{ position: 'absolute', top: '50px', right: '0', width: '300px', zIndex: 50, padding: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>
                        {(user?.name || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{user?.name || 'Student Name'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginTop: '2px' }}>{user?.role || 'Guest'}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0', marginBottom: '1rem' }}>
                      {[
                        { label: 'Email', value: user?.email },
                        { label: 'Age', value: user?.age },
                        { label: 'Board', value: user?.board },
                        { label: 'School', value: user?.school },
                        { label: 'State', value: user?.state },
                        { label: 'Address', value: user?.address }
                      ].map(info => info.value ? (
                        <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{info.label}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-main)', textAlign: 'right', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{info.value}</span>
                        </div>
                      ) : null)}
                    </div>
                    
                    <button onClick={() => { navigate('/settings'); setShowProfile(false); }} className="btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.85rem' }}>
                      <SettingsIcon size={16} /> Edit Profile
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="drawer-overlay" 
            onClick={() => setDrawerOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Drawer Menu */}
      <div className={`drawer ${drawerOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column', padding: '0', boxShadow: '5px 0 25px rgba(0,0,0,0.5)' }}>
        {/* Drawer Header */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '32px', height: '32px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative'
            }}>
              <Play size={16} color="#000" fill="#000" style={{ zIndex: 1 }} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '1px' }}>ARVO</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
            <X size={18} />
          </button>
        </div>

        {/* User Mini Profile in Drawer */}
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(180deg, rgba(212,175,55,0.05), transparent)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', border: '2px solid var(--border-color)' }}>
            {(user?.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>{user?.name || 'Student Name'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginTop: '4px' }}>{user?.role || 'Guest'}</div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" className={`drawer-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}>
            <Home size={20} /> <span style={{ fontWeight: '500' }}>Home</span>
          </Link>
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0', opacity: 0.5 }}></div>
          {navItems.map((item, idx) => (
            <Link key={idx} to={item.path} className={`drawer-link ${location.pathname === item.path ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}>
              {React.cloneElement(item.icon, { size: 20 })} <span style={{ fontWeight: '500' }}>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border-color)', background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/settings" className={`drawer-link ${location.pathname === '/settings' ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}>
            <SettingsIcon size={20} /> <span style={{ fontWeight: '500' }}>Settings</span>
          </Link>
          <button onClick={handleLogout} className="drawer-link" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', width: '100%', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: '1rem', padding: '0.85rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', marginTop: '0.5rem' }}>
            <LogOut size={20} color="#ef4444" /> <span style={{ color: '#ef4444', fontWeight: '600' }}>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
