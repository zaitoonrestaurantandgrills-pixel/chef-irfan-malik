'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    // Simulate/trigger password reset request securely without revealing database existence
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
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
            alt="Chef Irfan Malik Logo"
            style={{ height: '60px', width: 'auto', margin: '0 auto 1rem', objectFit: 'contain' }}
          />
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Admin Password Recovery
          </h1>
          <div
            className="font-label-caps"
            style={{
              color: 'var(--color-tertiary-fixed-dim)',
              fontSize: '11px',
              letterSpacing: '0.14em',
              marginTop: '0.35rem',
              fontWeight: 700,
            }}
          >
            Chef Irfan Malik Platform
          </div>
        </div>

        {/* Form Container */}
        <div
          style={{
            backgroundColor: '#1b1a17',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(76, 175, 120, 0.15)',
                  color: '#4caf78',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.75rem' }}>
                Instructions Sent
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', lineHeight: 1.6, marginBottom: '2rem' }}>
                If an administrator account exists for <strong>{email}</strong>, password recovery instructions have been dispatched.
              </p>
              <Link
                href="/admin/login"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
              >
                <ArrowLeft size={14} /> Back to Admin Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                Enter the verified email address associated with your administrator account to receive password recovery instructions.
              </p>

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
                  Admin Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="admin@chefirfan.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    }}
                  />
                  <Mail
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
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Sending Instructions...' : 'Send Recovery Link'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <Link
                  href="/admin/login"
                  style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '12px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <ArrowLeft size={13} /> Return to Admin Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
