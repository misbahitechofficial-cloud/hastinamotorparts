"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seed_data_1 = require("../src/seed-data");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('--- Starting Hastina Motor Parts Database Seed ---');
    // 1. Site Settings
    console.log('Seeding site settings...');
    for (const [key, value] of Object.entries(seed_data_1.SEED_SITE_SETTINGS)) {
        await prisma.siteSetting.upsert({
            where: { key },
            update: { value, updatedAt: new Date() },
            create: { key, value, updatedAt: new Date() }
        });
    }
    // 2. Static Pages
    console.log('Seeding static pages...');
    for (const page of seed_data_1.SEED_PAGES) {
        await prisma.page.upsert({
            where: { slug: page.slug },
            update: { title: page.title, body: page.body, updatedAt: new Date() },
            create: { slug: page.slug, title: page.title, body: page.body, updatedAt: new Date() }
        });
    }
    // 3. Admin Users
    console.log('Seeding users...');
    for (const u of seed_data_1.SEED_USERS) {
        const passwordHash = await bcryptjs_1.default.hash('Hastina@2026', 10);
        await prisma.user.upsert({
            where: { email: u.email },
            update: { name: u.name, role: u.role, passwordHash, isActive: true },
            create: { email: u.email, name: u.name, role: u.role, passwordHash, isActive: true }
        });
    }
    // 4. Brands
    console.log('Seeding brands...');
    for (const b of seed_data_1.SEED_BRANDS) {
        await prisma.brand.upsert({
            where: { slug: b.slug },
            update: {
                name: b.name,
                logoUrl: b.logoUrl,
                types: b.types,
                sortOrder: b.sortOrder,
                isActive: true
            },
            create: {
                id: b.id,
                name: b.name,
                slug: b.slug,
                logoUrl: b.logoUrl,
                types: b.types,
                sortOrder: b.sortOrder,
                isActive: true
            }
        });
    }
    // 5. Vehicle Models
    console.log('Seeding vehicle models...');
    for (const m of seed_data_1.SEED_MODELS) {
        await prisma.vehicleModel.upsert({
            where: { brandId_slug: { brandId: m.brandId, slug: m.slug } },
            update: {
                name: m.name,
                type: m.type,
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
                type: m.type,
                yearFrom: m.yearFrom,
                yearTo: m.yearTo,
                imageUrl: m.imageUrl,
                isActive: true
            }
        });
    }
    // 6. Categories (Ordered by level 1 -> 2 -> 3)
    console.log('Seeding categories tree...');
    const sortedCategories = [...seed_data_1.SEED_CATEGORIES].sort((a, b) => a.level - b.level);
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
    for (const p of seed_data_1.SEED_PARTS) {
        const part = await prisma.part.upsert({
            where: { partNumber: p.partNumber },
            update: {
                altNumbers: p.altNumbers,
                name: p.name,
                slug: p.slug,
                categoryId: p.categoryId,
                grade: p.grade,
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
                grade: p.grade,
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
    for (const b of seed_data_1.SEED_BANNERS) {
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
