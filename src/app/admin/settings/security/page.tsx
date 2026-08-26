import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AdminLayout from '@/components/AdminLayout';
import SecuritySettingsForm from './SecuritySettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSecurityPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/admin/login');
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') redirect('/unauthorized');

  return (
    <AdminLayout>
      <SecuritySettingsForm user={session.user} />
    </AdminLayout>
  );
}
