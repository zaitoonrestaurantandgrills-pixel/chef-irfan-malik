import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/gallery — Android App & Public REST endpoint
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};
    if (category && category !== 'ALL') {
      where.category = category.toUpperCase();
    }

    const items = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('API /api/gallery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
