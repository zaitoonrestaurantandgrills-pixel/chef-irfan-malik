import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories — Android App & Public REST endpoint
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: { recipes: { where: { status: 'PUBLISHED' } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('API /api/categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
