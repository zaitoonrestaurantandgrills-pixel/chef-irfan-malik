'use client';

import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import type { Gallery } from '@prisma/client';

export default function GalleryViewer({ initialItems }: { initialItems: Gallery[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<Gallery | null>(null);

  const categories = [
    { key: 'ALL', label: 'All Photos' },
    { key: 'ACHIEVEMENTS', label: 'Awards & Honors' },
    { key: 'CHEF', label: 'Chef Moments' },
    { key: 'EVENTS', label: 'Events & Galas' },
    { key: 'FOOD', label: 'Food Artistry' },
    { key: 'BEHIND_SCENES', label: 'Behind The Scenes' },
  ];

  const filteredItems = selectedCategory === 'ALL'
    ? initialItems
    : initialItems.filter((i) => i.category === selectedCategory);

  return (
    <div>
      {/* Category Pills */}
      <div
        className="hide-scrollbar"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '3rem',
        }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className="font-label-caps"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: isActive ? 'var(--color-primary)' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--color-primary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {filteredItems.length === 0 ? (
        <div
          style={{
            padding: '5rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-ambient)',
            maxWidth: '520px',
            margin: '0 auto',
          }}
        >
          <ImageIcon
            size={44}
            style={{ margin: '0 auto 1rem', color: 'var(--color-text-subtle)', display: 'block' }}
          />
          <h3
            className="font-headline-sm"
            style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}
          >
            No photos in this category yet
          </h3>
          <p className="font-body-md" style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            New gallery photos will appear here soon.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {filteredItems.map((item) => (
            <article
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group"
              style={{
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '4/3',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-ambient)',
              }}
            >
              <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="card-img"
                />

                {/* Dark Gradient Overlay for Typography */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.85) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.5rem',
                  }}
                >
                  <span
                    className="font-label-caps"
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: 'rgba(38, 25, 0, 0.9)',
                      color: 'var(--color-tertiary-fixed)',
                      border: '1px solid rgba(255, 222, 165, 0.3)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '9px',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.category.replace('_', ' ')}
                  </span>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '920px',
              width: '100%',
              maxHeight: '90vh',
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            <button
              onClick={() => setActivePhoto(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 10,
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Close photo"
            >
              <X size={18} />
            </button>

            <div
              style={{
                maxHeight: '65vh',
                backgroundColor: '#1b1c1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain',
                }}
              />
            </div>

            <div style={{ padding: '1.75rem 2rem', backgroundColor: 'var(--color-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span
                  className="font-label-caps"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    padding: '0.25rem 0.5rem',
                    fontSize: '10px',
                  }}
                >
                  {activePhoto.category.replace('_', ' ')}
                </span>
                <h3
                  className="font-headline-sm"
                  style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.25rem' }}
                >
                  {activePhoto.title}
                </h3>
              </div>
              {activePhoto.description && (
                <p
                  className="font-body-md"
                  style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}
                >
                  {activePhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
