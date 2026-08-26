'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { Category } from '@prisma/client';

interface Props {
  categories: Category[];
  currentParams: {
    type?: string;
    category?: string;
    cuisine?: string;
    difficulty?: string;
    search?: string;
    sort?: string;
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

const difficulties = ['Easy', 'Intermediate', 'Advanced'];

export default function RecipeFilters({ categories, currentParams }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(currentParams.search || '');
  const [drawerOpen, setDrawerOpen] = useState(false);

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
  const selectedDifficulty = currentParams.difficulty || '';
  const activeFiltersCount = [selectedCuisine, selectedType, selectedDifficulty, currentParams.category].filter(Boolean).length;

  return (
    <div>
      {/* ── Top Row: Search + Filter Toggle ───────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Search Input */}
        <form
          onSubmit={handleSearch}
          style={{
            position: 'relative',
            flex: '1',
            minWidth: '240px',
            maxWidth: '480px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-subtle)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="What do you want to cook today?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.7rem 1rem 0.7rem 2.625rem',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-secondary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(148,73,37,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </form>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="font-label-caps"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.125rem',
            border: `1px solid ${activeFiltersCount > 0 ? 'var(--color-secondary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-full)',
            background: activeFiltersCount > 0 ? 'var(--color-secondary)' : 'var(--color-surface)',
            color: activeFiltersCount > 0 ? '#ffffff' : 'var(--color-text)',
            cursor: 'pointer',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFiltersCount > 0 && (
            <span
              style={{
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <a
            href="/recipes"
            className="font-label-caps"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--color-secondary)',
              textDecoration: 'none',
              fontSize: '11px',
            }}
          >
            <X size={12} /> Clear
          </a>
        )}
      </div>

      {/* ── Horizontal Cuisine Pills (Desktop) ────────────────────── */}
      <div
        className="hide-scrollbar"
        style={{
          overflowX: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingBottom: '0.25rem',
        }}
      >
        {/* All */}
        <button
          onClick={() => router.push(buildUrl({ cuisine: undefined, type: undefined, category: undefined, difficulty: undefined }))}
          className="font-label-caps"
          style={{
            padding: '0.45rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            border: !selectedCuisine && !selectedType ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
            background: !selectedCuisine && !selectedType ? 'var(--color-primary)' : 'transparent',
            color: !selectedCuisine && !selectedType ? '#ffffff' : 'var(--color-text-muted)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: '11px',
            transition: 'all 0.2s ease',
          }}
        >
          All
        </button>

        {defaultCuisines.map((c) => {
          const isActive = selectedCuisine.toLowerCase() === c.toLowerCase();
          return (
            <button
              key={c}
              onClick={() => router.push(buildUrl({ cuisine: isActive ? undefined : c }))}
              className="font-label-caps"
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                border: isActive ? '1px solid var(--color-secondary)' : '1px solid var(--color-border)',
                background: isActive ? 'var(--color-secondary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '11px',
                transition: 'all 0.2s ease',
              }}
            >
              {c}
            </button>
          );
        })}

        <div style={{ width: '1px', height: '20px', background: 'var(--color-border)', margin: '0 0.25rem', flexShrink: 0 }} />

        {/* Premium */}
        <button
          onClick={() => router.push(buildUrl({ type: selectedType === 'premium' ? undefined : 'premium' }))}
          className="font-label-caps"
          style={{
            padding: '0.45rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            border: selectedType === 'premium' ? '1px solid var(--color-tertiary-fixed-dim)' : '1px solid var(--color-border)',
            background: selectedType === 'premium' ? 'var(--color-tertiary-container)' : 'transparent',
            color: selectedType === 'premium' ? 'var(--color-tertiary-fixed-dim)' : 'var(--color-text-muted)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: '11px',
            transition: 'all 0.2s ease',
          }}
        >
          ✦ Premium
        </button>

        {/* Free */}
        <button
          onClick={() => router.push(buildUrl({ type: selectedType === 'free' ? undefined : 'free' }))}
          className="font-label-caps"
          style={{
            padding: '0.45rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            border: selectedType === 'free' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
            background: selectedType === 'free' ? 'var(--color-surface-container)' : 'transparent',
            color: selectedType === 'free' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: '11px',
            transition: 'all 0.2s ease',
          }}
        >
          Free
        </button>
      </div>

      {/* ── Mobile Filter Drawer Overlay ──────────────────────────── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setDrawerOpen(false)}
          />

          {/* Bottom Sheet */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 310,
              background: 'var(--color-surface)',
              borderRadius: '16px 16px 0 0',
              padding: '1.5rem',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '4px', background: 'var(--color-border)', borderRadius: '999px' }} />
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h3 className="font-headline-sm" style={{ margin: 0, color: 'var(--color-primary)' }}>
                Filter Recipes
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuisine */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="font-label-caps" style={{ color: 'var(--color-text-subtle)', marginBottom: '0.875rem', fontSize: '11px' }}>
                Cuisine
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['All', ...defaultCuisines].map((c) => {
                  const isAll = c === 'All';
                  const isActive = isAll ? !selectedCuisine : selectedCuisine.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        router.push(buildUrl({ cuisine: isAll ? undefined : (isActive ? undefined : c) }));
                        if (!isAll) setDrawerOpen(false);
                      }}
                      className="font-label-caps"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        border: isActive ? '1px solid var(--color-secondary)' : '1px solid var(--color-border)',
                        background: isActive ? 'var(--color-secondary)' : 'var(--color-bg)',
                        color: isActive ? '#ffffff' : 'var(--color-text)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Type */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="font-label-caps" style={{ color: 'var(--color-text-subtle)', marginBottom: '0.875rem', fontSize: '11px' }}>
                Recipe Type
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[['all', 'All'], ['premium', '✦ Premium'], ['free', 'Free']].map(([val, label]) => {
                  const isActive = val === 'all' ? !selectedType : selectedType === val;
                  return (
                    <button
                      key={val}
                      onClick={() => {
                        router.push(buildUrl({ type: val === 'all' ? undefined : (isActive ? undefined : val) }));
                        setDrawerOpen(false);
                      }}
                      className="font-label-caps"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        background: isActive ? 'var(--color-primary)' : 'var(--color-bg)',
                        color: isActive ? '#ffffff' : 'var(--color-text)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: '2rem' }}>
              <div className="font-label-caps" style={{ color: 'var(--color-text-subtle)', marginBottom: '0.875rem', fontSize: '11px' }}>
                Difficulty
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {difficulties.map((d) => {
                  const isActive = selectedDifficulty.toLowerCase() === d.toLowerCase();
                  return (
                    <button
                      key={d}
                      onClick={() => {
                        router.push(buildUrl({ difficulty: isActive ? undefined : d.toUpperCase() }));
                        setDrawerOpen(false);
                      }}
                      className="font-label-caps"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        background: isActive ? 'var(--color-primary)' : 'var(--color-bg)',
                        color: isActive ? '#ffffff' : 'var(--color-text)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setDrawerOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              View Results
            </button>
          </div>
        </>
      )}
    </div>
  );
}
