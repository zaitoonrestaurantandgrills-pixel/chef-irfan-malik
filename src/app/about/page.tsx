import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Award, BookOpen, Flame, Heart, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Chef Irfan Malik — Biography & Culinary Journey',
  description: 'Learn about Executive Chef Irfan Malik, his culinary philosophy, food safety honors, Pakistani gastronomy heritage, and dedication to recipe sharing.',
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
  const bio = settings?.biography || 'Executive Chef Irfan Malik is a celebrated culinary master at Zaitoon Restaurant and an esteemed figure in Pakistani gastronomy. Honored by the Consumers Association of Pakistan and Sindh Food Authority, Chef Irfan is dedicated to Michelin-standard food safety, heritage recipes, and culinary education.';
  const profileImage = settings?.profileImage || '/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg';

  return (
    <>
      <Navbar />

      <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        {/* Header Hero Section */}
        <section
          style={{
            padding: '4rem 0 3.5rem',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--color-border)',
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
              {/* Chef Photo Frame */}
              <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
                <div
                  style={{
                    aspectRatio: '4/3',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-ambient)',
                    padding: '0.75rem',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileImage}
                    alt={chefName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  />
                </div>
              </div>

              {/* Bio & Intro Copy */}
              <div>
                <span
                  className="font-label-caps"
                  style={{
                    color: 'var(--color-secondary)',
                    display: 'block',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.15em',
                  }}
                >
                  Culinary Heritage & Story
                </span>

                <h1
                  className="font-display-lg-mobile md:font-display-lg"
                  style={{
                    color: 'var(--color-primary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Meet {chefName}
                </h1>

                <p
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    color: 'var(--color-secondary)',
                    fontStyle: 'italic',
                    marginBottom: '1.5rem',
                  }}
                >
                  &ldquo;{tagline}&rdquo;
                </p>

                <p
                  className="font-body-lg"
                  style={{
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.8,
                    marginBottom: '2rem',
                  }}
                >
                  {bio}
                </p>

                {/* Stat Counters */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.5rem',
                    padding: '1.5rem 0',
                    borderTop: '1px solid var(--color-border)',
                    borderBottom: '1px solid var(--color-border)',
                    marginBottom: '2rem',
                  }}
                >
                  <div>
                    <div className="font-display-lg-mobile" style={{ color: 'var(--color-primary)' }}>
                      100%
                    </div>
                    <div className="font-label-caps" style={{ color: 'var(--color-text-muted)' }}>
                      Authentic Recipes
                    </div>
                  </div>
                  <div>
                    <div className="font-display-lg-mobile" style={{ color: 'var(--color-primary)' }}>
                      {recipesCount > 0 ? `${recipesCount}+` : '100+'}
                    </div>
                    <div className="font-label-caps" style={{ color: 'var(--color-text-muted)' }}>
                      Recipes Published
                    </div>
                  </div>
                  <div>
                    <div className="font-display-lg-mobile" style={{ color: 'var(--color-primary)' }}>
                      {achievements.length > 0 ? `${achievements.length}+` : '5+'}
                    </div>
                    <div className="font-label-caps" style={{ color: 'var(--color-text-muted)' }}>
                      Honors & Awards
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/recipes" className="btn btn-primary btn-lg">
                    <BookOpen size={16} /> Explore Recipes
                  </Link>
                  <Link href="/gallery" className="btn btn-secondary btn-lg">
                    View Gallery & Honors
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values / Philosophy */}
        <section style={{ padding: '5rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-secondary)' }}>Core Values</span>
              <h2 className="font-headline-lg" style={{ color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                Culinary Philosophy
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {[
                {
                  icon: <Flame size={24} />,
                  title: 'Respect for Heritage & Technique',
                  desc: 'Every traditional dish carries regional culinary heritage. We honor authentic slow-cooking (dum), charcoal smoking, and balanced spice roasting.',
                },
                {
                  icon: <ShieldCheck size={24} />,
                  title: 'Food Safety & Kitchen Quality',
                  desc: 'Recognized by the Consumers Association of Pakistan and Sindh Food Authority for maintaining top culinary hygiene and health standards.',
                },
                {
                  icon: <Heart size={24} />,
                  title: 'Sharing Mastery Freely',
                  desc: 'Culinary excellence should empower everyone. Through detailed recipes and masterclasses, we enable home cooks and chefs to cook with confidence.',
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-ambient)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-secondary-container)',
                      color: 'var(--color-on-secondary-container)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {icon}
                  </div>
                  <h3 className="font-headline-sm" style={{ color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {title}
                  </h3>
                  <p className="font-body-md" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section
          style={{
            padding: '5rem 0',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ maxWidth: '640px' }}>
            <h2 className="font-headline-lg" style={{ color: '#ffffff', marginBottom: '1rem' }}>
              Start Cooking with Chef Irfan
            </h2>
            <p className="font-body-lg" style={{ color: 'rgba(255,255,255,0.7)', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Explore our curated digital cookbook of free and premium culinary masterclasses today.
            </p>
            <Link href="/recipes" className="btn btn-lg" style={{ background: 'var(--color-secondary)', color: '#ffffff', border: 'none' }}>
              Browse All Recipes <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
