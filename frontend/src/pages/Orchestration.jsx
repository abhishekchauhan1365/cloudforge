import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Box, HardDrive, Cpu, Activity, Server, RefreshCw, Search, Filter } from 'lucide-react';

export default function Orchestration() {
  const [clusterData, setClusterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cluster/status');
      setClusterData(res.data);
    } catch (err) {
      console.error("Cluster fetch fail", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  const pods = clusterData?.pods?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.image.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div style={{ color: '#fff' }}>
      
      {/* Heading Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
            Cluster <span className="gradient-text">Orchestration</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time Kubernetes pod matrices and Docker runtime container health.</p>
        </div>
        <button onClick={fetchStatus} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Upper System Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Active Cluster Health', value: clusterData?.cluster_health || 'LOADING...', icon: Server, color: '#10b981' },
          { label: 'Managed Nodes', value: clusterData?.nodes_active || '--', icon: HardDrive, color: '#3b82f6' },
          { label: 'Control Plane Latency', value: clusterData?.api_server_latency || '--', icon: Activity, color: 'var(--brand)' }
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${stat.color}30` }}>
               <stat.icon size={20} color={stat.color} />
             </div>
             <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{stat.value}</div>
             </div>
          </div>
        ))}
      </div>

      {/* Visual Grid / Interactive Dashboard */}
      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
        
        {/* Sub Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Running Instances</h2>
              <span style={{ background: 'rgba(248, 140, 125, 0.1)', color: 'var(--brand)', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>{pods.length} UNITS</span>
           </div>
           
           <div style={{ display: 'flex', position: 'relative' }}>
             <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
             <input 
               type="text" 
               placeholder="Filter by pod or image..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 1rem 0.5rem 2.5rem', color: '#fff', fontSize: '0.85rem', width: '260px' }}
             />
           </div>
        </div>

        {/* POD TABLE / LIST */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          <AnimatePresence mode="popLayout">
            {pods.map((pod) => (
              <motion.div
                key={pod.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: '12px', 
                  padding: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Status Indicator Stripe */}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: pod.status === 'RUNNING' ? '#10b981' : '#f59e0b' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{pod.type}</div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{pod.name}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ns: {pod.namespace}</div>
                  </div>
                  <div style={{ 
                    fontSize: '0.65rem', fontWeight: 800, 
                    padding: '0.25rem 0.5rem', borderRadius: '4px', 
                    background: pod.status === 'RUNNING' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', 
                    color: pod.status === 'RUNNING' ? '#34d399' : '#fbbf24',
                    border: `1px solid ${pod.status === 'RUNNING' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
                  }}>
                    {pod.status}
                  </div>
                </div>

                {/* Inner metrics panel */}
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '0.75rem', display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Cpu size={10} /> CPU</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{pod.cpu}</div>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><HardDrive size={10} /> MEMORY</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{pod.memory}</div>
                  </div>
                </div>

                {/* Meta Details Footer */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Box size={12} /> {pod.image}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Restarts: {pod.restarts}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
