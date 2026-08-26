import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import UsersManager from './UsersManager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/admin/login');
  if (session.user.role !== 'SUPER_ADMIN') redirect('/unauthorized');

  const adminUsers = await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'SUPER_ADMIN'] },
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminLayout>
      <UsersManager initialUsers={adminUsers} currentUserId={session.user.id} />
    </AdminLayout>
  );
}
