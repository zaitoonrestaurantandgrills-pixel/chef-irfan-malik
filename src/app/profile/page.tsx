import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileEditor from './ProfileEditor';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, username: true, email: true, createdAt: true, role: true },
  });

  if (!user) redirect('/login');

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>
              Account Profile
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Manage your personal credentials, contact info, and login security.
            </p>
          </div>

          <ProfileEditor user={user} />
        </div>
      </main>
      <Footer />
    </>
  );
}
