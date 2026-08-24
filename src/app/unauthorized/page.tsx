import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3.5rem 2rem', border: '1px solid rgba(224,82,82,0.3)' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1.5rem',
              background: 'rgba(224,82,82,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-error)',
            }}>
              <ShieldAlert size={36} />
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--color-error)' }}>
              Access Denied
            </h1>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              You do not have administrative privileges to access this resource. If you believe this is an error, please contact the site administrator.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn btn-primary">
                <Home size={16} /> Return Home
              </Link>
              <Link href="/login" className="btn btn-ghost">
                Switch Account
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
