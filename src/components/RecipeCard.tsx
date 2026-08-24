import Link from 'next/link';
import { Clock, ChefHat, Users, Star } from 'lucide-react';
import type { Recipe, Category } from '@prisma/client';

type RecipeWithCategory = Recipe & { category: Category | null };

interface RecipeCardProps {
  recipe: RecipeWithCategory;
  showPrice?: boolean;
}

export default function RecipeCard({ recipe, showPrice = true }: RecipeCardProps) {
  const isPremium = recipe.type === 'PREMIUM';

  return (
    <Link href={`/recipes/${recipe.slug}`} style={{ textDecoration: 'none' }}>
      <div className="recipe-card">
        {/* Image */}
        <div className="recipe-card-image">
          {recipe.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={recipe.coverImage} alt={recipe.title} />
          ) : (
            <div style={{
              width: '100%', height: '100%', minHeight: '220px',
              background: 'linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface-3) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem',
            }}>
              🍽️
            </div>
          )}

          {/* Overlay badges */}
          <div style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            display: 'flex', gap: '0.5rem',
          }}>
            <span className={`badge ${isPremium ? 'badge-premium' : 'badge-free'}`}>
              {isPremium ? '⭐ Premium' : '✓ Free'}
            </span>
          </div>

          {recipe.category && (
            <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem' }}>
              <span style={{
                background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(8px)',
                borderRadius: '999px', padding: '0.2rem 0.625rem',
                fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {recipe.category.name}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="recipe-card-body">
          {/* Cuisine */}
          <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {recipe.cuisine}
          </div>

          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.3,
          }} className="line-clamp-2">
            {recipe.title}
          </h3>

          <p className="line-clamp-2" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>
            {recipe.description}
          </p>

          {/* Meta */}
          <div className="recipe-meta">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} /> {recipe.prepTime + recipe.cookingTime}m
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Users size={13} /> {recipe.servings}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Star size={13} /> {recipe.difficulty}
            </span>
          </div>

          {/* Footer */}
          {showPrice && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 'auto', paddingTop: '0.75rem',
              borderTop: '1px solid var(--color-border)',
            }}>
              <div>
                {isPremium ? (
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {recipe.currency} {recipe.price.toLocaleString()}
                  </span>
                ) : (
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-success)' }}>
                    Free
                  </span>
                )}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600,
              }}>
                <ChefHat size={13} /> View Recipe
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
