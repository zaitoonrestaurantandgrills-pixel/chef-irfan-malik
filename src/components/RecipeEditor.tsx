'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Trash2, Save, ArrowLeft, Image as ImageIcon,
  Sparkles, Clock, Users, DollarSign, ChefHat, Check
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
      type: 'FREE',
      price: 0,
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Clean up empty rows
    const cleanedData = {
      ...form,
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
      setTimeout(() => {
        router.push('/admin/recipes');
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/recipes" className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Back
          </Link>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
              {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Fill in the details below to publish or draft a culinary masterpiece.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(224,82,82,0.12)', border: '1px solid rgba(224,82,82,0.3)',
          borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', color: 'var(--color-error)',
          marginBottom: '1.5rem', fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: 'rgba(76,175,120,0.12)', border: '1px solid rgba(76,175,120,0.3)',
          borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', color: 'var(--color-success)',
          marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <Check size={18} /> Recipe saved successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Basic Information */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
            1. Basic Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Recipe Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Royal Mutton Biryani Masterclass"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL Slug *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="royal-mutton-biryani-masterclass"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setForm({ ...form, slug: generateSlug(form.title) })}
                  title="Generate from title"
                >
                  <Sparkles size={14} />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cuisine *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Pakistani / Mughlai"
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={form.categoryId || ''}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value || null })}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="form-input"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Cover Image URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://example.com/food-image.jpg or /uploads/image.jpg"
                value={form.coverImage || ''}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>
                Paste image URL directly or upload to your CDN / hosting.
              </span>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Short Description / Introduction *</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Describe the dish, its heritage, aroma, taste, and what makes this recipe extraordinary."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            {/* Timing & Servings */}
            <div className="form-group">
              <label className="form-label">Prep Time (minutes)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={form.prepTime}
                onChange={(e) => setForm({ ...form, prepTime: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cooking Time (minutes)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={form.cookingTime}
                onChange={(e) => setForm({ ...form, cookingTime: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Servings</label>
              <input
                type="number"
                className="form-input"
                min="1"
                value={form.servings}
                onChange={(e) => setForm({ ...form, servings: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
        </div>

        {/* Pricing & Visibility */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
            2. Monetization & Status
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Recipe Access Type</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="type"
                    checked={form.type === 'FREE'}
                    onChange={() => setForm({ ...form, type: 'FREE', price: 0 })}
                  />
                  <span>✓ Free (Public Access)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="type"
                    checked={form.type === 'PREMIUM'}
                    onChange={() => setForm({ ...form, type: 'PREMIUM', price: form.price || 499 })}
                  />
                  <span>⭐ Premium (Protected & Paid)</span>
                </label>
              </div>
            </div>

            {form.type === 'PREMIUM' && (
              <div className="form-group">
                <label className="form-label">Price (PKR) *</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  required={form.type === 'PREMIUM'}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Publication Status</label>
              <select
                className="form-input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              >
                <option value="DRAFT">Draft (Admin Only)</option>
                <option value="PUBLISHED">Published (Visible on Site)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.5rem' }}>
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="featured" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                Feature on Homepage Showcase
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Ingredients */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-primary)' }}>
              3. Ingredients List
            </h2>
            <button type="button" onClick={addIngredient} className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Ingredient
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {form.ingredients.map((ing, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ingredient name (e.g. Mutton bone-in)"
                  value={ing.ingredient}
                  onChange={(e) => updateIngredient(index, 'ingredient', e.target.value)}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Quantity (e.g. 1)"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Unit (e.g. kg, tsp, cup)"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--color-error)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0.5rem'
                  }}
                  title="Remove row"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Numbered Instruction Steps */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-primary)' }}>
              4. Step-by-Step Instructions
            </h2>
            <button type="button" onClick={addStep} className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Step
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {form.steps.map((st, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--color-primary-muted)', border: '1px solid var(--color-border-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)', flexShrink: 0,
                  marginTop: '0.375rem'
                }}>
                  {index + 1}
                </div>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder={`Step ${index + 1} instructions...`}
                  value={st.instruction}
                  onChange={(e) => updateStep(index, e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--color-error)',
                    cursor: 'pointer', padding: '0.5rem', marginTop: '0.375rem'
                  }}
                  title="Remove step"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chef Notes & Tips & Equipment */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            5. Chef&apos;s Secrets, Notes & Equipment
          </h2>

          {/* Chef Notes */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label className="form-label">👨‍🍳 Chef Notes & Secrets</label>
              <button type="button" onClick={() => addArrayItem('notes')} className="btn btn-ghost btn-sm">
                <Plus size={12} /> Add Note
              </button>
            </div>
            {form.notes.map((note, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Always marinate meat at room temperature for 30 minutes before refrigeration."
                  value={note}
                  onChange={(e) => updateArrayItem('notes', idx, e.target.value)}
                />
                <button type="button" onClick={() => removeArrayItem('notes', idx)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Chef Tips */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label className="form-label">💡 Pro Tips</label>
              <button type="button" onClick={() => addArrayItem('tips')} className="btn btn-ghost btn-sm">
                <Plus size={12} /> Add Tip
              </button>
            </div>
            {form.tips.map((tip, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. For extra glossy gravy, finish with 1 tsp of cold butter right before turning off the heat."
                  value={tip}
                  onChange={(e) => updateArrayItem('tips', idx, e.target.value)}
                />
                <button type="button" onClick={() => removeArrayItem('tips', idx)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Equipment */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label className="form-label">🔪 Recommended Equipment</label>
              <button type="button" onClick={() => addArrayItem('equipment')} className="btn btn-ghost btn-sm">
                <Plus size={12} /> Add Equipment
              </button>
            </div>
            {form.equipment.map((eq, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Heavy-bottomed cast iron degchi"
                  value={eq}
                  onChange={(e) => updateArrayItem('equipment', idx, e.target.value)}
                />
                <button type="button" onClick={() => removeArrayItem('equipment', idx)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', position: 'sticky', bottom: '1.5rem', background: 'var(--color-surface)', padding: '1.25rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 30 }}>
          <Link href="/admin/recipes" className="btn btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            <Save size={18} />
            {loading ? 'Saving...' : isEditing ? 'Update Recipe' : 'Publish Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}
