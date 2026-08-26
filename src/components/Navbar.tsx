'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu, X, Search, ShoppingBag, User, LayoutDashboard,
  BookOpen, Settings, LogOut, ChevronDown, Award,
  Phone, Sparkles, Image as GalleryIcon, ChefHat, MessageSquare, Utensils
} from 'lucide-react';

const navLinks = [
  { href: '/',             label: 'Home' },
  { href: '/recipes',      label: 'Recipes' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/gallery',      label: 'Gallery' },
  { href: '/recipes',      label: 'Marketplace', isSpecial: true },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname                      = usePathname();
  const router                        = useRouter();
  const { data: session }             = useSession();
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

  // Scroll listener for sticky backdrop effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer and dropdowns on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled
            ? 'rgba(255, 255, 255, 0.98)'
            : '#ffffff',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
          transition: 'all 0.25s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0.875rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* ── Brand Logo & Name ──────────────────────────────────────── */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Chef Irfan Malik Emblem"
              style={{
                height: '40px',
                width: '40px',
                objectFit: 'contain',
                borderRadius: '50%',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 700,
                fontStyle: 'italic',
                color: 'var(--color-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              Irfan Malik
            </span>
          </Link>

          {/* ── Desktop Navigation Links ──────────────────────────────── */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
            }}
            className="nav-desktop-menu"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-label-caps"
                  style={{
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
                    borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                    paddingBottom: '0.25rem',
                    transition: 'color 0.15s ease, border-color 0.15s ease',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search Bar (Desktop) */}
            <form onSubmit={handleSearch} style={{ position: 'relative', display: 'none' }} className="lg-flex">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.5rem 1rem 0.5rem 2.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border-subtle)',
                  backgroundColor: 'var(--color-surface-low)',
                  fontSize: '13px',
                  outline: 'none',
                  width: '180px',
                }}
              />
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-secondary)',
                }}
              />
            </form>

            {/* Auth / Profile State */}
            {session?.user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                  }}
                >
                  <User size={15} color="var(--color-primary)" />
                  <span style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {session.user.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={13} />
                </button>

                {profileOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 0.5rem)',
                      width: '210px',
                      background: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      padding: '0.5rem',
                      zIndex: 200,
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-primary)' }}>{session.user.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>{session.user.email}</div>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                      >
                        <LayoutDashboard size={15} color="var(--color-primary)" /> Admin Center
                      </Link>
                    )}

                    <Link
                      href="/dashboard"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', color: 'var(--color-text)', textDecoration: 'none', fontSize: '13px' }}
                    >
                      <ShoppingBag size={15} /> My Recipes
                    </Link>

                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 0.75rem',
                        color: 'var(--color-error)',
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        cursor: 'pointer',
                        fontSize: '13px',
                        textAlign: 'left',
                        borderTop: '1px solid var(--color-border-subtle)',
                        marginTop: '0.25rem',
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="font-label-caps"
                style={{
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Sign In
              </Link>
            )}

            {/* Hire Chef / Explore CTA Button */}
            <Link
              href="/recipes"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                padding: '0.5rem 1.35rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(187, 1, 13, 0.25)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              Explore Recipes
            </Link>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-mobile-toggle"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
              aria-label="Toggle Navigation Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ─────────────────────────────────── */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(80vw, 320px)',
              backgroundColor: '#ffffff',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                Irfan Malik
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search all recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-low)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-secondary)',
                }}
              />
            </form>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-label-caps"
                  style={{
                    color: pathname === link.href ? 'var(--color-primary)' : 'var(--color-secondary)',
                    fontWeight: pathname === link.href ? 700 : 500,
                    textDecoration: 'none',
                    fontSize: '14px',
                    padding: '0.35rem 0',
                    borderBottom: '1px solid var(--color-border-subtle)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'center', textDecoration: 'none' }}
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'center', textDecoration: 'none' }}
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/recipes"
                className="btn btn-primary btn-sm"
                style={{ justifyContent: 'center', textDecoration: 'none' }}
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
