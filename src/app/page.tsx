import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import RecipeCard from '@/components/RecipeCard';
import { Award, Star, Clock, Users, ChevronRight, Flame, BookOpen, Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chef Irfan Malik — Crafting Flavors. Sharing Knowledge.',
  description: 'Professional chef portfolio and premium digital recipe marketplace. Discover authentic Pakistani recipes crafted by Chef Irfan Malik.',
};

export const dynamic = 'force-dynamic';

async function getFeaturedRecipes() {
  try {
    return await prisma.recipe.findMany({
      where: { status: 'PUBLISHED', featured: true },
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
      take: 4,
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

async function getStats() {
  try {
    const [recipeCount, freeCount, premiumCount] = await Promise.all([
      prisma.recipe.count({ where: { status: 'PUBLISHED' } }),
      prisma.recipe.count({ where: { status: 'PUBLISHED', type: 'FREE' } }),
      prisma.recipe.count({ where: { status: 'PUBLISHED', type: 'PREMIUM' } }),
    ]);
    return { recipeCount, freeCount, premiumCount };
  } catch {
    return { recipeCount: 0, freeCount: 0, premiumCount: 0 };
  }
}

export default async function HomePage() {
  const [featuredRecipes, testimonials, achievements, stats] = await Promise.all([
    getFeaturedRecipes(),
    getTestimonials(),
    getAchievements(),
    getStats(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO ────────────────────────────────────────────────── */}
        <section style={{
          minHeight: '95vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #111111 50%, #0D0D0D 100%)',
          marginTop: '-72px',
          paddingTop: '72px',
        }}>
          {/* Decorative background */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(201,168,76,0.05) 0%, transparent 40%),
              radial-gradient(circle at 60% 80%, rgba(201,168,76,0.04) 0%, transparent 40%)
            `,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A84C\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'center',
            }}>
              {/* Left Content */}
              <div style={{ animation: 'fadeInUp 0.8s ease' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                  borderRadius: '999px', padding: '0.375rem 1rem', marginBottom: '1.5rem',
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', animation: 'pulse-gold 2s infinite' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    Professional Chef Portfolio
                  </span>
                </div>

                <h1 className="heading-display" style={{ marginBottom: '0.75rem' }}>
                  Chef{' '}
                  <span className="gradient-text">Irfan</span>
                  <br />Malik
                </h1>

                <p style={{
                  fontSize: '1.1rem', color: 'var(--color-text-muted)',
                  letterSpacing: '0.04em', marginBottom: '1rem', fontStyle: 'italic',
                  fontFamily: 'var(--font-heading)',
                }}>
                  Professional Chef · Culinary Expert · Recipe Creator
                </p>

                <p style={{
                  fontSize: '1.05rem', color: 'var(--color-text-muted)',
                  maxWidth: '500px', lineHeight: 1.8, marginBottom: '2.5rem',
                }}>
                  Discover carefully crafted recipes, professional culinary techniques
                  and the passion behind every dish.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                  <Link href="/recipes" className="btn btn-primary btn-lg">
                    <BookOpen size={18} /> Explore Recipes
                  </Link>
                  <Link href="/about" className="btn btn-secondary btn-lg">
                    Meet Chef Irfan
                  </Link>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                  {[
                    { value: stats.recipeCount.toString(), label: 'Recipes Published' },
                    { value: stats.freeCount.toString(),   label: 'Free Recipes' },
                    { value: stats.premiumCount.toString(), label: 'Premium Recipes' },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                        {value}+
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', letterSpacing: '0.04em' }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Chef Image placeholder */}
              <div style={{ position: 'relative', animation: 'fadeIn 1s ease 0.3s both' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '480px',
                  margin: '0 auto',
                }}>
                  {/* Decorative ring */}
                  <div style={{
                    position: 'absolute', inset: '-20px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, transparent 0%, var(--color-primary) 25%, transparent 50%, var(--color-primary-dark) 75%, transparent 100%)',
                    opacity: 0.25,
                    animation: 'spin 12s linear infinite',
                  }} />
                  <div style={{
                    aspectRatio: '3/4',
                    borderRadius: 'var(--radius-xl)',
                    background: 'linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface-3) 100%)',
                    border: '2px solid var(--color-border-gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.15)',
                  }}>
                    {/* Placeholder chef silhouette */}
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                        margin: '0 auto 1.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(201,168,76,0.4)',
                      }}>
                        <span style={{ fontSize: '3rem' }}>👨‍🍳</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                        Chef Irfan Malik
                      </div>
                      <div style={{ color: 'var(--color-primary)', fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                        Professional Chef
                      </div>
                      <div style={{ marginTop: '1.5rem', color: 'var(--color-text-subtle)', fontSize: '0.8rem' }}>
                        Upload your photo from Admin → Settings
                      </div>
                    </div>

                    {/* Gold accent corners */}
                    <div style={{ position: 'absolute', top: '16px', left: '16px', width: '40px', height: '40px', borderTop: '2px solid var(--color-primary)', borderLeft: '2px solid var(--color-primary)', borderRadius: '4px 0 0 0', opacity: 0.6 }} />
                    <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '40px', height: '40px', borderBottom: '2px solid var(--color-primary)', borderRight: '2px solid var(--color-primary)', borderRadius: '0 0 4px 4px', opacity: 0.6 }} />
                  </div>

                  {/* Floating badges */}
                  <div style={{
                    position: 'absolute', bottom: '2rem', left: '-2rem',
                    background: 'var(--color-surface)', border: '1px solid var(--color-border-gold)',
                    borderRadius: 'var(--radius-md)', padding: '0.875rem 1.25rem',
                    boxShadow: 'var(--shadow-gold)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    animation: 'fadeInUp 0.8s ease 0.6s both',
                  }}>
                    <div style={{ background: 'var(--color-primary-muted)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trophy size={18} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Professional Chef</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>Culinary Expert</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            color: 'var(--color-text-subtle)', fontSize: '0.75rem', letterSpacing: '0.1em',
          }}>
            <span>SCROLL</span>
            <div style={{ width: '1px', height: '40px', background: 'linear-gradient(180deg, var(--color-primary), transparent)' }} />
          </div>
        </section>

        {/* ── FEATURED RECIPES ────────────────────────────────────── */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Recipe Showcase</span>
              <h2 className="heading-xl">Featured Recipes</h2>
              <div className="divider-gold" />
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '540px', margin: '1rem auto 0', fontSize: '1rem' }}>
                Explore Chef Irfan&apos;s signature dishes — from authentic Pakistani classics to modern culinary creations.
              </p>
            </div>

            {featuredRecipes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <BookOpen size={48} style={{ color: 'var(--color-text-subtle)', margin: '0 auto 1rem' }} />
                <h3 style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}>No recipes published yet.</h3>
                <p style={{ color: 'var(--color-text-subtle)' }}>Chef Irfan is preparing something amazing. Check back soon!</p>
              </div>
            ) : (
              <div className="grid-cards">
                {featuredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link href="/recipes" className="btn btn-secondary btn-lg">
                View All Recipes <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHY LEARN FROM CHEF IRFAN ────────────────────────────── */}
        <section className="section" style={{ background: 'var(--color-surface)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Why Choose Us</span>
              <h2 className="heading-xl">Why Learn From Chef Irfan?</h2>
              <div className="divider-gold" />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}>
              {[
                {
                  icon: <Award size={28} />,
                  title: 'Professional Expertise',
                  desc: 'Years of professional culinary training and experience in Pakistani and international cuisine.',
                },
                {
                  icon: <BookOpen size={28} />,
                  title: 'Detailed Recipes',
                  desc: 'Step-by-step instructions with precise measurements, techniques and chef tips.',
                },
                {
                  icon: <Flame size={28} />,
                  title: 'Authentic Techniques',
                  desc: 'Professional cooking methods that produce restaurant-quality results at home.',
                },
                {
                  icon: <Star size={28} />,
                  title: 'Premium Quality',
                  desc: 'Each premium recipe is crafted and tested to the highest culinary standards.',
                },
                {
                  icon: <Clock size={28} />,
                  title: 'Time-Tested Methods',
                  desc: 'Traditional recipes refined through years of professional cooking experience.',
                },
                {
                  icon: <Users size={28} />,
                  title: 'Growing Community',
                  desc: 'Join a growing community of food enthusiasts learning from Chef Irfan.',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="card-glass" style={{ padding: '2rem', transition: 'all 0.25s' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary)', marginBottom: '1.25rem',
                  }}>
                    {icon}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>
                    {title}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.7 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ACHIEVEMENTS ────────────────────────────────────────── */}
        {achievements.length > 0 && (
          <section className="section" style={{ background: 'var(--color-bg)' }}>
            <div className="container">
              <div className="section-header">
                <span className="section-label">Recognition</span>
                <h2 className="heading-xl">Achievements & Certifications</h2>
                <div className="divider-gold" />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}>
                {achievements.map((ach) => (
                  <div key={ach.id} className="card" style={{ padding: '1.75rem' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem',
                    }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: 'var(--color-primary-muted)',
                        border: '1px solid var(--color-border-gold)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Trophy size={20} style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <span className="badge badge-premium" style={{ fontSize: '0.65rem' }}>
                        {ach.type.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                      {ach.title}
                    </h3>
                    {ach.organization && (
                      <div style={{ color: 'var(--color-primary)', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {ach.organization}
                      </div>
                    )}
                    {ach.description && (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                        {ach.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <Link href="/achievements" className="btn btn-secondary">
                  View All Achievements <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ────────────────────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="section" style={{ background: 'var(--color-surface)' }}>
            <div className="container">
              <div className="section-header">
                <span className="section-label">What People Say</span>
                <h2 className="heading-xl">Customer Testimonials</h2>
                <div className="divider-gold" />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}>
                {testimonials.map((t) => (
                  <div key={t.id} className="card-glass" style={{ padding: '2rem', transition: 'border-color 0.25s' }}>
                    {/* Stars */}
                    <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} style={{ color: i < t.rating ? 'var(--color-primary)' : 'var(--color-border)', fill: i < t.rating ? 'var(--color-primary)' : 'transparent' }} />
                      ))}
                    </div>
                    <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', fontWeight: 700, color: '#0A0A0A',
                      }}>
                        {t.customerName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.customerName}</div>
                        <div style={{ color: 'var(--color-text-subtle)', fontSize: '0.8rem' }}>Verified Customer</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA BANNER ──────────────────────────────────────────── */}
        <section style={{
          padding: '5rem 0',
          background: 'linear-gradient(135deg, #0F0C07 0%, #1A1500 50%, #0F0C07 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 60%)',
          }} />
          <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
            <span className="section-label">Start Learning Today</span>
            <h2 className="heading-xl" style={{ marginBottom: '1rem' }}>
              Ready to Master<br />
              <span className="gradient-text">Authentic Pakistani Cuisine?</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Join thousands of food lovers who have transformed their cooking with Chef Irfan&apos;s premium recipes and techniques.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
              <Link href="/recipes" className="btn btn-ghost btn-lg">
                Browse Recipes First
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
