import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import { BarChart3, TrendingUp, Users, DollarSign, Award, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized');
  }

  const [
    totalRevenue,
    paidOrders,
    customersCount,
    recipesCount,
    topRecipes,
    cuisineDistribution,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    }),
    prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.recipe.count(),
    prisma.recipe.findMany({
      where: { type: 'PREMIUM' },
      include: {
        _count: {
          select: { access: true },
        },
      },
      orderBy: { access: { _count: 'desc' } },
      take: 5,
    }),
    prisma.recipe.groupBy({
      by: ['cuisine'],
      _count: { id: true },
    }),
  ]);

  const grossSales = totalRevenue._sum.amount || 0;
  const avgOrderValue = paidOrders > 0 ? (grossSales / paidOrders).toFixed(0) : '0';

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
            Platform Analytics & Insights
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Comprehensive performance indicators, recipe popularity, and revenue metrics.
          </p>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lifetime Revenue
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.25rem 0' }}>
              PKR {grossSales.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>
              From {paidOrders} completed digital orders
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #5290E0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Average Order Value
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', margin: '0.25rem 0' }}>
              PKR {avgOrderValue}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Per recipe sale
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #4CAF78' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Customer Base
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', margin: '0.25rem 0' }}>
              {customersCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Registered users
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #E0A052' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Published Recipes
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', margin: '0.25rem 0' }}>
              {recipesCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              In culinary catalog
            </div>
          </div>
        </div>

        {/* Detailed Insights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Top Selling Recipes */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
              <TrendingUp size={18} /> Top Selling Premium Recipes
            </h2>
            {topRecipes.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No premium recipe purchases recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topRecipes.map((r, i) => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)', width: '20px' }}>
                        #{i + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>PKR {r.price.toLocaleString()}</div>
                      </div>
                    </div>
                    <span className="badge badge-premium">
                      {r._count.access} Unlocked
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cuisine Distribution */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
              <BookOpen size={18} /> Catalog Cuisine Breakdown
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {cuisineDistribution.map((c) => {
                const percentage = recipesCount > 0 ? Math.round((c._count.id / recipesCount) * 100) : 0;
                return (
                  <div key={c.cuisine}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>{c.cuisine}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>{c._count.id} ({percentage}%)</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--color-surface-2)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary-light), var(--color-primary))' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
