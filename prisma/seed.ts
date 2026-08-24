import { PrismaClient, Role, RecipeType, RecipeStatus, Difficulty, GalleryCategory, AchievementType, TestimonialStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Site Settings ──────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      chefName: 'Chef Irfan Malik',
      tagline: 'Crafting Flavors. Sharing Knowledge.',
      biography: 'Chef Irfan Malik is a passionate culinary professional with years of experience in crafting authentic and contemporary Pakistani cuisine. His journey from a humble kitchen to professional culinary stages has been defined by dedication, creativity, and an unwavering love for food.',
      currency: 'PKR',
      seoTitle: 'Chef Irfan Malik — Professional Chef & Recipe Creator',
      seoDescription: 'Discover carefully crafted recipes, professional culinary techniques and the experience behind every dish by Chef Irfan Malik.',
    },
  });

  // ── Admin User ──────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@chefirfan.com' },
    update: {},
    create: {
      name: 'Chef Irfan Malik',
      username: 'chefirfan',
      email: 'admin@chefirfan.com',
      passwordHash: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ── Demo Customer ───────────────────────────────────────────────
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  await prisma.user.upsert({
    where: { email: 'demo@customer.com' },
    update: {},
    create: {
      name: 'Demo Customer',
      username: 'democustomer',
      email: 'demo@customer.com',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
    },
  });
  console.log('✅ Demo customer created');

  // ── Categories ──────────────────────────────────────────────────
  const categories = [
    { name: 'Main Course', slug: 'main-course', description: 'Hearty and satisfying main dishes' },
    { name: 'Appetizers', slug: 'appetizers', description: 'Starters and small plates' },
    { name: 'Desserts', slug: 'desserts', description: 'Sweet treats and desserts' },
    { name: 'Soups & Stews', slug: 'soups-stews', description: 'Warming soups and stews' },
    { name: 'Breads & Baking', slug: 'breads-baking', description: 'Freshly baked breads and pastries' },
    { name: 'Rice Dishes', slug: 'rice-dishes', description: 'Fragrant rice dishes and biryanis' },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log('✅ Categories created');

  // ── Recipes ─────────────────────────────────────────────────────
  const recipe1 = await prisma.recipe.upsert({
    where: { slug: 'chicken-karahi' },
    update: {},
    create: {
      title: 'Chicken Karahi',
      slug: 'chicken-karahi',
      description: 'A rich and aromatic Pakistani Chicken Karahi cooked in a traditional wok with tomatoes, green chillies and fresh spices. This is the dish that defines the essence of Pakistani street food.',
      cuisine: 'Pakistani',
      categoryId: createdCategories['main-course'],
      difficulty: Difficulty.MEDIUM,
      prepTime: 15,
      cookingTime: 45,
      servings: 4,
      type: RecipeType.FREE,
      price: 0,
      status: RecipeStatus.PUBLISHED,
      featured: true,
    },
  });

  await prisma.recipeIngredient.createMany({
    data: [
      { recipeId: recipe1.id, ingredient: 'Chicken', quantity: '1', unit: 'kg', sortOrder: 1 },
      { recipeId: recipe1.id, ingredient: 'Tomatoes', quantity: '4', unit: 'medium', sortOrder: 2 },
      { recipeId: recipe1.id, ingredient: 'Oil', quantity: '4', unit: 'tbsp', sortOrder: 3 },
      { recipeId: recipe1.id, ingredient: 'Green chillies', quantity: '4', unit: 'pieces', sortOrder: 4 },
      { recipeId: recipe1.id, ingredient: 'Ginger-garlic paste', quantity: '2', unit: 'tbsp', sortOrder: 5 },
      { recipeId: recipe1.id, ingredient: 'Salt', quantity: '1', unit: 'tsp', sortOrder: 6 },
      { recipeId: recipe1.id, ingredient: 'Red chilli powder', quantity: '1', unit: 'tsp', sortOrder: 7 },
      { recipeId: recipe1.id, ingredient: 'Garam masala', quantity: '0.5', unit: 'tsp', sortOrder: 8 },
      { recipeId: recipe1.id, ingredient: 'Fresh coriander', quantity: '1', unit: 'handful', sortOrder: 9 },
    ],
    skipDuplicates: true,
  });

  await prisma.recipeStep.createMany({
    data: [
      { recipeId: recipe1.id, stepNumber: 1, instruction: 'Heat oil in a heavy karahi or wok over high heat.' },
      { recipeId: recipe1.id, stepNumber: 2, instruction: 'Add ginger-garlic paste and sauté for 1 minute until fragrant.' },
      { recipeId: recipe1.id, stepNumber: 3, instruction: 'Add chicken pieces and cook on high heat for 5–7 minutes, stirring frequently.' },
      { recipeId: recipe1.id, stepNumber: 4, instruction: 'Add chopped tomatoes, salt, and red chilli powder. Mix well.' },
      { recipeId: recipe1.id, stepNumber: 5, instruction: 'Cover and cook on medium heat for 20 minutes until chicken is cooked through.' },
      { recipeId: recipe1.id, stepNumber: 6, instruction: 'Remove lid, increase heat, and dry out the masala for 5–7 minutes.' },
      { recipeId: recipe1.id, stepNumber: 7, instruction: 'Add green chillies and garam masala. Cook for 2 more minutes.' },
      { recipeId: recipe1.id, stepNumber: 8, instruction: 'Garnish with fresh coriander and serve hot with naan.' },
    ],
    skipDuplicates: true,
  });

  await prisma.recipeEquipment.createMany({
    data: [
      { recipeId: recipe1.id, name: 'Karahi or heavy wok' },
      { recipeId: recipe1.id, name: 'Wooden spoon' },
      { recipeId: recipe1.id, name: 'Sharp knife' },
    ],
    skipDuplicates: true,
  });

  const recipe2 = await prisma.recipe.upsert({
    where: { slug: 'mutton-biryani-masterclass' },
    update: {},
    create: {
      title: 'Mutton Biryani Masterclass',
      slug: 'mutton-biryani-masterclass',
      description: 'The ultimate guide to making a perfectly layered, aromatic Mutton Biryani. This premium recipe covers every professional technique — from the perfect rice to the slow-dum cooking method. Chef Irfan\'s signature recipe.',
      cuisine: 'Pakistani / Mughlai',
      categoryId: createdCategories['rice-dishes'],
      difficulty: Difficulty.HARD,
      prepTime: 30,
      cookingTime: 90,
      servings: 6,
      type: RecipeType.PREMIUM,
      price: 499,
      currency: 'PKR',
      status: RecipeStatus.PUBLISHED,
      featured: true,
    },
  });

  await prisma.recipeIngredient.createMany({
    data: [
      { recipeId: recipe2.id, ingredient: 'Mutton (bone-in)', quantity: '1', unit: 'kg', sortOrder: 1 },
      { recipeId: recipe2.id, ingredient: 'Basmati rice', quantity: '500', unit: 'g', sortOrder: 2 },
      { recipeId: recipe2.id, ingredient: 'Yogurt', quantity: '1', unit: 'cup', sortOrder: 3 },
      { recipeId: recipe2.id, ingredient: 'Onions', quantity: '3', unit: 'large', sortOrder: 4 },
      { recipeId: recipe2.id, ingredient: 'Saffron', quantity: '1', unit: 'pinch', sortOrder: 5 },
    ],
    skipDuplicates: true,
  });

  await prisma.recipeStep.createMany({
    data: [
      { recipeId: recipe2.id, stepNumber: 1, instruction: '[PREMIUM] Marinate the mutton with yogurt and spices for at least 2 hours.' },
      { recipeId: recipe2.id, stepNumber: 2, instruction: '[PREMIUM] Prepare the caramelized onions — the secret to perfect biryani.' },
    ],
    skipDuplicates: true,
  });

  const recipe3 = await prisma.recipe.upsert({
    where: { slug: 'restaurant-style-daal-makhani' },
    update: {},
    create: {
      title: 'Restaurant-Style Daal Makhani',
      slug: 'restaurant-style-daal-makhani',
      description: 'Silky, buttery and intensely flavorful Daal Makhani slow-cooked to perfection. Learn the restaurant secret to this beloved Pakistani-Indian classic.',
      cuisine: 'Pakistani / Indian',
      categoryId: createdCategories['main-course'],
      difficulty: Difficulty.MEDIUM,
      prepTime: 20,
      cookingTime: 120,
      servings: 4,
      type: RecipeType.PREMIUM,
      price: 349,
      currency: 'PKR',
      status: RecipeStatus.PUBLISHED,
      featured: true,
    },
  });

  await prisma.recipeIngredient.createMany({
    data: [
      { recipeId: recipe3.id, ingredient: 'Black lentils (urad daal)', quantity: '1', unit: 'cup', sortOrder: 1 },
      { recipeId: recipe3.id, ingredient: 'Red kidney beans', quantity: '0.25', unit: 'cup', sortOrder: 2 },
      { recipeId: recipe3.id, ingredient: 'Butter', quantity: '4', unit: 'tbsp', sortOrder: 3 },
      { recipeId: recipe3.id, ingredient: 'Fresh cream', quantity: '0.5', unit: 'cup', sortOrder: 4 },
    ],
    skipDuplicates: true,
  });

  const recipe4 = await prisma.recipe.upsert({
    where: { slug: 'sheer-khurma' },
    update: {},
    create: {
      title: 'Sheer Khurma',
      slug: 'sheer-khurma',
      description: 'A festive Pakistani dessert made with vermicelli, milk, dates and dried fruits. Perfect for Eid and special occasions.',
      cuisine: 'Pakistani',
      categoryId: createdCategories['desserts'],
      difficulty: Difficulty.EASY,
      prepTime: 10,
      cookingTime: 30,
      servings: 6,
      type: RecipeType.FREE,
      price: 0,
      status: RecipeStatus.PUBLISHED,
      featured: false,
    },
  });

  await prisma.recipeIngredient.createMany({
    data: [
      { recipeId: recipe4.id, ingredient: 'Whole milk', quantity: '1', unit: 'litre', sortOrder: 1 },
      { recipeId: recipe4.id, ingredient: 'Vermicelli (seviyan)', quantity: '100', unit: 'g', sortOrder: 2 },
      { recipeId: recipe4.id, ingredient: 'Sugar', quantity: '4', unit: 'tbsp', sortOrder: 3 },
      { recipeId: recipe4.id, ingredient: 'Dates', quantity: '8', unit: 'pieces', sortOrder: 4 },
      { recipeId: recipe4.id, ingredient: 'Almonds', quantity: '20', unit: 'pieces', sortOrder: 5 },
      { recipeId: recipe4.id, ingredient: 'Cardamom powder', quantity: '0.5', unit: 'tsp', sortOrder: 6 },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Demo recipes created');

  // ── Achievements ────────────────────────────────────────────────
  await prisma.achievement.createMany({
    data: [
      {
        title: 'Professional Culinary Arts Certificate',
        organization: '[Demo] Pakistan Institute of Culinary Arts',
        description: 'Completed professional culinary training with distinction. (Demo content — update from admin dashboard)',
        type: AchievementType.CERTIFICATION,
        sortOrder: 1,
      },
      {
        title: 'Best Chef Award — Regional Competition',
        organization: '[Demo] Karachi Food Festival',
        description: 'Awarded best chef at the annual culinary competition. (Demo content — update from admin dashboard)',
        type: AchievementType.AWARD,
        sortOrder: 2,
      },
      {
        title: 'Featured in Culinary Magazine',
        organization: '[Demo] Taste of Pakistan Magazine',
        description: 'Featured as one of the top emerging chefs in Pakistan. (Demo content — update from admin dashboard)',
        type: AchievementType.MEDIA_FEATURE,
        sortOrder: 3,
      },
    ],
    skipDuplicates: false,
  });
  console.log('✅ Demo achievements created');

  // ── Testimonials ────────────────────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      {
        customerName: 'Demo Customer',
        rating: 5,
        content: 'The Biryani recipe is absolutely incredible! I followed every step and the result was better than any restaurant biryani I\'ve had. (Demo testimonial — will be replaced with real customer reviews)',
        status: TestimonialStatus.PUBLISHED,
      },
      {
        customerName: 'Demo User 2',
        rating: 5,
        content: 'Chef Irfan\'s recipes are detailed, easy to follow and produce amazing results. The Karahi recipe is now a family favourite! (Demo testimonial)',
        status: TestimonialStatus.PUBLISHED,
      },
    ],
    skipDuplicates: false,
  });
  console.log('✅ Demo testimonials created');

  console.log('');
  console.log('🎉 Seed complete!');
  console.log('');
  console.log('Admin credentials:');
  console.log('  Email:    admin@chefirfan.com');
  console.log('  Password: Admin@123');
  console.log('');
  console.log('Demo customer credentials:');
  console.log('  Email:    demo@customer.com');
  console.log('  Password: Customer@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
