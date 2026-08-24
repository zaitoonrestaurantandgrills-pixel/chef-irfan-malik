'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Lock, CheckCircle, AlertCircle, Clock, Star, ChefHat } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  price: number;
  currency: string;
  cuisine: string;
  difficulty: string;
}

export default function CheckoutClient({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const [step, setStep] = useState<'review' | 'processing' | 'success' | 'failed'>('review');
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    setStep('processing');
    setError('');

    try {
      // 1. Create order
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: recipe.id }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        if (orderData.error === 'Already purchased') {
          setStep('success');
          return;
        }
        throw new Error(orderData.error || 'Failed to create order');
      }

      const { orderId } = orderData;

      // 2. Create payment checkout
      const checkoutRes = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok) throw new Error(checkoutData.error || 'Checkout failed');

      // 3. Simulate payment processing (in production: redirect to payment gateway)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. Verify payment server-side
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, providerRef: checkoutData.sessionId }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed');

      setStep('success');
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Purchase failed');
      setStep('failed');
    }
  };

  if (step === 'success') {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
          <div style={{
            background: 'var(--color-surface)', border: '1px solid rgba(76,175,120,0.3)',
            borderRadius: 'var(--radius-xl)', padding: '3rem',
          }}>
            <CheckCircle size={64} style={{ color: 'var(--color-success)', margin: '0 auto 1.25rem', display: 'block' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--color-success)' }}>
              Purchase Successful!
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>
              You now have full access to:
            </p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '2rem' }}>
              {recipe.title}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`/recipes/${recipe.slug}`} className="btn btn-primary btn-lg">
                View Full Recipe
              </Link>
              <Link href="/my-recipes" className="btn btn-ghost">
                My Recipes
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'failed') {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
          <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(224,82,82,0.3)', borderRadius: 'var(--radius-xl)', padding: '3rem' }}>
            <AlertCircle size={64} style={{ color: 'var(--color-error)', margin: '0 auto 1.25rem', display: 'block' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--color-error)' }}>
              Payment Failed
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>{error}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setStep('review')}>Try Again</button>
              <Link href="/recipes" className="btn btn-ghost">Browse Recipes</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href={`/recipes/${recipe.slug}`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            className="hover-gold">
            ← Back to Recipe
          </Link>
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '2rem' }}>
          Complete Your Purchase
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
          {/* Order Summary */}
          <div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600 }}>Order Summary</h2>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem' }}>
                <div style={{
                  width: '100px', height: '75px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
                  background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                }}>
                  {recipe.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={recipe.coverImage} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  ) : '🍽️'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', marginBottom: '0.375rem' }}>{recipe.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ChefHat size={12} /> {recipe.cuisine}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={12} /> {recipe.difficulty}</span>
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <span className="badge badge-premium">⭐ Premium Recipe</span>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', flexShrink: 0 }}>
                  {recipe.currency} {recipe.price.toLocaleString()}
                </div>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {recipe.currency} {recipe.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* What you get */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: '1rem' }}>What you get:</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  'Complete step-by-step instructions',
                  'Full ingredient list with quantities',
                  'Chef\'s personal notes and tips',
                  'Professional culinary techniques',
                  'Equipment recommendations',
                  'Lifetime access to the recipe',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    <CheckCircle size={15} style={{ color: 'var(--color-success)', flexShrink: 0 }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Panel */}
          <div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-gold)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', position: 'sticky', top: '100px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={16} style={{ color: 'var(--color-primary)' }} /> Secure Checkout
              </h2>

              {/* Payment notice */}
              <div style={{
                background: 'rgba(201,168,76,0.08)', border: '1px solid var(--color-border-gold)',
                borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
              }}>
                <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.375rem' }}>
                  💳 Payment Integration
                </div>
                This is a demonstration checkout. Payment gateway integration (JazzCash, EasyPaisa, Stripe) will be connected here.
              </div>

              <div style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Recipe price</span>
                  <span style={{ fontWeight: 600 }}>{recipe.currency} {recipe.price.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {recipe.currency} {recipe.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {step === 'processing' ? (
                <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <div style={{
                    width: '48px', height: '48px', border: '3px solid var(--color-primary)', borderTopColor: 'transparent',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
                  }} />
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', marginBottom: '0.375rem' }}>Processing Payment...</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <Clock size={14} /> Verifying with payment server
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
                  onClick={handlePurchase}
                >
                  <ShoppingCart size={18} />
                  Pay {recipe.currency} {recipe.price.toLocaleString()}
                </button>
              )}

              <div style={{ marginTop: '1rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                <Lock size={12} /> Secure · Encrypted · Server-verified
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 360px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
