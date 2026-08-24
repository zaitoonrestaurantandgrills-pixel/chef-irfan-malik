import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Users, BookOpen, ShoppingBag, TrendingUp, Plus, Eye, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') redirect('/unauthorized');

  const [totalUsers, totalRecipes, publishedRecipes, premiumRecipes, totalOrders, paidOrders, recentOrders, recentUsers] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.recipe.count(),
    prisma.recipe.count({ where: { status: 'PUBLISHED' } }),
    prisma.recipe.count({ where: { type: 'PREMIUM', status: 'PUBLISHED' } }),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { recipe: { select: { title: true } } } },
      },
    }),
    prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
  ]);

  const totalRevenue = await prisma.payment.aggregate({
    where: { status: 'PAID' },
    _sum: { amount: true },
  });

  const revenue = totalRevenue._sum.amount ?? 0;

  const stats = [
    { icon: <Users size={22} />, label: 'Total Customers', value: totalUsers, color: '#5290E0', change: null },
    { icon: <BookOpen size={22} />, label: 'Published Recipes', value: publishedRecipes, color: 'var(--color-primary)', change: `${premiumRecipes} Premium` },
    { icon: <ShoppingBag size={22} />, label: 'Total Orders', value: totalOrders, color: 'var(--color-success)', change: `${paidOrders} Paid` },
    { icon: <TrendingUp size={22} />, label: 'Total Revenue', value: `PKR ${revenue.toLocaleString()}`, color: '#9B59B6', change: null },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.25rem' }}>Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Welcome back, Chef Irfan. Here&apos;s your platform overview.
            </p>
          </div>
          <Link href="/admin/recipes/new" className="btn btn-primary">
            <Plus size={16} /> New Recipe
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {stats.map(({ icon, label, value, color, change }) => (
            <div key={label} style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)', padding: '1.5rem',
              borderLeft: `4px solid ${color}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
                  background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color,
                }}>
                  {icon}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                {value}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{label}</div>
              {change && <div style={{ fontSize: '0.775rem', color, marginTop: '0.375rem', fontWeight: 600 }}>{change}</div>}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.875rem', marginBottom: '2.5rem' }}>
          {[
            { href: '/admin/recipes/new',   label: 'Add Recipe',       icon: <Plus size={16} /> },
            { href: '/admin/recipes',        label: 'Manage Recipes',   icon: <BookOpen size={16} /> },
            { href: '/admin/orders',         label: 'View Orders',      icon: <ShoppingBag size={16} /> },
            { href: '/admin/customers',      label: 'Customers',        icon: <Users size={16} /> },
            { href: '/admin/gallery',        label: 'Gallery',          icon: <Eye size={16} /> },
            { href: '/admin/settings',       label: 'Settings',         icon: <Package size={16} /> },
          ].map(({ href, label, icon }) => (
            <Link key={href} href={href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
              padding: '1.25rem 1rem',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', textDecoration: 'none',
              color: 'var(--color-text-muted)', fontSize: '0.825rem', fontWeight: 500,
              transition: 'all 0.2s', textAlign: 'center',
            }}
              className="hover-gold"
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
          {/* Recent Orders */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>Recent Orders</h2>
              <Link href="/admin/orders" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none' }}>View all →</Link>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {recentOrders.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No orders yet.</div>
              ) : recentOrders.map((order, i) => (
                <div key={order.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderBottom: i < recentOrders.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }} className="line-clamp-1">
                      {order.user.name}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }} className="line-clamp-1">
                      {order.items.map(i => i.recipe.title).join(', ')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>
                      PKR {order.totalAmount.toLocaleString()}
                    </div>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px',
                      background: order.paymentStatus === 'PAID' ? 'rgba(76,175,120,0.1)' : 'rgba(224,130,82,0.1)',
                      color: order.paymentStatus === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)',
                      border: `1px solid ${order.paymentStatus === 'PAID' ? 'rgba(76,175,120,0.3)' : 'rgba(224,130,82,0.3)'}`,
                      textTransform: 'uppercase',
                    }}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Customers */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>New Customers</h2>
              <Link href="/admin/customers" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none' }}>View all →</Link>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {recentUsers.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No customers yet.</div>
              ) : recentUsers.map((user, i) => (
                <div key={user.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.875rem 1.25rem',
                  borderBottom: i < recentUsers.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.875rem', color: '#0A0A0A',
                  }}>
                    {user.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }} className="line-clamp-1">{user.email}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', flexShrink: 0 }}>
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 320px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
}
