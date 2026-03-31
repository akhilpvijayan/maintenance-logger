'use client';

import { useState, useRef } from 'react';
import { IssueCategory, Urgency } from '@/types/issue';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PROPERTIES = [
  'Palm Jumeirah Villa A',
  'Downtown Dubai Apt 4B',
  'JBR Residence Tower 2',
  'Business Bay Suite 10',
  'Mirdif Family Home',
];

const CATEGORIES: IssueCategory[] = [
  'Plumbing',
  'Electrical',
  'AC/HVAC',
  'Furniture',
  'Cleaning',
  'Other',
];

const URGENCIES: Urgency[] = ['Low', 'Medium', 'High'];

interface Props {
  onSubmitted: () => void;
  onViewDashboard: () => void;
}

export default function SubmitForm({ onSubmitted, onViewDashboard }: Props) {
  const [form, setForm] = useState({
    propertyName: '',
    issueCategory: '' as IssueCategory | '',
    urgency: '' as Urgency | '',
    description: '',
    photoURL: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.propertyName) e.propertyName = 'Please select a property';
    if (!form.issueCategory) e.issueCategory = 'Please select a category';
    if (!form.urgency) e.urgency = 'Please select urgency level';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.description.trim().length < 10)
      e.description = 'Description must be at least 10 characters';
    return e;
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'File must be under 5MB' }));
      return;
    }
    setPhotoName(file.name);
    setErrors((prev) => ({ ...prev, photo: '' }));
    // For simplicity, store filename. In production, upload to storage.
    setForm((prev) => ({ ...prev, photoURL: `[Uploaded: ${file.name}]` }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setTicket(data.issue.ticketNumber);
      onSubmitted();
    } catch (err: unknown) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to submit. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      propertyName: '',
      issueCategory: '' as IssueCategory | '',
      urgency: '' as Urgency | '',
      description: '',
      photoURL: '',
    });
    setErrors({});
    setTicket(null);
    setPhotoName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  // Success State
  if (ticket) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fade-in"
        style={{
          maxWidth: 520,
          margin: '60px auto',
          textAlign: 'center',
        }}
      >
        <div
          className="glass ticket-success"
          style={{
            borderRadius: 20,
            padding: 48,
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Issue Submitted!
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
            Your maintenance request has been logged successfully.
          </p>
          <div
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '16px 24px',
              marginBottom: 32,
            }}
          >
            <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>
              TICKET NUMBER
            </p>
            <p
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--accent)',
                letterSpacing: '2px',
              }}
            >
              {ticket}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={handleReset}
              style={{
                padding: '11px 22px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text)',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Submit Another
            </button>
            <button className="btn-primary" onClick={onViewDashboard}>
              View Dashboard →
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ maxWidth: 640, margin: '0 auto' }} 
      className="fade-in"
    >
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          Report an Issue
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15 }}>
          Submit a maintenance request and track it through resolution.
        </p>
      </div>

      <div
        className="glass"
        style={{ borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', gap: 22 }}
      >
        {/* Property */}
        <div>
          <label style={labelStyle}>
            Property Name <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <select
            value={form.propertyName}
            onChange={(e) => {
              setForm((p) => ({ ...p, propertyName: e.target.value }));
              setErrors((p) => ({ ...p, propertyName: '' }));
            }}
          >
            <option value="">— Select Property —</option>
            {PROPERTIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.propertyName && <p style={errorStyle}>{errors.propertyName}</p>}
        </div>

        {/* Category */}
        <div>
          <label style={labelStyle}>
            Issue Category <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <select
            value={form.issueCategory}
            onChange={(e) => {
              setForm((p) => ({ ...p, issueCategory: e.target.value as IssueCategory }));
              setErrors((p) => ({ ...p, issueCategory: '' }));
            }}
          >
            <option value="">— Select Category —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.issueCategory && <p style={errorStyle}>{errors.issueCategory}</p>}
        </div>

        {/* Urgency */}
        <div>
          <label style={labelStyle}>
            Urgency Level <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {URGENCIES.map((u) => {
              const colors: Record<Urgency, string> = {
                Low: 'var(--green)',
                Medium: 'var(--yellow)',
                High: 'var(--red)',
              };
              const selected = form.urgency === u;
              return (
                <label
                  key={u}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: `1px solid ${selected ? colors[u] : 'var(--border)'}`,
                    background: selected ? `${colors[u]}18` : 'var(--surface2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: 600,
                    fontSize: 14,
                    color: selected ? colors[u] : 'var(--muted)',
                  }}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={u}
                    checked={selected}
                    onChange={() => {
                      setForm((p) => ({ ...p, urgency: u }));
                      setErrors((p) => ({ ...p, urgency: '' }));
                    }}
                    style={{ display: 'none' }}
                  />
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: colors[u], display: 'inline-block'
                  }} />
                  {u}
                </label>
              );
            })}
          </div>
          {errors.urgency && <p style={errorStyle}>{errors.urgency}</p>}
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>
            Description <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Describe the issue in detail — location, symptoms, when it started..."
            value={form.description}
            onChange={(e) => {
              setForm((p) => ({ ...p, description: e.target.value }));
              setErrors((p) => ({ ...p, description: '' }));
            }}
            style={{ resize: 'vertical', minHeight: 100 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {errors.description
              ? <p style={errorStyle}>{errors.description}</p>
              : <span />
            }
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              {form.description.length} chars
            </span>
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label style={labelStyle}>Photo Upload (Optional)</label>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${photoName ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 8,
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: photoName ? 'var(--hover-bg)' : 'var(--surface2)',
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              style={{ display: 'none' }}
            />
            {photoName ? (
              <div style={{ color: 'var(--accent)', fontWeight: 500 }}>
                📎 {photoName}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 24, marginBottom: 6 }}>📷</div>
                <div style={{ color: 'var(--muted)', fontSize: 14 }}>
                  Click to upload a photo (max 5MB)
                </div>
              </div>
            )}
          </div>
          {errors.photo && <p style={errorStyle}>{errors.photo}</p>}
        </div>

        {errors.submit && (
          <div
            style={{
              background: 'var(--red-bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 16px',
              color: 'var(--red)',
              fontSize: 14,
            }}
          >
            ⚠️ {errors.submit}
          </div>
        )}

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '14px', fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Submitting...
            </>
          ) : 'Submit Issue →'}
        </button>
      </div>
    </motion.div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Rajdhani, sans-serif',
  fontWeight: 600,
  fontSize: 13,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: 8,
};

const errorStyle: React.CSSProperties = {
  color: 'var(--red)',
  fontSize: 12,
  marginTop: 5,
};