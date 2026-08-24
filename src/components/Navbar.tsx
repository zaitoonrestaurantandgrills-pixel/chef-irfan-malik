'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu, X, Search, ShoppingBag, User, LayoutDashboard,
  BookOpen, Settings, LogOut, ChevronDown
} from 'lucide-react';

const navLinks = [
  { href: '/gallery',      label: 'Portfolio' },
  { href: '/recipes',      label: 'Marketplace' },
  { href: '/about',        label: 'About' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/contact',      label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session }             = useSession();
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(250, 249, 245, 0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Brand / Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Chef Irfan Malik Logo"
              style={{
                height: '48px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
              }}
            >
              Chef Irfan Malik
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="font-label-caps"
                  style={{
                    color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                    borderBottom: isActive ? '1px solid var(--color-secondary)' : '1px solid transparent',
                    paddingBottom: '2px',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-secondary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)')}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              href="/recipes"
              style={{
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
              title="Search recipes"
            >
              <Search size={18} />
            </Link>

            <Link
              href="/recipes"
              style={{
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
              title="Shopping Bag"
            >
              <ShoppingBag size={19} />
            </Link>

            {session ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="font-label-caps"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.375rem 0.75rem',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 700 }}>
                    {session.user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {profileOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: '220px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-dropdown)',
                      zIndex: 200,
                      overflow: 'hidden',
                    }}
                    onClick={() => setProfileOpen(false)}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-low)' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{session.user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{session.user?.email}</div>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                      <Link
                        href="/dashboard"
                        className="font-label-caps"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', color: 'var(--color-text)', textDecoration: 'none' }}
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link
                        href="/my-recipes"
                        className="font-label-caps"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', color: 'var(--color-text)', textDecoration: 'none' }}
                      >
                        <BookOpen size={15} /> My Recipes
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="font-label-caps"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 600 }}
                        >
                          <Settings size={15} /> Chef Admin
                        </Link>
                      )}
                      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)', margin: '0.5rem 0' }} />
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="font-label-caps"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem',
                          padding: '0.625rem 0.75rem',
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-error)',
                          textAlign: 'left',
                        }}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href="/login" className="btn btn-ghost btn-sm">Account</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-primary)',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
              }}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          background: 'rgba(0,0,0,0.4)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={() => setMenuOpen(false)}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(80vw, 320px)',
          zIndex: 95,
          background: 'var(--color-bg)',
          borderLeft: '1px solid var(--color-border)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem',
          gap: '0.5rem',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Chef Irfan Malik" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700 }}>
              Chef Irfan Malik
            </span>
          </div>
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-label-caps"
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              color: pathname === href ? 'var(--color-secondary)' : 'var(--color-text)',
              textDecoration: 'none',
              background: pathname === href ? 'var(--color-surface-container)' : 'transparent',
              borderLeft: pathname === href ? '3px solid var(--color-secondary)' : '3px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </Link>
        ))}

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1rem 0' }} />

        {session ? (
          <>
            <Link href="/dashboard" className="font-label-caps" style={{ padding: '0.875rem 1rem', color: 'var(--color-text)', textDecoration: 'none' }}>Dashboard</Link>
            <Link href="/my-recipes" className="font-label-caps" style={{ padding: '0.875rem 1rem', color: 'var(--color-text)', textDecoration: 'none' }}>My Recipes</Link>
            {isAdmin && <Link href="/admin" className="font-label-caps" style={{ padding: '0.875rem 1rem', color: 'var(--color-secondary)', textDecoration: 'none' }}>Chef Admin</Link>}
            <button onClick={() => signOut({ callbackUrl: '/' })} className="font-label-caps" style={{ padding: '0.875rem 1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', textAlign: 'left' }}>Sign Out</button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link href="/login" className="btn btn-primary">Sign In</Link>
            <Link href="/register" className="btn btn-secondary">Create Account</Link>
          </div>
        )}
      </div>

      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: '72px' }} />
    </>
  );
}
