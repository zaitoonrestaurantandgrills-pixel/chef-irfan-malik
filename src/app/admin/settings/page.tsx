import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import SettingsEditor from './SettingsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized');
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      chefName: 'Chef Irfan Malik',
      tagline: 'Crafting Flavors. Sharing Knowledge.',
      biography: 'Chef Irfan Malik is a passionate culinary professional with extensive experience in traditional and contemporary Pakistani gastronomy.',
      currency: 'PKR',
      seoTitle: 'Chef Irfan Malik — Professional Chef & Recipe Creator',
      seoDescription: 'Discover carefully crafted recipes, professional culinary techniques and the experience behind every dish by Chef Irfan Malik.',
    },
  });

  return (
    <AdminLayout>
      <div style={{ padding: '2rem', maxWidth: '960px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
            Site & Brand Settings
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Customize Chef Irfan&apos;s brand identity, biography, contact information, and SEO parameters.
          </p>
        </div>

        <SettingsEditor initialSettings={settings} />
      </div>
    </AdminLayout>
  );
}
