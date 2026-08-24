'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit message');

      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting message');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', border: '1px solid rgba(76,175,120,0.3)' }}>
        <CheckCircle2 size={56} style={{ color: 'var(--color-success)', margin: '0 auto 1rem', display: 'block' }} />
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-success)' }}>
          Message Sent!
        </h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Thank you for reaching out. Chef Irfan&apos;s team will get back to you shortly.
        </p>
        <button onClick={() => setSuccess(false)} className="btn btn-secondary btn-sm">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '2.25rem' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '1.5rem', color: 'var(--color-text)' }}>
        Send a Message
      </h2>

      {error && (
        <div style={{ background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Phone / WhatsApp</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+92 300 0000000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Masterclass Inquiry"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Message *</label>
          <textarea
            className="form-input"
            rows={5}
            placeholder="Write your message or inquiry here..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ justifyContent: 'center' }}>
          {loading ? 'Sending...' : (
            <>
              <Send size={16} /> Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
