'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';

interface StickyPurchaseBarProps {
  recipeId: string;
  recipeSlug: string;
  price: number;
  currency: string;
  isLoggedIn: boolean;
}

export default function StickyPurchaseBar({
  recipeId,
  recipeSlug,
  price,
  currency,
  isLoggedIn,
}: StickyPurchaseBarProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: '#ffffff',
        borderTop: '1px solid var(--color-border)',
        padding: '0.875rem var(--margin-mobile)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
      }}
      className="sticky-purchase-bar"
    >
      <div>
        <div
          className="font-label-caps"
          style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}
        >
          Premium Recipe
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            lineHeight: 1.1,
          }}
        >
          {currency} {price.toLocaleString()}
        </div>
      </div>

      {isLoggedIn ? (
        <Link
          href={`/checkout/${recipeId}`}
          className="btn btn-primary btn-lg"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
        >
          <Lock size={15} />
          Unlock Recipe →
        </Link>
      ) : (
        <Link
          href={`/login?callbackUrl=/recipes/${recipeSlug}`}
          className="btn btn-primary btn-lg"
          style={{ whiteSpace: 'nowrap' }}
        >
          Sign In to Unlock
        </Link>
      )}
    </div>
  );
}
