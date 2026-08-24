import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import { ShoppingBag, DollarSign, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized');
  }

  const params = await searchParams;
  const where: Record<string, unknown> = {};
  if (params.status) {
    where.paymentStatus = params.status.toUpperCase();
  }

  const [orders, totalRevenue, paidCount, pendingCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, username: true } },
        items: { include: { recipe: { select: { title: true, slug: true } } } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    }),
    prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    prisma.order.count({ where: { paymentStatus: 'PENDING' } }),
  ]);

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
            Orders & Sales
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Track and manage digital recipe purchases and payments.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-primary)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Total Gross Sales</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
              PKR {(totalRevenue._sum.amount || 0).toLocaleString()}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-success)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Successful Payments</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem' }}>
              {paidCount}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-warning)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Pending Orders</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '0.25rem' }}>
              {pendingCount}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {orders.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No orders found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Order ID</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Customer</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Purchased Recipes</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Amount</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Payment Status</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, idx) => (
                    <tr
                      key={o.id}
                      style={{
                        borderBottom: idx < orders.length - 1 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        #{o.id.slice(-8).toUpperCase()}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{o.user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{o.user.email}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {o.items.map((it) => (
                          <div key={it.id} style={{ fontWeight: 500 }}>
                            {it.recipe.title}
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {o.currency} {o.totalAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className={`badge ${
                          o.paymentStatus === 'PAID' ? 'badge-published' : o.paymentStatus === 'PENDING' ? 'badge-draft' : 'badge-archived'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        {new Date(o.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
