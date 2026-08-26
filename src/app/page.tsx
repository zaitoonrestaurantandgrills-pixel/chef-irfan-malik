import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import RecipeCard from '@/components/RecipeCard';
import { Award, Star, Clock, Trophy, ArrowRight, CheckCircle, ChefHat, BookOpen, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chef Irfan Malik — Crafting Flavors. Sharing Knowledge.',
  description: 'Discover professional recipes, culinary techniques and carefully crafted dishes by Executive Chef Irfan Malik. Premium Pakistani and international gastronomy.',
};

export const dynamic = 'force-dynamic';

async function getFeaturedRecipes() {
  try {
    const featured = await prisma.recipe.findMany({
      where: { status: 'PUBLISHED', featured: true },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
    if (featured.length > 0) return featured;
    return await prisma.recipe.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  } catch { return []; }
}

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
  } catch { return []; }
}

async function getStats() {
  try {
    const [recipeCount, premiumCount, achievementCount] = await Promise.all([
      prisma.recipe.count({ where: { status: 'PUBLISHED' } }),
      prisma.recipe.count({ where: { status: 'PUBLISHED', type: 'PREMIUM' } }),
      prisma.achievement.count(),
    ]);
    return { recipeCount, premiumCount, achievementCount };
  } catch {
    return { recipeCount: 0, premiumCount: 0, achievementCount: 0 };
  }
}

async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  } catch { return null; }
}

