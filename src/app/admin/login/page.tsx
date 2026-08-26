'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ShieldCheck, Eye, EyeOff, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        identifier: identifier.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid login credentials. Please verify your username and password.');
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Authentication failed. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f0e0c',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(200, 90, 52, 0.12) 0%, transparent 60%)',
        padding: '2rem 1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="Chef Irfan Malik Emblem"
            style={{ height: '64px', width: 'auto', margin: '0 auto 1.25rem', objectFit: 'contain' }}
          />
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Chef Irfan Malik
          </h1>
          <div
            className="font-label-caps"
            style={{
              color: 'var(--color-tertiary-fixed-dim)',
              fontSize: '11px',
              letterSpacing: '0.16em',
              marginTop: '0.35rem',
              fontWeight: 700,
            }}
          >
            Admin Control Center
          </div>
        </div>

        {/* Login Box */}
        <div
          style={{
            backgroundColor: '#1b1a17',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
            <ShieldCheck size={18} color="var(--color-tertiary-fixed-dim)" />
            <span
              className="font-label-caps"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              Master Authorization
            </span>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(224, 82, 82, 0.15)',
                border: '1px solid rgba(224, 82, 82, 0.4)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.875rem 1rem',
                color: '#ff8a8a',
                fontSize: '13px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            <div>
              <label
                className="font-label-caps"
                style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                }}
              >
                Username or Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="admin@chefirfan.com or chefirfan"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  style={{
                    width: '100%',
                    backgroundColor: '#12110f',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.8rem 1rem 0.8rem 2.6rem',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-tertiary-fixed-dim)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                />
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label
                  className="font-label-caps"
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                  }}
                >
                  Password
                </label>
                <Link
                  href="/admin/forgot-password"
                  className="font-label-caps"
                  style={{
                    color: 'var(--color-tertiary-fixed-dim)',
                    fontSize: '10px',
                    textDecoration: 'none',
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    backgroundColor: '#12110f',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.8rem 2.75rem 0.8rem 2.6rem',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-tertiary-fixed-dim)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                />
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                backgroundColor: 'var(--color-secondary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                transition: 'opacity 0.2s ease',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Control Center'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem', textAlign: 'center' }}>
            <Link
              href="/"
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0e0c', color: '#ffffff' }}>
          Loading Control Center...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
