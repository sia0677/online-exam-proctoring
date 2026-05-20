import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, Shield, Zap, Award } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Intro = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow Backdrops (Blobs) */}
      <div className="animated-bg">
        <div className="blob" style={{ 
          position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', 
          background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 75%)', filter: 'blur(100px)', animation: 'float-glow 15s infinite alternate' 
        }}></div>
        <div className="blob" style={{ 
          position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', 
          background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 75%)', filter: 'blur(100px)', animation: 'float-glow 20s infinite alternate-reverse' 
        }}></div>
      </div>
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ textAlign: 'center', maxWidth: '800px', zIndex: 2 }}
      >
        {/* Pulsing Glow Logo Container */}
        <motion.div
          animate={{ 
            rotate: 360,
            boxShadow: [
              '0 0 40px rgba(212, 175, 55, 0.4), 0 0 80px rgba(212, 175, 55, 0.2)',
              '0 0 60px rgba(212, 175, 55, 0.6), 0 0 120px rgba(212, 175, 55, 0.3)',
              '0 0 40px rgba(212, 175, 55, 0.4), 0 0 80px rgba(212, 175, 55, 0.2)'
            ]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
            boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }}
          style={{ 
            width: '130px', 
            height: '130px', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
            borderRadius: '32px', 
            margin: '0 auto 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            border: '2px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Main Logo Image */}
          <img 
            src={logoImg} 
            alt="ARVO" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              zIndex: 2,
              position: 'absolute'
            }} 
            onError={(e) => e.target.style.display = 'none'} 
          />
          
          <Play size={54} color="#000" fill="#000" style={{ zIndex: 1 }} />
        </motion.div>

        {/* Glowing Title */}
        <h1 style={{ 
          fontSize: '4rem', 
          marginBottom: '1.5rem', 
          fontWeight: '900', 
          letterSpacing: '-1px',
          textShadow: '0 0 40px rgba(212,175,55,0.25)' 
        }}>
          Welcome to <span className="text-gradient" style={{ textShadow: '0 0 30px rgba(212,175,55,0.5)' }}>ARVO</span>
        </h1>
        
        <div style={{ marginBottom: '3.5rem' }}>
          <p style={{ fontSize: '1.35rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
            The next generation of secure, proctored, and interactive online examinations.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '3px' }}>
            Adaptive Testing. Limitless Potential.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          {user ? (
            <button 
              className="btn-premium shine-effect" 
              onClick={() => navigate('/dashboard')}
              style={{ fontSize: '1.1rem', padding: '1rem 3rem', boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button 
                className="btn-premium shine-effect" 
                onClick={() => navigate('/login?mode=register')}
                style={{ fontSize: '1.1rem', padding: '1rem 3rem', boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
              >
                Get Started
              </button>
              <button 
                className="btn-outline" 
                onClick={() => navigate('/login?mode=login')}
                style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Interactive Features Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2.5rem', 
        width: '100%', 
        maxWidth: '1050px', 
        marginTop: '7rem',
        zIndex: 2
      }}>
        {[
          { icon: <Shield size={26} />, title: 'Secure Proctoring', desc: 'Advanced AI-driven monitoring to ensure exam integrity.' },
          { icon: <Zap size={26} />, title: 'Real-time Analytics', desc: 'Instant feedback and detailed performance insights.' },
          { icon: <Award size={26} />, title: 'Global Standards', desc: 'Certified and trusted by leading educational institutions.' }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
              y: -8, 
              boxShadow: '0 20px 40px rgba(212,175,55,0.15), 0 0 30px rgba(212,175,55,0.08)',
              borderColor: 'rgba(212,175,55,0.4)',
              transition: { duration: 0.2 }
            }}
            transition={{ delay: 0.4 + i * 0.15 }}
            className="glass-card"
            style={{ 
              padding: '2.5rem 2rem', 
              textAlign: 'left', 
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'border-color 0.3s, box-shadow 0.3s'
            }}
          >
            <div style={{ 
              color: 'var(--primary)', 
              marginBottom: '1.25rem',
              display: 'inline-flex',
              padding: '0.75rem',
              background: 'rgba(212,175,55,0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(212,175,55,0.15)',
              boxShadow: '0 0 15px rgba(212,175,55,0.1)'
            }}>{feature.icon}</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '700' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.6' }}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <footer style={{ marginTop: 'auto', paddingTop: '5rem', color: 'var(--text-muted)', fontSize: '0.875rem', zIndex: 2 }}>
        &copy; 2026 ARVO Systems. All rights reserved.
      </footer>

      <style>{`
        @keyframes float-glow {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Intro;
