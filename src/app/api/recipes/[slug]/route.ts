import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/recipes/[slug] — Public recipe detail (Safe preview for premium, full for free)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await auth();

    const recipe = await prisma.recipe.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        category: true,
        ingredients: { orderBy: { sortOrder: 'asc' } },
        equipment: true,
        steps: {
          orderBy: { stepNumber: 'asc' },
          take: 1, // Only step 1 preview for public API if premium
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    let hasPurchased = false;
    if (session?.user?.id) {
      const access = await prisma.recipeAccess.findUnique({
        where: { userId_recipeId: { userId: session.user.id, recipeId: recipe.id } },
      });
      hasPurchased = !!access && !access.revokedAt;
    }

    return NextResponse.json({
      success: true,
      data: {
        id: recipe.id,
        title: recipe.title,
        slug: recipe.slug,
        description: recipe.description,
        coverImage: recipe.coverImage,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        prepTime: recipe.prepTime,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,
        type: recipe.type,
        price: recipe.price,
        currency: recipe.currency,
        category: recipe.category,
        ingredients: recipe.ingredients,
        equipment: recipe.equipment,
        previewSteps: recipe.steps,
        hasAccess: recipe.type === 'FREE' || hasPurchased,
      },
    });
  } catch (error) {
    console.error('API /api/recipes/[slug] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