export default async function HomePage() {
  const [featuredRecipes, testimonials, settings, stats] = await Promise.all([
    getFeaturedRecipes(),
    getTestimonials(),
    getSiteSettings(),
    getStats(),
  ]);

  const heroImage = settings?.heroImage || '/uploads/gallery/cap-food-safety-award-stage-2026.jpg';
  const profileImage = settings?.profileImage || '/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg';

  return (
    <>
      <Navbar />

      <main>

        {/* ── HERO SECTION ─────────────────────────────────────────── */}
        <section
          style={{
            position: 'relative',
            minHeight: '92vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: '#0f0e0c',
          }}
        >
          {/* Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Chef Irfan Malik"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.5,
            }}
          />

          {/* Dark Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(105deg, rgba(15,14,12,0.85) 0%, rgba(15,14,12,0.55) 55%, rgba(15,14,12,0.25) 100%)',
            }}
          />

          {/* Hero Content */}
          <div
            className="container"
            style={{
              position: 'relative',
              zIndex: 2,
              paddingTop: '5rem',
              paddingBottom: '5rem',
              maxWidth: '780px',
            }}
          >
            {/* Eyebrow */}
            <div
              className="font-label-caps"
              style={{
                color: 'var(--color-tertiary-fixed-dim)',
                marginBottom: '1.5rem',
                letterSpacing: '0.2em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.875rem',
                border: '1px solid rgba(233,193,118,0.3)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <Trophy size={12} />
              17th CAP Food Safety &amp; Quality Award Winner
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '1.5rem',
              }}
            >
              Master the Recipes
              <br />
              <span style={{ color: 'var(--color-tertiary-fixed-dim)' }}>Behind Exceptional</span>
              <br />
              Flavor.
            </h1>

            {/* Sub-headline */}
            <p
              className="font-body-lg"
              style={{
                color: 'rgba(255,255,255,0.75)',
                marginBottom: '2.5rem',
                maxWidth: '520px',
                lineHeight: 1.7,
              }}
            >
              Discover carefully crafted recipes, professional techniques and chef-tested methods from Executive Chef Irfan Malik — Karachi&apos;s culinary authority.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href="/recipes"
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
                Explore Premium Recipes
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="btn btn-lg"
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}
              >
                Meet Chef Irfan
              </Link>
            </div>

            {/* Trust Strip */}
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                marginTop: '3.5rem',
                flexWrap: 'wrap',
              }}
            >
              {[
                { icon: '🏆', label: 'Award Winner' },
                { icon: '👨‍🍳', label: '15+ Yrs Experience' },
                { icon: '📖', label: `${stats.recipeCount > 0 ? stats.recipeCount + '+' : '100+'} Recipes` },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                  <span
                    className="font-label-caps"
                    style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ───────────────────────────────────────────── */}
        <section
          style={{
            backgroundColor: 'var(--color-primary)',
            padding: '2.25rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '2rem',
                textAlign: 'center',
              }}
            >
              {[
                { value: '15+', label: 'Years of Mastery' },
                { value: stats.recipeCount > 0 ? `${stats.recipeCount}+` : '50+', label: 'Signature Recipes' },
                { value: stats.premiumCount > 0 ? `${stats.premiumCount}+` : '30+', label: 'Premium Masterclasses' },
                { value: stats.achievementCount > 0 ? `${stats.achievementCount}+` : '10+', label: 'Honors & Awards' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                      fontWeight: 700,
                      color: 'var(--color-tertiary-fixed-dim)',
                      lineHeight: 1,
                      marginBottom: '0.375rem',
                    }}
                  >
                    {value}
                  </div>
                  <div
                    className="font-label-caps"
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: '10px' }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED RECIPES ─────────────────────────────────────── */}
        <section
          style={{
            padding: '5rem 0',
            backgroundColor: 'var(--color-bg)',
          }}
        >
          <div className="container">
            {/* Section Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '3rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div>
                <span
                  className="font-label-caps"
                  style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.4rem' }}
                >
                  Curated Selection
                </span>
                <h2
                  className="font-headline-lg"
                  style={{ color: 'var(--color-primary)', margin: 0 }}
                >
                  Signature Recipes
                </h2>
              </div>
              <Link
                href="/recipes"
                className="font-label-caps"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--color-primary)',
                  borderBottom: '1px solid var(--color-tertiary-fixed-dim)',
                  paddingBottom: '2px',
                  textDecoration: 'none',
                  fontSize: '11px',
                }}
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>

            {featuredRecipes.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.75rem',
                }}
              >
                {featuredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '5rem 2rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
                <h3
                  className="font-headline-sm"
                  style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}
                >
                  Recipes Coming Soon
                </h3>
                <p className="font-body-md" style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Chef Irfan is crafting the first batch of premium recipes.
                </p>
                <Link href="/recipes" className="btn btn-primary">
                  Browse Marketplace
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── WHAT YOU'LL GET (Purchase Motivation) ─────────────────── */}
        <section
          style={{
            padding: '5rem 0',
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--color-border-variant)',
            borderBottom: '1px solid var(--color-border-variant)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '4rem',
                alignItems: 'center',
              }}
            >
              {/* Left: Text */}
              <div>
                <span
                  className="font-label-caps"
                  style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.75rem' }}
                >
                  Premium Recipe Access
                </span>
                <h2
                  className="font-headline-lg"
                  style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}
                >
                  Unlock the Complete
                  <br />
                  Chef Experience
                </h2>
                <p
                  className="font-body-lg"
                  style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: '2rem' }}
                >
                  Every premium recipe gives you direct access to professional-grade knowledge — the same techniques used in Michelin-standard kitchens.
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 2.5rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.875rem',
                  }}
                >
                  {[
                    'Complete ingredient quantities & ratios',
                    'Step-by-step professional instructions',
                    "Chef Irfan's secret techniques",
                    'Timing & temperature guidance',
                    'Serving suggestions & plating tips',
                    "Chef's personal notes & variations",
                  ].map((item) => (
                    <li
                      key={item}
                      className="font-body-md"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: 'var(--color-text)',
                      }}
                    >
                      <CheckCircle
                        size={17}
                        style={{ color: 'var(--color-secondary)', flexShrink: 0 }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/recipes"
                  className="btn btn-primary btn-lg"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Explore Signature Recipes
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Right: Premium Visual Card */}
              <div>
                <div
                  style={{
                    background: 'linear-gradient(145deg, #1b1c1a 0%, #2c2a26 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2.5rem',
                    color: '#ffffff',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(233,193,118,0.15)',
                      border: '1px solid rgba(233,193,118,0.3)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.3rem 0.875rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <span style={{ fontSize: '10px', color: 'var(--color-tertiary-fixed-dim)' }}>✦</span>
                    <span
                      className="font-label-caps"
                      style={{ color: 'var(--color-tertiary-fixed-dim)', fontSize: '10px' }}
                    >
                      Premium Recipe
                    </span>
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                    }}
                  >
                    Chicken Karahi
                  </div>
                  <div
                    className="font-label-caps"
                    style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '1.5rem' }}
                  >
                    Authentic Pakistani Cuisine · Intermediate · 45 min
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      paddingTop: '1.5rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {[
                      'Full ingredient list with exact quantities',
                      '12 professional cooking steps',
                      "Chef's secret spice blend technique",
                    ].map((item) => (
                      <div
                        key={item}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <CheckCircle size={15} style={{ color: 'var(--color-tertiary-fixed-dim)', flexShrink: 0 }} />
                        <span
                          className="font-body-md"
                          style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      paddingTop: '1.25rem',
                    }}
                  >
                    <div>
                      <div
                        className="font-label-caps"
                        style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}
                      >
                        One-time unlock
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.75rem',
                          fontWeight: 700,
                          color: 'var(--color-tertiary-fixed-dim)',
                        }}
                      >
                        PKR 499
                      </div>
                    </div>
                    <Link
                      href="/recipes"
                      className="btn"
                      style={{
                        background: 'var(--color-secondary)',
                        color: '#ffffff',
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      Unlock Recipe →
                    </Link>
                  </div>

                  <div
                    className="font-label-caps"
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: '10px',
                      marginTop: '1.25rem',
                    }}
                  >
                    🔒 Secure checkout · Instant access after payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT CHEF IRFAN ─────────────────────────────────────── */}
        <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--color-bg)' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '4rem',
                alignItems: 'center',
              }}
            >
              {/* Photo */}
              <div style={{ maxWidth: '460px', margin: '0 auto', width: '100%' }}>
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '4/5',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileImage}
                    alt="Executive Chef Irfan Malik"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Award badge overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1.25rem',
                      left: '1.25rem',
                      right: '1.25rem',
                      background: 'rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.875rem 1.125rem',
                      border: '1px solid rgba(233,193,118,0.25)',
                    }}
                  >
                    <div
                      className="font-label-caps"
                      style={{ color: 'var(--color-tertiary-fixed-dim)', fontSize: '9px', marginBottom: '0.25rem' }}
                    >
                      🏆 National Recognition
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      17th Consumers Food Safety & Quality Award
                    </div>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div>
                <span
                  className="font-label-caps"
                  style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.75rem' }}
                >
                  The Chef Behind the Craft
                </span>
                <h2
                  className="font-headline-lg"
                  style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}
                >
                  Learn From a
                  <br />
                  Professional Chef
                </h2>
                <p
                  className="font-body-lg"
                  style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}
                >
                  {settings?.biography ||
                    'Executive Chef Irfan Malik brings years of dedication at Zaitoon Restaurant and prominent culinary institutions. Honored for exemplary food safety and gastronomic craftsmanship, his recipes blend traditional Pakistani heritage with contemporary techniques.'}
                </p>

                {/* Trust Badges */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.25rem',
                    padding: '1.75rem 0',
                    borderTop: '1px solid var(--color-border)',
                    marginBottom: '2rem',
                  }}
                >
                  {[
                    { icon: <ChefHat size={20} />, value: '15+', label: 'Years Experience' },
                    { icon: <BookOpen size={20} />, value: stats.recipeCount > 0 ? `${stats.recipeCount}+` : '50+', label: 'Recipes' },
                    { icon: <Award size={20} />, value: stats.achievementCount > 0 ? `${stats.achievementCount}+` : '10+', label: 'Awards' },
                  ].map(({ icon, value, label }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--color-secondary)', marginBottom: '0.375rem', display: 'flex', justifyContent: 'center' }}>
                        {icon}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.75rem',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </div>
                      <div
                        className="font-label-caps"
                        style={{ color: 'var(--color-text-subtle)', fontSize: '10px', marginTop: '0.25rem' }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/about"
                  className="btn btn-secondary btn-lg"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Discover Chef Irfan&apos;s Journey
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
        {testimonials.length > 0 && (
          <section
            style={{
              padding: '5rem 0',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--color-border-variant)',
            }}
          >
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <span
                  className="font-label-caps"
                  style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.5rem' }}
                >
                  Social Proof
                </span>
                <h2
                  className="font-headline-lg"
                  style={{ color: 'var(--color-primary)', margin: 0 }}
                >
                  Loved by Home Cooks
                  <br />
                  &amp; Food Enthusiasts
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.75rem',
                }}
              >
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '2rem',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-ambient)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.2rem',
                        marginBottom: '1.25rem',
                        color: 'var(--color-tertiary-fixed-dim)',
                      }}
                    >
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} size={15} fill="var(--color-tertiary-fixed-dim)" />
                      ))}
                    </div>
                    <p
                      className="font-body-md"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontStyle: 'italic',
                        marginBottom: '1.5rem',
                        lineHeight: 1.7,
                      }}
                    >
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div
                      className="font-label-caps"
                      style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '11px' }}
                    >
                      {t.customerName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FINAL CTA STRIP ──────────────────────────────────────── */}
        <section
          style={{
            padding: '5rem 0',
            background: 'linear-gradient(135deg, #1b1c1a 0%, #2c2a26 100%)',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ maxWidth: '680px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(233,193,118,0.12)',
                border: '1px solid rgba(233,193,118,0.25)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.875rem',
                marginBottom: '1.75rem',
              }}
            >
              <ShieldCheck size={13} style={{ color: 'var(--color-tertiary-fixed-dim)' }} />
              <span
                className="font-label-caps"
                style={{ color: 'var(--color-tertiary-fixed-dim)', fontSize: '10px' }}
              >
                Secure Checkout · Instant Access
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.2,
                margin: '0 0 1.25rem',
              }}
            >
              Begin Your Culinary Journey
              <br />
              with Chef Irfan
            </h2>

            <p
              className="font-body-lg"
              style={{
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
              }}
            >
              Access full ingredient breakdowns, precise timing guides, and exclusive technique notes to elevate your cooking.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/recipes"
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
                Browse Marketplace
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="btn btn-lg"
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                Book Private Masterclass
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
