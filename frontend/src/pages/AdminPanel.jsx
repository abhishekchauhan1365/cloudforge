import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Users, Shield, Server, List, RefreshCw, Search, Calendar, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [uRes, eRes, lRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/environments'),
        api.get('/admin/audit/logs?limit=40')
      ]);
      setUsers(uRes.data);
      setEnvironments(eRes.data);
      setLogs(lRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEnvs = environments.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.instance_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
              <Shield size={17} color="#fff" style={{ margin: 'auto' }} />
            </div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
              Admin <span className="gradient-text">Panel</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>System-wide operations, audit logging, user role management, and environment oversight.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search users or environments..."
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchData} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
        </div>
      </motion.div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Users Table */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={15} color="var(--brand-light)" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>User Directory</span>
            <span className="tag" style={{ marginLeft: 'auto' }}>{filteredUsers.length} total</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No matching users found</td>
                  </tr>
                ) : filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-light)' }}>
                          {u.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.username}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-developer'}`}>{u.role}</span>
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Environments Table */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={15} color="var(--brand-light)" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Environment Overview</span>
            <span className="tag" style={{ marginLeft: 'auto' }}>{filteredEnvs.length} active</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Environment</th>
                  <th>Instance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnvs.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No environments found</td>
                  </tr>
                ) : filteredEnvs.map(e => (
                  <tr key={e.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Est. cost: ${(e.cost || 0).toFixed(2)}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        <Cpu size={11} color="var(--brand-light)" /> {e.instance_type}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${e.status === 'RUNNING' ? 'badge-running' : e.status === 'PROVISIONING' ? 'badge-provisioning' : e.status === 'DESTROYED' ? 'badge-destroyed' : 'badge-destroying'}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Audit Logs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <List size={15} color="var(--brand-light)" />
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Global Audit Logs</span>
          <span className="tag" style={{ marginLeft: 'auto' }}>Last 40 events</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No audit events found</td>
                </tr>
              ) : logs.map(l => {
                const isFail = l.status?.toLowerCase() === 'failed';
                return (
                  <tr key={l.id}>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={11} /> {l.timestamp ? new Date(l.timestamp).toLocaleString() : 'N/A'}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.action}</td>
                    <td className="mono" style={{ fontSize: '0.75rem' }}>{l.resource}</td>
                    <td>
                      <span className={`badge ${isFail ? 'badge-destroying' : 'badge-running'}`}>
                        {isFail ? <AlertTriangle size={10} style={{ marginRight: '0.2rem' }} /> : <CheckCircle size={10} style={{ marginRight: '0.2rem' }} />}
                        {l.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
