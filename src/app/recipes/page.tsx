import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import RecipeCard from '@/components/RecipeCard';
import RecipeFilters from '@/components/RecipeFilters';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recipe Marketplace',
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

      <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        {/* Marketplace Header Section */}
        <section
          style={{
            padding: '4rem 0 3rem',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="container">
            <div style={{ maxWidth: '780px', marginBottom: '2.5rem' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                Curated Digital Cookbook
              </span>
              <h1
                className="font-display-lg-mobile md:font-display-lg"
                style={{
                  color: 'var(--color-primary)',
                  marginBottom: '1rem',
                }}
              >
                Explore Recipes
              </h1>
              <p
                className="font-body-lg"
                style={{
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Discover a curated collection of culinary masterpieces. From traditional heritage dishes to modern gastronomy, elevate your cooking with Chef Irfan Malik&apos;s exclusive techniques.
              </p>
            </div>

            {/* Search & Category Filter Pills */}
            <RecipeFilters categories={categories} currentParams={params} />
          </div>
        </section>

        {/* Recipe Grid Section */}
        <section style={{ padding: '3.5rem 0 6rem' }}>
          <div className="container">
            {recipes.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '5rem 2rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-ambient)',
                }}
              >
                <BookOpen
                  size={48}
                  style={{
                    color: 'var(--color-text-subtle)',
                    margin: '0 auto 1.25rem',
                    display: 'block',
                  }}
                />
                <h3
                  className="font-headline-sm"
                  style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}
                >
                  No recipes match your criteria
                </h3>
                <p className="font-body-md" style={{ color: 'var(--color-text-muted)' }}>
                  Try clearing search filters or checking back soon for new additions.
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                  }}
                >
                  <p className="font-label-caps" style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                    Showing {recipes.length} of {total} recipes
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2.5rem',
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
                      gap: '0.5rem',
                      marginTop: '4rem',
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: '2.5rem',
                    }}
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const isActive = p === page;
                      return (
                        <a
                          key={p}
                          href={`/recipes?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                          className="font-label-caps"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isActive ? 'var(--color-primary)' : '#ffffff',
                            color: isActive ? '#ffffff' : 'var(--color-primary)',
                            border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          {p}
                        </a>
                      );
                    })}
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
