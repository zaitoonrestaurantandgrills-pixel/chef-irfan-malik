'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3.5rem 2rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1.25rem',
              background: 'rgba(224,82,82,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-error)'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Something Went Wrong
            </h1>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              An unexpected error occurred while preparing this page. Our kitchen technicians have been notified.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => reset()} className="btn btn-primary">
                <RefreshCw size={16} /> Try Again
              </button>
              <Link href="/" className="btn btn-ghost">
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
