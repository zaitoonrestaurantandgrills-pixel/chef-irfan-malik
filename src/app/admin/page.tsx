import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import {
  Users, BookOpen, ShoppingBag, TrendingUp, Plus,
  ArrowRight, Wallet, ShoppingCart, UserCheck, Utensils,
  Tag, Flame, Sparkles, Layers, Award, CheckCircle2, ChevronRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') redirect('/unauthorized');

  const [
    totalUsers,
    totalRecipes,
    publishedRecipes,
    premiumRecipes,
    totalOrders,
    paidOrders,
    recentOrders,
    topRecipes,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.recipe.count(),
    prisma.recipe.count({ where: { status: 'PUBLISHED' } }),
    prisma.recipe.count({ where: { type: 'PREMIUM', status: 'PUBLISHED' } }),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { recipe: { select: { title: true, price: true, coverImage: true } } } },
      },
    }),
    prisma.recipe.findMany({
      where: { status: 'PUBLISHED', type: 'PREMIUM' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, price: true, cuisine: true, coverImage: true },
    }),
  ]);

  const totalRevenue = await prisma.payment.aggregate({
    where: { status: 'PAID' },
    _sum: { amount: true },
  });

  const revenue = totalRevenue._sum.amount ?? 0;

  return (
    <AdminLayout>
      <div style={{ padding: '2.5rem 2rem', maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header Greeting */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span className="font-label-caps" style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.25rem' }}>
              Platform Overview &amp; Control
            </span>
            <h1 className="font-headline-md" style={{ color: 'var(--color-primary)', margin: 0 }}>
              Good Morning, Chef Irfan.
            </h1>
            <p className="font-body-md" style={{ color: 'var(--color-text-muted)', marginTop: '0.35rem', maxWidth: '640px' }}>
              Here is what is happening with your digital culinary business, active recipe masterclasses, and revenue today.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              href="/admin/offers"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
            >
              <Tag size={13} /> Active Offers (3)
            </Link>
            <Link
              href="/admin/recipes/new"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
            >
              <Plus size={14} /> Add New Recipe
            </Link>
          </div>
        </div>

        {/* ── 5 Metric KPI Cards Grid ───────────────────────────────── */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Card 1: Revenue */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-ambient)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: 'var(--color-secondary)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="font-label-caps" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>Total Revenue</span>
                <div className="font-headline-sm" style={{ color: 'var(--color-primary)', marginTop: '0.35rem', fontSize: '1.5rem' }}>
                  PKR {revenue.toLocaleString()}
                </div>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Wallet size={17} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', color: '#2b7a0b', fontSize: '11px', fontWeight: 600 }}>
              <TrendingUp size={13} />
              <span>Verified Supabase DB</span>
            </div>
          </div>

          {/* Card 2: Orders */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-ambient)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="font-label-caps" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>Orders Processed</span>
                <div className="font-headline-sm" style={{ color: 'var(--color-primary)', marginTop: '0.35rem', fontSize: '1.5rem' }}>
                  {totalOrders}
                </div>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-container)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingCart size={17} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', color: '#2b7a0b', fontSize: '11px', fontWeight: 600 }}>
              <span>{paidOrders} Completed Payments</span>
            </div>
          </div>

          {/* Card 3: Customers */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-ambient)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="font-label-caps" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>Active Customers</span>
                <div className="font-headline-sm" style={{ color: 'var(--color-primary)', marginTop: '0.35rem', fontSize: '1.5rem' }}>
                  {totalUsers}
                </div>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-container)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UserCheck size={17} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '11px' }}>
              <span>Registered Accounts</span>
            </div>
          </div>

          {/* Card 4: Published Recipes */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-ambient)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="font-label-caps" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>Live Catalog</span>
                <div className="font-headline-sm" style={{ color: 'var(--color-primary)', marginTop: '0.35rem', fontSize: '1.5rem' }}>
                  {publishedRecipes}
                </div>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-container)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Utensils size={17} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', color: 'var(--color-secondary)', fontSize: '11px', fontWeight: 600 }}>
              <span>{premiumRecipes} Premium / {publishedRecipes - premiumRecipes} Free</span>
            </div>
          </div>

          {/* Card 5: Active Promotions */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-ambient)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="font-label-caps" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>Active Promotions</span>
                <div className="font-headline-sm" style={{ color: 'var(--color-primary)', marginTop: '0.35rem', fontSize: '1.5rem' }}>
                  3 Deals
                </div>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-tertiary-container)',
                  color: 'var(--color-tertiary-fixed-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Tag size={17} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', color: 'var(--color-secondary)', fontSize: '11px', fontWeight: 600 }}>
              <Link href="/admin/offers" style={{ color: 'var(--color-secondary)', textDecoration: 'none' }}>
                Manage Offers →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Main 2-Column Split ────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
          className="admin-split-grid"
        >
          {/* Recent Orders Table */}
          <section
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-ambient)',
              overflow: 'hidden',
              gridColumn: 'span 2',
            }}
            className="orders-table-card"
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '17px' }}>
                  Recent Orders &amp; Transactions
                </h2>
                <span className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>
                  Live purchase activity from customers
                </span>
              </div>

              <Link
                href="/admin/orders"
                className="font-label-caps"
                style={{ color: 'var(--color-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px', fontWeight: 700 }}
              >
                View All Orders <ArrowRight size={13} />
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr
                    className="font-label-caps"
                    style={{
                      backgroundColor: 'var(--color-surface-low)',
                      borderBottom: '1px solid var(--color-border)',
                      color: 'var(--color-text-muted)',
                      fontSize: '10px',
                    }}
                  >
                    <th style={{ padding: '0.875rem 1.25rem' }}>Order ID</th>
                    <th style={{ padding: '0.875rem 1.25rem' }}>Customer</th>
                    <th style={{ padding: '0.875rem 1.25rem' }}>Recipe Item</th>
                    <th style={{ padding: '0.875rem 1.25rem' }}>Date</th>
                    <th style={{ padding: '0.875rem 1.25rem' }}>Status</th>
                    <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody className="font-body-md" style={{ fontSize: '13px' }}>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => {
                      const isPaid = order.paymentStatus === 'PAID';
                      const initial = order.user?.name?.[0]?.toUpperCase() || 'C';
                      const recipeTitle = order.items?.[0]?.recipe?.title || 'Digital Masterclass Access';

                      return (
                        <tr
                          key={order.id}
                          style={{
                            borderBottom: '1px solid var(--color-border-subtle)',
                          }}
                        >
                          <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                            #{order.id.slice(-6).toUpperCase()}
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--color-surface-container)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '10px',
                                }}
                              >
                                {initial}
                              </div>
                              <div>
                                <span style={{ fontWeight: 600, color: 'var(--color-primary)', display: 'block', lineHeight: 1.2 }}>
                                  {order.user?.name || 'Customer'}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                                  {order.user?.email || 'Guest'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)' }}>
                            {recipeTitle}
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-subtle)', fontSize: '12px' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span
                              className="font-label-caps"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '10px',
                                backgroundColor: isPaid ? '#f0f9eb' : 'var(--color-surface-high)',
                                color: isPaid ? '#2b7a0b' : 'var(--color-text-muted)',
                                border: `1px solid ${isPaid ? '#d6efcc' : 'var(--color-border)'}`,
                              }}
                            >
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: isPaid ? '#2b7a0b' : 'var(--color-border)' }} />
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)' }}>
                            PKR {order.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No orders recorded yet. All new checkout orders will appear here in real time.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Management & Control Panel */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Actions Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-ambient)',
              }}
            >
              <h3 className="font-headline-sm" style={{ color: 'var(--color-primary)', fontSize: '16px', marginBottom: '0.25rem' }}>
                Management Center
              </h3>
              <p className="font-body-md" style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginBottom: '1.25rem' }}>
                Quick actions for platform control
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <Link href="/admin/recipes/new" className="btn btn-primary btn-sm" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                  <Plus size={14} /> Publish New Recipe
                </Link>
                <Link href="/admin/offers" className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                  <Tag size={13} /> Create Promo / Offer
                </Link>
                <Link href="/admin/homepage" className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                  <Sparkles size={13} /> Customize Homepage
                </Link>
                <Link href="/admin/orders" className="btn btn-ghost btn-sm" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                  Review Sales Ledger
                </Link>
              </div>
            </div>

            {/* Weekly Activity Pulse */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-ambient)',
              }}
            >
              <h3 className="font-headline-sm" style={{ color: 'var(--color-primary)', fontSize: '16px', margin: '0 0 0.25rem 0' }}>
                Weekly Platform Activity
              </h3>
              <p className="font-body-md" style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginBottom: '1.25rem' }}>
                Recipe catalog engagement
              </p>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '90px', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                {[
                  { day: 'M', height: '50%' },
                  { day: 'T', height: '35%' },
                  { day: 'W', height: '80%' },
                  { day: 'T', height: '65%', active: true },
                  { day: 'F', height: '90%' },
                  { day: 'S', height: '100%' },
                  { day: 'S', height: '40%' },
                ].map((bar, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '18px',
                        height: bar.height,
                        backgroundColor: bar.active ? 'var(--color-secondary)' : 'var(--color-primary)',
                        borderRadius: '2px',
                        transition: 'height 0.3s ease',
                      }}
                    />
                    <span className="font-label-caps" style={{ fontSize: '9px', marginTop: '0.35rem', color: bar.active ? 'var(--color-secondary)' : 'var(--color-text-muted)' }}>
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '10px' }} className="font-label-caps">
                <span style={{ color: 'var(--color-primary)' }}>● Regular Flow</span>
                <span style={{ color: 'var(--color-secondary)' }}>● Weekend Surge</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
