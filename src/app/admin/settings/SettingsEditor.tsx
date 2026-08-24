'use client';

import { useState } from 'react';
import { Save, Check, Globe, Share2, Mail, Info } from 'lucide-react';
import type { SiteSettings } from '@prisma/client';

export default function SettingsEditor({ initialSettings }: { initialSettings: SiteSettings }) {
  const [form, setForm] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating settings');
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
          <Check size={16} /> Settings saved successfully!
        </div>
      )}

      {/* Chef Identity */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
          Chef Identity & Branding
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Chef Full Name</label>
            <input
              type="text"
              className="form-input"
              value={form.chefName}
              onChange={(e) => setForm({ ...form, chefName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand Tagline</label>
            <input
              type="text"
              className="form-input"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Profile / Headshot Image URL</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://... or /chef-profile.jpg"
              value={form.profileImage || ''}
              onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Hero / Banner Image URL</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://... or /hero-banner.jpg"
              value={form.heroImage || ''}
              onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Professional Biography</label>
            <textarea
              className="form-input"
              rows={4}
              value={form.biography || ''}
              onChange={(e) => setForm({ ...form, biography: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Social & Contact */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
          Social Media & Contact Information
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Official Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="chef@chefirfan.com"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Official Phone / WhatsApp</label>
            <input
              type="text"
              className="form-input"
              placeholder="+92 300 0000000"
              value={form.phone || ''}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instagram Profile URL</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://instagram.com/chefirfan"
              value={form.instagram || ''}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">YouTube Channel URL</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://youtube.com/@chefirfan"
              value={form.youtube || ''}
              onChange={(e) => setForm({ ...form, youtube: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Facebook Page URL</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://facebook.com/chefirfan"
              value={form.facebook || ''}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Twitter / X URL</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://x.com/chefirfan"
              value={form.twitter || ''}
              onChange={(e) => setForm({ ...form, twitter: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* SEO & Meta */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
          SEO & Search Metadata
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Global SEO Title</label>
            <input
              type="text"
              className="form-input"
              value={form.seoTitle || ''}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Global SEO Meta Description</label>
            <textarea
              className="form-input"
              rows={2}
              value={form.seoDescription || ''}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
