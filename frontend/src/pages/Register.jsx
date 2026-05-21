import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Quote, Check } from 'lucide-react';

const checks = [
  { label: '6+ Chars', test: p => p.length >= 6 },
  { label: 'Has Number', test: p => /\d/.test(p) },
];

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'developer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.role);
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Failed to create account. Please try again.';
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#1a181e',
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(248, 140, 125, 0.15) 0%, transparent 50%), 
        radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #2b2128 0%, #15181d 100%)
      `,
      padding: '2rem',
      fontFamily: '"Outfit", "Inter", sans-serif'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        .capsule-input {
          width: 100%;
          background: #000000 !important;
          border: 1px solid rgba(255,255,255,0.05) !important;
          border-radius: 100px !important;
          padding: 0.8rem 1.5rem !important;
          color: #fff !important;
          font-size: 0.85rem !important;
          outline: none !important;
          box-shadow: inset 0 4px 12px rgba(0,0,0,0.6) !important;
          transition: all 0.2s ease;
        }
        .capsule-input:focus {
          border-color: rgba(248, 140, 125, 0.5) !important;
        }
        select.capsule-input {
          appearance: none;
          cursor: pointer;
        }
        .clip-card {
          border-radius: 24px; background: #0c0d11; position: relative; overflow: hidden;
        }
        .clip-card::after {
          content: ''; position: absolute; top: 0; right: 0; width: 80px; height: 80px;
          background: transparent; border-bottom-left-radius: 30px;
          box-shadow: 40px -40px 0 0 #0c0d11; pointer-events: none;
        }
      `}} />

      <div style={{ 
        width: '100%', maxWidth: '1100px', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center'
      }}>
        
        {/* Left Side: Input controls */}
        <div style={{ flex: '1 1 400px', maxWidth: '460px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '4px', transform: 'rotate(-15deg)' }}>
              <div style={{ width: '6px', height: '18px', borderRadius: '10px', background: 'linear-gradient(#f88c7d, #f0687c)' }} />
              <div style={{ width: '6px', height: '18px', borderRadius: '10px', background: 'linear-gradient(#fca28f, #f88c7d)', transform: 'translateY(-6px)' }} />
              <div style={{ width: '6px', height: '18px', borderRadius: '10px', background: '#fff', transform: 'translateY(4px)' }} />
            </div>
          </div>

          <h1 style={{ color: '#fff', fontSize: '2.75rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
            Join our ranks
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginBottom: '2rem' }}>
            Begin your DevOps journey in seconds.
          </p>

          {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', padding: '0.8rem', borderRadius: '12px', fontSize: '0.8rem', marginBottom: '1rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Username</label>
                <input 
                  name="username" type="text" className="capsule-input" 
                  placeholder="dev-01" required value={form.username} onChange={handleChange}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Role</label>
                <select name="role" className="capsule-input" value={form.role} onChange={handleChange}>
                  <option value="developer" style={{background:'#000'}}>Dev</option>
                  <option value="admin" style={{background:'#000'}}>Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Email Address</label>
              <input 
                name="email" type="email" className="capsule-input" 
                placeholder="you@domain.com" required value={form.email} onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Secret Password</label>
              <input 
                name="password" type="password" className="capsule-input" 
                placeholder="••••••••" required value={form.password} onChange={handleChange}
              />
              {form.password.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', paddingLeft: '0.75rem' }}>
                  {checks.map(c => {
                    const ok = c.test(form.password);
                    return (
                      <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: ok ? '#10b981' : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                        <Check size={10} strokeWidth={ok?3:2} /> {c.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button 
              disabled={loading}
              style={{
                width: '100%', background: 'linear-gradient(90deg, #f88c7d, #f07d86)', color: '#000',
                border: 'none', borderRadius: '100px', padding: '1rem', fontSize: '1rem',
                fontWeight: 600, cursor: 'pointer', marginTop: '1rem',
                boxShadow: '0 8px 20px rgba(248, 140, 125, 0.3)', transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {loading ? 'Initializing...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
             <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
               Already signed up? <Link to="/login" style={{ color: '#f88c7d', textDecoration: 'none', fontWeight: 600 }}>Log In Instead</Link>
             </p>
          </div>
        </div>

        {/* Right Side Showcase */}
        <div style={{ flex: '1 1 450px', position: 'relative', display: 'flex', justifyContent: 'flex-end' }} className="lg-visible">
          <style dangerouslySetInnerHTML={{__html: `@media (max-width: 900px) { .lg-visible { display: none !important; } }`}} />
          
          <div className="clip-card" style={{ width: '100%', maxWidth: '480px', padding: '3rem 2.5rem 8rem 2.5rem' }}>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '2rem' }}>
              Elevate Your <br /> Deployment Game.
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <Quote size={30} color="#fff" style={{ opacity: 0.8, transform: 'rotate(180deg)', marginBottom: '1rem' }} />
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                "The level of control you have over instant cluster scaling without touching the AWS console is unreal. True magic."
              </p>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Sarah Chen</h4>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Lead Devops at HyperNet</p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '50px', height: '40px', borderRadius: '8px', background: '#f88c7d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={18} color="#fff" /></div>
              <div style={{ width: '50px', height: '40px', borderRadius: '8px', background: '#091c16', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowRight size={18} color="#fff" /></div>
            </div>

            <div style={{ position: 'absolute', bottom: '90px', right: '20px', width: '100px', height: '100px', backgroundImage: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(99,102,241,0.6) 11deg 12deg)', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', opacity: 0.8, zIndex: 1 }} />
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ position: 'absolute', bottom: '20px', right: '-20px', background: '#ffffff', borderRadius: '24px 24px 24px 0px', padding: '2rem', width: '340px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', zIndex: 10 }}
          >
            <h4 style={{ color: '#000', fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.2, marginBottom: '0.75rem' }}>Ship production code <br /> with total confidence.</h4>
            <p style={{ color: '#555', fontSize: '0.8rem', lineHeight: 1.5 }}>100% Automated lifecycle guardrails, protecting your budgets daily.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}




