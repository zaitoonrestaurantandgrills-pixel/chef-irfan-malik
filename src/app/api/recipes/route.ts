import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/recipes — Android App & Public REST endpoint
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const cuisine = searchParams.get('cuisine');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: 'PUBLISHED' };

    if (type === 'free') where.type = 'FREE';
    if (type === 'premium') where.type = 'PREMIUM';
    if (difficulty) where.difficulty = difficulty.toUpperCase();
    if (cuisine) where.cuisine = { contains: cuisine, mode: 'insensitive' };
    if (category) where.category = { slug: category };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { cuisine: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverImage: true,
          cuisine: true,
          difficulty: true,
          prepTime: true,
          cookingTime: true,
          servings: true,
          type: true,
          price: true,
          currency: true,
          featured: true,
          createdAt: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.recipe.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('API /api/recipes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
