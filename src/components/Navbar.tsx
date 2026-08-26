'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu, X, Search, ShoppingBag, User, LayoutDashboard,
  BookOpen, Settings, LogOut, ChevronDown, Award,
  Phone, Sparkles, Image as GalleryIcon, ChefHat, MessageSquare, Utensils,
  ArrowRight
} from 'lucide-react';

const navLinks = [
  { href: '/',             label: 'Home',         icon: Utensils },
  { href: '/recipes',      label: 'Recipes',      icon: BookOpen },
  { href: '/achievements', label: 'Achievements', icon: Award },
  { href: '/gallery',      label: 'Gallery',      icon: GalleryIcon },
  { href: '/recipes',      label: 'Marketplace',  icon: Sparkles, isSpecial: true },
];

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [searchModal, setSearchModal]   = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const pathname                        = usePathname();
  const router                          = useRouter();
  const { data: session }               = useSession();
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
    setSearchModal(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer or search modal is open
  useEffect(() => {
    if (menuOpen || searchModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, searchModal]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
      setSearchModal(false);
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
          background: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#ffffff',
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
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          {/* ── Brand Logo & Title ────────────────────────────────────── */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Chef Irfan Malik Emblem"
              style={{
                height: '38px',
                width: '38px',
                objectFit: 'contain',
                borderRadius: '50%',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                color: 'var(--color-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Irfan Malik
            </span>
          </Link>

          {/* ── Desktop Navigation Menu ───────────────────────────────── */}
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

          {/* ── Responsive Action Buttons ─────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexShrink: 0,
            }}
          >
            {/* Search Input (Desktop) */}
            <form onSubmit={handleSearch} style={{ position: 'relative' }} className="nav-desktop-search">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.45rem 0.85rem 0.45rem 2.1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border-subtle)',
                  backgroundColor: 'var(--color-surface-low)',
                  fontSize: '12px',
                  outline: 'none',
                  width: '160px',
                }}
              />
              <Search
                size={13}
                style={{
                  position: 'absolute',
                  left: '0.7rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-secondary)',
                }}
              />
            </form>

            {/* Mobile/Tablet Search Trigger Button */}
            <button
              onClick={() => setSearchModal(true)}
              className="nav-mobile-search-btn"
              style={{
                background: 'var(--color-surface-low)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--color-secondary)',
                width: '36px',
                height: '36px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Search recipes"
            >
              <Search size={16} />
            </button>

            {/* Auth / Profile State */}
            {session?.user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                  }}
                >
                  <User size={14} color="var(--color-primary)" />
                  <span className="nav-profile-name" style={{ maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {session.user.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={12} />
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
                className="nav-signin-link font-label-caps"
                style={{
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '0.4rem 0.6rem',
                  whiteSpace: 'nowrap',
                }}
              >
                Sign In
              </Link>
            )}

            {/* Primary Action Button (Responsive Text/Padding) */}
            <Link
              href="/recipes"
              className="nav-cta-btn"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                padding: '0.45rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(187, 1, 13, 0.25)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="nav-cta-text-full">Explore Recipes</span>
              <span className="nav-cta-text-short">Recipes</span>
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-mobile-toggle"
              style={{
                background: 'var(--color-surface-low)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                width: '38px',
                height: '38px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              aria-label="Toggle Navigation Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Search Modal Overlay ──────────────────────────────── */}
      {searchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            backgroundColor: 'rgba(15, 14, 12, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '4rem 1.25rem 1rem',
          }}
          onClick={() => setSearchModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-primary)', fontSize: '11px', fontWeight: 700 }}>
                Search Recipe Marketplace
              </span>
              <button
                onClick={() => setSearchModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Biryani, Daal Makhani, Karahi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.4rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-secondary)',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ padding: '0 1.25rem' }}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Mobile Navigation Drawer ─────────────────────────────────── */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            backgroundColor: 'rgba(15, 14, 12, 0.65)',
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
              width: 'min(82vw, 340px)',
              backgroundColor: '#ffffff',
              padding: '1.75rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Irfan Malik
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'var(--color-surface-low)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-primary)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* In-Drawer Search */}
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search all recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-low)',
                  fontSize: '13px',
                  outline: 'none',
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

            {/* Navigation Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.25rem', overflowY: 'auto' }}>
              {navLinks.map((link) => {
                const Icon = link.icon;
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
                      fontWeight: isActive ? 700 : 500,
                      textDecoration: 'none',
                      fontSize: '13px',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--color-primary-fixed)' : 'transparent',
                    }}
                  >
                    <Icon size={16} color={isActive ? 'var(--color-primary)' : 'var(--color-secondary)'} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Bottom Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'center', textDecoration: 'none', width: '100%' }}
                  >
                    <ShoppingBag size={14} /> My Recipes &amp; Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="btn btn-primary btn-sm"
                      style={{ justifyContent: 'center', textDecoration: 'none', width: '100%' }}
                    >
                      <LayoutDashboard size={14} /> Admin Control Center
                    </Link>
                  )}
                </>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <Link
                    href="/login"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'center', textDecoration: 'none' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-primary btn-sm"
                    style={{ justifyContent: 'center', textDecoration: 'none' }}
                  >
                    Register
                  </Link>
                </div>
              )}

              <Link
                href="/recipes"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <Sparkles size={14} /> Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
