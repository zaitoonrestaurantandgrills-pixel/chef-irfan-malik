import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChefHat, Home, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3.5rem 2rem' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '1rem' }}>
              404
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Page Not Found
            </h1>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              The recipe, page, or ingredient you are looking for does not exist or has been moved to another station.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn btn-primary">
                <Home size={16} /> Go to Homepage
              </Link>
              <Link href="/recipes" className="btn btn-secondary">
                <BookOpen size={16} /> Browse Recipes
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
