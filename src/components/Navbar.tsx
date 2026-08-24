'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu, X, ChefHat, Search, User, BookOpen,
  LogOut, LayoutDashboard, Settings, ChevronDown
} from 'lucide-react';

const navLinks = [
  { href: '/',             label: 'Home' },
  { href: '/about',        label: 'About Chef' },
  { href: '/recipes',      label: 'Recipes' },
  { href: '/gallery',      label: 'Gallery' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/contact',      label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session }           = useSession();
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'rgba(10,10,10,0.95)'
            : 'linear-gradient(180deg, rgba(10,10,10,0.8) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(201,168,76,0.35)',
            }}>
              <ChefHat size={20} color="#0A0A0A" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.1 }}>
                Chef Irfan Malik
              </div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 600 }}>
                Crafting Flavors
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hide-mobile">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '0.5rem 0.875rem',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: pathname === href ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  borderRadius: 'var(--radius-sm)',
                  borderBottom: pathname === href ? '2px solid var(--color-primary)' : '2px solid transparent',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = pathname === href ? 'var(--color-primary)' : 'var(--color-text-muted)')}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/recipes" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              <Search size={18} />
            </Link>

            {session ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                    borderRadius: '999px', padding: '0.375rem 0.875rem 0.375rem 0.5rem',
                    color: 'var(--color-text)', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: '#0A0A0A',
                  }}>
                    {session.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} style={{ color: 'var(--color-text-muted)' }} />
                </button>

                {profileOpen && (
                  <div
                    style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: '200px',
                      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', zIndex: 200,
                      overflow: 'hidden',
                    }}
                    onClick={() => setProfileOpen(false)}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{session.user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{session.user?.email}</div>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                      <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.875rem' }}
                        className="hover-gold">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link href="/my-recipes" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.875rem' }}
                        className="hover-gold">
                        <BookOpen size={15} /> My Recipes
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                          <Settings size={15} /> Admin Panel
                        </Link>
                      )}
                      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }} />
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)', textAlign: 'left' }}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', padding: '0.25rem' }}
              className="show-mobile"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 90,
        background: 'rgba(0,0,0,0.6)',
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s',
      }} onClick={() => setMenuOpen(false)} />

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(80vw, 320px)', zIndex: 95,
        background: 'var(--color-surface)',
        borderLeft: '1px solid var(--color-border)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        padding: '2rem 1.5rem',
        gap: '0.5rem',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-primary)' }}>Menu</span>
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} style={{
            padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)',
            color: pathname === href ? 'var(--color-primary)' : 'var(--color-text)',
            textDecoration: 'none', fontWeight: 500, fontSize: '1rem',
            background: pathname === href ? 'var(--color-primary-muted)' : 'transparent',
            borderLeft: pathname === href ? '3px solid var(--color-primary)' : '3px solid transparent',
            transition: 'all 0.2s',
          }}>
            {label}
          </Link>
        ))}
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1rem 0' }} />
        {session ? (
          <>
            <Link href="/dashboard" style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 500, fontSize: '1rem' }}>Dashboard</Link>
            <Link href="/my-recipes" style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 500, fontSize: '1rem' }}>My Recipes</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} style={{ padding: '0.875rem 1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', fontWeight: 500, fontSize: '1rem', textAlign: 'left', borderRadius: 'var(--radius-sm)' }}>Sign Out</button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link href="/login" className="btn btn-ghost">Login</Link>
            <Link href="/register" className="btn btn-primary">Register</Link>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .hide-mobile { display: none !important; } }
        @media (min-width: 901px) { .show-mobile { display: none !important; } }
      `}</style>

      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: '72px' }} />
    </>
  );
}
