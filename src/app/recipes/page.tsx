import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import RecipeCard from '@/components/RecipeCard';
import RecipeFilters from '@/components/RecipeFilters';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recipes',
  description: 'Browse Chef Irfan Malik\'s complete recipe collection — from free classics to premium culinary masterclasses.',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    cuisine?: string;
    difficulty?: string;
    search?: string;
    page?: string;
  }>;
}

const PER_PAGE = 12;

export default async function RecipesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page   = Math.max(1, parseInt(params.page || '1'));
  const skip   = (page - 1) * PER_PAGE;

  const where: Record<string, unknown> = { status: 'PUBLISHED' };

  if (params.type === 'free')    where.type = 'FREE';
  if (params.type === 'premium') where.type = 'PREMIUM';
  if (params.difficulty)         where.difficulty = params.difficulty.toUpperCase();
  if (params.cuisine)            where.cuisine = { contains: params.cuisine, mode: 'insensitive' };
  if (params.search)             where.title   = { contains: params.search, mode: 'insensitive' };

  if (params.category) {
    where.category = { slug: params.category };
  }

  const [recipes, total, categories] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: { category: true },
      skip,
      take: PER_PAGE,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.recipe.count({ where }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        {/* Header */}
        <section style={{
          background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
          borderBottom: '1px solid var(--color-border)',
          padding: '3rem 0',
        }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <span className="section-label">Culinary Collection</span>
            <h1 className="heading-xl" style={{ marginBottom: '0.75rem' }}>
              Recipe Marketplace
            </h1>
            <div className="divider-gold" />
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '1rem auto 0', fontSize: '1rem' }}>
              From free everyday classics to premium culinary masterclasses — all crafted by Chef Irfan Malik.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Recipes', value: total },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters + Grid */}
        <section style={{ padding: '2.5rem 0 4rem' }}>
          <div className="container">
            <RecipeFilters categories={categories} currentParams={params} />

            {recipes.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '5rem 2rem',
                background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)', marginTop: '2rem',
              }}>
                <BookOpen size={56} style={{ color: 'var(--color-text-subtle)', margin: '0 auto 1.5rem', display: 'block' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>No recipes found</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Showing <strong style={{ color: 'var(--color-text)' }}>{recipes.length}</strong> of <strong style={{ color: 'var(--color-text)' }}>{total}</strong> recipes
                  </p>
                </div>
                <div className="grid-cards">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <a
                        key={p}
                        href={`/recipes?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                        style={{
                          width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: p === page ? 'var(--color-primary)' : 'var(--color-surface)',
                          color: p === page ? '#0A0A0A' : 'var(--color-text-muted)',
                          border: `1px solid ${p === page ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
