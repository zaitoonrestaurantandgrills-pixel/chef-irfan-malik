'use client';

import Link from 'next/link';
import { Clock, Lock, ArrowRight } from 'lucide-react';
import type { Recipe, Category } from '@prisma/client';

type RecipeWithCategory = Recipe & { category: Category | null };

interface RecipeCardProps {
  recipe: RecipeWithCategory;
  showPrice?: boolean;
}

export default function RecipeCard({ recipe, showPrice = true }: RecipeCardProps) {
  const isPremium = recipe.type === 'PREMIUM';
  const totalTime = (recipe.prepTime || 0) + (recipe.cookingTime || 0);

  return (
    <article
      className="group"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-variant)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, border-color 300ms ease',
        boxShadow: 'var(--shadow-ambient)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-5px)';
        el.style.boxShadow = '0 12px 40px rgba(26,26,26,0.12)';
        el.style.borderColor = 'var(--color-border)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'var(--shadow-ambient)';
        el.style.borderColor = 'var(--color-border-variant)';
      }}
    >
      <Link href={`/recipes/${recipe.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* 4:5 Aspect Ratio Image Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4/5',
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface-variant)',
          }}
        >
          {recipe.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.coverImage}
              alt={recipe.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="card-img"
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                background: 'linear-gradient(145deg, #efeeea 0%, #e3e2df 100%)',
              }}
            >
              🍽️
            </div>
          )}

          {/* Premium / Free Badge */}
          <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem', zIndex: 2 }}>
            {isPremium ? (
              <span
                className="font-label-caps"
                style={{
                  background: 'rgba(26, 25, 0, 0.85)',
                  color: 'var(--color-tertiary-fixed-dim)',
                  padding: '0.3rem 0.7rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(233, 193, 118, 0.4)',
                  backdropFilter: 'blur(8px)',
                  letterSpacing: '0.14em',
                  fontSize: '9px',
                }}
              >
                ✦ PREMIUM
              </span>
            ) : (
              <span
                className="font-label-caps"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--color-primary)',
                  padding: '0.3rem 0.7rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(8px)',
                  letterSpacing: '0.12em',
                  fontSize: '9px',
                }}
              >
                FREE
              </span>
            )}
          </div>

          {/* Hover Overlay for Premium */}
          {isPremium && (
            <div
              className="card-lock-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 100%)',
                opacity: 0,
                transition: 'opacity 0.35s ease',
                zIndex: 3,
              }}
            >
              <Lock size={26} color="#ffffff" style={{ marginBottom: '0.625rem' }} />
              <span
                className="font-label-caps"
                style={{
                  background: 'var(--color-secondary)',
                  color: '#ffffff',
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                }}
              >
                Unlock Recipe
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div
          style={{
            padding: '1.125rem 1.25rem 0',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          {/* Cuisine label + price row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              className="font-label-caps"
              style={{ color: 'var(--color-secondary)', fontSize: '10px' }}
            >
              {recipe.cuisine || recipe.category?.name || 'Signature'}
            </span>
            {showPrice && (
              <span
                className="font-label-caps"
                style={{
                  color: isPremium ? 'var(--color-on-tertiary-container)' : 'var(--color-success)',
                  fontWeight: 700,
                  fontSize: '11px',
                }}
              >
                {isPremium ? `PKR ${recipe.price}` : 'Free'}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontWeight: 600,
              lineHeight: 1.3,
              color: 'var(--color-primary)',
              margin: 0,
              transition: 'color 0.2s ease',
            }}
            className="line-clamp-2 card-title"
          >
            {recipe.title}
          </h3>

          {/* Description */}
          {recipe.description && (
            <p
              className="font-body-md line-clamp-2"
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '13px',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {recipe.description}
            </p>
          )}

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '12px',
              color: 'var(--color-text-subtle)',
              marginTop: '0.25rem',
            }}
          >
            {totalTime > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} />
                {totalTime} min
              </span>
            )}
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--color-border)' }} />
            <span style={{ textTransform: 'capitalize' }}>
              {recipe.difficulty ? recipe.difficulty.toLowerCase() : 'Intermediate'}
            </span>
            {recipe.servings && (
              <>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--color-border)' }} />
                <span>{recipe.servings} servings</span>
              </>
            )}
          </div>
        </div>

        {/* CTA Footer */}
        <div
          style={{
            padding: '0.875rem 1.25rem',
            marginTop: '0.75rem',
            borderTop: '1px solid var(--color-border-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            className="font-label-caps"
            style={{
              color: isPremium ? 'var(--color-secondary)' : 'var(--color-primary)',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'gap 0.2s ease',
            }}
          >
            {isPremium ? 'Unlock Recipe' : 'View Recipe'}
            <ArrowRight size={13} />
          </span>
          {isPremium && (
            <Lock size={13} style={{ color: 'var(--color-text-subtle)' }} />
          )}
        </div>
      </Link>
    </article>
  );
}
