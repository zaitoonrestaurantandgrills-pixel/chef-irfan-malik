'use client';

import Link from 'next/link';
import { Phone, MessageSquare, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#1b1c1a',
        color: '#ffffff',
        borderTop: '1px solid var(--color-border-subtle)',
        padding: '5rem 1.5rem 3rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '3rem',
            flexWrap: 'wrap',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Brand Col */}
          <div style={{ maxWidth: '380px' }}>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.65rem',
                fontStyle: 'italic',
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '1rem',
              }}
            >
              Irfan Malik
            </Link>

            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Crafting Flavors. Sharing Knowledge. Mastering the art of traditional &amp; contemporary gastronomy.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a
                href="tel:03009482504"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Phone size={15} color="var(--color-tertiary-fixed-dim)" /> 0300-9482504
              </a>

              <a
                href="https://wa.me/923009482504"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <MessageSquare size={15} color="var(--color-tertiary-fixed-dim)" /> WhatsApp Inquiries
              </a>

              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.25rem',
                }}
              >
                <MapPin size={15} color="var(--color-tertiary-fixed-dim)" /> Zaitoon Restaurant, Karachi
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4
              className="font-label-caps"
              style={{
                color: 'var(--color-tertiary-fixed-dim)',
                fontSize: '12px',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
                fontWeight: 700,
              }}
            >
              Explore
            </h4>
            <Link href="/" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>Home</Link>
            <Link href="/recipes" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>Recipe Marketplace</Link>
            <Link href="/about" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>About Chef Irfan</Link>
            <Link href="/achievements" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>Achievements &amp; Honors</Link>
            <Link href="/gallery" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>Culinary Gallery</Link>
          </div>

          {/* Customer & Legal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4
              className="font-label-caps"
              style={{
                color: 'var(--color-tertiary-fixed-dim)',
                fontSize: '12px',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
                fontWeight: 700,
              }}
            >
              Customer &amp; Legal
            </h4>
            <Link href="/login" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>Sign In</Link>
            <Link href="/dashboard" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>My Recipes</Link>
            <Link href="/contact" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>Contact &amp; Bookings</Link>
            <Link href="/about" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>Privacy Policy</Link>
            <Link href="/admin/login" style={{ color: 'var(--color-tertiary-fixed-dim)', textDecoration: 'none', fontSize: '12px', marginTop: '0.5rem' }}>
              🔒 Admin Control Center
            </Link>
          </div>
        </div>

        {/* Bottom Credits */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div>© {year} Chef Irfan Malik. All culinary rights reserved.</div>
          <div>
            Designed &amp; Developed by <strong style={{ color: '#ffffff' }}>A Wajid Shah</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
