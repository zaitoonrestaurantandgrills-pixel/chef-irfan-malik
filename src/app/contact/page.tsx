import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

export const metadata: Metadata = {
  title: 'Contact Chef Irfan Malik — Inquiries, Workshops & Collaborations',
  description: 'Get in touch with Chef Irfan Malik for culinary workshops, media appearances, recipe inquiries, or brand collaborations.',
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });

  const email = settings?.email || 'info@chefirfan.com';
  const phone = settings?.phone || '+92 300 000 0000';
  const address = settings?.address || 'Lahore, Pakistan';

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        {/* Header */}
        <section style={{
          background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
          borderBottom: '1px solid var(--color-border)',
          padding: '4rem 0 3rem',
          textAlign: 'center',
        }}>
          <div className="container">
            <span className="section-label">Connect With Us</span>
            <h1 className="heading-xl" style={{ marginBottom: '0.75rem' }}>
              Get In Touch
            </h1>
            <div className="divider-gold" />
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '1rem auto 0' }}>
              Have questions about a recipe, private culinary consulting, masterclasses, or brand collaborations?
            </p>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: '4rem 0 5rem' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '3.5rem', alignItems: 'start' }}>
              {/* Contact Info & Socials */}
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                  Contact Details
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0,
                    }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Email Us</div>
                      <a href={`mailto:${email}`} style={{ color: 'var(--color-text)', fontWeight: 600, textDecoration: 'none' }} className="hover-gold">
                        {email}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0,
                    }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Phone / WhatsApp</div>
                      <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                        {phone}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0,
                    }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Location</div>
                      <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                        {address}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  Follow Chef Irfan
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[
                    { icon: InstagramIcon, href: settings?.instagram || '#' },
                    { icon: YoutubeIcon, href: settings?.youtube || '#' },
                    { icon: FacebookIcon, href: settings?.facebook || '#' },
                    { icon: TwitterIcon, href: settings?.twitter || '#' },
                  ].map(({ icon: IconComponent, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-text-muted)', transition: 'all 0.2s', textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                        e.currentTarget.style.color = 'var(--color-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.color = 'var(--color-text-muted)';
                      }}
                    >
                      <IconComponent />
                    </a>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 860px) {
          section > div > div[style*="grid-template-columns: 1fr 1.3fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
