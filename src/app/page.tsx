import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import RecipeCard from '@/components/RecipeCard';
import { Award, Star, Clock, Users, ArrowRight, Lock, BookOpen, Trophy } from 'lucide-react';

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

    // If none are explicitly featured, return published recipes
    return await prisma.recipe.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

async function getAchievements() {
  try {
    return await prisma.achievement.findMany({
      take: 4,
      orderBy: { sortOrder: 'asc' },
    });
  } catch {
    return [];
  }
}

async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
    });
  } catch {
    return null;
  }
}

async function getStats() {
  try {
    const [recipeCount, freeCount, premiumCount, achievementCount] = await Promise.all([
      prisma.recipe.count({ where: { status: 'PUBLISHED' } }),
      prisma.recipe.count({ where: { status: 'PUBLISHED', type: 'FREE' } }),
      prisma.recipe.count({ where: { status: 'PUBLISHED', type: 'PREMIUM' } }),
      prisma.achievement.count(),
    ]);
    return { recipeCount, freeCount, premiumCount, achievementCount };
  } catch {
    return { recipeCount: 0, freeCount: 0, premiumCount: 0, achievementCount: 0 };
  }
}

export default async function HomePage() {
  const [featuredRecipes, testimonials, achievements, settings, stats] = await Promise.all([
    getFeaturedRecipes(),
    getTestimonials(),
    getAchievements(),
    getSiteSettings(),
    getStats(),
  ]);

  const heroImage = settings?.heroImage || '/uploads/gallery/cap-food-safety-award-stage-2026.jpg';
  const profileImage = settings?.profileImage || '/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg';

  return (
    <>
      <Navbar />

      <main>
        {/* ── HERO SECTION ────────────────────────────────────────── */}
        <header
          style={{
            paddingTop: '3.5rem',
            paddingBottom: '4.5rem',
            maxWidth: 'var(--container-max-width)',
            margin: '0 auto',
          }}
          className="container"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Copy */}
            <div>
              <div
                className="font-label-caps"
                style={{
                  color: 'var(--color-secondary)',
                  marginBottom: '1rem',
                  letterSpacing: '0.15em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Trophy size={14} /> 17th CAP Food Safety & Quality Award Winner
              </div>

              <h1
                className="font-display-lg-mobile md:font-display-lg"
                style={{
                  color: 'var(--color-primary)',
                  marginBottom: '1.25rem',
                  lineHeight: 1.1,
                }}
              >
                Crafting Flavors.
                <br />
                Sharing Knowledge.
              </h1>

              <p
                className="font-body-lg"
                style={{
                  color: 'var(--color-text-muted)',
                  marginBottom: '2.5rem',
                  maxWidth: '500px',
                  lineHeight: 1.7,
                }}
              >
                Discover authentic heritage recipes, professional kitchen techniques, and culinary masterclasses by Executive Chef Irfan Malik.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/recipes" className="btn btn-primary btn-lg">
                  Explore Recipes
                </Link>
                <Link href="/gallery" className="btn btn-secondary btn-lg">
                  View Awards & Gallery
                </Link>
              </div>
            </div>

            {/* Right Hero Image (Customer / Real Photo) */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4/3',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-ambient)',
                backgroundColor: 'var(--color-surface-variant)',
                border: '1px solid var(--color-border)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Chef Irfan Malik at 17th Consumers Food Safety & Quality Awards Ceremony"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(6px)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                }}
              >
                <div className="font-label-caps" style={{ color: 'var(--color-tertiary-fixed)', fontSize: '10px' }}>
                  National Recognition
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 600 }}>
                  17th Consumers Food Safety & Quality Awards • PC Karachi
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── SIGNATURE RECIPES SECTION ───────────────────────────── */}
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '3rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem',
              }}
            >
              <div>
                <span className="font-label-caps" style={{ color: 'var(--color-secondary)' }}>Curated Selection</span>
                <h2 className="font-headline-lg" style={{ color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                  Signature Recipes
                </h2>
              </div>
              <Link
                href="/recipes"
                className="font-label-caps"
                style={{
                  color: 'var(--color-primary)',
                  borderBottom: '1px solid var(--color-tertiary-fixed-dim)',
                  paddingBottom: '2px',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                View All →
              </Link>
            </div>

            {featuredRecipes.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2.5rem',
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
                  padding: '4rem 2rem',
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <BookOpen size={48} style={{ color: 'var(--color-text-subtle)', margin: '0 auto 1rem', display: 'block' }} />
                <h3 className="font-headline-sm" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  Recipes Available in Marketplace
                </h3>
                <Link href="/recipes" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Browse All Recipes
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── ABOUT / MASTERING THE CRAFT SECTION ─────────────────── */}
        <section style={{ padding: '6rem 0' }} className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            {/* Left Real Customer / Chef Photo */}
            <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
              <div
                style={{
                  aspectRatio: '4/3',
                  backgroundColor: '#ffffff',
                  padding: '0.75rem',
                  boxShadow: 'var(--shadow-ambient)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileImage}
                  alt="Executive Chef Irfan Malik"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
              </div>
            </div>

            {/* Right Story & Stats */}
            <div>
              <span className="font-label-caps" style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.75rem' }}>
                The Philosophy & Heritage
              </span>

              <h2 className="font-headline-lg" style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                Mastering the Craft
              </h2>

              <p
                className="font-body-lg"
                style={{
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.8,
                  marginBottom: '2.5rem',
                }}
              >
                {settings?.biography || 'Executive Chef Irfan Malik brings years of dedication at Zaitoon Restaurant and prominent culinary institutions. Honored for exemplary food safety and gastronomic craftsmanship, his recipes blend traditional Pakistani heritage with contemporary techniques.'}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div className="font-display-lg-mobile" style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                    15+
                  </div>
                  <div className="font-label-caps" style={{ color: 'var(--color-text-muted)' }}>
                    Years Experience
                  </div>
                </div>

                <div>
                  <div className="font-display-lg-mobile" style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                    {stats.recipeCount > 0 ? `${stats.recipeCount}+` : '100+'}
                  </div>
                  <div className="font-label-caps" style={{ color: 'var(--color-text-muted)' }}>
                    Signature Recipes
                  </div>
                </div>

                <div>
                  <div className="font-display-lg-mobile" style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                    {stats.achievementCount > 0 ? `${stats.achievementCount}+` : '10+'}
                  </div>
                  <div className="font-label-caps" style={{ color: 'var(--color-text-muted)' }}>
                    Honors & Awards
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS SECTION ─────────────────────────────────── */}
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
                <span className="font-label-caps" style={{ color: 'var(--color-secondary)' }}>Testimonials</span>
                <h2 className="font-headline-lg" style={{ color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                  What People Say
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '2rem',
                }}
              >
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '2rem',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-ambient)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', color: '#e9c176' }}>
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} size={15} fill="#e9c176" />
                      ))}
                    </div>
                    <p className="font-body-md" style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="font-label-caps" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                      {t.customerName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CALL TO ACTION SECTION ──────────────────────────────── */}
        <section
          style={{
            padding: '5rem 0',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
          }}
        >
          <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
            <span className="font-label-caps" style={{ color: 'var(--color-tertiary-fixed-dim)', letterSpacing: '0.15em' }}>
              Begin Your Culinary Journey
            </span>
            <h2 className="font-headline-lg" style={{ color: '#ffffff', margin: '1rem 0 1.5rem' }}>
              Master the Recipes of Chef Irfan
            </h2>
            <p className="font-body-lg" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Access full ingredient breakdowns, precise timing guides, and exclusive technique notes to elevate your dining table.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/recipes"
                className="btn btn-lg"
                style={{
                  background: 'var(--color-secondary)',
                  color: '#ffffff',
                  border: 'none',
                }}
              >
                Browse Marketplace
              </Link>
              <Link
                href="/contact"
                className="btn btn-lg"
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
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
