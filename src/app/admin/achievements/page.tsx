import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import AchievementsManager from './AchievementsManager';

export const dynamic = 'force-dynamic';

export default async function AdminAchievementsPage() {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized');
  }

  const items = await prisma.achievement.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
            Achievements & Certifications
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Manage Chef Irfan&apos;s culinary awards, certifications, media appearances, and competition honors.
          </p>
        </div>

        <AchievementsManager initialItems={items} />
      </div>
    </AdminLayout>
  );
}
