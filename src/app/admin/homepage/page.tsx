import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import HomepageManager from './HomepageManager';

export const dynamic = 'force-dynamic';

export default async function AdminHomepagePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') redirect('/unauthorized');

  const [settings, recipes, achievements] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.recipe.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, featured: true, cuisine: true, price: true, coverImage: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.achievement.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <AdminLayout>
      <HomepageManager
        settings={settings}
        recipes={recipes}
        achievements={achievements}
      />
    </AdminLayout>
  );
}
