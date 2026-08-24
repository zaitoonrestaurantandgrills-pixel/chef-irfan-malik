import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, Star, CheckCircle, Clock } from 'lucide-react';
import AdminRecipeActions from './AdminRecipeActions';

export const dynamic = 'force-dynamic';

export default async function AdminRecipesListPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; search?: string }>;
}) {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized');
  }

  const params = await searchParams;
  const where: Record<string, unknown> = {};

  if (params.type === 'free') where.type = 'FREE';
  if (params.type === 'premium') where.type = 'PREMIUM';
  if (params.status) where.status = params.status.toUpperCase();
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { cuisine: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const recipes = await prisma.recipe.findMany({
    where,
    include: {
      category: true,
      _count: {
        select: { access: true, orderItems: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
              Recipe Management
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Create, edit, price, and manage all your culinary recipes.
            </p>
          </div>
          <Link href="/admin/recipes/new" className="btn btn-primary">
            <Plus size={16} /> Create New Recipe
          </Link>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form style={{ flex: 1, minWidth: '240px' }} action="/admin/recipes" method="GET">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
              <input
                type="text"
                name="search"
                defaultValue={params.search || ''}
                placeholder="Search recipe title or cuisine..."
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </form>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link
              href="/admin/recipes"
              className={`btn btn-sm ${!params.type && !params.status ? 'btn-primary' : 'btn-ghost'}`}
            >
              All
            </Link>
            <Link
              href="/admin/recipes?type=free"
              className={`btn btn-sm ${params.type === 'free' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Free
            </Link>
            <Link
              href="/admin/recipes?type=premium"
              className={`btn btn-sm ${params.type === 'premium' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Premium
            </Link>
            <Link
              href="/admin/recipes?status=draft"
              className={`btn btn-sm ${params.status === 'draft' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Drafts
            </Link>
            <Link
              href="/admin/recipes?status=published"
              className={`btn btn-sm ${params.status === 'published' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Published
            </Link>
          </div>
        </div>

        {/* Table / List */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {recipes.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
                No recipes found matching your criteria.
              </p>
              <Link href="/admin/recipes/new" className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add First Recipe
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Recipe</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Type & Price</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Cuisine / Category</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Purchases</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((r, idx) => (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: idx < recipes.length - 1 ? '1px solid var(--color-border)' : 'none',
                        transition: 'background 0.2s',
                      }}
                    >
                      {/* Title & Image */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <div style={{
                            width: '48px', height: '48px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-surface-2)', overflow: 'hidden', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                          }}>
                            {r.coverImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={r.coverImage} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : '🍽️'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>
                              {r.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                              /{r.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Price */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className={`badge ${r.type === 'PREMIUM' ? 'badge-premium' : 'badge-free'}`}>
                          {r.type === 'PREMIUM' ? `PKR ${r.price.toLocaleString()}` : 'Free'}
                        </span>
                      </td>

                      {/* Cuisine */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ color: 'var(--color-text)' }}>{r.cuisine}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {r.category?.name || 'Uncategorized'}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className={`badge ${
                          r.status === 'PUBLISHED' ? 'badge-published' : r.status === 'DRAFT' ? 'badge-draft' : 'badge-archived'
                        }`}>
                          {r.status}
                        </span>
                      </td>

                      {/* Purchases */}
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                        {r.type === 'PREMIUM' ? `${r._count.access} unlocked` : '—'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <AdminRecipeActions recipeId={r.id} slug={r.slug} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
