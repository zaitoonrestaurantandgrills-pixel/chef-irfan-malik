'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
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

const difficulties = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
const cuisines = ['Pakistani', 'Indian', 'Continental', 'Chinese', 'Arabic', 'Italian'];

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

  const isActive = (key: string, value: string) =>
    (currentParams as Record<string, string | undefined>)[key] === value;

  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '0.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
        <Filter size={16} style={{ color: 'var(--color-primary)' }} />
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Filter Recipes</span>
        {Object.values(currentParams).some(Boolean) && (
          <a href="/recipes" style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none',
          }} className="hover-gold">
            <X size={12} /> Clear all
          </a>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: '1', minWidth: '200px' }}>
          <label className="form-label">Search</label>
          <div style={{ position: 'relative', marginTop: '0.25rem' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input
              className="form-input"
              style={{ paddingLeft: '2.25rem', paddingRight: '0.75rem' }}
              placeholder="Search recipes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </form>

        {/* Type */}
        <div style={{ minWidth: '150px' }}>
          <label className="form-label">Type</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem' }}>
            {[
              { value: '', label: 'All' },
              { value: 'free', label: '✓ Free' },
              { value: 'premium', label: '⭐ Premium' },
            ].map(({ value, label }) => (
              <a
                key={value}
                href={buildUrl({ type: value || undefined })}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: (currentParams.type === value || (!currentParams.type && !value))
                    ? 'var(--color-primary)' : 'var(--color-surface-2)',
                  color: (currentParams.type === value || (!currentParams.type && !value))
                    ? '#0A0A0A' : 'var(--color-text-muted)',
                  border: '1px solid',
                  borderColor: (currentParams.type === value || (!currentParams.type && !value))
                    ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Category */}
        <div style={{ minWidth: '160px' }}>
          <label className="form-label">Category</label>
          <select
            className="form-input"
            style={{ marginTop: '0.375rem' }}
            value={currentParams.category || ''}
            onChange={e => router.push(buildUrl({ category: e.target.value || undefined }))}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div style={{ minWidth: '160px' }}>
          <label className="form-label">Difficulty</label>
          <select
            className="form-input"
            style={{ marginTop: '0.375rem' }}
            value={currentParams.difficulty || ''}
            onChange={e => router.push(buildUrl({ difficulty: e.target.value || undefined }))}
          >
            <option value="">All Levels</option>
            {difficulties.map(d => (
              <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>

        {/* Cuisine */}
        <div style={{ minWidth: '160px' }}>
          <label className="form-label">Cuisine</label>
          <select
            className="form-input"
            style={{ marginTop: '0.375rem' }}
            value={currentParams.cuisine || ''}
            onChange={e => router.push(buildUrl({ cuisine: e.target.value || undefined }))}
          >
            <option value="">All Cuisines</option>
            {cuisines.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
