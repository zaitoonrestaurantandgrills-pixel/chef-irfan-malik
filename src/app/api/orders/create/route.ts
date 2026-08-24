import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createOrderSchema = z.object({
  recipeId: z.string().cuid(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { recipeId } = parsed.data;

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId, status: 'PUBLISHED' },
    });
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }
    if (recipe.type === 'FREE') {
      return NextResponse.json({ error: 'This recipe is free' }, { status: 400 });
    }

    // Check if already purchased
    const existingAccess = await prisma.recipeAccess.findUnique({
      where: { userId_recipeId: { userId: session.user.id, recipeId } },
    });
    if (existingAccess && !existingAccess.revokedAt) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 409 });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount: recipe.price,
        currency: recipe.currency,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: {
            recipeId: recipe.id,
            price: recipe.price,
          },
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
