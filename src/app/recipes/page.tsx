import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import RecipeCard from '@/components/RecipeCard';
import SortSelector from '@/components/SortSelector';
import RecipeFilters from '@/components/RecipeFilters';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Recipe Marketplace — Chef Irfan Malik',
  description: 'Explore curated culinary masterpieces from Chef Irfan Malik. Master traditional heritage dishes and modern gastronomy.',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    cuisine?: string;
    difficulty?: string;
    search?: string;
    sort?: string;
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

  // Sort order
  let orderBy: Record<string, string> = { createdAt: 'desc' };
  if (params.sort === 'price_asc')  orderBy = { price: 'asc' };
  if (params.sort === 'price_desc') orderBy = { price: 'desc' };

  const [recipes, total, categories] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: { category: true },
      skip,
      take: PER_PAGE,
      orderBy,
    }),
    prisma.recipe.count({ where }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <>
      <Navbar />

      <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>

        {/* ── Marketplace Hero Header ────────────────────────────── */}
        <section
          style={{
            padding: '4.5rem 0 3.5rem',
            background: 'linear-gradient(180deg, #ffffff 0%, var(--color-bg) 100%)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="container">
            {/* Breadcrumb */}
            <div
              className="font-label-caps"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--color-text-subtle)',
                fontSize: '10px',
                marginBottom: '1.5rem',
              }}
            >
              <Link href="/" style={{ color: 'var(--color-text-subtle)', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--color-secondary)' }}>Marketplace</span>
            </div>

            <div style={{ maxWidth: '720px', marginBottom: '2.75rem' }}>
              <span
                className="font-label-caps"
                style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.6rem' }}
              >
                Curated Digital Cookbook
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  marginBottom: '1rem',
                }}
              >
                Explore Chef Irfan&apos;s Recipes
              </h1>
              <p
                className="font-body-lg"
                style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}
              >
                Professional recipes designed to help you cook with confidence. From traditional heritage dishes to modern gastronomy.
              </p>
            </div>

            {/* Filters */}
            <RecipeFilters categories={categories} currentParams={params} />
          </div>
        </section>

        {/* ── Recipe Grid ────────────────────────────────────────── */}
        <section style={{ padding: '3rem 0 6rem' }}>
          <div className="container">

            {recipes.length === 0 ? (
              /* ── Empty State ─── */
              <div
                style={{
                  textAlign: 'center',
                  padding: '6rem 2rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-ambient)',
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
                <h3
                  className="font-headline-sm"
                  style={{ color: 'var(--color-primary)', marginBottom: '0.625rem' }}
                >
                  No recipes match your search
                </h3>
                <p
                  className="font-body-md"
                  style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}
                >
                  Try adjusting your filters or search terms to find what you&apos;re looking for.
                </p>
                <a
                  href="/recipes"
                  className="btn btn-secondary"
                >
                  Clear All Filters
                </a>
              </div>
            ) : (
              <>
                {/* Toolbar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <p
                    className="font-label-caps"
                    style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '11px' }}
                  >
                    Showing {skip + 1}–{Math.min(skip + recipes.length, total)} of {total} recipes
                  </p>

                  {/* Sort Selector */}
                  <SortSelector currentSort={params.sort} />
                </div>

                {/* Recipe Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '1.75rem',
                  }}
                >
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '4rem',
                      paddingTop: '2.5rem',
                      borderTop: '1px solid var(--color-border)',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Prev */}
                    {page > 1 && (
                      <a
                        href={`/recipes?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                        className="font-label-caps"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.625rem 1rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-full)',
                          color: 'var(--color-text-muted)',
                          textDecoration: 'none',
                          fontSize: '11px',
                          background: '#ffffff',
                          transition: 'all 0.2s',
                        }}
                      >
                        <ArrowLeft size={13} /> Prev
                      </a>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                        if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === '...' ? (
                          <span key={`ellipsis-${i}`} style={{ color: 'var(--color-text-subtle)', padding: '0 0.25rem' }}>…</span>
                        ) : (
                          <a
                            key={p}
                            href={`/recipes?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                            className="font-label-caps"
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: 'var(--radius-full)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: p === page ? 'var(--color-primary)' : '#ffffff',
                              color: p === page ? '#ffffff' : 'var(--color-text-muted)',
                              border: `1px solid ${p === page ? 'var(--color-primary)' : 'var(--color-border)'}`,
                              textDecoration: 'none',
                              fontSize: '11px',
                              transition: 'all 0.2s',
                            }}
                          >
                            {p}
                          </a>
                        )
                      )}

                    {/* Next */}
                    {page < totalPages && (
                      <a
                        href={`/recipes?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                        className="font-label-caps"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.625rem 1rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-full)',
                          color: 'var(--color-text-muted)',
                          textDecoration: 'none',
                          fontSize: '11px',
                          background: '#ffffff',
                          transition: 'all 0.2s',
                        }}
                      >
                        Next <ArrowRight size={13} />
                      </a>
                    )}
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
