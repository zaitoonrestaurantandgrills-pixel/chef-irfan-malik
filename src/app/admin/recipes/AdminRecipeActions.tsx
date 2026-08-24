'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit2, Trash2, Eye } from 'lucide-react';

export default function AdminRecipeActions({ recipeId, slug }: { recipeId: string; slug: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/recipes/${recipeId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.refresh();
    } catch (err) {
      alert('Failed to delete recipe.');
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Link
        href={`/recipes/${slug}`}
        target="_blank"
        style={{
          padding: '0.4rem', borderRadius: 'var(--radius-sm)',
          background: 'var(--color-surface-2)', color: 'var(--color-text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        title="View Live"
      >
        <Eye size={15} />
      </Link>
      <Link
        href={`/admin/recipes/${recipeId}/edit`}
        style={{
          padding: '0.4rem', borderRadius: 'var(--radius-sm)',
          background: 'var(--color-surface-2)', color: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        title="Edit Recipe"
      >
        <Edit2 size={15} />
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        style={{
          padding: '0.4rem', borderRadius: 'var(--radius-sm)',
          background: 'rgba(224,82,82,0.1)', border: 'none',
          color: 'var(--color-error)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        title="Delete Recipe"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
