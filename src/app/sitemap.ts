import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/recipes',
    '/gallery',
    '/achievements',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const recipes = await prisma.recipe.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });

    const recipePages = recipes.map((r) => ({
      url: `${baseUrl}/recipes/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));

    return [...staticPages, ...recipePages];
  } catch {
    return staticPages;
  }
}
