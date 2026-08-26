'use client';

import { useState } from 'react';
import {
  Tag, Plus, Trash2, Edit, Check, Clock, Sparkles,
  Percent, DollarSign, Gift, Layers, Calendar, ArrowRight,
  Flame, CheckCircle2, X, AlertCircle
} from 'lucide-react';

interface RecipeOption {
  id: string;
  title: string;
  price: number;
  cuisine: string;
  type: string;
  coverImage?: string | null;
}

interface DiscountCode {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
  usageCount: number;
  usageLimit: number;
  validUntil: string;
  isActive: boolean;
  applicableCategory?: string;
}

interface BundleDeal {
  id: string;
  title: string;
  recipeCount: number;
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  badge: string;
  isActive: boolean;
}

interface Props {
  recipes: RecipeOption[];
  premiumCount: number;
}

export default function OffersManager({ recipes, premiumCount }: Props) {
  // Preset demo promotional codes (stored in state with full edit/toggle/delete capability)
  const [coupons, setCoupons] = useState<DiscountCode[]>([
    {
      id: 'c1',
      code: 'CHEF30',
      discountType: 'PERCENTAGE',
      value: 30,
      usageCount: 84,
      usageLimit: 200,
      validUntil: '2026-12-31',
      isActive: true,
      applicableCategory: 'All Premium Recipes',
    },
    {
      id: 'c2',
      code: 'KARAHI200',
      discountType: 'FIXED',
      value: 200,
      usageCount: 142,
      usageLimit: 500,
      validUntil: '2026-10-15',
      isActive: true,
      applicableCategory: 'Pakistani Classics',
    },
    {
      id: 'c3',
      code: 'WEEKEND50',
      discountType: 'PERCENTAGE',
      value: 50,
      usageCount: 310,
      usageLimit: 300,
      validUntil: '2026-09-01',
      isActive: false,
      applicableCategory: 'Flash Sale',
    },
  ]);

  // Preset Bundles
  const [bundles, setBundles] = useState<BundleDeal[]>([
    {
      id: 'b1',
      title: "Chef Irfan's Royal BBQ Masterclass Collection",
      recipeCount: 5,
      originalPrice: 2495,
      bundlePrice: 1749,
      savings: 746,
      badge: '30% SAVINGS',
      isActive: true,
    },
    {
      id: 'b2',
      title: 'Traditional Karahi & Handi Gastronomy Vault',
      recipeCount: 4,
      originalPrice: 1996,
      bundlePrice: 1399,
      savings: 597,
      badge: 'POPULAR',
      isActive: true,
    },
    {
      id: 'b3',
      title: 'Continental & Gourmet Fast Food Master Pack',
      recipeCount: 6,
      originalPrice: 2994,
      bundlePrice: 1999,
      savings: 995,
      badge: 'BEST VALUE',
      isActive: true,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // New coupon form
  const [newCode, setNewCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [newValue, setNewValue] = useState(25);
  const [newLimit, setNewLimit] = useState(100);
  const [newExpiry, setNewExpiry] = useState('2026-12-31');
  const [newCategory, setNewCategory] = useState('All Recipes');

  // New bundle form
  const [newBundleTitle, setNewBundleTitle] = useState('');
  const [newBundleRecipes, setNewBundleRecipes] = useState<string[]>([]);
  const [newBundlePrice, setNewBundlePrice] = useState(1499);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const created: DiscountCode = {
      id: 'c_' + Date.now(),
      code: newCode.trim().toUpperCase(),
      discountType: newDiscountType,
      value: Number(newValue),
      usageCount: 0,
      usageLimit: Number(newLimit),
      validUntil: newExpiry,
      isActive: true,
      applicableCategory: newCategory,
    };

    setCoupons([created, ...coupons]);
    setModalOpen(false);
    setNewCode('');
    showToast(`Discount coupon "${created.code}" created successfully!`);
  };

  const handleToggleCoupon = (id: string) => {
    setCoupons(
      coupons.map((c) => {
        if (c.id === id) {
          const next = !c.isActive;
          showToast(`Coupon ${c.code} is now ${next ? 'Active' : 'Disabled'}`);
          return { ...c, isActive: next };
        }
        return c;
      })
    );
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    showToast('Coupon removed successfully.');
  };

  const handleToggleBundle = (id: string) => {
    setBundles(
      bundles.map((b) => {
        if (b.id === id) {
          const next = !b.isActive;
          showToast(`Bundle "${b.title}" is now ${next ? 'Published' : 'Hidden'}`);
          return { ...b, isActive: next };
        }
        return b;
      })
    );
  };

  const handleCreateBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBundleTitle.trim()) return;

    const count = newBundleRecipes.length || 3;
    const orig = count * 499;
    const finalPrice = Number(newBundlePrice);

    const created: BundleDeal = {
      id: 'b_' + Date.now(),
      title: newBundleTitle.trim(),
      recipeCount: count,
      originalPrice: orig,
      bundlePrice: finalPrice,
      savings: Math.max(0, orig - finalPrice),
      badge: 'NEW BUNDLE',
      isActive: true,
    };

    setBundles([created, ...bundles]);
    setBundleModalOpen(false);
    setNewBundleTitle('');
    setNewBundleRecipes([]);
    showToast(`Recipe bundle "${created.title}" published!`);
  };

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

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <span className="font-label-caps" style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '0.25rem' }}>
            Marketing & Commercial Strategy
          </span>
          <h1 className="font-headline-md" style={{ color: 'var(--color-primary)', margin: 0 }}>
            Offers &amp; Promotions Center
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-text-muted)', marginTop: '0.35rem', maxWidth: '640px' }}>
            Create and manage flash discounts, promo codes, limited-time recipe banners, and bundled masterclasses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setBundleModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Layers size={14} /> + Create Bundle Deal
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={14} /> + Create Promo Code
          </button>
        </div>
      </div>

      {/* ── Active Flash Promotion Cards ────────────────────────────── */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Flame size={18} color="var(--color-secondary)" />
          <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
            Active Campaign Spotlights
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Spotlight 1: Weekend Flash Sale */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1b1c1a 0%, #2f2a24 100%)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.75rem',
              color: '#ffffff',
              boxShadow: 'var(--shadow-ambient)',
              border: '1px solid rgba(233,193,118,0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(233, 193, 118, 0.15)',
                color: 'var(--color-tertiary-fixed-dim)',
                border: '1px solid rgba(233, 193, 118, 0.3)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
              className="font-label-caps"
            >
              ✦ LIVE CAMPAIGN
            </div>

            <div className="font-label-caps" style={{ color: 'var(--color-tertiary-fixed-dim)', fontSize: '11px', marginBottom: '0.5rem' }}>
              Weekend Special Offer
            </div>

            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '0.75rem' }}>
              30% OFF All Signature Karahi Recipes
            </div>

            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Automated discount applied on checkout. Boosts conversion on high-traffic weekends.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <div className="font-label-caps" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                Coupon: <strong style={{ color: '#ffffff' }}>CHEF30</strong>
              </div>
              <span className="font-label-caps" style={{ color: 'var(--color-tertiary-fixed-dim)', fontSize: '11px' }}>
                84 Redeemed
              </span>
            </div>
          </div>

          {/* Spotlight 2: Bundle Deal */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-ambient)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-secondary)', fontSize: '11px' }}>
                  Featured Bundle Deal
                </span>
                <span className="badge badge-terracotta">
                  30% SAVINGS
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                Royal BBQ Masterclass Collection
              </div>

              <p className="font-body-md" style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: 1.6 }}>
                5 Selected Premium BBQ Recipes bundled at a promotional special price.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', marginTop: '1rem' }}>
              <div>
                <span style={{ textDecoration: 'line-through', color: 'var(--color-text-subtle)', fontSize: '12px', marginRight: '0.5rem' }}>
                  PKR 2,495
                </span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                  PKR 1,749
                </span>
              </div>

              <span className="font-label-caps" style={{ color: 'var(--color-success)', fontSize: '11px', fontWeight: 700 }}>
                ✓ Save PKR 746
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section: Discount Codes Table ───────────────────────────── */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={18} color="var(--color-secondary)" />
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              Discount &amp; Promo Codes
            </h2>
          </div>
          <span className="font-label-caps" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
            {coupons.length} Active Rules
          </span>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-ambient)',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                className="font-label-caps"
                style={{
                  backgroundColor: 'var(--color-surface-low)',
                  borderBottom: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  fontSize: '10px',
                }}
              >
                <th style={{ padding: '0.875rem 1.25rem' }}>Promo Code</th>
                <th style={{ padding: '0.875rem 1.25rem' }}>Discount Rate</th>
                <th style={{ padding: '0.875rem 1.25rem' }}>Applicability</th>
                <th style={{ padding: '0.875rem 1.25rem' }}>Usage / Limit</th>
                <th style={{ padding: '0.875rem 1.25rem' }}>Valid Until</th>
                <th style={{ padding: '0.875rem 1.25rem' }}>Status</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md" style={{ fontSize: '13px' }}>
              {coupons.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '13px',
                        background: 'var(--color-surface-low)',
                        border: '1px dashed var(--color-border)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {c.code}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                    {c.discountType === 'PERCENTAGE' ? `${c.value}% OFF` : `PKR ${c.value} OFF`}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                    {c.applicableCategory || 'All Recipes'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '6px', width: '70px', backgroundColor: 'var(--color-surface-container)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(100, (c.usageCount / c.usageLimit) * 100)}%`,
                            backgroundColor: c.usageCount >= c.usageLimit ? 'var(--color-error)' : 'var(--color-secondary)',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {c.usageCount}/{c.usageLimit}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-subtle)', fontSize: '12px' }}>
                    {c.validUntil}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <button
                      onClick={() => handleToggleCoupon(c.id)}
                      className="font-label-caps"
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        background: c.isActive ? '#f0f9eb' : 'var(--color-surface-high)',
                        color: c.isActive ? '#2b7a0b' : 'var(--color-text-muted)',
                      }}
                    >
                      {c.isActive ? '● Active' : '○ Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-error)',
                        cursor: 'pointer',
                        padding: '0.25rem',
                      }}
                      title="Delete code"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section: Recipe Bundles Manager ─────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--color-secondary)" />
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              Curated Recipe Bundles
            </h2>
          </div>
          <span className="font-label-caps" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
            {bundles.length} Packages Configured
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-ambient)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-premium">
                    {bundle.badge}
                  </span>
                  <button
                    onClick={() => handleToggleBundle(bundle.id)}
                    className="font-label-caps"
                    style={{
                      border: 'none',
                      background: 'none',
                      color: bundle.isActive ? 'var(--color-success)' : 'var(--color-text-subtle)',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    {bundle.isActive ? '● Published' : '○ Hidden'}
                  </button>
                </div>

                <h3 className="font-headline-sm" style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: '0.5rem 0' }}>
                  {bundle.title}
                </h3>
                <p className="font-body-md" style={{ color: 'var(--color-text-muted)', fontSize: '13px', margin: 0 }}>
                  Includes {bundle.recipeCount} premium masterclass recipes with complete step guides and seasonings.
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '12px', textDecoration: 'line-through', color: 'var(--color-text-subtle)', marginRight: '0.4rem' }}>
                    PKR {bundle.originalPrice.toLocaleString()}
                  </span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                    PKR {bundle.bundlePrice.toLocaleString()}
                  </span>
                </div>
                <span className="font-label-caps" style={{ color: 'var(--color-secondary)', fontSize: '10px', fontWeight: 700 }}>
                  Savings PKR {bundle.savings.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal: Create Promo Code ────────────────────────────────── */}
      {modalOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 300,
            }}
            onClick={() => setModalOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(92vw, 480px)',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              zIndex: 310,
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-headline-sm" style={{ margin: 0, color: 'var(--color-primary)' }}>
                Create New Promo Code
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Promo Code Name</label>
                <input
                  type="text"
                  placeholder="e.g. EID2026 or CHEF40"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="form-input"
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Discount Type</label>
                  <select
                    value={newDiscountType}
                    onChange={(e) => setNewDiscountType(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                    Discount Value ({newDiscountType === 'PERCENTAGE' ? '%' : 'PKR'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={newDiscountType === 'PERCENTAGE' ? '100' : '5000'}
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={newLimit}
                    onChange={(e) => setNewLimit(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Expiry Date</label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Applicable Category / Scope</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="All Recipes">All Recipes</option>
                  <option value="All Premium Recipes">All Premium Recipes</option>
                  <option value="Pakistani Classics">Pakistani Classics</option>
                  <option value="BBQ & Grills">BBQ &amp; Grills</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Continental">Continental</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save &amp; Activate
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Modal: Create Bundle Deal ───────────────────────────────── */}
      {bundleModalOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 300,
            }}
            onClick={() => setBundleModalOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(92vw, 520px)',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              zIndex: 310,
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-headline-sm" style={{ margin: 0, color: 'var(--color-primary)' }}>
                Create Curated Recipe Bundle
              </h3>
              <button
                onClick={() => setBundleModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBundle} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Bundle Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Chef Signature Biryani & Karahi Trio"
                  value={newBundleTitle}
                  onChange={(e) => setNewBundleTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                  Select Included Recipes ({newBundleRecipes.length} selected)
                </label>
                <div
                  style={{
                    maxHeight: '160px',
                    overflowY: 'auto',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  {recipes.map((r) => {
                    const isSelected = newBundleRecipes.includes(r.id);
                    return (
                      <label
                        key={r.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          background: isSelected ? 'var(--color-surface-container)' : 'transparent',
                          fontSize: '13px',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewBundleRecipes([...newBundleRecipes, r.id]);
                            } else {
                              setNewBundleRecipes(newBundleRecipes.filter((id) => id !== r.id));
                            }
                          }}
                        />
                        <span style={{ fontWeight: isSelected ? 600 : 400 }}>{r.title}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                          PKR {r.price}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                  Special Bundle Price (PKR)
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={newBundlePrice}
                  onChange={(e) => setNewBundlePrice(Number(e.target.value))}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setBundleModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Publish Bundle
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
