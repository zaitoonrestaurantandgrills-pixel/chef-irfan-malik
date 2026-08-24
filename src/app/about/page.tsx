import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ChefHat, Award, BookOpen, Flame, Heart, Trophy, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Chef Irfan Malik — Biography & Culinary Journey',
  description: 'Learn about Chef Irfan Malik, his culinary philosophy, professional background, expertise in Pakistani gastronomy, and dedication to sharing recipes.',
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [settings, achievements, recipesCount] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.achievement.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.recipe.count({ where: { status: 'PUBLISHED' } }),
  ]);

  const chefName = settings?.chefName || 'Chef Irfan Malik';
  const tagline = settings?.tagline || 'Crafting Flavors. Sharing Knowledge.';
  const bio = settings?.biography || 'Chef Irfan Malik is a passionate culinary artist with an obsession for perfection in traditional and contemporary Pakistani gastronomy.';

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        {/* Header Hero */}
        <section style={{
          padding: '5rem 0 4rem',
          background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-bg) 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '4rem', alignItems: 'center' }}>
              {/* Image / Silhouette */}
              <div style={{
                aspectRatio: '4/5',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface-3) 100%)',
                border: '2px solid var(--color-border-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
              }}>
                {settings?.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.profileImage} alt={chefName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{
                      width: '120px', height: '120px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                      margin: '0 auto 1.5rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '3rem',
                    }}>
                      👨‍🍳
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>{chefName}</div>
                    <div style={{ color: 'var(--color-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginTop: '0.25rem' }}>
                      Professional Chef
                    </div>
                  </div>
                )}
              </div>

              {/* Bio & Intro */}
              <div>
                <span className="section-label">Culinary Story</span>
                <h1 className="heading-xl" style={{ marginBottom: '1rem' }}>
                  Meet <span className="gradient-text">{chefName}</span>
                </h1>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-primary)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  &ldquo;{tagline}&rdquo;
                </p>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '2rem' }}>
                  {bio}
                </p>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem', padding: '1.5rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      100%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Authentic Recipes</div>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '2rem' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {recipesCount}+
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Recipes Published</div>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '2rem' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {achievements.length}+
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Honors & Awards</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/recipes" className="btn btn-primary">
                    <BookOpen size={16} /> Explore Recipes
                  </Link>
                  <Link href="/contact" className="btn btn-secondary">
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Culinary Philosophy */}
        <section className="section" style={{ background: 'var(--color-surface)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Core Values</span>
              <h2 className="heading-xl">Culinary Philosophy</h2>
              <div className="divider-gold" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {[
                {
                  icon: <Flame size={28} />,
                  title: 'Respect for Heritage & Technique',
                  desc: 'Every traditional dish carries centuries of regional culinary history. We honor authentic spice balances, slow cooking (dum), and time-honored methods.',
                },
                {
                  icon: <Award size={28} />,
                  title: 'Precision & Consistency',
                  desc: 'A recipe must work flawlessly in your home kitchen. Every measurement, timing, and heat intensity is thoroughly tested and documented.',
                },
                {
                  icon: <Heart size={28} />,
                  title: 'Sharing Knowledge Freely',
                  desc: 'Culinary mastery is not meant to be kept secret. Through detailed recipes and masterclasses, we empower everyone to cook like a master chef.',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="card-glass" style={{ padding: '2rem' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary)', marginBottom: '1.25rem',
                  }}>
                    {icon}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '0.75rem' }}>{title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.75 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Professional Timeline / Specialties */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Culinary Focus</span>
              <h2 className="heading-xl">Specialties & Signature Styles</h2>
              <div className="divider-gold" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[
                { name: 'Traditional Biryani & Pulao', desc: 'Aromatic layered rice masterclasses using slow dum and fragrant saffron.' },
                { name: 'Karahi & Handi Dishes', desc: 'High-heat wok cooking with fresh tomatoes, ginger, and balanced spices.' },
                { name: 'Slow-Cooked Nihari & Haleem', desc: 'Rich, unctuous gravies perfected through hours of simmering.' },
                { name: 'Contemporary Desserts', desc: 'Festive sweets from classic Sheer Khurma to gourmet fusion creations.' },
              ].map(({ name, desc }) => (
                <div key={name} className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>✨</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '4rem 0', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
          <div className="container">
            <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>
              Start Cooking with Chef Irfan
            </h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 2rem' }}>
              Explore our curated library of free and premium recipes today.
            </p>
            <Link href="/recipes" className="btn btn-primary btn-lg">
              Browse All Recipes <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 860px) {
          section > div > div[style*="grid-template-columns: 420px 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
