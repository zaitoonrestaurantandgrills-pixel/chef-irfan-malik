'use client';

import Link from 'next/link';
import { Clock, Star, Lock } from 'lucide-react';
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
    <article className="group cursor-pointer flex flex-col gap-3">
      <Link href={`/recipes/${recipe.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* 4:5 Aspect Ratio Image Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4/5',
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface-variant)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-ambient)',
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
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #e3e2df 0%, #dbdad6 100%)',
              }}
            >
              🍽️
            </div>
          )}

          {/* Premium / Free Pill Badge */}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 2,
            }}
          >
            {isPremium ? (
              <span
                className="font-label-caps"
                style={{
                  background: 'rgba(38, 25, 0, 0.88)',
                  color: 'var(--color-tertiary-fixed)',
                  padding: '0.25rem 0.625rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 222, 165, 0.3)',
                  backdropFilter: 'blur(4px)',
                  letterSpacing: '0.12em',
                  fontSize: '10px',
                }}
              >
                PREMIUM
              </span>
            ) : (
              <span
                className="font-label-caps"
                style={{
                  background: 'rgba(255, 255, 255, 0.92)',
                  color: 'var(--color-primary)',
                  padding: '0.25rem 0.625rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backdropFilter: 'blur(4px)',
                  letterSpacing: '0.12em',
                  fontSize: '10px',
                }}
              >
                FREE
              </span>
            )}
          </div>

          {/* Locked Overlay for Premium on hover */}
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
                background: 'rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(2px)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 3,
              }}
            >
              <Lock size={28} color="#ffffff" style={{ marginBottom: '0.75rem' }} />
              <span
                className="font-label-caps"
                style={{
                  background: 'var(--color-secondary)',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: 0,
                  fontSize: '11px',
                }}
              >
                View Recipe
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div style={{ paddingTop: '0.75rem' }}>
          {/* Category & Price Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
            <span
              className="font-label-caps"
              style={{ color: 'var(--color-secondary)', fontSize: '11px' }}
            >
              {recipe.cuisine || recipe.category?.name || 'Signature'}
            </span>
            {showPrice && (
              <span
                className="font-label-caps"
                style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '12px' }}
              >
                {isPremium ? `PKR ${recipe.price}` : 'Free'}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              fontWeight: 600,
              lineHeight: 1.3,
              color: 'var(--color-primary)',
              margin: '0 0 0.5rem 0',
              transition: 'color 0.2s ease',
            }}
            className="line-clamp-2 card-title"
          >
            {recipe.title}
          </h3>

          {/* Meta Info */}
          <div
            className="font-body-md"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
            }}
          >
            {totalTime > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} /> {totalTime} Min
              </span>
            )}
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-border)' }} />
            <span style={{ textTransform: 'capitalize' }}>
              {recipe.difficulty ? recipe.difficulty.toLowerCase() : 'Intermediate'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
