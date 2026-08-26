'use client';

interface Props {
  currentSort?: string;
}

export default function SortSelector({ currentSort }: Props) {
  return (
    <select
      defaultValue={currentSort || 'newest'}
      onChange={(e) => {
        const url = new URL(window.location.href);
        url.searchParams.set('sort', e.target.value);
        url.searchParams.delete('page');
        window.location.href = url.toString();
      }}
      style={{
        padding: '0.5rem 0.875rem',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-full)',
        background: '#ffffff',
        color: 'var(--color-text)',
        fontSize: '11px',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <option value="newest">Newest First</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}
