'use client';

import Link from 'next/link';
import { ChefHat, Mail, Phone } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '4rem 0 2rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ChefHat size={22} color="#0A0A0A" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  Chef Irfan Malik
                </div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Crafting Flavors
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '260px' }}>
              Professional chef dedicated to sharing the art of Pakistani cuisine with the world.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[
                { Icon: InstagramIcon, href: '#', name: 'Instagram' },
                { Icon: YoutubeIcon,   href: '#', name: 'Youtube' },
                { Icon: FacebookIcon,  href: '#', name: 'Facebook' },
                { Icon: TwitterIcon,   href: '#', name: 'Twitter' },
              ].map(({ Icon, href, name }) => (
                <a key={href + name} href={href} target="_blank" rel="noopener noreferrer"
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-text-muted)', transition: 'all 0.2s', textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text)' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { href: '/about',        label: 'About Chef Irfan' },
                { href: '/recipes',      label: 'All Recipes' },
                { href: '/gallery',      label: 'Gallery' },
                { href: '/achievements', label: 'Achievements' },
                { href: '/contact',      label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{
                    color: 'var(--color-text-muted)', textDecoration: 'none',
                    fontSize: '0.9rem', transition: 'color 0.2s',
                  }}
                    className="hover-gold"
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recipes */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text)' }}>
              Recipes
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { href: '/recipes?type=free',    label: 'Free Recipes' },
                { href: '/recipes?type=premium', label: 'Premium Recipes' },
                { href: '/recipes?cuisine=Pakistani', label: 'Pakistani Cuisine' },
                { href: '/recipes?category=main-course', label: 'Main Course' },
                { href: '/recipes?category=desserts', label: 'Desserts' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    className="hover-gold">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text)' }}>
              Get In Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <a href="mailto:info@chefirfan.com" style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem',
              }} className="hover-gold">
                <Mail size={15} /> info@chefirfan.com
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <Phone size={15} /> +92 300 000 0000
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/register" className="btn btn-primary btn-sm">
                Join & Explore Recipes
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ color: 'var(--color-text-subtle)', fontSize: '0.85rem' }}>
            © {year} Chef Irfan Malik. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" style={{ color: 'var(--color-text-subtle)', textDecoration: 'none', fontSize: '0.85rem' }} className="hover-gold">Privacy Policy</Link>
            <Link href="/terms"   style={{ color: 'var(--color-text-subtle)', textDecoration: 'none', fontSize: '0.85rem' }} className="hover-gold">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
