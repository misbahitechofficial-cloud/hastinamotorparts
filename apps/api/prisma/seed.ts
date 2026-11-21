import { PrismaClient, VehicleType, PartGrade, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  SEED_BRANDS,
  SEED_MODELS,
  SEED_CATEGORIES,
  SEED_PARTS,
  SEED_USERS,
  SEED_BANNERS,
  SEED_SITE_SETTINGS,
  SEED_PAGES
} from '../src/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Hastina Motor Parts Database Seed ---');

  // 1. Site Settings
  console.log('Seeding site settings...');
  for (const [key, value] of Object.entries(SEED_SITE_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value, updatedAt: new Date() }
    });
  }

  // 2. Static Pages
  console.log('Seeding static pages...');
  for (const page of SEED_PAGES) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { title: page.title, body: page.body, updatedAt: new Date() },
      create: { slug: page.slug, title: page.title, body: page.body, updatedAt: new Date() }
    });
  }

  // 3. Admin Users
  console.log('Seeding users...');
  for (const u of SEED_USERS) {
    const passwordHash = await bcrypt.hash('Hastina@2026', 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role as Role, passwordHash, isActive: true },
      create: { email: u.email, name: u.name, role: u.role as Role, passwordHash, isActive: true }
    });
  }

  // 4. Brands
  console.log('Seeding brands...');
  for (const b of SEED_BRANDS) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        logoUrl: b.logoUrl,
        types: b.types as VehicleType[],
        sortOrder: b.sortOrder,
        isActive: true
      },
      create: {
        id: b.id,
        name: b.name,
        slug: b.slug,
        logoUrl: b.logoUrl,
        types: b.types as VehicleType[],
        sortOrder: b.sortOrder,
        isActive: true
      }
    });
  }

  // 5. Vehicle Models
  console.log('Seeding vehicle models...');
  for (const m of SEED_MODELS) {
    await prisma.vehicleModel.upsert({
      where: { brandId_slug: { brandId: m.brandId, slug: m.slug } },
      update: {
        name: m.name,
        type: m.type as VehicleType,
        yearFrom: m.yearFrom,
        yearTo: m.yearTo,
        imageUrl: m.imageUrl,
        isActive: true
      },
      create: {
        id: m.id,
        brandId: m.brandId,
        name: m.name,
        slug: m.slug,
        type: m.type as VehicleType,
        yearFrom: m.yearFrom,
        yearTo: m.yearTo,
        imageUrl: m.imageUrl,
        isActive: true
      }
    });
  }

  // 6. Categories (Ordered by level 1 -> 2 -> 3)
  console.log('Seeding categories tree...');
  const sortedCategories = [...SEED_CATEGORIES].sort((a, b) => a.level - b.level);
  for (const c of sortedCategories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        slug: c.slug,
        level: c.level,
        imageUrl: c.imageUrl,
        sortOrder: c.sortOrder,
        parentId: c.parentId || null
      },
      create: {
        id: c.id,
        parentId: c.parentId || null,
        name: c.name,
        slug: c.slug,
        level: c.level,
        imageUrl: c.imageUrl,
        sortOrder: c.sortOrder
      }
    });
  }

  // 7. Parts & Images & Fitments
  console.log('Seeding parts catalogue...');
  for (const p of SEED_PARTS) {
    const part = await prisma.part.upsert({
      where: { partNumber: p.partNumber },
      update: {
        altNumbers: p.altNumbers,
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
        grade: p.grade as PartGrade,
        description: p.description,
        specs: p.specs,
        weightKg: p.weightKg,
        moq: p.moq,
        isFeatured: p.isFeatured,
        isActive: true
      },
      create: {
        id: p.id,
        partNumber: p.partNumber,
        altNumbers: p.altNumbers,
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
        grade: p.grade as PartGrade,
        description: p.description,
        specs: p.specs,
        weightKg: p.weightKg,
        moq: p.moq,
        isFeatured: p.isFeatured,
        isActive: true
      }
    });

    // Delete existing images and fitments to re-seed clean
    await prisma.partImage.deleteMany({ where: { partId: part.id } });
    for (let i = 0; i < p.images.length; i++) {
      await prisma.partImage.create({
        data: {
          partId: part.id,
          url: p.images[i],
          sortOrder: i
        }
      });
    }

    await prisma.fitment.deleteMany({ where: { partId: part.id } });
    for (const modelId of p.fitmentModelIds) {
      await prisma.fitment.create({
        data: {
          partId: part.id,
          modelId
        }
      });
    }
  }

  // 8. Banners
  console.log('Seeding banners...');
  for (const b of SEED_BANNERS) {
    await prisma.banner.upsert({
      where: { id: b.id },
      update: {
        title: b.title,
        subtitle: b.subtitle,
        imageUrl: b.imageUrl,
        link: b.link,
        sortOrder: b.sortOrder,
        isActive: b.isActive
      },
      create: {
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        imageUrl: b.imageUrl,
        link: b.link,
        sortOrder: b.sortOrder,
        isActive: b.isActive
      }
    });
  }

  console.log('--- Database Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
