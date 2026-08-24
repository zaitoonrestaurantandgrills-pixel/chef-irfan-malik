'use client';

import { useState } from 'react';
import { Plus, Trash2, Star, MessageSquare } from 'lucide-react';
import type { Testimonial } from '@prisma/client';

export default function TestimonialsManager({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = useState<Testimonial[]>(initialItems);
  const [form, setForm] = useState({
    customerName: '',
    rating: 5,
    content: '',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.content) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add testimonial');

      setItems([data.item, ...items]);
      setForm({ customerName: '', rating: 5, content: '', status: 'PUBLISHED' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error adding testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setItems(items.filter((it) => it.id !== id));
    } catch (err) {
      alert('Failed to delete testimonial');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem', alignItems: 'start' }}>
      {/* Add Form */}
      <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <Plus size={18} /> Add Testimonial
        </h2>

        {error && (
          <div style={{ background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--color-error)', fontSize: '0.825rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Ayesha Khan"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Star Rating (1-5)</label>
            <select
              className="form-input"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })}
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Testimonial Review *</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="What did the customer say about Chef Irfan's recipes and masterclasses?"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
            >
              <option value="PUBLISHED">Published (Visible)</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
            {loading ? 'Adding...' : 'Publish Testimonial'}
          </button>
        </form>
      </div>

      {/* Testimonials List */}
      <div>
        {items.length === 0 ? (
          <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <MessageSquare size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-text-subtle)', display: 'block' }} />
            No testimonials recorded yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        style={{
                          color: i < item.rating ? 'var(--color-primary)' : 'var(--color-border)',
                          fill: i < item.rating ? 'var(--color-primary)' : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                    &ldquo;{item.content}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.875rem' }}>{item.customerName}</span>
                    <span className={`badge ${item.status === 'PUBLISHED' ? 'badge-published' : 'badge-draft'}`} style={{ fontSize: '0.65rem' }}>
                      {item.status}
                    </span>
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
