'use client';

import { useState } from 'react';
import {
  ShieldCheck, Lock, KeyRound, CheckCircle2,
  AlertCircle, Eye, EyeOff, ShieldAlert, Laptop
} from 'lucide-react';

interface Props {
  user: any;
}

export default function SecuritySettingsForm({ user }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password update failed');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Master password updated successfully!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--color-primary)',
            color: '#ffffff',
            padding: '0.875rem 1.5rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            fontSize: '13px',
            fontWeight: 600,
            borderLeft: '4px solid var(--color-tertiary-fixed-dim)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={17} color="var(--color-tertiary-fixed-dim)" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="font-label-caps" style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.25rem' }}>
          Platform Security &amp; Credentials
        </span>
        <h1 className="font-headline-md" style={{ color: 'var(--color-primary)', margin: 0 }}>
          Security &amp; Password Management
        </h1>
        <p className="font-body-md" style={{ color: 'var(--color-text-muted)', marginTop: '0.35rem', maxWidth: '640px' }}>
          Update your administrator credentials, manage active sessions, and review security preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Change Password Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '2rem',
            boxShadow: 'var(--shadow-ambient)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.875rem' }}>
            <KeyRound size={18} color="var(--color-secondary)" />
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              Update Master Password
            </h2>
          </div>

          {error && (
            <div style={{ background: 'rgba(224,82,82,0.1)', color: 'var(--color-error)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Current Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter existing password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer' }}
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>New Password (min 6 chars) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter strong new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer' }}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Confirm New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Repeat new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', justifyContent: 'center' }}
            >
              {loading ? 'Verifying & Updating...' : 'Save New Password'}
            </button>
          </form>
        </div>

        {/* Active Session & Security Overview Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-ambient)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Laptop size={18} color="var(--color-secondary)" />
              <h3 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '16px' }}>
                Active Administrator Session
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Authenticated User:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{user?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Email:</span>
                <span style={{ fontFamily: 'monospace' }}>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Role Privilege:</span>
                <span className="badge badge-premium">{user?.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Session Security:</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>● JWT (Encrypted HttpOnly)</span>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface-low)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={17} color="var(--color-secondary)" />
              <span className="font-label-caps" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '11px' }}>
                Security Best Practices
              </span>
            </div>
            <p className="font-body-md" style={{ color: 'var(--color-text-muted)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
              Keep your administrator credentials confidential. Use strong alphanumeric combinations with special symbols. Always sign out after finishing administrative tasks on shared devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
