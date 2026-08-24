import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Payment abstraction layer
// This interface defines the contract for any payment provider
// Future providers (JazzCash, EasyPaisa, Stripe) should implement this pattern
interface PaymentService {
  createCheckout(params: {
    orderId: string;
    amount: number;
    currency: string;
    description: string;
  }): Promise<{ checkoutUrl: string; sessionId: string }>;

  verifyPayment(params: {
    orderId: string;
    providerRef: string;
  }): Promise<{ success: boolean; status: string }>;
}

// Development/Simulation payment provider
// Replace this with a real provider implementation
class SimulatedPaymentProvider implements PaymentService {
  async createCheckout(params: {
    orderId: string;
    amount: number;
    currency: string;
    description: string;
  }) {
    // In production: call real payment gateway API here
    return {
      checkoutUrl: `/checkout/simulate/${params.orderId}`,
      sessionId: `sim_${params.orderId}_${Date.now()}`,
    };
  }

  async verifyPayment(params: { orderId: string; providerRef: string }) {
    // In production: verify with payment gateway API
    // Never trust frontend "success" signals — always verify server-side
    return { success: true, status: 'PAID' };
  }
}

// Factory — swap provider here when integrating a real gateway
function getPaymentProvider(): PaymentService {
  // const provider = process.env.PAYMENT_PROVIDER;
  // if (provider === 'stripe') return new StripeProvider();
  // if (provider === 'jazzcash') return new JazzCashProvider();
  return new SimulatedPaymentProvider();
}

const createCheckoutSchema = z.object({
  orderId: z.string().cuid(),
});

// POST /api/payment/create-checkout
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createCheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { orderId } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { recipe: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Security: ensure order belongs to the requesting user
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Already paid' }, { status: 409 });
    }

    const provider = getPaymentProvider();
    const description = order.items.map(i => i.recipe.title).join(', ');

    const checkout = await provider.createCheckout({
      orderId: order.id,
      amount: order.totalAmount,
      currency: order.currency,
      description,
    });

    // Store payment record
    await prisma.payment.upsert({
      where: { orderId: order.id },
      update: { providerRef: checkout.sessionId },
      create: {
        orderId: order.id,
        provider: 'simulated',
        providerRef: checkout.sessionId,
        amount: order.totalAmount,
        currency: order.currency,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ checkoutUrl: checkout.checkoutUrl, sessionId: checkout.sessionId });
  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
