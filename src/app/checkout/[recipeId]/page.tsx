import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import CheckoutClient from './CheckoutClient';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ recipeId: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { recipeId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/checkout/${recipeId}`);
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId, status: 'PUBLISHED', type: 'PREMIUM' },
    select: { id: true, title: true, slug: true, description: true, coverImage: true, price: true, currency: true, cuisine: true, difficulty: true },
  });

  if (!recipe) notFound();

  // Check if already purchased
  const existingAccess = await prisma.recipeAccess.findUnique({
    where: { userId_recipeId: { userId: session.user.id, recipeId } },
  });

  if (existingAccess && !existingAccess.revokedAt) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{
            textAlign: 'center', maxWidth: '480px', padding: '3rem',
            background: 'var(--color-surface)', border: '1px solid rgba(76,175,120,0.3)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>✅</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--color-success)' }}>
              Already Purchased!
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              You already have access to <strong>{recipe.title}</strong>.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`/recipes/${recipe.slug}`} className="btn btn-primary">View Recipe</Link>
              <Link href="/my-recipes" className="btn btn-ghost">My Recipes</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CheckoutClient recipe={recipe} />
    </>
  );
}
