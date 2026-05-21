import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Server, Tag, Zap, DollarSign } from 'lucide-react';
import api from '../services/api';

const instanceOptions = [
  { value: 't2.micro',  label: 't2.micro',  tier: 'Free Tier',  vcpu: '1 vCPU',  ram: '1 GB',  costRate: 0.0116, costStr: '$0.0116/hr' },
  { value: 't3.small',  label: 't3.small',  tier: 'General',    vcpu: '2 vCPU',  ram: '2 GB',  costRate: 0.0208, costStr: '$0.0208/hr' },
  { value: 't3.medium', label: 't3.medium', tier: 'Standard',   vcpu: '2 vCPU',  ram: '4 GB',  costRate: 0.0416, costStr: '$0.0416/hr' },
  { value: 't3.large',  label: 't3.large',  tier: 'Enhanced',   vcpu: '2 vCPU',  ram: '8 GB',  costRate: 0.0832, costStr: '$0.0832/hr' },
];

export default function ProvisionModal({ isOpen, onClose, onProvisionStarted }) {
  const [envName, setEnvName] = useState('');
  const [instanceType, setInstanceType] = useState('t2.micro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedInstance = instanceOptions.find(o => o.value === instanceType);
  const estCost = selectedInstance
    ? (selectedInstance.costRate * 24).toFixed(2)
    : '0.00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!envName.trim()) { setError('Environment name is required.'); return; }
    setLoading(true);
    try {
      await api.post('/environment/provision', { environment_name: envName.trim(), instance_type: instanceType });
      onProvisionStarted();
      onClose();
      setEnvName('');
      setInstanceType('t2.micro');
    } catch {
      setError('Failed to start provisioning. Please try again.');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            style={{ width: '100%', maxWidth: '480px' }}
          >
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Modal header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-faint)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    background: 'var(--grad-brand)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Zap size={16} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Provision Environment
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Deploy a new AWS EC2 environment</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: '0.35rem', borderRadius: '8px',
                    transition: 'all 0.2s', display: 'flex'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal body with strict containment scrolling to fix visibility bug */}
              <form onSubmit={handleSubmit} style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem',
                maxHeight: 'calc(90vh - 80px)', // Constrain to view height minus header
                overflowY: 'auto' // Explicit scrolling support
              }}>
                {/* Ensure inputs use standard box sizing to fit correctly without shifting */}
                <style dangerouslySetInnerHTML={{__html: `
                  .modal-scroll-zone::-webkit-scrollbar { width: 6px; }
                  .modal-scroll-zone::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                `}} />
                {error && (
                  <div style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: 'var(--r-sm)', padding: '0.75rem 1rem',
                    fontSize: '0.82rem', color: '#fca5a5'
                  }}>
                    {error}
                  </div>
                )}

                {/* Environment name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Environment Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Tag size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      id="env-name-input"
                      type="text"
                      className="input-field"
                      value={envName}
                      onChange={(e) => setEnvName(e.target.value)}
                      placeholder="e.g. staging-v3"
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    Lowercase letters, numbers, and hyphens only
                  </p>
                </div>

                {/* Instance type selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Instance Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {instanceOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setInstanceType(opt.value)}
                        style={{
                          background: instanceType === opt.value
                            ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))'
                            : 'rgba(6,9,20,0.4)',
                          border: instanceType === opt.value
                            ? '1px solid rgba(99,102,241,0.4)'
                            : '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          padding: '0.625rem 0.75rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: instanceType === opt.value ? 'var(--brand-light)' : 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                            {opt.label}
                          </span>
                          <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: 'var(--brand-light)', fontWeight: 600 }}>
                            {opt.tier}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{opt.vcpu} · {opt.ram}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--warning)', marginTop: '0.2rem', fontWeight: 600 }}>{opt.costStr}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Advanced Configuration Section */}
                <div style={{ borderTop: '1px solid var(--border-faint)', paddingTop: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Infrastructure Region
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {['us-east-1', 'us-west-2', 'eu-central-1'].map(reg => (
                      <div key={reg} style={{ 
                        background: reg === 'us-east-1' ? 'rgba(99,102,241,0.05)' : 'transparent',
                        border: `1px solid ${reg === 'us-east-1' ? 'var(--brand)' : 'var(--border-subtle)'}`,
                        borderRadius: '6px', padding: '0.5rem', fontSize: '0.7rem', textAlign: 'center', fontWeight: 600, color: reg === 'us-east-1' ? '#fff' : 'var(--text-muted)', cursor: 'pointer'
                      }}>
                        {reg}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        ROOT STORAGE (EBS)
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="number" defaultValue={20} className="input-field" style={{ padding: '0.5rem', fontSize: '0.75rem' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GB</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <div style={{ width: '16px', height: '16px', border: '2px solid var(--brand)', borderRadius: '4px', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Zap size={10} color="#fff" />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Allocate Public IP</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost estimate banner */}
                <div style={{
                  background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
                  borderRadius: '8px', padding: '0.75rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                  <DollarSign size={16} color="var(--warning)" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Estimated 24-hour cost: <span style={{ color: 'var(--warning)' }}>${estCost}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Auto-destroyed after 24h to prevent runaway costs
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.25rem' }}>
                  <button type="button" onClick={onClose} className="btn-ghost">
                    Cancel
                  </button>
                  <button
                    id="provision-submit"
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px', justifyContent: 'center' }}
                  >
                    {loading ? (
                      <>
                        <div style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        Launching...
                      </>
                    ) : (
                      <><Zap size={14} /> Launch now</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
