'use client';

import { useState, useEffect, useCallback } from 'react';
import { Issue, Status, Urgency } from '@/types/issue';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PROPERTIES = [
  'All Properties',
  'Palm Jumeirah Villa A',
  'Downtown Dubai Apt 4B',
  'JBR Residence Tower 2',
  'Business Bay Suite 10',
  'Mirdif Family Home',
];

const URGENCY_OPTIONS = ['All', 'Low', 'Medium', 'High'];

const urgencyColors: Record<Urgency, { bg: string; text: string; dot: string }> = {
  Low: { bg: 'var(--green-bg)', text: 'var(--green)', dot: 'var(--green)' },
  Medium: { bg: 'var(--yellow-bg)', text: 'var(--yellow)', dot: 'var(--yellow)' },
  High: { bg: 'var(--red-bg)', text: 'var(--red)', dot: 'var(--red)' },
};

const statusColors: Record<Status, { bg: string; text: string }> = {
  Open: { bg: 'var(--red-bg)', text: 'var(--red)' },
  'In Progress': { bg: 'var(--yellow-bg)', text: 'var(--yellow)' },
  Resolved: { bg: 'var(--green-bg)', text: 'var(--green)' },
};

export default function Dashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterProperty, setFilterProperty] = useState('All Properties');
  const [filterUrgency, setFilterUrgency] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/issues');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIssues(data.issues.reverse()); // newest first
    } catch {
      setError('Failed to load issues. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  const handleStatusChange = async (ticketNumber: string, status: Status) => {
    setUpdatingId(ticketNumber);
    try {
      const res = await fetch(`/api/issues/${ticketNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      setIssues((prev) =>
        prev.map((i) =>
          i.ticketNumber === ticketNumber ? { ...i, status } : i
        )
      );
    } catch {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = issues.filter((issue) => {
    if (filterProperty !== 'All Properties' && issue.propertyName !== filterProperty) return false;
    if (filterUrgency !== 'All' && issue.urgency !== filterUrgency) return false;
    if (filterStatus !== 'All' && issue.status !== filterStatus) return false;
    return true;
  });

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-AE', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    } catch { return iso; }
  };

  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === 'Open').length,
    inProgress: issues.filter((i) => i.status === 'In Progress').length,
    resolved: issues.filter((i) => i.status === 'Resolved').length,
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fade-in"
    >
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 800, marginBottom: 6 }}>
          Issue Dashboard
        </h1>
        <p style={{ color: 'var(--muted)' }}>
          Monitor and manage all submitted maintenance requests.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total', value: stats.total, color: 'var(--accent)' },
          { label: 'Open', value: stats.open, color: '#ef4444' },
          { label: 'In Progress', value: stats.inProgress, color: '#eab308' },
          { label: 'Resolved', value: stats.resolved, color: '#22c55e' },
        ].map((s) => (
          <div
            key={s.label}
            className="glass"
            style={{
              borderRadius: 12,
              padding: '16px 20px',
            }}
          >
            <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
              {s.label}
            </p>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 28, fontWeight: 800, color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="glass"
        style={{
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Filter:
        </span>
        <select
          value={filterProperty}
          onChange={(e) => setFilterProperty(e.target.value)}
          style={{ width: 'auto', minWidth: 180 }}
        >
          {PROPERTIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value)}
          style={{ width: 'auto', minWidth: 120 }}
        >
          {URGENCY_OPTIONS.map((u) => <option key={u} value={u}>{u === 'All' ? 'All Urgencies' : u}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: 'auto', minWidth: 140 }}
        >
          {['All', 'Open', 'In Progress', 'Resolved'].map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
          ))}
        </select>
        {(filterProperty !== 'All Properties' || filterUrgency !== 'All' || filterStatus !== 'All') && (
          <button
            onClick={() => { setFilterProperty('All Properties'); setFilterUrgency('All'); setFilterStatus('All'); }}
            style={{
              padding: '8px 14px',
              borderRadius: 7,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--muted)',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'JetBrains Mono, sans-serif',
            }}
          >
            Clear ×
          </button>
        )}
        <button
          onClick={fetchIssues}
          style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            borderRadius: 7,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text)',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 600,
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: 80, color: 'var(--muted)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Loader2 className="animate-spin" size={48} color="var(--accent)" />
            </div>
            <p>Loading issues securely...</p>
          </motion.div>
        ) : error ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#ef4444' }}>
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="glass"
          style={{ borderRadius: 12, padding: 60, textAlign: 'center', color: 'var(--muted)' }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            No issues found
          </p>
          <p style={{ fontSize: 14 }}>
            {issues.length === 0 ? 'Submit your first issue to get started.' : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <motion.div 
          key="table"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="glass" style={{ borderRadius: 12, overflow: 'hidden' }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Ticket #', 'Property', 'Category', 'Urgency', 'Date Submitted', 'Status', 'Update Status'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        whiteSpace: 'nowrap',
                        background: 'var(--surface2)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <motion.tbody
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
              >
                <AnimatePresence>
                  {filtered.map((issue, idx) => (
                    <motion.tr
                      key={issue.ticketNumber}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                        transition: 'background 0.15s',
                      }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={cellStyle}>
                      <span style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 700,
                        fontSize: 13,
                        color: 'var(--accent)',
                      }}>
                        {issue.ticketNumber}
                      </span>
                    </td>
                    <td style={{ ...cellStyle, maxWidth: 180 }}>
                      <span style={{ fontSize: 13, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {issue.propertyName}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <span style={{ fontSize: 13 }}>{issue.issueCategory}</span>
                    </td>
                    <td style={cellStyle}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: urgencyColors[issue.urgency as Urgency]?.bg,
                        color: urgencyColors[issue.urgency as Urgency]?.text,
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: urgencyColors[issue.urgency as Urgency]?.dot,
                          display: 'inline-block',
                        }} />
                        {issue.urgency}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <span style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {formatDate(issue.dateSubmitted)}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: statusColors[issue.status as Status]?.bg,
                        color: statusColors[issue.status as Status]?.text,
                      }}>
                        {issue.status}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <select
                        value={issue.status}
                        disabled={updatingId === issue.ticketNumber}
                        onChange={(e) => handleStatusChange(issue.ticketNumber, e.target.value as Status)}
                        style={{
                          width: 'auto',
                          minWidth: 140,
                          padding: '7px 12px',
                          fontSize: 13,
                          opacity: updatingId === issue.ticketNumber ? 0.5 : 1,
                        }}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </motion.tr>
                ))}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <p style={{ marginTop: 16, color: 'var(--muted)', fontSize: 13, textAlign: 'right' }}>
        Showing {filtered.length} of {issues.length} issues
      </p>
    </motion.div>
  );
}

const cellStyle: React.CSSProperties = {
  padding: '14px 16px',
  verticalAlign: 'middle',
};