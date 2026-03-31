'use client';

import Dashboard from '@/components/Dashboard';
import SubmitForm from '@/components/SubmitForm';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [activeView, setActiveView] = useState<'submit' | 'dashboard'>('submit');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleIssueSubmitted = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header
        className="glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid var(--border)',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              🔧
            </div>
            <span
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: '-0.3px',
              }}
            >
              Maintenance<span style={{ color: 'var(--accent)' }}>IQ</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Nav Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 4,
              background: 'var(--surface2)',
              padding: 4,
              borderRadius: 10,
              border: '1px solid var(--border)',
            }}
          >
            {(['submit', 'dashboard'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                style={{
                  padding: '7px 18px',
                  borderRadius: 7,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  fontSize: 13,
                  transition: 'all 0.2s',
                  background:
                    activeView === view
                      ? 'linear-gradient(135deg, #f97316, #ea580c)'
                      : 'transparent',
                  color: activeView === view ? 'white' : 'var(--muted)',
                }}
              >
                {view === 'submit' ? '+ Submit Issue' : '📋 Dashboard'}
              </button>
            ))}
          </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'submit' ? (
              <SubmitForm
                onSubmitted={handleIssueSubmitted}
                onViewDashboard={() => setActiveView('dashboard')}
              />
            ) : (
              <Dashboard key={`dashboard-${refreshKey}`} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}