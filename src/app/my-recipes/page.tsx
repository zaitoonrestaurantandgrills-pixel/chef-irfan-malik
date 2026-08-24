import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { BookOpen, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MyRecipesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  // Only show recipes this user has actually purchased — server-side verified
  const accessRecords = await prisma.recipeAccess.findMany({
    where: { userId: session.user.id, revokedAt: null },
    include: {
      recipe: {
        include: { category: true },
      },
    },
    orderBy: { grantedAt: 'desc' },
  });

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>
              My Recipes
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              {accessRecords.length > 0
                ? `You have access to ${accessRecords.length} purchased recipe${accessRecords.length > 1 ? 's' : ''}.`
                : 'You haven\'t purchased any recipes yet.'}
            </p>
          </div>

          {accessRecords.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '5rem 2rem',
              background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
            }}>
              <Lock size={64} style={{ color: 'var(--color-text-subtle)', margin: '0 auto 1.5rem', display: 'block' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
                No Purchased Recipes Yet
              </h2>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                Explore Chef Irfan&apos;s premium recipe collection and unlock professional culinary techniques.
              </p>
              <Link href="/recipes" className="btn btn-primary btn-lg">
                <BookOpen size={18} /> Browse Recipes
              </Link>
            </div>
          ) : (
            <div className="grid-cards">
              {accessRecords.map(({ recipe, grantedAt }) => (
                <div key={recipe.id} style={{
                  background: 'var(--color-surface)', border: '1px solid var(--color-border-gold)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  transition: 'all 0.25s',
                  display: 'flex', flexDirection: 'column',
                }}>
                  {/* Image */}
                  <div style={{ aspectRatio: '4/3', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', position: 'relative' }}>
                    {recipe.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={recipe.coverImage} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : '🍽️'}
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                      <span className="badge badge-premium">✅ Purchased</span>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {recipe.category && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {recipe.category.name}
                      </div>
                    )}
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', lineHeight: 1.3, color: 'var(--color-text)' }}
                      className="line-clamp-2">
                      {recipe.title}
                    </h3>
                    <p className="line-clamp-2" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                      {recipe.description}
                    </p>
                    <div style={{ fontSize: '0.775rem', color: 'var(--color-text-subtle)', marginTop: 'auto' }}>
                      Purchased {new Date(grantedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <Link href={`/recipes/${recipe.slug}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                      <BookOpen size={15} /> View Full Recipe
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Browse more */}
          {accessRecords.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.75rem' }}>Looking for more recipes?</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Explore Chef Irfan&apos;s complete collection of premium culinary recipes.
              </p>
              <Link href="/recipes?type=premium" className="btn btn-primary">
                Browse Premium Recipes
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
