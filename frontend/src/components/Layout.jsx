import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Cloud, LayoutDashboard, Activity, Settings, LogOut, ChevronRight, Zap, Search, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV = [
  { to: '/',       label: 'Dashboard',     icon: LayoutDashboard, end: true },
  { to: '/orchestration', label: 'Orchestration', icon: Server },
  { to: '/metrics', label: 'Metrics',       icon: Activity },
];

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'transparent' }}>
      <div className="bg-animated" />

      {/* ── Sidebar ── */}
      <motion.aside
        className="sidebar"
        initial={{ x: -260 }} animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        style={{ zIndex: 20 }}
      >
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid var(--border-faint)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-icon"><Cloud size={18} color="#fff" /></div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Cloud<span className="gradient-text">Forge</span>
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                DevOps Portal
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0', display: 'flex', flexDirection: 'column' }}>
          <div className="nav-section-label">Platform</div>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Icon size={15} />
              <span style={{ flex: 1 }}>{label}</span>
              <ChevronRight size={12} style={{ opacity: 0.3 }} />
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>Administration</div>
              <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <Settings size={15} />
                <span style={{ flex: 1 }}>Admin Panel</span>
                <ChevronRight size={12} style={{ opacity: 0.3 }} />
              </NavLink>
            </>
          )}
        </nav>

        {/* System status */}
        <div style={{ margin: '0 0.75rem 0.75rem', padding: '0.75rem', borderRadius: 'var(--r-md)', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', marginBottom: '0.25rem' }}>
            <div className="status-dot" /> All systems operational
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', paddingLeft: '1.1rem' }}>API · DB · Terraform</div>
        </div>

        {/* User */}
        <div style={{ margin: '0 0.75rem 1rem', padding: '0.75rem', borderRadius: 'var(--r-md)', background: 'rgba(99,102,241,0.05)', border: '1px solid var(--border-faint)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {user?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
              </div>
            </div>
            <button id="logout-btn" onClick={handleLogout} title="Sign out"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', borderRadius: '6px', display: 'flex', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1 }}>
        {/* Topbar - Augmented with Omni-Search */}
        <header style={{ height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', borderBottom: '1px solid var(--border-faint)', background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: '600px' }}>
            {/* Global Command Search (Simulating AWS Omni-Bar) */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input 
                type="text" 
                placeholder="Search environments, regions, deployments (CMD+K)..." 
                style={{
                  width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px', color: '#fff', fontSize: '0.8rem',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'var(--brand)'; }}
                onBlur={(e) => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              />
              <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: '1px solid var(--border-faint)', borderRadius: '4px', padding: '0.1rem 0.3rem', fontSize: '0.6rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)' }}>
                /
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.02em' }}>US-EAST-1</span>
            </div>
            <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-developer'}`} style={{ padding: '0.35rem 0.6rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
              {user?.role === 'admin' ? <><Zap size={10} /> ADMIN</> : <>◆ DEV</>}
            </span>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
