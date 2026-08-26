'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard, BookOpen, PlusCircle, ShoppingBag,
  Users, Image as ImageIcon, Trophy, MessageSquare, BarChart3,
  Settings, LogOut, Globe, Menu, X, Bell, Search, Tag,
  Home as HomeIcon, Sparkles, ChevronRight, Layers, ShieldCheck
} from 'lucide-react';

interface NavGroup {
  title: string;
  items: {
    href: string;
    label: string;
    icon: any;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Sales & Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Recipe Marketplace',
    items: [
      { href: '/admin/recipes', label: 'All Recipes', icon: BookOpen },
      { href: '/admin/recipes/new', label: '+ Create Recipe', icon: PlusCircle },
      { href: '/admin/offers', label: 'Offers & Discounts', icon: Tag, badge: 'Hot' },
    ],
  },
  {
    title: 'Sales & Commerce',
    items: [
      { href: '/admin/orders', label: 'Orders & Sales', icon: ShoppingBag },
      { href: '/admin/customers', label: 'Customers', icon: Users },
    ],
  },
  {
    title: 'Website & Content',
    items: [
      { href: '/admin/homepage', label: 'Homepage Control', icon: HomeIcon, badge: 'New' },
      { href: '/admin/gallery', label: 'Photo Gallery', icon: ImageIcon },
      { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
      { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    ],
  },
  {
    title: 'Platform Control',
    items: [
      { href: '/admin/settings', label: 'Website Settings', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on path change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll on mobile when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* ── Mobile Backdrop ────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 14, 12, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 140,
            transition: 'opacity 0.25s ease',
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Admin Sidebar ──────────────────────────────────────────── */}
      <aside
        style={{
          width: '270px',
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 150,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: mobileOpen ? 'translateX(0)' : undefined,
        }}
        className="admin-sidebar-container"
        aria-label="Admin Navigation"
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-bg)',
          }}
        >
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Chef Irfan Malik Emblem" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
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
                  fontWeight: 700,
                }}
              >
                Control Center
              </div>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="md-hidden"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Groups */}
        <div
          style={{
            flex: 1,
            padding: '1rem 0.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {navGroups.map((group) => (
            <div key={group.title}>
              <div
                className="font-label-caps"
                style={{
                  color: 'var(--color-text-subtle)',
                  fontSize: '9.5px',
                  letterSpacing: '0.14em',
                  padding: '0 0.75rem',
                  marginBottom: '0.35rem',
                  fontWeight: 700,
                }}
              >
                {group.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                {group.items.map((item) => {
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="font-label-caps"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.65rem',
                        padding: '0.65rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        fontWeight: isActive ? 700 : 500,
                        textDecoration: 'none',
                        color: isActive ? 'var(--color-on-secondary-container)' : 'var(--color-text-muted)',
                        background: isActive ? 'var(--color-secondary-container)' : 'transparent',
                        borderLeft: isActive ? '3px solid var(--color-secondary)' : '3px solid transparent',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-surface-low)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Icon size={16} color={isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)'} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          style={{
                            background: item.badge === 'Hot' ? 'var(--color-secondary)' : 'var(--color-tertiary-container)',
                            color: item.badge === 'Hot' ? '#ffffff' : 'var(--color-tertiary-fixed-dim)',
                            fontSize: '8.5px',
                            padding: '0.1rem 0.4rem',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Profile & Footer */}
        <div
          style={{
            padding: '1rem 0.875rem',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.25rem 0.5rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.75rem',
                flexShrink: 0,
              }}
            >
              {session?.user?.name?.[0]?.toUpperCase() || 'IM'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {session?.user?.name || 'Chef Irfan Malik'}
              </div>
              <div className="font-label-caps" style={{ fontSize: '8.5px', color: 'var(--color-secondary)' }}>
                Master Admin
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
            <Link
              href="/"
              target="_blank"
              className="font-label-caps"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.5rem',
                color: 'var(--color-text-muted)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '10px',
                textAlign: 'center',
              }}
            >
              <Globe size={12} /> Live Site
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="font-label-caps"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.5rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                color: 'var(--color-error)',
                fontSize: '10px',
                textAlign: 'center',
              }}
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ──────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          marginLeft: '270px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0,
        }}
        className="admin-main-wrapper"
      >
        {/* Sticky Topbar */}
        <header
          style={{
            height: '66px',
            background: 'rgba(250, 249, 245, 0.96)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.75rem',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'none',
                width: '38px',
                height: '38px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="admin-hamburger"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>

            <div>
              <span className="font-label-caps" style={{ color: 'var(--color-secondary)', fontSize: '9px', display: 'block' }}>
                Chef Irfan Malik Platform
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-primary)', fontSize: '1rem' }}>
                Admin Control Center
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <Link
              href="/"
              target="_blank"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
            >
              <Globe size={13} /> View Website
            </Link>

            <Link
              href="/admin/recipes/new"
              className="btn btn-primary btn-sm"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <PlusCircle size={14} /> Add Recipe
            </Link>
          </div>
        </header>

        {/* Main Canvas */}
        <main style={{ flex: 1, background: 'var(--color-bg)', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
