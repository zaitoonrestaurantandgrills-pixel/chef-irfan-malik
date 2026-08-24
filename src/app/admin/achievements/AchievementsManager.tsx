'use client';

import { useState } from 'react';
import { Plus, Trash2, Trophy, Award, Medal } from 'lucide-react';
import type { Achievement } from '@prisma/client';

export default function AchievementsManager({ initialItems }: { initialItems: Achievement[] }) {
  const [items, setItems] = useState<Achievement[]>(initialItems);
  const [form, setForm] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
    image: '',
    type: 'AWARD' as 'AWARD' | 'CERTIFICATION' | 'COMPETITION' | 'RECOGNITION' | 'MEDIA_FEATURE' | 'TRAINING',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add achievement');

      setItems([...items, data.item]);
      setForm({ title: '', organization: '', date: '', description: '', image: '', type: 'AWARD' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error adding item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      const res = await fetch(`/api/admin/achievements?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setItems(items.filter((it) => it.id !== id));
    } catch (err) {
      alert('Failed to delete achievement');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem', alignItems: 'start' }}>
      {/* Add Form */}
      <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <Plus size={18} /> Add Recognition
        </h2>

        {error && (
          <div style={{ background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--color-error)', fontSize: '0.825rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Title / Honor *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Master Chef Award 2024"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Awarding Body / Organization</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Culinary Guild of Pakistan"
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
            >
              <option value="AWARD">Culinary Award</option>
              <option value="CERTIFICATION">Certification</option>
              <option value="COMPETITION">Cooking Competition</option>
              <option value="RECOGNITION">Professional Recognition</option>
              <option value="MEDIA_FEATURE">Media Feature / TV Appearance</option>
              <option value="TRAINING">Executive Training</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date (Optional)</label>
            <input
              type="date"
              className="form-input"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Summary</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Provide context regarding this award or certification..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
            {loading ? 'Adding...' : 'Save Achievement'}
          </button>
        </form>
      </div>

      {/* List */}
      <div>
        {items.length === 0 ? (
          <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Trophy size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-text-subtle)', display: 'block' }} />
            No achievements added yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item.id} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Trophy size={22} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700 }}>
                        {item.title}
                      </h3>
                      <span className="badge badge-premium" style={{ fontSize: '0.65rem' }}>
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>
                    {item.organization && (
                      <div style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                        {item.organization}
                      </div>
                    )}
                    {item.description && (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--color-error)',
                    cursor: 'pointer', padding: '0.5rem'
                  }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 860px) {
          div[style*="grid-template-columns: 380px 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
