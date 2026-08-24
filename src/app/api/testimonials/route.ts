import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/testimonials — Android App & Public REST endpoint
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('API /api/testimonials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
