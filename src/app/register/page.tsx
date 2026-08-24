'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ChefHat, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                                    e.name = 'Name is required';
    if (!form.username.match(/^[a-zA-Z0-9_]{3,20}$/))       e.username = 'Username: 3-20 chars, letters/numbers/underscore only';
    if (!form.email.includes('@'))                            e.email = 'Valid email required';
    if (form.password.length < 8)                            e.password = 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(form.password))                        e.password = 'Password must have at least one uppercase letter';
    if (!/[0-9]/.test(form.password))                        e.password = 'Password must have at least one number';
    if (form.password !== form.confirmPassword)               e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setServerError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, username: form.username, email: form.email, password: form.password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setServerError(data.error || 'Registration failed');
      setLoading(false);
      return;
    }

    // Auto sign in after registration
    const signInResult = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (signInResult?.ok) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)',
      backgroundImage: 'radial-gradient(circle at 70% 60%, rgba(201,168,76,0.07) 0%, transparent 50%)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '2.5rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-gold)',
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
            Create Account
          </h1>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Join Chef Irfan&apos;s culinary community
          </p>

          {serverError && (
            <div style={{
              background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)',
              borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem',
              color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '1.5rem',
            }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" className="form-input" placeholder="Your full name"
                value={form.name} onChange={handleChange} required />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input id="username" name="username" type="text" className="form-input" placeholder="yourhandle"
                value={form.username} onChange={handleChange} required />
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" className="form-input" placeholder="your@email.com"
                value={form.email} onChange={handleChange} required />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input id="password" name="password" type={showPw ? 'text' : 'password'} className="form-input"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  value={form.password} onChange={handleChange} required style={{ paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex',
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className="form-input"
                placeholder="Repeat your password"
                value={form.confirmPassword} onChange={handleChange} required />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid #0A0A0A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Creating account...
                </span>
              ) : (
                <><UserPlus size={17} /> Create Account</>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
