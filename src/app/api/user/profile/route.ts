import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, username, currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Check username uniqueness if changed
    if (username !== user.username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing) return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    let passwordHash = user.passwordHash;
    if (newPassword && newPassword.length >= 8) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }
      const match = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!match) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
      }
      passwordHash = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        username,
        passwordHash,
      },
      select: { id: true, name: true, username: true, email: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
