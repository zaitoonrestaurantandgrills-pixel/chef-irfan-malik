'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu, X, Search, ShoppingBag, User, LayoutDashboard,
  BookOpen, Settings, LogOut, ChevronDown, Award,
  Phone, Sparkles, Image as GalleryIcon, ChefHat, MessageSquare
} from 'lucide-react';

const navLinks = [
  { href: '/gallery',      label: 'Portfolio',     icon: GalleryIcon },
  { href: '/recipes',      label: 'Marketplace',   icon: BookOpen, isSpecial: true },
  { href: '/about',        label: 'About Chef',    icon: ChefHat },
  { href: '/achievements', label: 'Achievements',  icon: Award },
  { href: '/contact',      label: 'Contact',       icon: MessageSquare },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
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

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(mobileSearch.trim())}`);
      setMenuOpen(false);
      setMobileSearch('');
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled
            ? 'rgba(250, 249, 245, 0.96)'
            : 'rgba(250, 249, 245, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: scrolled ? '68px' : '76px',
            transition: 'height 0.3s ease',
          }}
        >
          {/* ── Brand / Logo ────────────────────────────────────────── */}
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
              alt="Chef Irfan Malik Logo"
              style={{
                height: scrolled ? '42px' : '48px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'height 0.3s ease',
              }}
            />
            <div>
              <span className="nav-brand-title">
                Chef Irfan Malik
              </span>
              <span className="nav-brand-subtitle">
                Executive Chef
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation Links (≥ 1024px) ─────────────────── */}
          <nav className="nav-desktop-menu" aria-label="Main Navigation">
            {navLinks.map(({ href, label, isSpecial }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="font-label-caps"
                  style={{
                    position: 'relative',
                    color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                    padding: '0.35rem 0.25rem',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 600,
                    letterSpacing: '0.1em',
                    transition: 'color 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--color-text-muted)';
                  }}
                >
                  {label}
                  {isSpecial && (
                    <span
                      style={{
                        background: 'var(--color-tertiary-container)',
                        color: 'var(--color-tertiary-fixed-dim)',
                        border: '1px solid rgba(233, 193, 118, 0.4)',
                        fontSize: '9px',
                        padding: '0.1rem 0.4rem',
                        borderRadius: 'var(--radius-full)',
                        lineHeight: 1,
                        letterSpacing: '0.04em',
                      }}
                    >
                      ✦ Recipes
                    </span>
                  )}
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: 'var(--color-secondary)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions (Desktop & Mobile) ────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {/* Search Button */}
            <Link
              href="/recipes"
              style={{
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
              title="Search recipes"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-container)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Search size={18} />
            </Link>

            {/* Shopping Bag / Recipes link */}
            <Link
              href="/recipes"
              style={{
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
              title="Browse Marketplace"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-container)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ShoppingBag size={18} />
            </Link>

            {/* Desktop Auth Section */}
            <div className="nav-desktop-menu" style={{ marginLeft: '0.25rem' }}>
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
                      borderRadius: 'var(--radius-full)',
                      padding: '0.4rem 0.875rem',
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 700,
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'var(--color-primary)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                      }}
                    >
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{session.user?.name?.split(' ')[0] || 'Account'}</span>
                    <ChevronDown size={13} style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {profileOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        minWidth: '230px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-dropdown)',
                        zIndex: 200,
                        overflow: 'hidden',
                        animation: 'fadeIn 0.15s ease',
                      }}
                      onClick={() => setProfileOpen(false)}
                    >
                      <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-low)' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>{session.user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{session.user?.email}</div>
                      </div>
                      <div style={{ padding: '0.4rem' }}>
                        <Link
                          href="/dashboard"
                          className="font-label-caps"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', color: 'var(--color-text)', textDecoration: 'none', borderRadius: 'var(--radius-sm)', fontSize: '11px' }}
                        >
                          <LayoutDashboard size={14} /> Dashboard
                        </Link>
                        <Link
                          href="/my-recipes"
                          className="font-label-caps"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', color: 'var(--color-text)', textDecoration: 'none', borderRadius: 'var(--radius-sm)', fontSize: '11px' }}
                        >
                          <BookOpen size={14} /> My Purchased Recipes
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="font-label-caps"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 700, borderRadius: 'var(--radius-sm)', fontSize: '11px' }}
                          >
                            <Settings size={14} /> Chef Admin Panel
                          </Link>
                        )}
                        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)', margin: '0.4rem 0' }} />
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
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '11px',
                          }}
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <Link
                    href="/login"
                    className="font-label-caps"
                    style={{
                      padding: '0.5rem 1rem',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/recipes"
                    className="btn btn-primary"
                    style={{
                      padding: '0.5rem 1.125rem',
                      fontSize: '11px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    Explore
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile Hamburger Toggle (< 1024px) ─────────────────── */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-mobile-toggle"
              style={{
                background: menuOpen ? 'var(--color-surface-container)' : 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                color: 'var(--color-primary)',
                padding: '0.5rem',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                transition: 'all 0.2s ease',
              }}
              aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer Backdrop ──────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 190,
          background: 'rgba(15, 14, 12, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Slide-Over Drawer Panel ──────────────────────────── */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(88vw, 360px)',
          zIndex: 200,
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
          }}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Chef Irfan Malik" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, display: 'block', lineHeight: 1.1 }}>
                Chef Irfan Malik
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '8.5px', letterSpacing: '0.12em', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Executive Chef
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Search Form inside Mobile Drawer */}
          <form onSubmit={handleMobileSearch} style={{ position: 'relative' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-subtle)',
              }}
            />
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--color-surface-low)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                padding: '0.625rem 1rem 0.625rem 2.35rem',
                fontSize: '13px',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
                outline: 'none',
              }}
            />
          </form>

          {/* Nav Links List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div
              className="font-label-caps"
              style={{
                color: 'var(--color-text-subtle)',
                fontSize: '10px',
                letterSpacing: '0.14em',
                marginBottom: '0.25rem',
                paddingLeft: '0.5rem',
              }}
            >
              Navigation
            </div>
            {navLinks.map(({ href, label, icon: Icon, isSpecial }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-label-caps"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--color-secondary)' : 'var(--color-text)',
                    textDecoration: 'none',
                    background: isActive ? 'var(--color-surface-container)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--color-secondary)' : '3px solid transparent',
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 600,
                    letterSpacing: '0.08em',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={16} color={isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)'} />
                    <span>{label}</span>
                  </div>
                  {isSpecial && (
                    <span
                      style={{
                        background: 'var(--color-tertiary-container)',
                        color: 'var(--color-tertiary-fixed-dim)',
                        border: '1px solid rgba(233, 193, 118, 0.4)',
                        fontSize: '9px',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 700,
                      }}
                    >
                      ✦ Recipes
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 0 }} />

          {/* User Section in Drawer */}
          <div>
            <div
              className="font-label-caps"
              style={{
                color: 'var(--color-text-subtle)',
                fontSize: '10px',
                letterSpacing: '0.14em',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
              }}
            >
              Account
            </div>

            {session ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--color-surface-low)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '0.25rem',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text)' }}>{session.user?.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{session.user?.email}</div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="font-label-caps"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--color-text)', textDecoration: 'none', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                >
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <Link
                  href="/my-recipes"
                  onClick={() => setMenuOpen(false)}
                  className="font-label-caps"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--color-text)', textDecoration: 'none', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                >
                  <BookOpen size={15} /> My Purchased Recipes
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="font-label-caps"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 700, fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                  >
                    <Settings size={15} /> Chef Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="font-label-caps"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-error)',
                    textAlign: 'left',
                    fontSize: '11px',
                  }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Contact Strip */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <a
            href="tel:03009482504"
            className="font-label-caps"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '11px',
            }}
          >
            <Phone size={13} color="var(--color-secondary)" /> 0300-9482504
          </a>
          <a
            href="https://wa.me/923009482504"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label-caps"
            style={{
              color: 'var(--color-secondary)',
              textDecoration: 'none',
              fontSize: '10px',
            }}
          >
            💬 WhatsApp Inquiries Direct
          </a>
        </div>
      </aside>

      {/* Spacer to push content cleanly below fixed navbar */}
      <div className="navbar-wrapper" aria-hidden="true" />
    </>
  );
}
