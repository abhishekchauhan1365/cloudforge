import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [environments, setEnvironments] = useState([]);
  const [stats, setStats] = useState({ total_environments: 0, active_environments: 0, total_users: 0, monthly_estimated_cost: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [envName, setEnvName] = useState('');

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [envRes, statsRes] = await Promise.all([
        api.get('/environment/all'),
        api.get('/dashboard/stats')
      ]);
      setEnvironments(envRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleProvision = async (e) => {
    e.preventDefault();
    if (!envName) return;
    try {
      setProvisioning(true);
      await api.post('/environment/provision', {
        environment_name: envName,
        instance_type: 't2.micro'
      });
      setEnvName('');
      fetchData();
    } catch (err) {
      alert('Failed to provision');
    } finally {
      setProvisioning(false);
    }
  };

  const handleDestroy = async (id) => {
    if (!window.confirm('Destroy this environment?')) return;
    try {
      await api.post('/environment/destroy', { environment_id: id });
      fetchData();
    } catch {
      alert('Failed to destroy');
    }
  };

  return (
    <div style={{ padding: '2rem', color: '#fff', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Welcome, {user?.username}</h1>
      <p style={{ color: '#aaa' }}>This is your real-time infrastructure dashboard. No fake data, strictly real metrics.</p>
      
      {/* Real-time Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Environments</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>{stats.total_environments}</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#064e3b', border: '1px solid #065f46', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.85rem', color: '#a7f3d0', textTransform: 'uppercase' }}>Active Servers</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399' }}>{stats.active_environments}</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#4c1d95', border: '1px solid #5b21b6', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.85rem', color: '#ddd6fe', textTransform: 'uppercase' }}>Total Users</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a78bfa' }}>{stats.total_users}</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#7f1d1d', border: '1px solid #991b1b', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.85rem', color: '#fecaca', textTransform: 'uppercase' }}>Est. Total Cost</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f87171' }}>${stats.monthly_estimated_cost.toFixed(2)}/hr</div>
        </div>
      </div>

      <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
        <h3>Provision New Environment</h3>
        <form onSubmit={handleProvision} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="Environment Name (e.g. prod-server)" 
            value={envName}
            onChange={e => setEnvName(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', background: '#000', color: '#fff', width: '300px' }}
          />
          <button type="submit" disabled={provisioning || !envName} style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {provisioning ? 'Starting Pipeline...' : 'Deploy via Jenkins'}
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem' }}>
        <h2>Live Server Status ({environments.length})</h2>
        <button onClick={fetchData} style={{ padding: '0.5rem 1rem', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}>
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {environments.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#111', border: '1px dashed #333', borderRadius: '8px', marginTop: '1rem', color: '#888' }}>
          No environments provisioned yet in the database.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {environments.map(env => (
            <div key={env.id} style={{ padding: '1.5rem', background: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{env.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#aaa', fontFamily: 'monospace' }}>Instance: {env.instance_type} | ID: {env.id}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <span style={{ 
                  padding: '0.35rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  background: env.status === 'RUNNING' ? '#065f46' : env.status === 'PROVISIONING' ? '#92400e' : '#7f1d1d',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {env.status}
                </span>
                <button 
                  onClick={() => handleDestroy(env.id)}
                  disabled={env.status === 'DESTROYING' || env.status === 'DESTROYED'}
                  style={{ padding: '0.5rem 1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Destroy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
