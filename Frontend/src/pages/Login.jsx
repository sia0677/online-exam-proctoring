import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, ShieldCheck } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'register';
  
  const [isRegister, setIsRegister] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsRegister(queryParams.get('mode') === 'register');
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        const response = await api.post('/auth/register', { name, email, password });
        if (response.data.success) {
          login(response.data.token);
          navigate('/dashboard');
        }
      } else {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
          login(response.data.token);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.05), transparent)'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card animate-fade-in" 
        style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', position: 'relative' }}
      >
        <button 
          onClick={() => navigate('/')}
          style={{ 
            position: 'absolute', 
            top: '1.5rem', 
            left: '1.5rem', 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'rgba(212, 175, 55, 0.1)', 
            borderRadius: '16px', 
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {isRegister ? 'Join our community of learners' : 'Sign in to continue your progress'}
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="alert alert-danger" 
              style={{ 
                marginBottom: '1.5rem', 
                padding: '0.75rem 1rem', 
                backgroundColor: 'rgba(255, 68, 68, 0.1)', 
                color: '#ff4444', 
                borderRadius: '8px', 
                border: '1px solid rgba(255, 68, 68, 0.2)',
                fontSize: '0.875rem'
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <AnimatePresence mode="popLayout">
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <User size={14} /> Full Name
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="John Doe"
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)', outline: 'none' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="name@example.com"
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-premium shine-effect" 
            disabled={loading}
            style={{ marginTop: '1rem', width: '100%', padding: '1rem', borderRadius: '8px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button 
              type="button" 
              onClick={() => setIsRegister(!isRegister)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', marginLeft: '0.5rem', fontSize: '0.9rem' }}
            >
              {isRegister ? 'Login' : 'Register Now'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
