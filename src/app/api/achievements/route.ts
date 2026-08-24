import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/achievements — Android App & Public REST endpoint
export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: achievements });
  } catch (error) {
    console.error('API /api/achievements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
