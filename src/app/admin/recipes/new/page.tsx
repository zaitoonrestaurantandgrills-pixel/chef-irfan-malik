import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import RecipeEditor from '@/components/RecipeEditor';

export const dynamic = 'force-dynamic';

export default async function NewRecipePage() {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized');
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <AdminLayout>
      <RecipeEditor categories={categories} />
    </AdminLayout>
  );
}
