import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Inspect existing gallery and achievements
  const allGallery = await prisma.gallery.findMany();
  console.log('Current Gallery Count:', allGallery.length);
  for (const g of allGallery) {
    console.log(`- Gallery [${g.id}]: ${g.title} (${g.image})`);
  }

  const allAchievements = await prisma.achievement.findMany();
  console.log('Current Achievements Count:', allAchievements.length);
  for (const a of allAchievements) {
    console.log(`- Achievement [${a.id}]: ${a.title} (${a.image})`);
  }

  // 2. Remove any example dummy items that don't use real /uploads/ paths
  const deletedGallery = await prisma.gallery.deleteMany({
    where: {
      NOT: {
        image: {
          startsWith: '/uploads/',
        },
      },
    },
  });
  console.log('Deleted dummy gallery items:', deletedGallery.count);

  const deletedAchievements = await prisma.achievement.deleteMany({
    where: {
      NOT: {
        image: {
          startsWith: '/uploads/',
        },
      },
    },
  });
  console.log('Deleted dummy achievements:', deletedAchievements.count);

  // 3. Update SiteSettings to use the real uploaded photos
  const updatedSettings = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      chefName: 'Chef Irfan Malik',
      tagline: 'Crafting Flavors. Sharing Knowledge.',
      biography: 'Executive Chef Irfan Malik is a celebrated culinary master at Zaitoon Restaurant and an esteemed figure in Pakistani gastronomy. Honored by the Consumers Association of Pakistan and Sindh Food Authority, Chef Irfan is dedicated to Michelin-standard food safety, heritage recipes, and culinary education.',
      heroImage: '/uploads/gallery/cap-food-safety-award-stage-2026.jpg',
      profileImage: '/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg',
      logoUrl: '/images/logo.png',
      phone: '0300-9482504',
      whatsapp: '0300-9482504',
      email: 'contact@chefirfanmalik.com',
      address: 'Zaitoon Restaurant, Karachi, Pakistan',
    },
    update: {
      heroImage: '/uploads/gallery/cap-food-safety-award-stage-2026.jpg',
      profileImage: '/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg',
      logoUrl: '/images/logo.png',
      phone: '0300-9482504',
      whatsapp: '0300-9482504',
      email: 'contact@chefirfanmalik.com',
      address: 'Zaitoon Restaurant, Karachi, Pakistan',
      biography: 'Executive Chef Irfan Malik is a celebrated culinary master at Zaitoon Restaurant and an esteemed figure in Pakistani gastronomy. Honored by the Consumers Association of Pakistan and Sindh Food Authority, Chef Irfan is dedicated to Michelin-standard food safety, heritage recipes, and culinary education.',
    },
  });
  console.log('Updated SiteSettings:', updatedSettings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
