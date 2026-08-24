import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {
        chefName: body.chefName,
        tagline: body.tagline,
        biography: body.biography,
        profileImage: body.profileImage,
        heroImage: body.heroImage,
        currency: body.currency,
        email: body.email,
        phone: body.phone,
        address: body.address,
        facebook: body.facebook,
        instagram: body.instagram,
        youtube: body.youtube,
        twitter: body.twitter,
        whatsapp: body.whatsapp,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        logoUrl: body.logoUrl,
      },
      create: {
        id: 'singleton',
        chefName: body.chefName || 'Chef Irfan Malik',
        tagline: body.tagline || 'Crafting Flavors. Sharing Knowledge.',
        biography: body.biography,
        profileImage: body.profileImage,
        heroImage: body.heroImage,
        currency: body.currency || 'PKR',
        email: body.email,
        phone: body.phone,
        address: body.address,
        facebook: body.facebook,
        instagram: body.instagram,
        youtube: body.youtube,
        twitter: body.twitter,
        whatsapp: body.whatsapp,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        logoUrl: body.logoUrl,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
