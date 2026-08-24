import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import RecipeEditor from '@/components/RecipeEditor';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
  const session = await auth();
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized');
  }

  const { id } = await params;

  const [recipe, categories] = await Promise.all([
    prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: { orderBy: { sortOrder: 'asc' } },
        steps: { orderBy: { stepNumber: 'asc' } },
        notes: true,
        tips: true,
        equipment: true,
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!recipe) notFound();

  const initialData = {
    id: recipe.id,
    title: recipe.title,
    slug: recipe.slug,
    description: recipe.description,
    coverImage: recipe.coverImage,
    cuisine: recipe.cuisine,
    categoryId: recipe.categoryId,
    difficulty: recipe.difficulty,
    prepTime: recipe.prepTime,
    cookingTime: recipe.cookingTime,
    servings: recipe.servings,
    type: recipe.type,
    price: recipe.price,
    currency: recipe.currency,
    status: recipe.status,
    featured: recipe.featured,
    ingredients: recipe.ingredients.map((i) => ({
      ingredient: i.ingredient,
      quantity: i.quantity,
      unit: i.unit || '',
    })),
    steps: recipe.steps.map((s) => ({
      stepNumber: s.stepNumber,
      instruction: s.instruction,
    })),
    notes: recipe.notes.map((n) => n.content),
    tips: recipe.tips.map((t) => t.content),
    equipment: recipe.equipment.map((e) => e.name),
  };

  return (
    <AdminLayout>
      <RecipeEditor initialData={initialData} categories={categories} isEditing={true} />
    </AdminLayout>
  );
}
