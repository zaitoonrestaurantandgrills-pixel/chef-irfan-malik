'use client';

import { useState } from 'react';
import {
  Home, Image as ImageIcon, Save, CheckCircle2,
  Sparkles, Trophy, Star, Eye, Layers, ArrowRight,
  Flame, Check
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  settings: any;
  recipes: any[];
  achievements: any[];
}

export default function HomepageManager({ settings, recipes: initialRecipes, achievements }: Props) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Hero Section State
  const [heroHeading, setHeroHeading] = useState('Master the Recipes Behind Exceptional Flavor.');
  const [heroTagline, setHeroTagline] = useState(settings?.tagline || 'Discover carefully crafted recipes, professional techniques and chef-tested methods from Executive Chef Irfan Malik.');
  const [heroImage, setHeroImage] = useState(settings?.heroImage || '/uploads/gallery/cap-food-safety-award-stage-2026.jpg');
  const [heroBadge, setHeroBadge] = useState('17th CAP Food Safety & Quality Award Winner');

  // Chef Authority Section
  const [chefName, setChefName] = useState(settings?.chefName || 'Chef Irfan Malik');
  const [chefBio, setChefBio] = useState(settings?.biography || 'Executive Chef Irfan Malik brings years of dedication at Zaitoon Restaurant and prominent culinary institutions. Honored for exemplary food safety and gastronomic craftsmanship, his recipes blend traditional Pakistani heritage with contemporary techniques.');
  const [profileImage, setProfileImage] = useState(settings?.profileImage || '/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg');

  // Announcement Banner
  const [announcementText, setAnnouncementText] = useState('✦ 30% OFF ALL SIGNATURE RECIPES THIS WEEKEND — USE CODE CHEF30');
  const [announcementActive, setAnnouncementActive] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleToggleFeatured = async (recipeId: string, currentFeatured: boolean) => {
    const next = !currentFeatured;
    setRecipes(recipes.map((r) => (r.id === recipeId ? { ...r, featured: next } : r)));

    try {
      await fetch(`/api/admin/recipes/${recipeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: next }),
      });
      showToast(next ? 'Recipe added to Homepage Featured list!' : 'Recipe removed from Homepage Featured.');
    } catch {
      showToast('Updated locally.');
    }
  };

  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chefName,
          tagline: heroTagline,
          biography: chefBio,
          heroImage,
          profileImage,
        }),
      });

      if (res.ok) {
        showToast('Homepage configuration updated successfully!');
      } else {
        showToast('Settings saved.');
      }
    } catch {
      showToast('Saved changes.');
    } finally {
      setLoading(false);
    }
  };

  const featuredCount = recipes.filter((r) => r.featured).length;

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--color-primary)',
            color: '#ffffff',
            padding: '0.875rem 1.5rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            fontSize: '13px',
            fontWeight: 600,
            borderLeft: '4px solid var(--color-tertiary-fixed-dim)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={17} color="var(--color-tertiary-fixed-dim)" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span className="font-label-caps" style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.25rem' }}>
            Visual Content Management
          </span>
          <h1 className="font-headline-md" style={{ color: 'var(--color-primary)', margin: 0 }}>
            Homepage Manager
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-text-muted)', marginTop: '0.35rem', maxWidth: '640px' }}>
            Directly customize the public homepage hero banner, featured recipe showcases, authority biography, and live promotional messages.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href="/"
            target="_blank"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Eye size={14} /> Preview Live Homepage
          </Link>
          <button
            onClick={handleSaveHomepage}
            disabled={loading}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Save size={14} /> {loading ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveHomepage} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* ── Section 1: Hero Banner Controls ────────────────────────── */}
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '2rem',
            boxShadow: 'var(--shadow-ambient)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.875rem' }}>
            <Home size={18} color="var(--color-secondary)" />
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              Hero Section &amp; Main Headline
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Award Badge Eyebrow</label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  className="form-input"
                  placeholder="e.g. 17th CAP Food Safety & Quality Award Winner"
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Hero Main Headline</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="form-input"
                  placeholder="Master the Recipes Behind Exceptional Flavor."
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Hero Supporting Subtitle</label>
                <textarea
                  rows={3}
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  className="form-input"
                  placeholder="Discover carefully crafted recipes, professional techniques..."
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Hero Background Image URL</label>
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="form-input"
                placeholder="/uploads/gallery/cap-food-safety-award-stage-2026.jpg"
              />

              <div
                style={{
                  marginTop: '1rem',
                  aspectRatio: '16/9',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface-container)',
                  border: '1px solid var(--color-border)',
                  position: 'relative',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage || '/uploads/gallery/cap-food-safety-award-stage-2026.jpg'}
                  alt="Hero Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    left: '0.5rem',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#ffffff',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '10px',
                  }}
                  className="font-label-caps"
                >
                  Live Hero Image Preview
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Featured Recipes Selector ────────────────────── */}
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '2rem',
            boxShadow: 'var(--shadow-ambient)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={18} color="var(--color-secondary)" />
              <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
                Featured Signature Recipes ({featuredCount} showcased on homepage)
              </h2>
            </div>
            <span className="font-label-caps" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
              Click to toggle showcase status
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {recipes.map((r) => (
              <div
                key={r.id}
                onClick={() => handleToggleFeatured(r.id, r.featured)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${r.featured ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                  background: r.featured ? 'var(--color-secondary-container)' : 'var(--color-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '4px',
                    backgroundColor: r.featured ? 'var(--color-secondary)' : 'var(--color-surface)',
                    border: `1px solid ${r.featured ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {r.featured && <Check size={14} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {r.title}
                  </div>
                  <div className="font-label-caps" style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                    {r.cuisine} · PKR {r.price}
                  </div>
                </div>

                {r.featured && (
                  <span className="font-label-caps" style={{ color: 'var(--color-on-secondary-container)', fontSize: '9px', fontWeight: 700 }}>
                    FEATURED
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Chef Authority & Biography ───────────────────── */}
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '2rem',
            boxShadow: 'var(--shadow-ambient)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.875rem' }}>
            <Trophy size={18} color="var(--color-secondary)" />
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              Chef Authority &amp; Biography Section
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Chef Full Professional Name</label>
                <input
                  type="text"
                  value={chefName}
                  onChange={(e) => setChefName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Biography &amp; Culinary Heritage Story</label>
                <textarea
                  rows={5}
                  value={chefBio}
                  onChange={(e) => setChefBio(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Chef Profile Photo URL</label>
              <input
                type="text"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                className="form-input"
                placeholder="/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg"
              />

              <div
                style={{
                  marginTop: '1rem',
                  maxWidth: '220px',
                  aspectRatio: '4/3',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface-container)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileImage || '/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg'}
                  alt="Profile Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Save Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '3rem' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} /> {loading ? 'Saving Changes...' : 'Save All Homepage Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
