import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { Trophy, Award, Medal, Tv, CheckCircle2, Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Achievements, Honors & Certifications — Chef Irfan Malik',
  description: 'Explore the awards, professional food safety honors, culinary masterclass certifications, and industry recognitions of Chef Irfan Malik.',
};

export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const iconMap: Record<string, typeof Trophy> = {
    AWARD: Trophy,
    CERTIFICATION: Award,
    COMPETITION: Medal,
    RECOGNITION: Trophy,
    MEDIA_FEATURE: Tv,
    TRAINING: CheckCircle2,
  };

  return (
    <>
      <Navbar />

      <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        {/* Editorial Header */}
        <section
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--color-border)',
            padding: '4rem 0 3rem',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ maxWidth: '780px' }}>
            <span
              className="font-label-caps"
              style={{
                color: 'var(--color-secondary)',
                display: 'block',
                marginBottom: '0.5rem',
                letterSpacing: '0.15em',
              }}
            >
              Excellence & Industry Recognition
            </span>
            <h1
              className="font-display-lg-mobile md:font-display-lg"
              style={{
                color: 'var(--color-primary)',
                marginBottom: '1rem',
              }}
            >
              Honors & Certifications
            </h1>
            <p
              className="font-body-lg"
              style={{
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                margin: '0 auto',
              }}
            >
              Documenting Chef Irfan Malik&apos;s culinary awards, food safety conference recognitions, and professional milestones.
            </p>
          </div>
        </section>

        {/* Achievements Timeline & Cards */}
        <section style={{ padding: '4rem 0 6rem' }}>
          <div className="container" style={{ maxWidth: '1020px' }}>
            {achievements.length === 0 ? (
              <div
                style={{
                  padding: '5rem 2rem',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-ambient)',
                }}
              >
                <Trophy
                  size={48}
                  style={{ margin: '0 auto 1.25rem', color: 'var(--color-text-subtle)', display: 'block' }}
                />
                <h3 className="font-headline-sm" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  No achievements published yet
                </h3>
                <p className="font-body-md" style={{ color: 'var(--color-text-muted)' }}>
                  Check back soon for new professional updates.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {achievements.map((item) => {
                  const Icon = iconMap[item.type] || Trophy;

                  return (
                    <article
                      key={item.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        boxShadow: 'var(--shadow-ambient)',
                        overflow: 'hidden',
                        display: 'grid',
                        gridTemplateColumns: item.image ? '1fr 340px' : '1fr',
                        gap: '2rem',
                      }}
                      className="achievement-card"
                    >
                      {/* Left: Content & Badges */}
                      <div
                        style={{
                          padding: '2.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '1.5rem',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <span
                              className="font-label-caps"
                              style={{
                                backgroundColor: 'var(--color-tertiary-container)',
                                color: 'var(--color-tertiary-fixed)',
                                border: '1px solid rgba(255,222,165,0.3)',
                                padding: '0.25rem 0.625rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '10px',
                              }}
                            >
                              {item.type.replace('_', ' ')}
                            </span>

                            {item.date && (
                              <span
                                className="font-label-caps"
                                style={{
                                  color: 'var(--color-text-muted)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '11px',
                                }}
                              >
                                <Calendar size={13} />
                                {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            )}
                          </div>

                          <h2
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '1.5rem',
                              fontWeight: 600,
                              color: 'var(--color-primary)',
                              marginBottom: '0.5rem',
                              lineHeight: 1.25,
                            }}
                          >
                            {item.title}
                          </h2>

                          {item.organization && (
                            <div
                              className="font-label-caps"
                              style={{
                                color: 'var(--color-secondary)',
                                fontSize: '12px',
                                marginBottom: '1.25rem',
                              }}
                            >
                              {item.organization}
                            </div>
                          )}

                          {item.description && (
                            <p
                              className="font-body-md"
                              style={{
                                color: 'var(--color-text-muted)',
                                lineHeight: 1.75,
                                margin: 0,
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-surface-container)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <span className="font-label-caps" style={{ fontSize: '11px', color: 'var(--color-text)' }}>
                            Verified Honor
                          </span>
                        </div>
                      </div>

                      {/* Right: Certificate / Award Photo (if present) */}
                      {item.image && (
                        <div
                          style={{
                            position: 'relative',
                            backgroundColor: 'var(--color-surface-variant)',
                            minHeight: '260px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            borderLeft: '1px solid var(--color-border)',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <Link href="/gallery" className="btn btn-primary btn-lg" style={{ marginRight: '1rem' }}>
                View Full Photo Gallery
              </Link>
              <Link href="/recipes" className="btn btn-secondary btn-lg">
                Explore Recipes
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
