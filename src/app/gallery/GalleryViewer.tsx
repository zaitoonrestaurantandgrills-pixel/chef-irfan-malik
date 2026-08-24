'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, ZoomIn } from 'lucide-react';
import type { Gallery } from '@prisma/client';

export default function GalleryViewer({ initialItems }: { initialItems: Gallery[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<Gallery | null>(null);

  const categories = [
    { key: 'ALL', label: 'All Photos' },
    { key: 'FOOD', label: 'Food Photography' },
    { key: 'CHEF', label: 'Chef Moments' },
    { key: 'EVENTS', label: 'Events & Masterclasses' },
    { key: 'ACHIEVEMENTS', label: 'Awards & Honors' },
    { key: 'BEHIND_SCENES', label: 'Behind The Scenes' },
  ];

  const filteredItems = selectedCategory === 'ALL'
    ? initialItems
    : initialItems.filter((i) => i.category === selectedCategory);

  return (
    <div>
      {/* Category Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`btn btn-sm ${selectedCategory === cat.key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '999px', fontSize: '0.825rem' }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
          <ImageIcon size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-text-subtle)', display: 'block' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No photos in this category</h3>
          <p style={{ fontSize: '0.875rem' }}>Chef Irfan is curating new moments to display here.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="card"
              style={{
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '4/3',
              }}
            >
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="gallery-img"
                />
                {/* Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.85) 100%)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  padding: '1.25rem',
                }}>
                  <span className="badge badge-premium" style={{ alignSelf: 'flex-start', fontSize: '0.65rem', marginBottom: '0.35rem' }}>
                    {item.category.replace('_', ' ')}
                  </span>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {item.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '900px', width: '100%', maxHeight: '90vh',
              background: 'var(--color-surface)', border: '1px solid var(--color-border-gold)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', position: 'relative',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8)'
            }}
          >
            <button
              onClick={() => setActivePhoto(null)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
                background: 'rgba(10,10,10,0.8)', border: '1px solid var(--color-border)',
                borderRadius: '50%', color: 'var(--color-text)', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ maxHeight: '65vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }}
              />
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
                  {activePhoto.title}
                </h3>
                <span className="badge badge-premium" style={{ fontSize: '0.7rem' }}>
                  {activePhoto.category.replace('_', ' ')}
                </span>
              </div>
              {activePhoto.description && (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {activePhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .card:hover .gallery-img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
}
