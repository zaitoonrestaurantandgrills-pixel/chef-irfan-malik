'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Trash2, Save, ArrowLeft, Image as ImageIcon,
  Sparkles, Clock, Users, DollarSign, ChefHat, Check,
  Eye, Tag, AlertCircle, CheckCircle2, Flame, Wrench
} from 'lucide-react';
import Link from 'next/link';

interface IngredientRow {
  ingredient: string;
  quantity: string;
  unit: string;
}

interface StepRow {
  stepNumber: number;
  instruction: string;
}

interface RecipeData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string | null;
  cuisine: string;
  categoryId?: string | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  prepTime: number;
  cookingTime: number;
  servings: number;
  type: 'FREE' | 'PREMIUM';
  price: number;
  currency: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  ingredients: IngredientRow[];
  steps: StepRow[];
  notes: string[];
  tips: string[];
  equipment: string[];
}

interface Props {
  initialData?: RecipeData;
  categories: { id: string; name: string }[];
  isEditing?: boolean;
}

export default function RecipeEditor({ initialData, categories, isEditing = false }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<RecipeData>(
    initialData || {
      title: '',
      slug: '',
      description: '',
      coverImage: '',
      cuisine: 'Pakistani',
      categoryId: categories[0]?.id || '',
      difficulty: 'MEDIUM',
      prepTime: 20,
      cookingTime: 40,
      servings: 4,
      type: 'PREMIUM',
      price: 499,
      currency: 'PKR',
      status: 'DRAFT',
      featured: false,
      ingredients: [
        { ingredient: '', quantity: '', unit: '' },
        { ingredient: '', quantity: '', unit: '' },
      ],
      steps: [
        { stepNumber: 1, instruction: '' },
        { stepNumber: 2, instruction: '' },
      ],
      notes: [''],
      tips: [''],
      equipment: [''],
    }
  );

  const [comparePrice, setComparePrice] = useState(form.price ? Math.round(form.price * 1.4) : 699);
  const [hasOffer, setHasOffer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: isEditing ? prev.slug : generateSlug(val),
    }));
  };

  // Ingredient handlers
  const addIngredient = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredient: '', quantity: '', unit: '' }],
    }));
  };

  const removeIngredient = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, field: keyof IngredientRow, val: string) => {
    setForm((prev) => {
      const next = [...prev.ingredients];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, ingredients: next };
    });
  };

  // Step handlers
  const addStep = () => {
    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, { stepNumber: prev.steps.length + 1, instruction: '' }],
    }));
  };

  const removeStep = (index: number) => {
    setForm((prev) => {
      const filtered = prev.steps.filter((_, i) => i !== index);
      const renumbered = filtered.map((s, i) => ({ ...s, stepNumber: i + 1 }));
      return { ...prev, steps: renumbered };
    });
  };

  const updateStep = (index: number, val: string) => {
    setForm((prev) => {
      const next = [...prev.steps];
      next[index] = { ...next[index], instruction: val };
      return { ...prev, steps: next };
    });
  };

  // Notes, Tips, Equipment handlers
  const addArrayItem = (key: 'notes' | 'tips' | 'equipment') => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
  };

  const removeArrayItem = (key: 'notes' | 'tips' | 'equipment', index: number) => {
    setForm((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  const updateArrayItem = (key: 'notes' | 'tips' | 'equipment', index: number, val: string) => {
    setForm((prev) => {
      const next = [...prev[key]];
      next[index] = val;
      return { ...prev, [key]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent, overrideStatus?: 'DRAFT' | 'PUBLISHED') => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const targetStatus = overrideStatus || form.status;

    // Clean up empty rows
    const cleanedData = {
      ...form,
      status: targetStatus,
      prepTime: Number(form.prepTime),
      cookingTime: Number(form.cookingTime),
      servings: Number(form.servings),
      price: form.type === 'FREE' ? 0 : Number(form.price),
      ingredients: form.ingredients.filter((i) => i.ingredient.trim() !== ''),
      steps: form.steps.filter((s) => s.instruction.trim() !== ''),
      notes: form.notes.filter((n) => n.trim() !== ''),
      tips: form.tips.filter((t) => t.trim() !== ''),
      equipment: form.equipment.filter((eq) => eq.trim() !== ''),
    };

    try {
      const url = isEditing ? `/api/admin/recipes/${form.id}` : '/api/admin/recipes';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save recipe');
      }

      setSuccess(true);
      showToast(targetStatus === 'PUBLISHED' ? 'Recipe published successfully!' : 'Recipe draft saved.');
      setTimeout(() => {
        router.push('/admin/recipes');
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const discountPercent =
    comparePrice > form.price && form.price > 0
      ? Math.round(((comparePrice - form.price) / comparePrice) * 100)
      : 0;

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
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
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/recipes" className="btn btn-secondary btn-sm">
            <ArrowLeft size={15} /> Back to Catalog
          </Link>
          <div>
            <span className="font-label-caps" style={{ color: 'var(--color-secondary)', fontSize: '10px', display: 'block' }}>
              Master Recipe Studio
            </span>
            <h1 className="font-headline-md" style={{ color: 'var(--color-primary)', margin: 0 }}>
              {isEditing ? `Edit: ${form.title || 'Recipe'}` : 'Create New Masterclass Recipe'}
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {form.slug && (
            <Link
              href={`/recipes/${form.slug}`}
              target="_blank"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
            >
              <Eye size={14} /> Preview
            </Link>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, 'DRAFT')}
            className="btn btn-secondary btn-sm"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, 'PUBLISHED')}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Save size={14} /> {loading ? 'Saving...' : 'Publish Recipe'}
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(224,82,82,0.12)',
            border: '1px solid rgba(224,82,82,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem 1.25rem',
            color: 'var(--color-error)',
            marginBottom: '1.5rem',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: 'rgba(76,175,120,0.12)',
            border: '1px solid rgba(76,175,120,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem 1.25rem',
            color: 'var(--color-success)',
            marginBottom: '1.5rem',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={16} />
          Recipe saved successfully! Redirecting...
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* ── Section 1: Basic Information ──────────────────────────── */}
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
            <ChefHat size={18} color="var(--color-secondary)" />
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              1. Basic Recipe Details
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Recipe Title *</label>
              <input
                type="text"
                placeholder="e.g. Royal Mutton Shinwari Karahi"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="form-input"
                style={{ fontSize: '1.1rem', fontWeight: 600 }}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>URL Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="form-input"
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Category</label>
              <select
                className="form-input"
                value={form.categoryId || ''}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value || null })}
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Cuisine Style</label>
              <input
                type="text"
                placeholder="e.g. Pakistani, BBQ, Continental"
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Difficulty Level</label>
              <select
                className="form-input"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Intermediate</option>
                <option value="HARD">Advanced</option>
                <option value="EXPERT">Master Level</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Short Description / Taste Profile *</label>
              <textarea
                rows={3}
                placeholder="Describe the aroma, key cooking method, flavor notes, and heritage..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Prep Time (Minutes)</label>
              <input
                type="number"
                min="0"
                value={form.prepTime}
                onChange={(e) => setForm({ ...form, prepTime: parseInt(e.target.value) || 0 })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Cook Time (Minutes)</label>
              <input
                type="number"
                min="0"
                value={form.cookingTime}
                onChange={(e) => setForm({ ...form, cookingTime: parseInt(e.target.value) || 0 })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Servings</label>
              <input
                type="number"
                min="1"
                value={form.servings}
                onChange={(e) => setForm({ ...form, servings: parseInt(e.target.value) || 1 })}
                className="form-input"
              />
            </div>
          </div>
        </section>

        {/* ── Section 2: Cover Image ─────────────────────────────────── */}
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
            <ImageIcon size={18} color="var(--color-secondary)" />
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              2. Recipe Photography / Media
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', alignItems: 'center' }}>
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Cover Image URL / Path</label>
              <input
                type="text"
                placeholder="/uploads/gallery/chef-irfan-food-safety-presentation.jpg"
                value={form.coverImage || ''}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className="form-input"
              />
              <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '0.35rem', display: 'block' }}>
                Tip: Enter any local public path or cloud image URL.
              </span>
            </div>

            <div
              style={{
                aspectRatio: '16/9',
                maxHeight: '180px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface-container)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {form.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.coverImage}
                  alt="Recipe Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--color-text-subtle)' }}>
                  <ImageIcon size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                  <div style={{ fontSize: '12px' }}>No cover image specified</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Section 3: Pricing, Monetization & Offers ─────────────── */}
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
            <DollarSign size={18} color="var(--color-secondary)" />
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              3. Monetization, Pricing &amp; Offers
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Recipe Access Type</label>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="radio"
                    name="accessType"
                    checked={form.type === 'FREE'}
                    onChange={() => setForm({ ...form, type: 'FREE', price: 0 })}
                  />
                  <span>Free (Public Access)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="accessType"
                    checked={form.type === 'PREMIUM'}
                    onChange={() => setForm({ ...form, type: 'PREMIUM', price: form.price || 499 })}
                  />
                  <span>✦ Premium (Paywall Protected)</span>
                </label>
              </div>
            </div>

            {form.type === 'PREMIUM' && (
              <>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Selling Price (PKR) *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                    required={form.type === 'PREMIUM'}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Regular / Compare-At Price (PKR)</label>
                  <input
                    type="number"
                    min="1"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                  {discountPercent > 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 700, marginTop: '0.25rem', display: 'block' }}>
                      ✓ Customer sees: {discountPercent}% OFF badge
                    </span>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Publishing Status</label>
              <select
                className="form-input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              >
                <option value="DRAFT">Draft (Internal Only)</option>
                <option value="PUBLISHED">Published (Live in Marketplace)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.25rem' }}>
              <input
                type="checkbox"
                id="feat_check"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="feat_check" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Feature in Homepage Signature Showcase
              </label>
            </div>
          </div>
        </section>

        {/* ── Section 4: Ingredient Builder ──────────────────────────── */}
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
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              4. Ingredient Quantities &amp; Ratios
            </h2>
            <button type="button" onClick={addIngredient} className="btn btn-secondary btn-sm">
              <Plus size={14} /> + Add Ingredient
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {form.ingredients.map((ing, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Ingredient name (e.g. Mutton Shinwari cut)"
                  value={ing.ingredient}
                  onChange={(e) => updateIngredient(index, 'ingredient', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Quantity (e.g. 1)"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g. kg, tbsp, pinch)"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove ingredient"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5: Step-by-Step Instructions ───────────────────── */}
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
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              5. Professional Step-by-Step Instructions
            </h2>
            <button type="button" onClick={addStep} className="btn btn-secondary btn-sm">
              <Plus size={14} /> + Add Step
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {form.steps.map((step, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                    flexShrink: 0,
                    marginTop: '0.35rem',
                  }}
                >
                  {step.stepNumber}
                </div>
                <textarea
                  rows={2}
                  placeholder={`Describe step ${step.stepNumber} in professional culinary detail...`}
                  value={step.instruction}
                  onChange={(e) => updateStep(index, e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', marginTop: '0.5rem' }}
                  title="Remove step"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 6: Chef's Secret Notes & Pro Tips ──────────────── */}
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
            <h2 className="font-headline-sm" style={{ color: 'var(--color-primary)', margin: 0, fontSize: '18px' }}>
              6. Chef&apos;s Pro Techniques &amp; Secret Tips
            </h2>
            <button type="button" onClick={() => addArrayItem('tips')} className="btn btn-secondary btn-sm">
              <Plus size={14} /> + Add Pro Tip
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {form.tips.map((tip, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem' }}>💡</span>
                <input
                  type="text"
                  placeholder="e.g. Always sear meat on high flame for 4 minutes to lock in juices before simmering."
                  value={tip}
                  onChange={(e) => updateArrayItem('tips', index, e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('tips', index)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Equipment */}
          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-primary)', fontSize: '11px', fontWeight: 700 }}>
                Required Kitchen Equipment
              </span>
              <button type="button" onClick={() => addArrayItem('equipment')} className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}>
                + Add Tool
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {form.equipment.map((eq, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <Wrench size={14} color="var(--color-text-subtle)" />
                  <input
                    type="text"
                    placeholder="e.g. Heavy Cast Iron Wok / Karahi"
                    value={eq}
                    onChange={(e) => updateArrayItem('equipment', index, e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('equipment', index)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingBottom: '3rem' }}>
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, 'DRAFT')}
            className="btn btn-secondary btn-lg"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} /> {loading ? 'Publishing...' : 'Publish Masterclass Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}
