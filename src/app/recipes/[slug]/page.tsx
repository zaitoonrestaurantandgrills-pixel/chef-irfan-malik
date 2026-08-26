import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyPurchaseBar from '@/components/StickyPurchaseBar';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import {
  Clock, Users, ChefHat, ShoppingCart, Lock,
  CheckCircle, ArrowLeft, ArrowRight, Utensils,
} from 'lucide-react';
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

  let hasAccess = false;
  if (isPremium && session?.user?.id) {
    hasAccess = await hasRecipeAccess(session.user.id, recipe.id);
  }
  if (!isPremium) hasAccess = true;

  const totalTime = (recipe.prepTime || 0) + (recipe.cookingTime || 0);

  return (
    <>
      <Navbar />

      <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>

        {/* ── CINEMATIC HERO ──────────────────────────────────────── */}
        <section
          style={{
            position: 'relative',
            height: 'clamp(420px, 65vh, 680px)',
            overflow: 'hidden',
            backgroundColor: '#0f0e0c',
          }}
        >
          {/* Background Image */}
          {recipe.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.coverImage}
              alt={recipe.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                opacity: 0.7,
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '6rem',
                background: 'linear-gradient(145deg, #1a1916 0%, #2c2a24 100%)',
              }}
            >
              🍽️
            </div>
          )}

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.45) 50%, rgba(10,9,8,0.2) 100%)',
            }}
          />

          {/* Breadcrumb */}
          <div
            className="container"
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: 0,
              right: 0,
            }}
          >
            <div
              className="font-label-caps"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '10px',
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(8px)',
                padding: '0.35rem 0.875rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <Link href="/recipes" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ArrowLeft size={11} /> Recipes
              </Link>
              <span>/</span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{recipe.title}</span>
            </div>
          </div>

          {/* Hero Text */}
          <div
            className="container"
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: 0,
              right: 0,
            }}
          >
            {/* Badge */}
            {isPremium && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(26,25,0,0.85)',
                  border: '1px solid rgba(233,193,118,0.4)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.875rem',
                  marginBottom: '1rem',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ color: 'var(--color-tertiary-fixed-dim)', fontSize: '10px' }}>✦</span>
                <span
                  className="font-label-caps"
                  style={{ color: 'var(--color-tertiary-fixed-dim)', fontSize: '10px' }}
                >
                  Premium Masterclass
                </span>
              </div>
            )}

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
                maxWidth: '700px',
              }}
            >
              {recipe.title}
            </h1>

            {/* Meta strip */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
              {recipe.cuisine && (
                <span
                  className="font-label-caps"
                  style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  🍽 {recipe.cuisine}
                </span>
              )}
              {totalTime > 0 && (
                <span
                  className="font-label-caps"
                  style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Clock size={12} /> {totalTime} min
                </span>
              )}
              <span
                className="font-label-caps"
                style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'capitalize' }}
              >
                <ChefHat size={12} /> {recipe.difficulty.toLowerCase()}
              </span>
              {recipe.servings && (
                <span
                  className="font-label-caps"
                  style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Users size={12} /> {recipe.servings} servings
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── RECIPE BODY ─────────────────────────────────────────── */}
        <section style={{ padding: '3.5rem 0 6rem' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) 340px',
                gap: '3.5rem',
                alignItems: 'start',
              }}
              className="recipe-detail-grid"
            >

              {/* ── LEFT: Content Column ─────────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', minWidth: 0 }}>

                {/* Chef Signature */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.375rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-ambient)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(145deg, #1b1c1a 0%, #2c2a26 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    }}
                  >
                    👨‍🍳
                  </div>
                  <div>
                    <div className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>
                      Recipe by
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        fontSize: '1.05rem',
                      }}
                    >
                      Chef Irfan Malik
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>
                      Cuisine
                    </div>
                    <div className="font-body-md" style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '14px' }}>
                      {recipe.cuisine || 'Signature'}
                    </div>
                  </div>
                </div>

                {/* About */}
                <div>
                  <h2 className="font-headline-md" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                    About This Recipe
                  </h2>
                  <p className="font-body-md" style={{ color: 'var(--color-text-muted)', lineHeight: 1.85, margin: 0 }}>
                    {recipe.description}
                  </p>
                </div>

                {/* What You'll Learn */}
                {isPremium && !hasAccess && (
                  <div
                    style={{
                      padding: '2rem',
                      background: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-ambient)',
                    }}
                  >
                    <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                      What You&apos;ll Learn
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        'Complete ingredient quantities & professional ratios',
                        `${recipe.steps.length || 'Step-by-step'} professional cooking instructions`,
                        "Chef Irfan's secret spice & technique mastery",
                        'Timing guides, temperatures & serving suggestions',
                        "Chef's personal notes & recipe variations",
                      ].map((item) => (
                        <div
                          key={item}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}
                        >
                          <CheckCircle
                            size={17}
                            style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '1px' }}
                          />
                          <span className="font-body-md" style={{ color: 'var(--color-text)', fontSize: '14px', lineHeight: 1.5 }}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                <div>
                  <h2 className="font-headline-md" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                    Ingredients
                  </h2>

                  {recipe.ingredients.length > 0 ? (
                    <>
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0',
                        }}
                      >
                        {/* Show all if access, else show first 3 */}
                        {(hasAccess ? recipe.ingredients : recipe.ingredients.slice(0, 3)).map((ing) => (
                          <li
                            key={ing.id}
                            className="font-body-md"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '1rem',
                              padding: '0.875rem 0',
                              borderBottom: '1px solid var(--color-border-variant)',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--color-secondary)',
                                  flexShrink: 0,
                                }}
                              />
                              {ing.ingredient}
                            </span>
                            <span style={{ fontWeight: 600, color: 'var(--color-text-muted)', flexShrink: 0, fontSize: '14px' }}>
                              {ing.quantity} {ing.unit}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Blurred preview for locked */}
                      {!hasAccess && isPremium && recipe.ingredients.length > 3 && (
                        <div style={{ position: 'relative', marginTop: '-0.5rem' }}>
                          <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' }}>
                            {recipe.ingredients.slice(3, 6).map((ing) => (
                              <div
                                key={ing.id}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  padding: '0.875rem 0',
                                  borderBottom: '1px solid var(--color-border-variant)',
                                  fontSize: '15px',
                                  color: 'var(--color-text)',
                                }}
                              >
                                <span>●  {ing.ingredient}</span>
                                <span>{ing.quantity} {ing.unit}</span>
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'linear-gradient(to bottom, transparent, rgba(250,249,245,0.8))',
                            }}
                          >
                            <span
                              className="font-label-caps"
                              style={{ color: 'var(--color-text-subtle)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <Lock size={12} /> Unlock to see all {recipe.ingredients.length} ingredients
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="font-body-md" style={{ color: 'var(--color-text-muted)' }}>
                      Full ingredient list is available upon recipe unlock.
                    </p>
                  )}
                </div>

                {/* Instructions */}
                <div>
                  <h2 className="font-headline-md" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                    Instructions
                  </h2>

                  {hasAccess ? (
                    recipe.steps.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {recipe.steps.map((step) => (
                          <div
                            key={step.id}
                            style={{
                              display: 'flex',
                              gap: '1.25rem',
                              padding: '1.5rem',
                              backgroundColor: '#ffffff',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-lg)',
                            }}
                          >
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                minWidth: '32px',
                                borderRadius: '50%',
                                background: 'var(--color-primary)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '13px',
                              }}
                            >
                              {step.stepNumber}
                            </div>
                            <p
                              className="font-body-md"
                              style={{ color: 'var(--color-text)', lineHeight: 1.8, margin: 0, paddingTop: '0.2rem' }}
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
                    /* ── Locked Premium Content ── */
                    <div>
                      {/* Show step 1 as teaser */}
                      {recipe.steps.slice(0, 1).map((step) => (
                        <div
                          key={step.id}
                          style={{
                            display: 'flex',
                            gap: '1.25rem',
                            padding: '1.5rem',
                            backgroundColor: '#ffffff',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '1rem',
                          }}
                        >
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              minWidth: '32px',
                              borderRadius: '50%',
                              background: 'var(--color-primary)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '13px',
                            }}
                          >
                            1
                          </div>
                          <p className="font-body-md" style={{ color: 'var(--color-text)', lineHeight: 1.8, margin: 0, paddingTop: '0.2rem' }}>
                            {step.instruction}
                          </p>
                        </div>
                      ))}

                      {/* Premium Lock Panel */}
                      <div
                        style={{
                          background: 'linear-gradient(145deg, #1b1c1a 0%, #2c2a26 100%)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '3rem 2rem',
                          textAlign: 'center',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: 'rgba(233,193,118,0.15)',
                            border: '1px solid rgba(233,193,118,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                          }}
                        >
                          <Lock size={24} style={{ color: 'var(--color-tertiary-fixed-dim)' }} />
                        </div>

                        <h3
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#ffffff',
                            marginBottom: '0.75rem',
                          }}
                        >
                          The Full Recipe Is Waiting
                        </h3>
                        <p
                          className="font-body-md"
                          style={{
                            color: 'rgba(255,255,255,0.65)',
                            maxWidth: '420px',
                            margin: '0 auto 2rem',
                            lineHeight: 1.7,
                          }}
                        >
                          Unlock Chef Irfan Malik&apos;s complete recipe including professional techniques, exact quantities and chef&apos;s personal notes.
                        </p>

                        <div
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: 'var(--color-tertiary-fixed-dim)',
                            marginBottom: '1.5rem',
                          }}
                        >
                          {recipe.currency} {recipe.price.toLocaleString()}
                        </div>

                        {session ? (
                          <Link
                            href={`/checkout/${recipe.id}`}
                            className="btn btn-lg"
                            style={{
                              background: 'var(--color-secondary)',
                              color: '#ffffff',
                              border: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            <ShoppingCart size={16} />
                            Unlock Recipe — {recipe.currency} {recipe.price.toLocaleString()}
                          </Link>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', maxWidth: '280px', margin: '0 auto' }}>
                            <Link
                              href={`/login?callbackUrl=/recipes/${recipe.slug}`}
                              className="btn btn-lg"
                              style={{ width: '100%', background: 'var(--color-secondary)', color: '#ffffff', border: 'none', justifyContent: 'center' }}
                            >
                              Sign In to Unlock
                            </Link>
                            <Link
                              href="/register"
                              className="btn btn-lg"
                              style={{ width: '100%', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', justifyContent: 'center' }}
                            >
                              Create Free Account
                            </Link>
                          </div>
                        )}

                        <p
                          className="font-label-caps"
                          style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '1.25rem' }}
                        >
                          🔒 Secure checkout · Instant access after payment · Lifetime access
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chef Notes (if unlocked) */}
                {hasAccess && recipe.notes.length > 0 && (
                  <div>
                    <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                      Chef&apos;s Pro Notes
                    </h2>
                    <div
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--color-border)',
                        borderLeft: '4px solid var(--color-secondary)',
                        borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
                      }}
                    >
                      {recipe.notes.map((n) => (
                        <div
                          key={n.id}
                          className="font-body-md"
                          style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}
                          dangerouslySetInnerHTML={{ __html: n.content }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips (if unlocked) */}
                {hasAccess && recipe.tips.length > 0 && (
                  <div>
                    <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                      Chef&apos;s Tips
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {recipe.tips.map((tip) => (
                        <div
                          key={tip.id}
                          style={{
                            display: 'flex',
                            gap: '0.75rem',
                            padding: '1rem 1.25rem',
                            background: 'var(--color-surface-low)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border-variant)',
                          }}
                        >
                          <span style={{ fontSize: '1rem', flexShrink: 0 }}>💡</span>
                          <p className="font-body-md" style={{ color: 'var(--color-text)', margin: 0, lineHeight: 1.65, fontSize: '14px' }}>
                            {tip.tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back to recipes */}
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <Link
                    href="/recipes"
                    className="font-label-caps"
                    style={{ color: 'var(--color-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px' }}
                  >
                    <ArrowLeft size={13} /> Back to all recipes
                  </Link>
                </div>
              </div>

              {/* ── RIGHT: Sticky Sidebar ─────────────────────────── */}
              <aside style={{ position: 'sticky', top: '88px' }}>

                {/* Purchase Card / Access Card */}
                {isPremium && !hasAccess ? (
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    }}
                  >
                    {/* Card Image Preview */}
                    {recipe.coverImage && (
                      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={recipe.coverImage}
                          alt={recipe.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,0.15)',
                              border: '2px solid rgba(255,255,255,0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Lock size={20} color="#ffffff" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ padding: '1.75rem' }}>
                      {/* Badge */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: 'var(--color-tertiary-container)',
                          border: '1px solid rgba(233,193,118,0.3)',
                          borderRadius: 'var(--radius-full)',
                          padding: '0.3rem 0.75rem',
                          marginBottom: '1.25rem',
                        }}
                      >
                        <span style={{ color: 'var(--color-tertiary-fixed-dim)', fontSize: '9px' }}>✦</span>
                        <span
                          className="font-label-caps"
                          style={{ color: 'var(--color-on-tertiary-container)', fontSize: '9px' }}
                        >
                          Premium Recipe
                        </span>
                      </div>

                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '2.25rem',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                          lineHeight: 1,
                          marginBottom: '0.35rem',
                        }}
                      >
                        {recipe.currency} {recipe.price.toLocaleString()}
                      </div>
                      <div
                        className="font-label-caps"
                        style={{ color: 'var(--color-success)', fontSize: '10px', marginBottom: '1.5rem' }}
                      >
                        One-time purchase · Lifetime access
                      </div>

                      {/* Checklist */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.75rem' }}>
                        {[
                          'Full ingredients with quantities',
                          'Step-by-step instructions',
                          "Chef's techniques & tips",
                          'Timing & temperature guidance',
                          "Chef's personal notes",
                        ].map((item) => (
                          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <CheckCircle size={14} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      {session ? (
                        <Link
                          href={`/checkout/${recipe.id}`}
                          className="btn btn-primary btn-lg"
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          Unlock Recipe →
                        </Link>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                          <Link
                            href={`/login?callbackUrl=/recipes/${recipe.slug}`}
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                          >
                            Sign In to Unlock
                          </Link>
                          <Link
                            href="/register"
                            className="btn btn-secondary"
                            style={{ width: '100%', justifyContent: 'center' }}
                          >
                            Create Free Account
                          </Link>
                        </div>
                      )}

                      <p
                        className="font-label-caps"
                        style={{
                          textAlign: 'center',
                          color: 'var(--color-text-subtle)',
                          fontSize: '10px',
                          marginTop: '1.125rem',
                        }}
                      >
                        🔒 Secure checkout · Instant access after payment
                      </p>
                    </div>
                  </div>
                ) : (
                  /* ── Unlocked Sidebar ── */
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.75rem',
                      boxShadow: 'var(--shadow-ambient)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
                      <span
                        className="font-label-caps"
                        style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '11px' }}
                      >
                        {isPremium ? '✓ Recipe Unlocked' : '✓ Free Access'}
                      </span>
                    </div>

                    {/* Quick Stats */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        paddingBottom: '1.5rem',
                        borderBottom: '1px solid var(--color-border)',
                      }}
                    >
                      {[
                        { label: 'Prep Time', value: `${recipe.prepTime}m` },
                        { label: 'Cook Time', value: `${recipe.cookingTime}m` },
                        { label: 'Servings', value: `${recipe.servings}` },
                        { label: 'Difficulty', value: recipe.difficulty.toLowerCase() },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px', marginBottom: '0.2rem' }}>
                            {label}
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontWeight: 700,
                              color: 'var(--color-primary)',
                              fontSize: '14px',
                              textTransform: 'capitalize',
                            }}
                          >
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Equipment */}
                    {recipe.equipment.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4
                          className="font-label-caps"
                          style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', fontSize: '11px' }}
                        >
                          <Utensils size={13} style={{ display: 'inline', marginRight: '0.35rem' }} />
                          Equipment Required
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {recipe.equipment.map((eq) => (
                            <li key={eq.id} style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-border)', flexShrink: 0 }} />
                              {eq.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      href="/recipes"
                      className="font-label-caps"
                      style={{ color: 'var(--color-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px' }}
                    >
                      <ArrowLeft size={12} /> Browse more recipes
                    </Link>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Sticky Purchase Bar */}
      {isPremium && !hasAccess && (
        <StickyPurchaseBar
          recipeId={recipe.id}
          recipeSlug={recipe.slug}
          price={recipe.price}
          currency={recipe.currency}
          isLoggedIn={!!session?.user}
        />
      )}

      <Footer />
    </>
  );
}
