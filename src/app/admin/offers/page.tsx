import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import OffersManager from './OffersManager';

export const dynamic = 'force-dynamic';

export default async function AdminOffersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') redirect('/unauthorized');

  const [recipes, premiumCount] = await Promise.all([
    prisma.recipe.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, price: true, cuisine: true, type: true, coverImage: true },
      orderBy: { title: 'asc' },
    }),
    prisma.recipe.count({ where: { status: 'PUBLISHED', type: 'PREMIUM' } }),
  ]);

  return (
    <AdminLayout>
      <OffersManager recipes={recipes} premiumCount={premiumCount} />
    </AdminLayout>
  );
}
