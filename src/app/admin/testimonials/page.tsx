import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import TestimonialsManager from './TestimonialsManager';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized');
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
            Testimonials & Reviews
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Manage real customer reviews and testimonials shown on the website.
          </p>
        </div>

        <TestimonialsManager initialItems={testimonials} />
      </div>
    </AdminLayout>
  );
}
