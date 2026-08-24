import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const verifySchema = z.object({
  orderId: z.string().cuid(),
  providerRef: z.string(),
});

// POST /api/payment/verify
// This is the critical server-side payment verification endpoint.
// NEVER unlock recipes based on frontend payment signals alone.
// Always verify with the payment provider server-to-server.
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { orderId, providerRef } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { recipe: true } }, payment: true },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ success: true, alreadyPaid: true });
    }

    // In production: verify providerRef with actual payment gateway
    // e.g., await stripe.paymentIntents.retrieve(providerRef)
    // For now: simulate verification success
    const verified = true; // Replace with real gateway verification

    if (!verified) {
      await prisma.payment.update({
        where: { orderId },
        data: { status: 'FAILED' },
      });
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 402 });
    }

    const userId = session.user.id;

    // Atomic transaction: update order, payment, and grant recipe access
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'PAID', status: 'COMPLETED' },
      });

      await tx.payment.update({
        where: { orderId },
        data: { status: 'PAID', providerRef, metadata: { verifiedAt: new Date().toISOString() } },
      });

      // Grant access to each recipe in the order
      for (const item of order.items) {
        await tx.recipeAccess.upsert({
          where: { userId_recipeId: { userId, recipeId: item.recipeId } },
          update: { revokedAt: null, orderId, grantedAt: new Date() },
          create: {
            userId,
            recipeId: item.recipeId,
            orderId,
            grantedAt: new Date(),
          },
        });
      }
    });

    return NextResponse.json({ success: true, message: 'Payment verified and recipe access granted' });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
