'use client';

import { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Filter } from 'lucide-react';
import type { Gallery } from '@prisma/client';

export default function GalleryManager({ initialItems }: { initialItems: Gallery[] }) {
  const [items, setItems] = useState<Gallery[]>(initialItems);
  const [form, setForm] = useState({
    title: '',
    image: '',
    category: 'FOOD' as 'FOOD' | 'CHEF' | 'EVENTS' | 'ACHIEVEMENTS' | 'BEHIND_SCENES',
    description: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add image');

      setItems([data.item, ...items]);
      setForm({ title: '', image: '', category: 'FOOD', description: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error adding image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setItems(items.filter((it) => it.id !== id));
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter((i) => i.category === selectedCategory);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem', alignItems: 'start' }}>
      {/* Upload / Add Form */}
      <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <Plus size={18} /> Add Photo
        </h2>

        {error && (
          <div style={{ background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--color-error)', fontSize: '0.825rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Photo Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Signature Nihari Garnishing"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL *</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://... or /gallery/photo.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
            >
              <option value="FOOD">Food Photography</option>
              <option value="CHEF">Chef Moments</option>
              <option value="EVENTS">Events & Masterclasses</option>
              <option value="ACHIEVEMENTS">Awards & Achievements</option>
              <option value="BEHIND_SCENES">Behind the Scenes</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Caption / Description</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Optional short description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
            {loading ? 'Adding...' : 'Add to Gallery'}
          </button>
        </form>
      </div>

      {/* Grid of Gallery Photos */}
      <div>
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'FOOD', 'CHEF', 'EVENTS', 'ACHIEVEMENTS', 'BEHIND_SCENES'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem' }}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <ImageIcon size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-text-subtle)', display: 'block' }} />
            No photos in this category yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{ overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ aspectRatio: '1/1', background: 'var(--color-surface-2)', position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    className="badge badge-premium"
                    style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', fontSize: '0.65rem' }}
                  >
                    {item.category.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      position: 'absolute', top: '0.5rem', right: '0.5rem',
                      background: 'rgba(224,82,82,0.9)', border: 'none', borderRadius: 'var(--radius-sm)',
                      color: '#FFF', padding: '0.35rem', cursor: 'pointer', display: 'flex'
                    }}
                    title="Delete image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ padding: '0.875rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    {item.title}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }} className="line-clamp-2">
                      {item.description}
                    </div>
                  )}
                </div>
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
