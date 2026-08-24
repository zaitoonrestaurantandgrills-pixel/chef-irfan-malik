'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChefHat, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate reset link dispatch
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '2rem' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChefHat size={22} color="#0A0A0A" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)' }}>Chef Irfan Malik</div>
        </Link>

        <div className="card" style={{ padding: '2.5rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle2 size={52} style={{ color: 'var(--color-success)', margin: '0 auto 1rem', display: 'block' }} />
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-success)' }}>
                Check Your Email
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                If an account exists for <strong style={{ color: 'var(--color-text)' }}>{email}</strong>, we have sent instructions to reset your password.
              </p>
              <Link href="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
                Reset Password
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
                Enter your account email address to receive password reset instructions.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link href="/login" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} className="hover-gold">
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
