'use client';

import { useState } from 'react';
import {
  ShieldCheck, UserPlus, Trash2, Edit2, KeyRound,
  CheckCircle2, AlertCircle, X, User, Mail, Lock, Shield
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface Props {
  initialUsers: AdminUser[];
  currentUserId: string;
}

export default function UsersManager({ initialUsers, currentUserId }: Props) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create admin');
      }

      setUsers([data.user, ...users]);
      setModalOpen(false);
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      showToast(`Administrator "${data.user.name}" created successfully!`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'SUPER_ADMIN' | 'ADMIN') => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');

      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      showToast(`Role updated to ${newRole}`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      setPasswordModalOpen(false);
      setNewPassword('');
      setSelectedUser(null);
      showToast(`Password for ${selectedUser.name} updated successfully!`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to revoke and delete administrator access for ${userName}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setUsers(users.filter((u) => u.id !== userId));
      showToast(`Administrator ${userName} removed.`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Deletion failed');
    }
  };

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span className="font-label-caps" style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.25rem' }}>
            Access Control &amp; Governance
          </span>
          <h1 className="font-headline-md" style={{ color: 'var(--color-primary)', margin: 0 }}>
            Administrator Accounts
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-text-muted)', marginTop: '0.35rem', maxWidth: '640px' }}>
            Manage authorized staff accounts, role levels, credentials, and access permissions for the Chef Irfan Malik platform.
          </p>
        </div>

        <button
          onClick={() => {
            setError('');
            setModalOpen(true);
          }}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <UserPlus size={14} /> + Add Administrator
        </button>
      </div>

      {/* Table Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-ambient)',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              className="font-label-caps"
              style={{
                backgroundColor: 'var(--color-surface-low)',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                fontSize: '10px',
              }}
            >
              <th style={{ padding: '0.875rem 1.25rem' }}>Administrator</th>
              <th style={{ padding: '0.875rem 1.25rem' }}>Username</th>
              <th style={{ padding: '0.875rem 1.25rem' }}>Email Address</th>
              <th style={{ padding: '0.875rem 1.25rem' }}>Role Privilege</th>
              <th style={{ padding: '0.875rem 1.25rem' }}>Created Date</th>
              <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody className="font-body-md" style={{ fontSize: '13px' }}>
            {users.map((u) => {
              const isSuper = u.role === 'SUPER_ADMIN';
              const isSelf = u.id === currentUserId;

              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isSuper ? 'var(--color-primary)' : 'var(--color-surface-container)',
                          color: isSuper ? '#ffffff' : 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px',
                        }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                          {u.name} {isSelf && <span style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>(You)</span>}
                        </div>
                        <div className="font-label-caps" style={{ fontSize: '9px', color: 'var(--color-text-subtle)' }}>
                          Active Status
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', color: 'var(--color-text)' }}>
                    @{u.username}
                  </td>

                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)' }}>
                    {u.email}
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <select
                      value={u.role}
                      disabled={isSelf}
                      onChange={(e) => handleUpdateRole(u.id, e.target.value as any)}
                      className="font-label-caps"
                      style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '10px',
                        border: '1px solid var(--color-border)',
                        background: isSuper ? 'var(--color-surface-high)' : '#ffffff',
                        color: isSuper ? 'var(--color-primary)' : 'var(--color-text)',
                        fontWeight: 700,
                        cursor: isSelf ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-subtle)', fontSize: '12px' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setNewPassword('');
                          setError('');
                          setPasswordModalOpen(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-secondary)',
                          cursor: 'pointer',
                          padding: '0.25rem',
                        }}
                        title="Reset Password"
                      >
                        <KeyRound size={15} />
                      </button>

                      {!isSelf && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-error)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                          }}
                          title="Delete Admin"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Modal: Add Admin ────────────────────────────────────────── */}
      {modalOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 300,
            }}
            onClick={() => setModalOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(92vw, 480px)',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              zIndex: 310,
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-headline-sm" style={{ margin: 0, color: 'var(--color-primary)' }}>
                Add New Administrator
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(224,82,82,0.1)', color: 'var(--color-error)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Ali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. asadali"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Role Level</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="asad@chefirfan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Temporary Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Modal: Reset Password ───────────────────────────────────── */}
      {passwordModalOpen && selectedUser && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 300,
            }}
            onClick={() => setPasswordModalOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(92vw, 440px)',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              zIndex: 310,
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-headline-sm" style={{ margin: 0, color: 'var(--color-primary)' }}>
                Reset Admin Password
              </h3>
              <button
                onClick={() => setPasswordModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Setting a new password for <strong>{selectedUser.name}</strong> ({selectedUser.email}).
            </p>

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>New Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••••••"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setPasswordModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
