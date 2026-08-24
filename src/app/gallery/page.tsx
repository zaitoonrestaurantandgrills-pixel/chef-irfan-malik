import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import GalleryViewer from './GalleryViewer';

export const metadata: Metadata = {
  title: 'Food Photography & Culinary Gallery — Chef Irfan Malik',
  description: 'Explore the culinary visual gallery of Chef Irfan Malik featuring food photography, masterclasses, behind the scenes, and events.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const items = await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' },
  });

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
            <span className="section-label">Visual Showcase</span>
            <h1 className="heading-xl" style={{ marginBottom: '0.75rem' }}>
              Culinary & Food Gallery
            </h1>
            <div className="divider-gold" />
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '1rem auto 0' }}>
              A visual feast of Chef Irfan&apos;s creations, culinary events, kitchen moments, and culinary artistry.
            </p>
          </div>
        </section>

        {/* Gallery Content */}
        <section style={{ padding: '3rem 0 5rem' }}>
          <div className="container">
            <GalleryViewer initialItems={items} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
