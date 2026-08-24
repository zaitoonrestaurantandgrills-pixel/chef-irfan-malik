import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/recipes/[slug]/full — Protected Full Recipe API (Android & Web)
// Strictly enforces server-side authentication + purchase verification
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
        steps: { orderBy: { stepNumber: 'asc' } },
        notes: true,
        tips: true,
        equipment: true,
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // If recipe is premium, verify authentication and active purchase access
    if (recipe.type === 'PREMIUM') {
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Authentication required to access this premium recipe' },
          { status: 401 }
        );
      }

      // Check if user is admin or has bought recipe
      const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';
      if (!isAdmin) {
        const access = await prisma.recipeAccess.findUnique({
          where: { userId_recipeId: { userId: session.user.id, recipeId: recipe.id } },
        });

        if (!access || access.revokedAt) {
          return NextResponse.json(
            { error: 'Purchase required. You do not own access to this premium recipe.' },
            { status: 403 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error('API /api/recipes/[slug]/full error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
