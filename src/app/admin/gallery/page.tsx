import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import GalleryManager from './GalleryManager';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized');
  }

  const items = await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
            Photo Gallery Management
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Upload and organize food photography, chef moments, events, and behind the scenes.
          </p>
        </div>

        <GalleryManager initialItems={items} />
      </div>
    </AdminLayout>
  );
}
