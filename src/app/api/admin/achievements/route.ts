import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const achievementSchema = z.object({
  title: z.string().min(2),
  organization: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  type: z.enum(['AWARD', 'CERTIFICATION', 'COMPETITION', 'RECOGNITION', 'MEDIA_FEATURE', 'TRAINING']),
});

export async function GET() {
  try {
    const items = await prisma.achievement.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = achievementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const item = await prisma.achievement.create({
      data: {
        title: data.title,
        organization: data.organization || null,
        date: data.date ? new Date(data.date) : null,
        description: data.description || null,
        image: data.image || null,
        type: data.type,
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.achievement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
