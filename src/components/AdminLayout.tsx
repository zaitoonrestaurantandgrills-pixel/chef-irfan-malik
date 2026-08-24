'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  ChefHat, LayoutDashboard, BookOpen, PlusCircle, ShoppingBag,
  Users, Image as ImageIcon, Trophy, MessageSquare, BarChart3,
  Settings, LogOut, Globe, Menu, X, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/recipes', label: 'All Recipes', icon: BookOpen },
  { href: '/admin/recipes/new', label: 'Create Recipe', icon: PlusCircle },
  { href: '/admin/orders', label: 'Orders & Sales', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/gallery', label: 'Photo Gallery', icon: ImageIcon },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Site & Profile Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)', zIndex: 90
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: mobileOpen ? 'translateX(0)' : undefined,
        }}
        className="admin-sidebar-container"
      >
        {/* Brand Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(201,168,76,0.3)',
            }}>
              <ChefHat size={20} color="#0A0A0A" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
                Chef Irfan
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                Admin Portal
              </div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            className="md-hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <div style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.5rem 0.75rem' }}>
            Management
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  color: isActive ? '#0A0A0A' : 'var(--color-text-muted)',
                  background: isActive ? 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--color-surface-2)';
                    e.currentTarget.style.color = 'var(--color-text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                  }
                }}
              >
                <Icon size={18} color={isActive ? '#0A0A0A' : 'currentColor'} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface-2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
            className="hover-gold"
          >
            <Globe size={16} /> View Live Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-error)', fontSize: '0.85rem', width: '100%', textAlign: 'left',
              transition: 'background 0.2s',
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="admin-main-wrapper">
        {/* Top Header Bar */}
        <header style={{
          height: '64px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: 'none', border: 'none', color: 'var(--color-text)',
                cursor: 'pointer', display: 'none'
              }}
              className="admin-hamburger"
            >
              <Menu size={22} />
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>
              Chef Irfan Malik Portfolio Administration
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
              padding: '0.375rem 0.875rem', borderRadius: '999px',
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'var(--color-primary)', color: '#0A0A0A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.75rem'
              }}>
                {session?.user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{session?.user?.name || 'Admin'}</span>
              <span className="badge badge-premium" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>
                {session?.user?.role || 'ADMIN'}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, background: 'var(--color-bg)' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .admin-sidebar-container {
            transform: translateX(-100%);
          }
          .admin-main-wrapper {
            margin-left: 0 !important;
          }
          .admin-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
