import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Chef Irfan Malik — Inquiries, Masterclasses & Consulting',
  description: 'Get in touch directly with Executive Chef Irfan Malik for culinary workshops, media appearances, recipe inquiries, or brand collaborations. Call 0300-9482504.',
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });

  const email = settings?.email || 'contact@chefirfanmalik.com';
  const phone = settings?.phone || '0300-9482504';
  const whatsapp = settings?.whatsapp || '0300-9482504';
  const address = settings?.address || 'Zaitoon Restaurant, Karachi, Pakistan';

  return (
    <>
      <Navbar />

      <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        {/* Header */}
        <section
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--color-border)',
            padding: '4rem 0 3rem',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ maxWidth: '780px' }}>
            <span
              className="font-label-caps"
              style={{
                color: 'var(--color-secondary)',
                display: 'block',
                marginBottom: '0.5rem',
                letterSpacing: '0.15em',
              }}
            >
              Direct Communication
            </span>
            <h1
              className="font-display-lg-mobile md:font-display-lg"
              style={{
                color: 'var(--color-primary)',
                marginBottom: '1rem',
              }}
            >
              Get In Touch
            </h1>
            <p
              className="font-body-lg"
              style={{
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                margin: '0 auto',
              }}
            >
              Have questions about a recipe masterclass, private culinary consulting, restaurant events, or brand collaborations?
            </p>
          </div>
        </section>

        {/* Content Split */}
        <section style={{ padding: '4rem 0 6rem' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '4rem',
                alignItems: 'start',
              }}
            >
              {/* Contact Details Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                    Executive Contact
                  </h2>
                  <p className="font-body-md" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>
                    Reach Chef Irfan Malik directly for private masterclasses, recipe licensing, or consulting inquiries.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Phone */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'center',
                      padding: '1.5rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-ambient)',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-secondary-container)',
                        color: 'var(--color-on-secondary-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>
                        Direct Call / WhatsApp
                      </div>
                      <a
                        href={`tel:${phone.replace(/[^0-9]/g, '')}`}
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                        }}
                      >
                        {phone}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp Quick Link */}
                  <a
                    href={`https://wa.me/92${whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'center',
                      padding: '1.5rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-ambient)',
                      textDecoration: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: '#25D366',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <div className="font-label-caps" style={{ color: '#128C7E', fontSize: '10px' }}>
                        Instant Chat
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                        Message on WhatsApp →
                      </div>
                    </div>
                  </a>

                  {/* Email */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'center',
                      padding: '1.5rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-ambient)',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-surface-container)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>
                        Official Email
                      </div>
                      <a
                        href={`mailto:${email}`}
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                        }}
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'center',
                      padding: '1.5rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-ambient)',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-surface-container)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="font-label-caps" style={{ color: 'var(--color-text-subtle)', fontSize: '10px' }}>
                        Restaurant Location
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                        {address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2.5rem',
                  boxShadow: 'var(--shadow-ambient)',
                }}
              >
                <h3 className="font-headline-sm" style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                  Send a Direct Message
                </h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
