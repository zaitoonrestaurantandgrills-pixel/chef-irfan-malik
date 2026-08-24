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
    title: `${recipe.title} — Chef Irfan Malik`,
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

  // Server-side access check
  let hasAccess = false;
  if (isPremium && session?.user?.id) {
    hasAccess = await hasRecipeAccess(session.user.id, recipe.id);
  }
  if (!isPremium) hasAccess = true;

  return (
    <>
      <Navbar />

      <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        {/* Breadcrumb & Top Bar */}
        <div
          style={{
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: '#ffffff',
            padding: '1rem 0',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}
              className="font-label-caps"
            >
              <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/recipes" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Recipes</Link>
              <span>/</span>
              <span style={{ color: 'var(--color-secondary)' }}>{recipe.title}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section style={{ padding: '3.5rem 0 4rem' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '3.5rem',
                alignItems: 'start',
              }}
            >
              {/* Left Column: Metadata & Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div>
                  <span
                    className="font-label-caps"
                    style={{
                      color: 'var(--color-secondary)',
                      display: 'block',
                      marginBottom: '0.75rem',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {isPremium ? '★ Premium Masterclass' : 'Signature Heritage Dish'}
                  </span>

                  <h1
                    className="font-display-lg-mobile md:font-display-lg"
                    style={{
                      color: 'var(--color-primary)',
                      marginBottom: '1rem',
                      lineHeight: 1.15,
                    }}
                  >
                    {recipe.title}
                  </h1>

                  <p
                    className="font-body-lg"
                    style={{
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {recipe.description}
                  </p>
                </div>

                {/* Metadata Horizontal Tags Row */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    padding: '1.5rem 0',
                    borderTop: '1px solid var(--color-border)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>Cuisine</span>
                    <span className="font-body-md" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{recipe.cuisine || 'Pakistani'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>Difficulty</span>
                    <span className="font-body-md" style={{ fontWeight: 600, color: 'var(--color-primary)', textTransform: 'capitalize' }}>{recipe.difficulty.toLowerCase()}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>Prep Time</span>
                    <span className="font-body-md" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{recipe.prepTime}m</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>Cook Time</span>
                    <span className="font-body-md" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{recipe.cookingTime}m</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>Servings</span>
                    <span className="font-body-md" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{recipe.servings}</span>
                  </div>
                </div>

                {/* Chef Signature Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-ambient)',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-surface-container)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    👨‍🍳
                  </div>
                  <div>
                    <div className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>Crafted By</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-primary)', fontSize: '1rem' }}>
                      Chef Irfan Malik
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 4:5 Photo */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4/5',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-ambient)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-variant)',
                }}
              >
                {recipe.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={recipe.coverImage}
                    alt={recipe.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                    }}
                  >
                    🍽️
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Split: Instructions & Paywall */}
        <section
          style={{
            padding: '4rem 0 6rem',
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '4rem',
                alignItems: 'start',
              }}
            >
              {/* Left Column: Story, Ingredients, Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {/* About This Recipe */}
                <div>
                  <h2 className="font-headline-md" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                    About This Recipe
                  </h2>
                  <p className="font-body-md" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                    {recipe.description}
                  </p>
                </div>

                {/* Ingredients Preview / Checklist */}
                <div>
                  <h2 className="font-headline-md" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                    Ingredients
                  </h2>
                  {recipe.ingredients.length > 0 ? (
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                    >
                      {recipe.ingredients.map((ing) => (
                        <li
                          key={ing.id}
                          className="font-body-md"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            color: 'var(--color-text)',
                            borderBottom: '1px solid var(--color-border-subtle)',
                            paddingBottom: '0.5rem',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-secondary)',
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ flex: 1 }}>{ing.ingredient}</span>
                          <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                            {ing.quantity} {ing.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-body-md" style={{ color: 'var(--color-text-muted)' }}>
                      Full ingredient quantities and seasoning ratios are available upon recipe unlock.
                    </p>
                  )}
                </div>

                {/* Cooking Instructions */}
                <div>
                  <h2 className="font-headline-md" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                    Instructions
                  </h2>

                  {hasAccess || !isPremium ? (
                    recipe.steps.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {recipe.steps.map((step) => (
                          <div
                            key={step.id}
                            style={{
                              display: 'flex',
                              gap: '1.25rem',
                              padding: '1.5rem',
                              backgroundColor: 'var(--color-bg)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '13px',
                                flexShrink: 0,
                              }}
                            >
                              {step.stepNumber}
                            </div>
                            <p
                              className="font-body-md"
                              style={{
                                color: 'var(--color-text)',
                                lineHeight: 1.75,
                                margin: 0,
                                paddingTop: '0.2rem',
                              }}
                            >
                              {step.instruction}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-body-md" style={{ color: 'var(--color-text-muted)' }}>No steps added yet.</p>
                    )
                  ) : (
                    /* Locked Paywall Preview */
                    <div style={{ position: 'relative' }}>
                      {recipe.steps.slice(0, 1).map((step) => (
                        <div
                          key={step.id}
                          style={{
                            display: 'flex',
                            gap: '1.25rem',
                            padding: '1.5rem',
                            backgroundColor: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: '1rem',
                          }}
                        >
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-primary)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '13px',
                              flexShrink: 0,
                            }}
                          >
                            1
                          </div>
                          <p className="font-body-md" style={{ color: 'var(--color-text)', margin: 0 }}>
                            {step.instruction}
                          </p>
                        </div>
                      ))}

                      <div
                        style={{
                          backgroundColor: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '2.5rem 2rem',
                          textAlign: 'center',
                        }}
                      >
                        <Lock size={32} style={{ color: 'var(--color-secondary)', margin: '0 auto 1rem' }} />
                        <h3 className="font-headline-sm" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                          Step-by-step masterclass is locked
                        </h3>
                        <p className="font-body-md" style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                          Purchase this recipe to access the complete technique guide, time markers, chef secret notes, and pro tips.
                        </p>
                        {session ? (
                          <Link href={`/checkout/${recipe.id}`} className="btn btn-primary btn-lg">
                            <ShoppingCart size={16} /> Buy Recipe — {recipe.currency} {recipe.price.toLocaleString()}
                          </Link>
                        ) : (
                          <Link href={`/login?callbackUrl=/recipes/${recipe.slug}`} className="btn btn-primary btn-lg">
                            Sign In to Purchase
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Chef Notes & Tips (if unlocked) */}
                {hasAccess && (
                  <>
                    {recipe.notes.length > 0 && (
                      <div>
                        <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                          Chef&apos;s Pro Notes
                        </h2>
                        <div
                          style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            borderLeft: '4px solid var(--color-secondary)',
                          }}
                        >
                          {recipe.notes.map((n) => (
                            <div
                              key={n.id}
                              className="font-body-md"
                              style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}
                              dangerouslySetInnerHTML={{ __html: n.content }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Column: Sticky Paywall Card or Equipment Sidebar */}
              <div style={{ position: 'sticky', top: '100px' }}>
                {isPremium && !hasAccess ? (
                  <div
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      padding: '2.5rem 2rem',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-ambient)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1.25rem',
                    }}
                  >
                    <Lock size={44} style={{ color: 'var(--color-secondary)' }} />
                    <h3 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0 }}>
                      Available for Purchase
                    </h3>
                    <p className="font-body-md" style={{ color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
                      Unlock lifetime access to the full ingredient list, step-by-step professional techniques, and exclusive chef notes.
                    </p>

                    <div className="font-display-lg-mobile" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                      {recipe.currency} {recipe.price.toLocaleString()}
                    </div>

                    {session ? (
                      <Link
                        href={`/checkout/${recipe.id}`}
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                      >
                        Buy Recipe Now
                      </Link>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        <Link
                          href={`/login?callbackUrl=/recipes/${recipe.slug}`}
                          className="btn btn-primary"
                          style={{ width: '100%' }}
                        >
                          Sign In to Purchase
                        </Link>
                        <Link
                          href="/register"
                          className="btn btn-secondary"
                          style={{ width: '100%' }}
                        >
                          Create Free Account
                        </Link>
                      </div>
                    )}

                    <span className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '11px' }}>
                      Lifetime Access • Masterclass Quality
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      padding: '2rem',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-ambient)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
                      <CheckCircle size={20} />
                      <span className="font-label-caps" style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                        {isPremium ? 'Recipe Unlocked' : 'Free Access'}
                      </span>
                    </div>

                    {recipe.equipment.length > 0 && (
                      <div>
                        <h4 className="font-label-caps" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                          Equipment Required
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {recipe.equipment.map((eq) => (
                            <li key={eq.id} className="font-body-md" style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                              • {eq.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                      <Link href="/recipes" className="font-label-caps" style={{ color: 'var(--color-secondary)', textDecoration: 'none' }}>
                        ← Back to all recipes
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
