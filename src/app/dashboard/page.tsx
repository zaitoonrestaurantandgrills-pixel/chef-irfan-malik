import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { BookOpen, ShoppingBag, User, ChefHat, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [purchases, recentOrders, user] = await Promise.all([
    prisma.recipeAccess.count({ where: { userId: session.user.id, revokedAt: null } }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { recipe: { select: { title: true, slug: true, coverImage: true, type: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true, username: true, createdAt: true } }),
  ]);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', padding: '3rem 0' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>
              Welcome back, <span className="gradient-text">{session.user.name?.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Manage your purchased recipes and profile from your dashboard.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { icon: <BookOpen size={24} />, value: purchases, label: 'Purchased Recipes', color: 'var(--color-primary)', href: '/my-recipes' },
              { icon: <ShoppingBag size={24} />, value: recentOrders.length, label: 'Total Orders', color: 'var(--color-success)', href: '/dashboard' },
              { icon: <User size={24} />, value: user?.username, label: 'Username', color: 'var(--color-info)', href: '/profile' },
            ].map(({ icon, value, label, color, href }) => (
              <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '1.5rem', transition: 'all 0.2s' }}>
                  <div style={{ color, marginBottom: '1rem' }}>{icon}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                    {value ?? 0}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{label}</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
            {/* Recent Orders */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Recent Orders
                <Link href="/my-recipes" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  My Recipes <ArrowRight size={14} />
                </Link>
              </h2>

              {recentOrders.length === 0 ? (
                <div style={{
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center',
                }}>
                  <ShoppingBag size={48} style={{ color: 'var(--color-text-subtle)', margin: '0 auto 1rem', display: 'block' }} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>No purchases yet</h3>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Browse Chef Irfan&apos;s premium recipes and start your culinary journey.
                  </p>
                  <Link href="/recipes" className="btn btn-primary">Explore Recipes</Link>
                </div>
              ) : (
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  {recentOrders.map((order, i) => (
                    <div key={order.id} style={{
                      padding: '1.25rem 1.5rem',
                      borderBottom: i < recentOrders.length - 1 ? '1px solid var(--color-border)' : 'none',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                    }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
                        background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                      }}>
                        {order.items[0]?.recipe.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={order.items[0].recipe.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        ) : '🍽️'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }} className="line-clamp-1">
                          {order.items.map(i => i.recipe.title).join(', ')}
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>
                          {order.currency} {order.totalAmount.toLocaleString()}
                        </div>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, padding: '0.175rem 0.5rem', borderRadius: '999px',
                          background: order.paymentStatus === 'PAID' ? 'rgba(76,175,120,0.1)' : 'rgba(224,130,82,0.1)',
                          color: order.paymentStatus === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)',
                          border: `1px solid ${order.paymentStatus === 'PAID' ? 'rgba(76,175,120,0.3)' : 'rgba(224,130,82,0.3)'}`,
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Card */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', marginBottom: '1.25rem' }}>My Profile</h2>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1rem',
                    background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.75rem', fontWeight: 700, color: '#0A0A0A', fontFamily: 'var(--font-heading)',
                    boxShadow: 'var(--shadow-gold)',
                  }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 }}>{user?.name}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>@{user?.username}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Email</span>
                    <span style={{ fontWeight: 500, fontSize: '0.8rem' }}>{user?.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Member since</span>
                    <span style={{ fontWeight: 500 }}>{new Date(user?.createdAt ?? '').getFullYear()}</span>
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link href="/profile" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    <User size={15} /> Edit Profile
                  </Link>
                  <Link href="/recipes" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <ChefHat size={15} /> Browse Recipes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
