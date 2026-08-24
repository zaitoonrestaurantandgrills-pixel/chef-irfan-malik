'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import type { Category } from '@prisma/client';

interface Props {
  categories: Category[];
  currentParams: {
    type?: string;
    category?: string;
    cuisine?: string;
    difficulty?: string;
    search?: string;
  };
}

const defaultCuisines = [
  'Pakistani',
  'Chinese',
  'BBQ',
  'Fast Food',
  'Continental',
  'Desserts',
];

export default function RecipeFilters({ categories, currentParams }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(currentParams.search || '');

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      const merged = { ...currentParams, ...overrides };
      Object.entries(merged).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      params.delete('page');
      return `/recipes?${params.toString()}`;
    },
    [currentParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ search: search || undefined }));
  };

  const selectedCuisine = currentParams.cuisine || '';
  const selectedType = currentParams.type || '';

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Search Bar & Primary Filter Row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Search Input */}
          <form
            onSubmit={handleSearch}
            style={{
              position: 'relative',
              flex: '1',
              minWidth: '280px',
              maxWidth: '420px',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-subtle)',
              }}
            />
            <input
              type="text"
              placeholder="Search ingredients, dishes, cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-body-md"
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-border)',
                padding: '0.75rem 1rem 0.75rem 2.25rem',
                color: 'var(--color-primary)',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--color-secondary)')}
              onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'var(--color-border)')}
            />
          </form>

          {/* Clear Filters (if active) */}
          {Object.values(currentParams).some(Boolean) && (
            <a
              href="/recipes"
              className="font-label-caps"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--color-secondary)',
                textDecoration: 'none',
                fontSize: '11px',
              }}
            >
              <X size={13} /> Clear filters
            </a>
          )}
        </div>

        {/* Horizontal Category & Status Pills */}
        <div
          className="hide-scrollbar"
          style={{
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {/* ALL Pill */}
          <button
            onClick={() => router.push(buildUrl({ cuisine: undefined, type: undefined, category: undefined }))}
            className="font-label-caps"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              border: !selectedCuisine && !selectedType ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: !selectedCuisine && !selectedType ? 'var(--color-primary)' : 'transparent',
              color: !selectedCuisine && !selectedType ? '#ffffff' : 'var(--color-text)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            All
          </button>

          {/* Dynamic / Common Cuisines */}
          {defaultCuisines.map((c) => {
            const isActive = selectedCuisine.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() =>
                  router.push(buildUrl({ cuisine: isActive ? undefined : c }))
                }
                className="font-label-caps"
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '999px',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--color-text)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {c}
              </button>
            );
          })}

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 0.5rem', flexShrink: 0 }} />

          {/* Premium Pill */}
          <button
            onClick={() => router.push(buildUrl({ type: selectedType === 'premium' ? undefined : 'premium' }))}
            className="font-label-caps"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              border: selectedType === 'premium' ? '1px solid var(--color-tertiary-fixed-dim)' : '1px solid var(--color-border)',
              background: selectedType === 'premium' ? 'var(--color-tertiary-container)' : 'transparent',
              color: selectedType === 'premium' ? 'var(--color-tertiary-fixed-dim)' : 'var(--color-text)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            ★ Premium
          </button>

          {/* Free Pill */}
          <button
            onClick={() => router.push(buildUrl({ type: selectedType === 'free' ? undefined : 'free' }))}
            className="font-label-caps"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              border: selectedType === 'free' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: selectedType === 'free' ? 'var(--color-surface-container)' : 'transparent',
              color: selectedType === 'free' ? 'var(--color-primary)' : 'var(--color-text)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            Free
          </button>
        </div>
      </div>
    </div>
  );
}
