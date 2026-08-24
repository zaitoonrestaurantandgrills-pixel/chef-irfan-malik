import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { Trophy, Award, Medal, Tv, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Achievements, Awards & Certifications — Chef Irfan Malik',
  description: 'Explore the professional certifications, culinary competition honors, awards, and media features of Chef Irfan Malik.',
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
      <main style={{ minHeight: '100vh' }}>
        {/* Header */}
        <section style={{
          background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
          borderBottom: '1px solid var(--color-border)',
          padding: '4rem 0 3rem',
          textAlign: 'center',
        }}>
          <div className="container">
            <span className="section-label">Professional Honors</span>
            <h1 className="heading-xl" style={{ marginBottom: '0.75rem' }}>
              Achievements & Certifications
            </h1>
            <div className="divider-gold" />
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '540px', margin: '1rem auto 0' }}>
              Recognized for culinary excellence, professional certifications, cooking competitions, and industry contributions.
            </p>
          </div>
        </section>

        {/* List */}
        <section style={{ padding: '4rem 0 5rem' }}>
          <div className="container" style={{ maxWidth: '960px' }}>
            {achievements.length === 0 ? (
              <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Trophy size={56} style={{ margin: '0 auto 1.25rem', color: 'var(--color-text-subtle)', display: 'block' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  No achievements published yet.
                </h3>
                <p style={{ fontSize: '0.9rem' }}>Check back soon for new professional updates.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {achievements.map((item) => {
                  const Icon = iconMap[item.type] || Trophy;
                  return (
                    <div key={item.id} className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-primary)', flexShrink: 0,
                      }}>
                        <Icon size={26} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                            {item.title}
                          </h2>
                          <span className="badge badge-premium" style={{ fontSize: '0.7rem' }}>
                            {item.type.replace('_', ' ')}
                          </span>
                        </div>

                        {item.organization && (
                          <div style={{ color: 'var(--color-primary)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            {item.organization}
                          </div>
                        )}

                        {item.description && (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <Link href="/recipes" className="btn btn-primary btn-lg">
                Explore Chef Irfan&apos;s Recipes
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
