import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Clock, Users, ChefHat, ShoppingCart, Lock, Star, Utensils, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });
  if (!recipe) return { title: 'Recipe Not Found' };
  return {
    title: recipe.title,
    description: recipe.description,
  };
}

async function hasRecipeAccess(userId: string, recipeId: string): Promise<boolean> {
  const access = await prisma.recipeAccess.findUnique({
    where: { userId_recipeId: { userId, recipeId } },
  });
  return !!access && !access.revokedAt;
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const recipe = await prisma.recipe.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      ingredients: { orderBy: { sortOrder: 'asc' } },
      steps: { orderBy: { stepNumber: 'asc' } },
      notes: true,
      tips: true,
      equipment: true,
    },
  });

  if (!recipe) notFound();

  const session = await auth();
  const isPremium = recipe.type === 'PREMIUM';

  // Server-side access check — never expose premium content without this
  let hasAccess = false;
  if (isPremium && session?.user?.id) {
    hasAccess = await hasRecipeAccess(session.user.id, recipe.id);
  }
  if (!isPremium) hasAccess = true;

  const difficultyColor: Record<string, string> = {
    EASY: 'var(--color-success)',
    MEDIUM: 'var(--color-primary)',
    HARD: 'var(--color-error)',
    EXPERT: '#9B59B6',
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        {/* Hero */}
        <section style={{
          background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-bg) 100%)',
          padding: '3rem 0 0',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div className="container">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }} className="hover-gold">Home</Link>
              <span>/</span>
              <Link href="/recipes" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }} className="hover-gold">Recipes</Link>
              <span>/</span>
              <span style={{ color: 'var(--color-text)' }}>{recipe.title}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '3rem', alignItems: 'start', paddingBottom: '3rem' }}>
              {/* Left */}
              <div>
                {/* Badges */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <span className={`badge ${isPremium ? 'badge-premium' : 'badge-free'}`}>
                    {isPremium ? '⭐ Premium Recipe' : '✓ Free Recipe'}
                  </span>
                  {recipe.category && (
                    <span className="badge badge-draft">{recipe.category.name}</span>
                  )}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.25rem 0.75rem', borderRadius: '999px',
                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: difficultyColor[recipe.difficulty] ?? 'var(--color-primary)',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${difficultyColor[recipe.difficulty] ?? 'var(--color-primary)'}44`,
                  }}>
                    <Star size={11} /> {recipe.difficulty}
                  </span>
                </div>

                <h1 className="heading-xl" style={{ marginBottom: '1.25rem' }}>
                  {recipe.title}
                </h1>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '600px' }}>
                  {recipe.description}
                </p>

                {/* Quick Stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1rem', marginBottom: '2rem',
                }}>
                  {[
                    { icon: <Clock size={18} />, label: 'Prep', value: `${recipe.prepTime}m` },
                    { icon: <ChefHat size={18} />, label: 'Cook', value: `${recipe.cookingTime}m` },
                    { icon: <Users size={18} />, label: 'Serves', value: recipe.servings },
                    { icon: <Utensils size={18} />, label: 'Cuisine', value: recipe.cuisine },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{
                      background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)', padding: '1rem',
                      textAlign: 'center', transition: 'border-color 0.2s',
                    }}>
                      <div style={{ color: 'var(--color-primary)', display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}>{icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>{value}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Chef credit */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '1rem 1.25rem',
                  background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}>👨‍🍳</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Recipe by</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>Chef Irfan Malik</div>
                  </div>
                </div>
              </div>

              {/* Right: Image + Purchase */}
              <div>
                {/* Recipe Image */}
                <div style={{
                  aspectRatio: '4/3', borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden', marginBottom: '1.25rem',
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '5rem',
                  boxShadow: 'var(--shadow-gold)',
                }}>
                  {recipe.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={recipe.coverImage} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : '🍽️'}
                </div>

                {/* Purchase / Access Card */}
                {isPremium && (
                  <div style={{
                    background: hasAccess
                      ? 'linear-gradient(135deg, rgba(76,175,120,0.1), rgba(76,175,120,0.05))'
                      : 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05))',
                    border: `1px solid ${hasAccess ? 'rgba(76,175,120,0.3)' : 'var(--color-border-gold)'}`,
                    borderRadius: 'var(--radius-lg)', padding: '1.5rem',
                  }}>
                    {hasAccess ? (
                      <div style={{ textAlign: 'center' }}>
                        <CheckCircle size={32} style={{ color: 'var(--color-success)', margin: '0 auto 0.75rem', display: 'block' }} />
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                          Recipe Unlocked!
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                          You have full access to this recipe.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                          <Lock size={20} style={{ color: 'var(--color-primary)' }} />
                          <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>Premium Recipe</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                          {recipe.currency} {recipe.price.toLocaleString()}
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>
                          Purchase this recipe to unlock the complete recipe including all ingredients, step-by-step instructions, chef notes and tips.
                        </p>
                        {session ? (
                          <Link href={`/checkout/${recipe.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            <ShoppingCart size={16} /> Buy Recipe — {recipe.currency} {recipe.price.toLocaleString()}
                          </Link>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link href={`/login?callbackUrl=/recipes/${recipe.slug}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                              Login to Purchase
                            </Link>
                            <Link href="/register" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                              Create Account
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section style={{ padding: '3rem 0 5rem' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '3rem', alignItems: 'start' }}>
              {/* Main Content */}
              <div>
                {/* Ingredients */}
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ color: 'var(--color-primary)' }}>🧄</span> Ingredients
                  </h2>

                  {recipe.ingredients.length > 0 ? (
                    <div style={{
                      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                    }}>
                      {recipe.ingredients.map((ing, i) => (
                        <div key={ing.id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.875rem 1.25rem',
                          borderBottom: i < recipe.ingredients.length - 1 ? '1px solid var(--color-border)' : 'none',
                          background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                        }}>
                          <span style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>{ing.ingredient}</span>
                          <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                            {ing.quantity} {ing.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)' }}>Ingredient details are available upon purchase.</p>
                  )}
                </div>

                {/* Instructions */}
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ color: 'var(--color-primary)' }}>📋</span> Instructions
                  </h2>

                  {hasAccess || !isPremium ? (
                    recipe.steps.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recipe.steps.map((step) => (
                          <div key={step.id} style={{
                            display: 'flex', gap: '1.25rem',
                            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)', padding: '1.25rem',
                          }}>
                            <div style={{
                              minWidth: '36px', height: '36px', borderRadius: '50%',
                              background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: 'var(--font-heading)', fontWeight: 800,
                              color: 'var(--color-primary)', fontSize: '0.9rem',
                            }}>
                              {step.stepNumber}
                            </div>
                            <p style={{ color: 'var(--color-text)', lineHeight: 1.75, margin: 0, paddingTop: '0.25rem', fontSize: '0.975rem' }}>
                              {step.instruction}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--color-text-muted)' }}>No instructions added yet.</p>
                    )
                  ) : (
                    /* Premium lock — only preview shown, full content never sent to browser */
                    <div style={{
                      position: 'relative', overflow: 'hidden',
                      borderRadius: 'var(--radius-lg)',
                    }}>
                      {recipe.steps.slice(0, 1).map((step) => (
                        <div key={step.id} style={{
                          display: 'flex', gap: '1.25rem',
                          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '0.75rem',
                          filter: 'blur(0)',
                        }}>
                          <div style={{
                            minWidth: '36px', height: '36px', borderRadius: '50%',
                            background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.9rem',
                          }}>1</div>
                          <p style={{ color: 'var(--color-text)', lineHeight: 1.75, margin: 0, paddingTop: '0.25rem', fontSize: '0.975rem' }}>
                            {step.instruction}
                          </p>
                        </div>
                      ))}
                      {/* Lock overlay */}
                      <div style={{
                        background: 'linear-gradient(180deg, transparent 0%, var(--color-bg) 100%)',
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
                      }} />
                      <div style={{
                        background: 'var(--color-surface)', border: '1px solid var(--color-border-gold)',
                        borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center',
                        marginTop: '0.75rem',
                      }}>
                        <Lock size={32} style={{ color: 'var(--color-primary)', margin: '0 auto 0.875rem', display: 'block' }} />
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                          Complete Recipe Locked
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '360px', margin: '0 auto 1.5rem' }}>
                          Purchase this recipe to unlock the complete step-by-step instructions, chef notes and professional tips.
                        </p>
                        {session ? (
                          <Link href={`/checkout/${recipe.id}`} className="btn btn-primary">
                            <ShoppingCart size={16} /> Unlock Full Recipe — {recipe.currency} {recipe.price.toLocaleString()}
                          </Link>
                        ) : (
                          <Link href={`/login?callbackUrl=/recipes/${recipe.slug}`} className="btn btn-primary">
                            Login to Purchase
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Chef Notes & Tips — only if access granted */}
                {hasAccess && (
                  <>
                    {recipe.notes.length > 0 && (
                      <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', marginBottom: '1rem' }}>
                          👨‍🍳 Chef Notes
                        </h2>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))',
                          border: '1px solid var(--color-border-gold)', borderRadius: 'var(--radius-md)', padding: '1.5rem',
                        }}>
                          {recipe.notes.map((n, i) => (
                            <div key={n.id} style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, paddingBottom: i < recipe.notes.length - 1 ? '0.75rem' : 0, borderBottom: i < recipe.notes.length - 1 ? '1px solid var(--color-border)' : 'none', marginBottom: i < recipe.notes.length - 1 ? '0.75rem' : 0 }}
                              dangerouslySetInnerHTML={{ __html: n.content }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {recipe.tips.length > 0 && (
                      <div>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', marginBottom: '1rem' }}>
                          💡 Chef Tips
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {recipe.tips.map((tip) => (
                            <div key={tip.id} style={{
                              display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-md)', padding: '1rem',
                            }}>
                              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>✨</span>
                              <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}
                                dangerouslySetInnerHTML={{ __html: tip.content }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* Equipment */}
                {recipe.equipment.length > 0 && (
                  <div style={{
                    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem',
                  }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                      🔪 Equipment Needed
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {recipe.equipment.map((eq) => (
                        <li key={eq.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                          <span style={{ color: 'var(--color-primary)', fontSize: '0.625rem' }}>●</span>
                          {eq.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Nutrition notice */}
                <div style={{
                  background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)', padding: '1.25rem',
                }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
                    Recipe Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[
                      { label: 'Cuisine', value: recipe.cuisine },
                      { label: 'Difficulty', value: recipe.difficulty },
                      { label: 'Servings', value: `${recipe.servings} people` },
                      { label: 'Total Time', value: `${recipe.prepTime + recipe.cookingTime} minutes` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 900px) {
          section > div > div[style*="grid-template-columns: 1fr 420px"],
          section > div > div[style*="grid-template-columns: 1fr 320px"] {
            grid-template-columns: 1fr !important;
          }
          section > div > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}
