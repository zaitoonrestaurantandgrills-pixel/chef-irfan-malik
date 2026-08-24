'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        borderTop: '1px solid var(--color-border)',
        padding: '5rem 0 3rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '3.5rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          }}
          className="footer-top-row"
        >
          {/* Brand Col */}
          <div style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Chef Irfan Malik Emblem"
                style={{
                  height: '64px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    lineHeight: 1.1,
                  }}
                >
                  Chef Irfan Malik
                </div>
                <div className="font-label-caps" style={{ color: 'var(--color-tertiary-fixed-dim)', fontSize: '10px', marginTop: '0.25rem' }}>
                  Crafting Flavors. Sharing Knowledge.
                </div>
              </div>
            </div>
            <p
              className="font-body-md"
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Mastering the art of traditional & contemporary gastronomy. Sharing Michelin-standard food safety, authentic techniques, and heritage recipes.
            </p>
          </div>

          {/* Nav & Contact Columns */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '3rem',
            }}
          >
            {/* Nav */}
            <div>
              <div
                className="font-label-caps"
                style={{ color: 'var(--color-tertiary-fixed-dim)', marginBottom: '1.25rem' }}
              >
                Explore
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li>
                  <Link href="/gallery" className="font-label-caps" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                    Portfolio Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/recipes" className="font-label-caps" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                    Recipe Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="font-label-caps" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                    About Chef Irfan
                  </Link>
                </li>
                <li>
                  <Link href="/achievements" className="font-label-caps" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                    Awards & Honors
                  </Link>
                </li>
              </ul>
            </div>

            {/* Direct Contact Info */}
            <div>
              <div
                className="font-label-caps"
                style={{ color: 'var(--color-tertiary-fixed-dim)', marginBottom: '1.25rem' }}
              >
                Contact & Inquiries
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <li>
                  <a
                    href="tel:03009482504"
                    className="font-label-caps"
                    style={{
                      color: '#ffffff',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    <Phone size={14} color="var(--color-secondary-container)" />
                    0300-9482504
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/923009482504"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-label-caps"
                    style={{
                      color: 'var(--color-secondary-container)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    💬 WhatsApp Direct
                  </a>
                </li>
                <li style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} color="var(--color-tertiary-fixed-dim)" />
                  Zaitoon Restaurant, Karachi
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright + Developer Branding */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            paddingTop: '2.5rem',
          }}
        >
          {/* Copyright & Developer Branding */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <p
              className="font-label-caps"
              style={{ color: 'rgba(255, 255, 255, 0.65)', margin: 0, fontSize: '11px' }}
            >
              © {year} Chef Irfan Malik. All Rights Reserved.
            </p>
            <p
              className="font-label-caps"
              style={{
                color: 'var(--color-tertiary-fixed-dim)',
                margin: 0,
                fontSize: '11px',
                letterSpacing: '0.12em',
              }}
            >
              Designed & Developed by{' '}
              <strong style={{ color: '#ffffff', fontWeight: 700 }}>A Wajid Shah</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              className="font-label-caps"
              style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="font-label-caps"
              style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}
            >
              Press Kit
            </Link>
            <Link
              href="/about"
              className="font-label-caps"
              style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
