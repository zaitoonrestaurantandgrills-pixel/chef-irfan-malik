'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ChefHat, Eye, EyeOff, LogIn } from 'lucide-react';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)',
      backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(201,168,76,0.07) 0%, transparent 50%)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '2.5rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-gold)',
          }}>
            <ChefHat size={24} color="#0A0A0A" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)' }}>Chef Irfan Malik</div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Crafting Flavors</div>
          </div>
        </Link>

        {/* Card */}
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)', padding: '2.5rem',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Sign in to access your recipes and dashboard
          </p>

          {error && (
            <div style={{
              background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)',
              borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem',
              color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '1.5rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex',
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid #0A0A0A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : (
                <><LogIn size={17} /> Sign In</>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Don&apos;t have an account?{' '}
              <Link href={`/register${callbackUrl !== '/dashboard' ? `?callbackUrl=${callbackUrl}` : ''}`}
                style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: '1.25rem', background: 'rgba(201,168,76,0.06)', border: '1px solid var(--color-border-gold)',
          borderRadius: 'var(--radius-md)', padding: '0.875rem 1.25rem', fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
        }}>
          <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.375rem' }}>🔧 Dev Mode</div>
          Admin: <code style={{ color: 'var(--color-text)' }}>admin@chefirfan.com</code> / <code style={{ color: 'var(--color-text)' }}>Admin@123</code>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
