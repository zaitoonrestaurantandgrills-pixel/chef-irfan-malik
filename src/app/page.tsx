import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import {
  Utensils, ArrowRight, CheckCircle2, ShieldCheck,
  Clock, BarChart2, Star, Lock, Award, Users, ChevronRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chef Irfan Malik - Master the Recipes Behind Exceptional Flavor',
  description: 'Discover carefully crafted recipes, professional techniques and chef-tested methods from Executive Chef Irfan Malik — Karachi\'s culinary authority.',
};

export const dynamic = 'force-dynamic';

async function getFeaturedRecipes() {
  try {
    const featured = await prisma.recipe.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      take: 6,
      orderBy: { featured: 'desc' },
    });
    return featured;
  } catch {
    return [];
  }
}

async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [recipes, settings] = await Promise.all([
    getFeaturedRecipes(),
    getSiteSettings(),
  ]);

  const heroImage = settings?.heroImage || '/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg';
  const profileImage = settings?.profileImage || '/uploads/gallery/cap-food-safety-award-stage-2026.jpg';

  const biryaniRecipe = recipes.find((r) => r.slug.includes('biryani')) || recipes[0];
  const daalRecipe = recipes.find((r) => r.slug.includes('daal')) || recipes[1] || recipes[0];
  const karahiRecipe = recipes.find((r) => r.slug.includes('karahi')) || recipes[2] || recipes[0];

  return (
    <>
      <Navbar />

      <main>
        {/* ── HERO SECTION ─────────────────────────────────────────── */}
        <section
          style={{
            position: 'relative',
            minHeight: '82vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 1.5rem',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Left Narrative Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                className="font-label-caps"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-primary-fixed)',
                  color: 'var(--color-primary)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  width: 'fit-content',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}
              >
                <Utensils size={13} color="var(--color-primary)" />
                17th CAP Food Safety &amp; Quality Award Winner
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  lineHeight: 1.15,
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                Master the Recipes <br />
                Behind <span style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>Exceptional Flavor.</span>
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'var(--color-secondary)',
                  margin: 0,
                  maxWidth: '540px',
                }}
              >
                Discover carefully crafted recipes, professional techniques and chef-tested methods from Executive Chef Irfan Malik — Karachi&apos;s culinary authority.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                <Link
                  href="/recipes"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    padding: '0.9rem 2rem',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(187, 1, 13, 0.3)',
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
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid var(--color-primary)',
                    color: 'var(--color-primary)',
                    padding: '0.85rem 1.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Meet Chef Irfan
                </Link>
              </div>

              {/* Stats Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--color-border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>15+</div>
                  <div className="font-label-caps" style={{ fontSize: '10px', color: 'var(--color-secondary)' }}>Years of Mastery</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>4+</div>
                  <div className="font-label-caps" style={{ fontSize: '10px', color: 'var(--color-secondary)' }}>Signature Recipes</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>2+</div>
                  <div className="font-label-caps" style={{ fontSize: '10px', color: 'var(--color-secondary)' }}>Masterclasses</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>4+</div>
                  <div className="font-label-caps" style={{ fontSize: '10px', color: 'var(--color-secondary)' }}>Awards</div>
                </div>
              </div>
            </div>

            {/* Right Editorial Portrait Column */}
            <div
              style={{
                position: 'relative',
                height: '560px',
                width: '100%',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                backgroundColor: 'var(--color-surface-low)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Executive Chef Irfan Malik"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <div>
                  <p className="font-label-caps" style={{ color: '#ffffff', opacity: 0.9, fontSize: '11px', margin: '0 0 0.25rem' }}>
                    Executive Chef
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                    Irfan Malik
                  </h3>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '50%',
                    padding: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  }}
                >
                  <ShieldCheck size={22} color="var(--color-primary)" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SIGNATURE RECIPES BENTO GRID ──────────────────────────── */}
        <section
          style={{
            padding: '5rem 1.5rem',
            backgroundColor: 'var(--color-bg)',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '3rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <span
                  className="font-label-caps"
                  style={{
                    color: 'var(--color-primary)',
                    display: 'block',
                    marginBottom: '0.35rem',
                    letterSpacing: '0.12em',
                  }}
                >
                  Curated Selection
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    margin: 0,
                  }}
                >
                  Signature Recipes
                </h2>
              </div>

              <Link
                href="/recipes"
                className="font-label-caps"
                style={{
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '13px',
                }}
              >
                View All Marketplace Recipes
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Bento Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* Card 1: Biryani / Main Masterclass */}
              {biryaniRecipe && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={biryaniRecipe.coverImage || '/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg'}
                      alt={biryaniRecipe.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <span
                        className="font-label-caps"
                        style={{
                          backgroundColor: 'var(--color-tertiary-container)',
                          color: '#ffffff',
                          fontSize: '10px',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Star size={11} /> PREMIUM
                      </span>
                      <span
                        className="font-label-caps"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.92)',
                          color: 'var(--color-primary)',
                          fontSize: '10px',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700,
                        }}
                      >
                        PKR {biryaniRecipe.price || 499}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span className="font-label-caps" style={{ color: 'var(--color-primary)', fontSize: '11px', display: 'block', marginBottom: '0.35rem' }}>
                        {biryaniRecipe.cuisine || 'Pakistani / Mughlai'}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.5rem' }}>
                        {biryaniRecipe.title}
                      </h3>
                      <p style={{ color: 'var(--color-secondary)', fontSize: '14px', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                        {biryaniRecipe.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-secondary)', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {biryaniRecipe.cookingTime || 120} min</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BarChart2 size={14} /> {biryaniRecipe.difficulty}</span>
                      </div>
                      <Link
                        href={`/recipes/${biryaniRecipe.slug}`}
                        style={{
                          color: 'var(--color-primary)',
                          fontWeight: 700,
                          fontSize: '13px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        Unlock Recipe <Lock size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 2: Daal Makhani */}
              {daalRecipe && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={daalRecipe.coverImage || '/uploads/gallery/cap-food-safety-award-stage-2026.jpg'}
                      alt={daalRecipe.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <span
                        className="font-label-caps"
                        style={{
                          backgroundColor: 'var(--color-tertiary-container)',
                          color: '#ffffff',
                          fontSize: '10px',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700,
                        }}
                      >
                        PREMIUM
                      </span>
                      <span
                        className="font-label-caps"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.92)',
                          color: 'var(--color-primary)',
                          fontSize: '10px',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700,
                        }}
                      >
                        PKR {daalRecipe.price || 349}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span className="font-label-caps" style={{ color: 'var(--color-primary)', fontSize: '11px', display: 'block', marginBottom: '0.35rem' }}>
                        {daalRecipe.cuisine || 'Pakistani / Indian'}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.5rem' }}>
                        {daalRecipe.title}
                      </h3>
                      <p style={{ color: 'var(--color-secondary)', fontSize: '14px', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                        {daalRecipe.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-secondary)', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {daalRecipe.cookingTime || 140} min</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BarChart2 size={14} /> {daalRecipe.difficulty}</span>
                      </div>
                      <Link
                        href={`/recipes/${daalRecipe.slug}`}
                        style={{
                          color: 'var(--color-primary)',
                          fontWeight: 700,
                          fontSize: '13px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        Unlock Recipe <Lock size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 3: Chicken Karahi (Free) */}
              {karahiRecipe && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={karahiRecipe.coverImage || '/uploads/gallery/master-chefs-sindh-food-authority-2026.jpg'}
                      alt={karahiRecipe.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                      <span
                        className="font-label-caps"
                        style={{
                          backgroundColor: 'var(--color-success)',
                          color: '#ffffff',
                          fontSize: '10px',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700,
                        }}
                      >
                        FREE
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span className="font-label-caps" style={{ color: 'var(--color-primary)', fontSize: '11px', display: 'block', marginBottom: '0.35rem' }}>
                        {karahiRecipe.cuisine || 'Pakistani'}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.5rem' }}>
                        {karahiRecipe.title}
                      </h3>
                      <p style={{ color: 'var(--color-secondary)', fontSize: '14px', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                        {karahiRecipe.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-secondary)', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {karahiRecipe.cookingTime || 60} min</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BarChart2 size={14} /> {karahiRecipe.difficulty}</span>
                      </div>
                      <Link
                        href={`/recipes/${karahiRecipe.slug}`}
                        style={{
                          color: 'var(--color-primary)',
                          fontWeight: 700,
                          fontSize: '13px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        View Recipe <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── CHEF BIO SECTION (ASYMMETRIC LAYOUT) ───────────────────── */}
        <section
          style={{
            padding: '5rem 1.5rem',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Portrait Column */}
            <div style={{ position: 'relative', maxWidth: '440px', margin: '0 auto', width: '100%' }}>
              <div
                style={{
                  aspectRatio: '4/5',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileImage}
                  alt="Executive Chef Irfan Malik"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Floating Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-1.5rem',
                  right: '-1.5rem',
                  backgroundColor: '#ffffff',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '1rem',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  border: '1px solid var(--color-border-subtle)',
                  maxWidth: '220px',
                }}
              >
                <Award size={26} color="var(--color-tertiary-container)" style={{ marginBottom: '0.35rem' }} />
                <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text)' }}>Sindh Food Authority</div>
                <div style={{ fontSize: '11px', color: 'var(--color-secondary)', marginTop: '0.15rem' }}>Certified Excellence</div>
              </div>
            </div>

            {/* Narrative Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <span
                className="font-label-caps"
                style={{
                  color: 'var(--color-primary)',
                  letterSpacing: '0.12em',
                  fontSize: '11px',
                }}
              >
                The Chef Behind the Craft
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Learn From a Professional Chef
              </h2>

              <p style={{ color: 'var(--color-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
                Executive Chef Irfan Malik is a celebrated culinary master at Zaitoon Restaurant and an esteemed figure in Pakistani gastronomy. Honored by the Consumers Association of Pakistan and Sindh Food Authority, Chef Irfan is dedicated to Michelin-standard food safety, heritage recipes, and culinary education.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-low)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                  }}
                >
                  <ShieldCheck size={24} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text)' }}>Food Safety</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>Michelin-standard</div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface-low)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                  }}
                >
                  <Utensils size={24} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text)' }}>Heritage Recipes</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>Authentic techniques</div>
                  </div>
                </div>
              </div>

              <Link
                href="/about"
                className="font-label-caps"
                style={{
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '13px',
                  marginTop: '0.5rem',
                }}
              >
                Discover Chef Irfan&apos;s Journey
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
