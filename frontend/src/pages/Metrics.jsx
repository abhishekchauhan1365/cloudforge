import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Activity, Layers, DollarSign, Users, CheckCircle, RefreshCw, TrendingUp, Search } from 'lucide-react';

const WEEK_DATA = [
  { day: 'Mon', provisioned: 4, destroyed: 2 },
  { day: 'Tue', provisioned: 3, destroyed: 1 },
  { day: 'Wed', provisioned: 7, destroyed: 5 },
  { day: 'Thu', provisioned: 5, destroyed: 3 },
  { day: 'Fri', provisioned: 8, destroyed: 6 },
  { day: 'Sat', provisioned: 2, destroyed: 2 },
  { day: 'Sun', provisioned: 1, destroyed: 0 },
];

const LOAD_DATA = [
  { time: '00:00', cpu: 22, memory: 41 }, { time: '04:00', cpu: 18, memory: 39 },
  { time: '08:00', cpu: 45, memory: 55 }, { time: '12:00', cpu: 72, memory: 68 },
  { time: '16:00', cpu: 65, memory: 62 }, { time: '20:00', cpu: 38, memory: 52 },
  { time: '23:59', cpu: 28, memory: 45 },
];

const COST_DATA = WEEK_DATA.map((d, i) => ({ ...d, cost: +(1.5 + i * 0.4 + (i % 3) * 0.3).toFixed(2) }));

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const TOOLTIP_STYLE = {
  contentStyle: { background: '#0c1020', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '10px', fontSize: '0.78rem', color: '#f0f4ff', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
  cursor: { fill: 'rgba(99,102,241,0.05)' },
};

function KpiRow({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
      style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-faint)' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${color}12`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>{label}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 900, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      </div>
      {sub && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right' }}>{sub}</div>}
    </motion.div>
  );
}

export default function Metrics() {
  const [stats, setStats] = useState({ total_environments: 0, active_environments: 0, total_users: 0, monthly_estimated_cost: 0, provision_success_rate: 98.5 });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    setRefreshing(true);
    try { const res = await api.get('/dashboard/stats'); setStats(res.data); }
    catch { /* backend not connected yet */ }
    setRefreshing(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const pieData = [
    { name: 'Running',      value: Math.max(1, stats.active_environments) },
    { name: 'Provisioning', value: Math.max(1, Math.round(stats.total_environments * 0.1)) },
    { name: 'Destroyed',    value: Math.max(0, stats.total_environments - stats.active_environments) },
  ].filter(d => d.value > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={17} color="#fff" />
            </div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
              Platform <span className="gradient-text">Metrics</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Real-time observability across your CloudForge infrastructure.</p>
        </div>
        <button onClick={fetchStats} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} /> Refresh
        </button>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }}>
        {/* Left KPIs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={14} color="var(--brand-light)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Key Indicators</span>
            </div>
            <KpiRow icon={Layers}      label="Total Environments"  value={stats.total_environments}                            sub="all time"   color="var(--brand-light)" delay={0.12} />
            <KpiRow icon={Activity}    label="Active Now"          value={stats.active_environments}                           sub="running"    color="var(--success)"     delay={0.16} />
            <KpiRow icon={Users}       label="Total Users"         value={stats.total_users}                                   sub="registered" color="#60a5fa"            delay={0.20} />
            <KpiRow icon={DollarSign}  label="Estimated Cost"      value={`$${(stats.monthly_estimated_cost||0).toFixed(2)}`}  sub="lifetime"   color="var(--warning)"     delay={0.24} />
            <KpiRow icon={CheckCircle} label="Success Rate"        value={`${stats.provision_success_rate}%`}                  sub="provisions" color="var(--success)"     delay={0.28} />
          </motion.div>

          {/* Pie */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="card">
            <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={13} color="var(--brand-light)" /> Environment Status
            </div>
            <div style={{ height: '190px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE.contentStyle} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Bar */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card">
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Environments — Last 7 Days</span>
            </div>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEK_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
                  <XAxis dataKey="day" stroke="#4a5270" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#4a5270" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Bar dataKey="provisioned" fill="#6366f1" radius={[5,5,0,0]} name="Provisioned" />
                  <Bar dataKey="destroyed"   fill="#ef4444" radius={[5,5,0,0]} name="Destroyed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Area */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card">
            <div style={{ marginBottom: '1.25rem', fontWeight: 700, fontSize: '0.88rem' }}>System Load — 24h (Simulated)</div>
            <div style={{ height: '190px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={LOAD_DATA}>
                  <defs>
                    <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
                  <XAxis dataKey="time" stroke="#4a5270" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#4a5270" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={30} unit="%" />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="cpu"    name="CPU %"    stroke="#6366f1" fill="url(#cpuGrad)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="memory" name="Memory %"  stroke="#10b981" fill="url(#memGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Line */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="card">
            <div style={{ marginBottom: '1.25rem', fontWeight: 700, fontSize: '0.88rem' }}>Daily Cost Estimate (Simulated)</div>
            <div style={{ height: '160px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={COST_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
                  <XAxis dataKey="day" stroke="#4a5270" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#4a5270" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={34} unit="$" />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="cost" name="Cost $" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
