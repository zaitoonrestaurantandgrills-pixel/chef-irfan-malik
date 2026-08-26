import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateRecipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().nullable().default(''),
  coverImage: z.string().optional().nullable(),
  cuisine: z.string().optional().nullable().default('Pakistani'),
  categoryId: z.string().optional().nullable(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']).default('MEDIUM'),
  prepTime: z.coerce.number().nonnegative().default(0),
  cookingTime: z.coerce.number().nonnegative().default(0),
  servings: z.coerce.number().positive().default(1),
  type: z.enum(['FREE', 'PREMIUM']).default('FREE'),
  price: z.coerce.number().nonnegative().default(0),
  currency: z.string().default('PKR'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  ingredients: z.array(
    z.object({
      ingredient: z.string().min(1, 'Ingredient name is required'),
      quantity: z.string().optional().nullable().default(''),
      unit: z.string().optional().nullable().default(''),
      sortOrder: z.coerce.number().int().optional().default(0),
    })
  ).default([]),
  steps: z.array(
    z.object({
      stepNumber: z.coerce.number().int().optional().default(1),
      instruction: z.string().min(1, 'Step instruction is required'),
    })
  ).default([]),
  notes: z.array(z.string()).default([]),
  tips: z.array(z.string()).default([]),
  equipment: z.array(z.string()).default([]),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateRecipeSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const errorMsg = Object.entries(fieldErrors)
        .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`)
        .join('; ');
      return NextResponse.json(
        { error: `Validation failed: ${errorMsg}`, details: fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if recipe exists
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (data.slug !== existing.slug) {
      const slugConflict = await prisma.recipe.findUnique({ where: { slug: data.slug } });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json({ error: 'A recipe with this slug already exists' }, { status: 409 });
      }
    }

    // Atomic update: wipe children and recreate with new dataset
    const updatedRecipe = await prisma.$transaction(async (tx) => {
      await tx.recipeIngredient.deleteMany({ where: { recipeId: id } });
      await tx.recipeStep.deleteMany({ where: { recipeId: id } });
      await tx.recipeNote.deleteMany({ where: { recipeId: id } });
      await tx.recipeTip.deleteMany({ where: { recipeId: id } });
      await tx.recipeEquipment.deleteMany({ where: { recipeId: id } });

      return tx.recipe.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description || '',
          coverImage: data.coverImage || null,
          cuisine: data.cuisine || 'Pakistani',
          categoryId: data.categoryId && data.categoryId.trim() !== '' ? data.categoryId : null,
          difficulty: data.difficulty,
          prepTime: data.prepTime,
          cookingTime: data.cookingTime,
          servings: data.servings,
          type: data.type,
          price: data.type === 'FREE' ? 0 : data.price,
          currency: data.currency,
          status: data.status,
          featured: data.featured,
          ingredients: {
            create: data.ingredients.map((ing, i) => ({
              ingredient: ing.ingredient,
              quantity: ing.quantity || '',
              unit: ing.unit || null,
              sortOrder: ing.sortOrder || i + 1,
            })),
          },
          steps: {
            create: data.steps.map((st, i) => ({
              stepNumber: st.stepNumber || i + 1,
              instruction: st.instruction,
            })),
          },
          notes: {
            create: data.notes.filter((n) => n && n.trim() !== '').map((content) => ({ content })),
          },
          tips: {
            create: data.tips.filter((t) => t && t.trim() !== '').map((content) => ({ content })),
          },
          equipment: {
            create: data.equipment.filter((eq) => eq && eq.trim() !== '').map((name) => ({ name })),
          },
        },
      });
    });

    return NextResponse.json({ success: true, recipe: updatedRecipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.recipe.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Recipe deleted' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
