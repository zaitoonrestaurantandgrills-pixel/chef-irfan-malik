import { PrismaClient, GalleryCategory, AchievementType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Inserting new Gallery and Achievement items into database...');

  // 1. Add Achievement
  const achievement = await prisma.achievement.create({
    data: {
      title: 'Certificate of Appreciation — 17th Consumers Food Safety & Quality Awards',
      organization: 'Consumers Association of Pakistan (CAP) in collaboration with Sindh Food Authority',
      date: new Date('2026-08-05'),
      type: AchievementType.AWARD,
      description: 'Presented to Irfan Malik (Zaitoon Restaurant) in recognition of promoting food safety, quality culinary standards, and consumer protection at Grand Ballroom, Hotel Pearl Continental, Karachi.',
      image: '/uploads/achievements/cap-food-safety-certificate-2026.jpg',
      sortOrder: 1,
    },
  });
  console.log('Created Achievement:', achievement.title);

  // 2. Add Gallery Items
  const galleryItems = [
    {
      title: '17th CAP Food Safety & Quality Award Ceremony',
      image: '/uploads/gallery/cap-food-safety-award-stage-2026.jpg',
      category: GalleryCategory.ACHIEVEMENTS,
      description: 'Chef Irfan Malik receiving the Certificate of Appreciation on stage at the 17th Consumers Food Safety & Quality Conference at Pearl Continental Hotel Karachi.',
      sortOrder: 1,
    },
    {
      title: 'Official Certificate of Appreciation 2026',
      image: '/uploads/gallery/cap-food-safety-certificate-2026.jpg',
      category: GalleryCategory.ACHIEVEMENTS,
      description: 'Certificate presented by Consumers Association of Pakistan recognizing Irfan Malik (Zaitoon Restaurant) for exemplary food safety & culinary excellence.',
      sortOrder: 2,
    },
    {
      title: 'Master Chefs Recognition by Sindh Food Authority',
      image: '/uploads/gallery/master-chefs-sindh-food-authority-2026.jpg',
      category: GalleryCategory.CHEF,
      description: 'Executive Chef Irfan Malik with fellow master chefs recognized by Sindh Food Authority and CAP for maintaining highest food safety standards.',
      sortOrder: 3,
    },
    {
      title: 'Stage Award Presentation with CAP Leadership',
      image: '/uploads/gallery/cap-award-presentation-2026.jpg',
      category: GalleryCategory.EVENTS,
      description: 'Award presentation on stage with leadership of Consumers Association of Pakistan and food industry dignitaries.',
      sortOrder: 4,
    },
    {
      title: 'Certificate of Excellence & Appreciation Gala',
      image: '/uploads/gallery/chef-irfan-malik-award-presentation-vip.jpg',
      category: GalleryCategory.EVENTS,
      description: 'Chef Irfan Malik presenting the Food Safety Award alongside distinguished guests at the Grand Ballroom.',
      sortOrder: 5,
    },
  ];

  for (const item of galleryItems) {
    const created = await prisma.gallery.create({
      data: item,
    });
    console.log(`Created Gallery item: ${created.title} (${created.category})`);
  }

  console.log('Finished updating database with new photos!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
