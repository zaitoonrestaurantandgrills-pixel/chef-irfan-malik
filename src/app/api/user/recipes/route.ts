import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET /api/user/recipes — Customer Purchased Recipes (Android & Web)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accessRecords = await prisma.recipeAccess.findMany({
      where: { userId: session.user.id, revokedAt: null },
      include: {
        recipe: {
          include: { category: true },
        },
      },
      orderBy: { grantedAt: 'desc' },
    });

    const recipes = accessRecords.map((rec) => ({
      ...rec.recipe,
      grantedAt: rec.grantedAt,
      orderId: rec.orderId,
    }));

    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    console.error('API /api/user/recipes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
