import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import { Users, Mail, BookOpen, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized');
  }

  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      _count: {
        select: { recipeAccess: true, orders: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
            Customer Directory
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Registered customers and their purchased recipe portfolio.
          </p>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          {customers.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No registered customers yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Customer</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Username</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Unlocked Recipes</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Total Orders</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Member Since</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, idx) => (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: idx < customers.length - 1 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.85rem', color: '#0A0A0A', flexShrink: 0
                          }}>
                            {c.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                        @{c.username}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className="badge badge-premium">
                          {c._count.recipeAccess} Recipes
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                        {c._count.orders} Orders
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
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
