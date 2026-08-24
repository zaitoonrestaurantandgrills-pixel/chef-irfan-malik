'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard, BookOpen, PlusCircle, ShoppingBag,
  Users, Image as ImageIcon, Trophy, MessageSquare, BarChart3,
  Settings, LogOut, Globe, Menu, X, Bell, Search
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
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
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
        <div
          style={{
            padding: '1.25rem 1.25rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                }}
              >
                Chef Irfan
              </div>
              <div
                className="font-label-caps"
                style={{
                  color: 'var(--color-secondary)',
                  fontSize: '9px',
                  marginTop: '0.15rem',
                }}
              >
                Admin Portal
              </div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
            className="md-hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <div
          style={{
            flex: 1,
            padding: '1.25rem 0.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-label-caps"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 0,
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  color: isActive ? 'var(--color-on-secondary-container)' : 'var(--color-text-muted)',
                  background: isActive ? 'var(--color-secondary-container)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--color-secondary)' : '4px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Profile & Footer */}
        <div
          style={{
            padding: '1.25rem 1rem',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-surface-low)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              {session?.user?.name?.[0]?.toUpperCase() || 'IM'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
                {session?.user?.name || 'Chef Irfan'}
              </div>
              <div className="font-label-caps" style={{ fontSize: '9px', color: 'var(--color-secondary)' }}>
                Master Access
              </div>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="font-label-caps"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              fontSize: '11px',
            }}
          >
            <Globe size={14} /> Live Website
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="font-label-caps"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-error)',
              fontSize: '11px',
              textAlign: 'left',
            }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="admin-main-wrapper">
        {/* Sticky Topbar */}
        <header
          style={{
            height: '68px',
            background: 'rgba(250, 249, 245, 0.95)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'none',
              }}
              className="admin-hamburger"
            >
              <Menu size={22} />
            </button>

            <span className="font-label-caps" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
              Management Portal
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Notifications"
            >
              <Bell size={18} />
            </button>
            <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)' }} />
            <Link
              href="/admin/recipes/new"
              className="btn btn-primary btn-sm"
              style={{ textDecoration: 'none' }}
            >
              <PlusCircle size={14} /> New Recipe
            </Link>
          </div>
        </header>

        {/* Main Canvas */}
        <main style={{ flex: 1, background: 'var(--color-bg)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
