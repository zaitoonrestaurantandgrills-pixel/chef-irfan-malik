import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import GalleryViewer from './GalleryViewer';

export const metadata: Metadata = {
  title: 'Portfolio & Visual Gallery — Chef Irfan Malik',
  description: 'Explore the culinary visual gallery of Chef Irfan Malik featuring award ceremonies, culinary masterclasses, behind the scenes, and gastronomic creations.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const items = await prisma.gallery.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <>
      <Navbar />

      <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        {/* Editorial Header */}
        <section
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--color-border)',
            padding: '4rem 0 3rem',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ maxWidth: '780px' }}>
            <span
              className="font-label-caps"
              style={{
                color: 'var(--color-secondary)',
                display: 'block',
                marginBottom: '0.5rem',
                letterSpacing: '0.15em',
              }}
            >
              Visual Heritage & Moments
            </span>
            <h1
              className="font-display-lg-mobile md:font-display-lg"
              style={{
                color: 'var(--color-primary)',
                marginBottom: '1rem',
              }}
            >
              Culinary & Awards Gallery
            </h1>
            <p
              className="font-body-lg"
              style={{
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                margin: '0 auto',
              }}
            >
              A visual chronicle of Chef Irfan Malik&apos;s award ceremonies, industry recognitions, culinary masterclasses, and kitchen craft.
            </p>
          </div>
        </section>

        {/* Gallery Content with Filter Pills & Lightbox */}
        <section style={{ padding: '3.5rem 0 6rem' }}>
          <div className="container">
            <GalleryViewer initialItems={items} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
