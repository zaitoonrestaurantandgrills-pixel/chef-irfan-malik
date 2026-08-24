'use client';

import { useState } from 'react';
import { Save, Check, Lock, User, Shield } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

export default function ProfileEditor({ user }: { user: UserProfile }) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          username,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {error && (
        <div style={{ background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', color: 'var(--color-error)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: 'rgba(76,175,120,0.1)', border: '1px solid rgba(76,175,120,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', color: 'var(--color-success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={16} /> Profile updated successfully!
        </div>
      )}

      {/* Basic details */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <User size={18} /> Personal Details
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              className="form-input"
              value={user.email}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <Lock size={18} /> Change Password
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Leave blank if you do not want to change your password.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          <Save size={18} /> {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
