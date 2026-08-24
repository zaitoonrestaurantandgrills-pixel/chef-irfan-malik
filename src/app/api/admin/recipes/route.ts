import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const recipeSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverImage: z.string().optional().nullable(),
  cuisine: z.string().min(2, 'Cuisine is required'),
  categoryId: z.string().optional().nullable(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  prepTime: z.number().int().nonnegative(),
  cookingTime: z.number().int().nonnegative(),
  servings: z.number().int().positive(),
  type: z.enum(['FREE', 'PREMIUM']),
  price: z.number().nonnegative(),
  currency: z.string().default('PKR'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  featured: z.boolean().default(false),
  ingredients: z.array(
    z.object({
      ingredient: z.string().min(1),
      quantity: z.string().min(1),
      unit: z.string().optional().nullable(),
      sortOrder: z.number().int().default(0),
    })
  ).default([]),
  steps: z.array(
    z.object({
      stepNumber: z.number().int(),
      instruction: z.string().min(1),
    })
  ).default([]),
  notes: z.array(z.string()).default([]),
  tips: z.array(z.string()).default([]),
  equipment: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = recipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.recipe.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: 'A recipe with this slug already exists' }, { status: 409 });
    }

    const recipe = await prisma.recipe.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        coverImage: data.coverImage || null,
        cuisine: data.cuisine,
        categoryId: data.categoryId || null,
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
            quantity: ing.quantity,
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
          create: data.notes.map((content) => ({ content })),
        },
        tips: {
          create: data.tips.map((content) => ({ content })),
        },
        equipment: {
          create: data.equipment.map((name) => ({ name })),
        },
      },
    });

    return NextResponse.json({ success: true, recipe }, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
