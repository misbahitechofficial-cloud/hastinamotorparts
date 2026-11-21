import {
  SEED_BRANDS,
  SEED_MODELS,
  SEED_CATEGORIES,
  SEED_PARTS,
  SEED_USERS,
  SEED_BANNERS,
  SEED_SITE_SETTINGS,
  SEED_PAGES,
  SeedBrand,
  SeedModel,
  SeedCategory,
  SeedPart
} from './seed-data';
import { normalizePartNo } from './utils/normalizePartNo';

export interface PartRecord extends SeedPart {
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandRecord extends SeedBrand {
  isActive: boolean;
}

export interface ModelRecord extends SeedModel {
  isActive: boolean;
}

export interface CategoryRecord extends SeedCategory {
  isActive: boolean;
}

export interface EnquiryItemRecord {
  id: number;
  enquiryId: number;
  partId?: number;
  partNumber: string;
  partName?: string;
  quantity: number;
}

export interface EnquiryRecord {
  id: number;
  refNo: string;
  name: string;
  company?: string;
  country: string;
  email: string;
  phone?: string;
  message?: string;
  attachmentUrl?: string;
  status: 'NEW' | 'QUOTED' | 'WON' | 'LOST';
  assignedTo?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: EnquiryItemRecord[];
}

export interface SearchLogRecord {
  id: number;
  query: string;
  results: number;
  country?: string;
  createdAt: Date;
}

export interface UserRecord {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: 'SUPER_ADMIN' | 'CATALOGUE' | 'SALES';
  isActive: boolean;
}

export interface BannerRecord {
  id: number;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface PageRecord {
  id: number;
  slug: string;
  title: string;
  body: string;
  updatedAt: Date;
}

class InMemoryDataStore {
  public brands: BrandRecord[] = [];
  public models: ModelRecord[] = [];
  public categories: CategoryRecord[] = [];
  public parts: PartRecord[] = [];
  public enquiries: EnquiryRecord[] = [];
  public searchLogs: SearchLogRecord[] = [];
  public users: UserRecord[] = [];
  public banners: BannerRecord[] = [];
  public pages: PageRecord[] = [];
  public siteSettings: Record<string, string> = {};

  private enquiryCounter = 124;
  private partIdCounter = 100;
  private modelIdCounter = 2000;
  private brandIdCounter = 100;
  private categoryIdCounter = 2000;
  private bannerIdCounter = 100;
  private searchLogIdCounter = 1;

  constructor() {
    this.resetToSeed();
  }

  public resetToSeed() {
    this.brands = SEED_BRANDS.map(b => ({ ...b, isActive: true }));
    this.models = SEED_MODELS.map(m => ({ ...m, isActive: true }));
    this.categories = SEED_CATEGORIES.map(c => ({ ...c, isActive: true }));
    this.parts = SEED_PARTS.map(p => ({
      ...p,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    this.users = [...SEED_USERS];
    this.banners = [...SEED_BANNERS];
    this.siteSettings = { ...SEED_SITE_SETTINGS };
    this.pages = SEED_PAGES.map((p, idx) => ({
      id: idx + 1,
      slug: p.slug,
      title: p.title,
      body: p.body,
      updatedAt: new Date()
    }));

    // Seed sample enquiries
    this.enquiries = [
      {
        id: 1,
        refNo: 'ENQ-2026-000101',
        name: 'Hassan Al-Tamimi',
        company: 'Al-Tamimi Auto Spare Parts LLC',
        country: 'Iraq',
        email: 'hassan@tamimi-spares.iq',
        phone: '+964 770 123 4567',
        message: 'Require 20ft container quotation for Bajaj Pulsar 150 cylinder kits and clutch plates CIF Umm Qasr Port.',
        status: 'QUOTED',
        assignedTo: 3,
        notes: 'Quotation sent on 04 Oct 2026. Awaiting LC confirmation.',
        createdAt: new Date(Date.now() - 3 * 86400000),
        updatedAt: new Date(Date.now() - 2 * 86400000),
        items: [
          { id: 1, enquiryId: 1, partId: 1, partNumber: '36360086', partName: 'Cylinder Block Kit with Piston & Rings', quantity: 150 },
          { id: 2, enquiryId: 1, partId: 2, partNumber: 'JA541015', partName: 'Clutch Friction Plate Set', quantity: 300 }
        ]
      },
      {
        id: 2,
        refNo: 'ENQ-2026-000102',
        name: 'Kwame Mensah',
        company: 'Accra Moto Distro Ltd',
        country: 'Ghana',
        email: 'kwame@accramoto.com',
        phone: '+233 24 555 6789',
        message: 'Looking for commercial tuk tuk spare parts supply for Bajaj RE 205. Need crown wheel sets and piston rings urgently.',
        status: 'NEW',
        assignedTo: 3,
        notes: 'New buyer inquiry from Accra. High priority.',
        createdAt: new Date(Date.now() - 1 * 86400000),
        updatedAt: new Date(Date.now() - 1 * 86400000),
        items: [
          { id: 3, enquiryId: 2, partId: 10, partNumber: 'AA101438', partName: 'Bajaj RE Tuk Tuk Differential Crown Wheel & Pinion Set', quantity: 50 },
          { id: 4, enquiryId: 2, partId: 11, partNumber: 'BA122001', partName: 'Bajaj RE 205cc Tuk Tuk Piston Ring Set', quantity: 200 }
        ]
      }
    ];

    // Seed sample search logs including zero-result searches
    this.searchLogs = [
      { id: 1, query: 'pulsar 150 cylinder', results: 1, country: 'Iraq', createdAt: new Date(Date.now() - 3600000 * 5) },
      { id: 2, query: '36360086', results: 1, country: 'UAE', createdAt: new Date(Date.now() - 3600000 * 4) },
      { id: 3, query: 'bajaj re crown pinion', results: 1, country: 'Ghana', createdAt: new Date(Date.now() - 3600000 * 3) },
      { id: 4, query: 'hero splendor cdi', results: 0, country: 'Senegal', createdAt: new Date(Date.now() - 3600000 * 2) },
      { id: 5, query: 'tvs ntorq belt', results: 1, country: 'Iran', createdAt: new Date(Date.now() - 3600000 * 1) },
      { id: 6, query: 'yamaha r15 v3 headlight', results: 0, country: 'Turkey', createdAt: new Date(Date.now() - 1800000) }
    ];
  }

  // --- Parts queries ---
  public getParts(options: {
    brandSlug?: string;
    modelSlug?: string;
    modelId?: number;
    categorySlug?: string;
    categoryId?: number;
    grade?: string;
    q?: string;
    sort?: string;
    page?: number;
    limit?: number;
    vehicleType?: string;
    isFeatured?: boolean;
  }) {
    let list = this.parts.filter(p => p.isActive);

    // Filter by vehicle type (MOTORCYCLE, SCOOTER, TUKTUK, CAR)
    if (options.vehicleType) {
      const validModelIds = this.models
        .filter(m => m.type.toUpperCase() === options.vehicleType?.toUpperCase())
        .map(m => m.id);
      list = list.filter(p => p.fitmentModelIds.some(mId => validModelIds.includes(mId)));
    }

    // Filter by brand
    if (options.brandSlug) {
      const brand = this.brands.find(b => b.slug.toLowerCase() === options.brandSlug?.toLowerCase());
      if (brand) {
        const brandModelIds = this.models.filter(m => m.brandId === brand.id).map(m => m.id);
        list = list.filter(p => p.fitmentModelIds.some(mId => brandModelIds.includes(mId)));
      }
    }

    // Filter by model
    if (options.modelSlug) {
      const model = this.models.find(m => m.slug.toLowerCase() === options.modelSlug?.toLowerCase());
      if (model) {
        list = list.filter(p => p.fitmentModelIds.includes(model.id));
      }
    } else if (options.modelId) {
      list = list.filter(p => p.fitmentModelIds.includes(Number(options.modelId)));
    }

    // Filter by category (includes child categories)
    if (options.categorySlug) {
      const cat = this.categories.find(c => c.slug.toLowerCase() === options.categorySlug?.toLowerCase());
      if (cat) {
        const matchingCategoryIds = this.getAllDescendantCategoryIds(cat.id);
        matchingCategoryIds.push(cat.id);
        list = list.filter(p => matchingCategoryIds.includes(p.categoryId));
      }
    } else if (options.categoryId) {
      const matchingCategoryIds = this.getAllDescendantCategoryIds(Number(options.categoryId));
      matchingCategoryIds.push(Number(options.categoryId));
      list = list.filter(p => matchingCategoryIds.includes(p.categoryId));
    }

    // Filter by grade (GENUINE, OES, AFTERMARKET)
    if (options.grade) {
      list = list.filter(p => p.grade.toUpperCase() === options.grade?.toUpperCase());
    }

    // Filter by featured
    if (options.isFeatured !== undefined) {
      list = list.filter(p => p.isFeatured === options.isFeatured);
    }

    // Search query
    if (options.q && options.q.trim()) {
      const rawQuery = options.q.trim();
      const normQuery = normalizePartNo(rawQuery);
      const lowerQuery = rawQuery.toLowerCase();

      list = list.filter(p => {
        const normPartNo = normalizePartNo(p.partNumber);
        if (normPartNo.includes(normQuery)) return true;
        if (p.altNumbers.some(alt => normalizePartNo(alt).includes(normQuery))) return true;
        if (p.name.toLowerCase().includes(lowerQuery)) return true;
        if (p.description && p.description.toLowerCase().includes(lowerQuery)) return true;
        // Check compatible models
        const modelNames = this.getCompatibleModels(p.fitmentModelIds).map(m => m.name.toLowerCase());
        if (modelNames.some(name => name.includes(lowerQuery))) return true;
        return false;
      });

      // Priority sort: exact part-number match first
      list.sort((a, b) => {
        const aExact = normalizePartNo(a.partNumber) === normQuery || a.altNumbers.some(alt => normalizePartNo(alt) === normQuery);
        const bExact = normalizePartNo(b.partNumber) === normQuery || b.altNumbers.some(alt => normalizePartNo(alt) === normQuery);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0;
      });
    }

    // Sort order
    if (options.sort === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (options.sort === 'name_desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (options.sort === 'part_number') {
      list.sort((a, b) => a.partNumber.localeCompare(b.partNumber));
    } else if (options.sort === 'newest') {
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    const total = list.length;
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 24);
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    // Enrich parts with category and fitments
    const enriched = paginated.map(p => this.enrichPart(p));

    return {
      items: enriched,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  public getPartBySlug(slug: string) {
    const part = this.parts.find(p => p.slug.toLowerCase() === slug.toLowerCase() && p.isActive);
    if (!part) return null;
    return this.enrichPart(part);
  }

  public getPartById(id: number) {
    const part = this.parts.find(p => p.id === id);
    if (!part) return null;
    return this.enrichPart(part);
  }

  public getPartByPartNumber(partNo: string) {
    const norm = normalizePartNo(partNo);
    const part = this.parts.find(p => normalizePartNo(p.partNumber) === norm || p.altNumbers.some(alt => normalizePartNo(alt) === norm));
    if (!part) return null;
    return this.enrichPart(part);
  }

  private getAllDescendantCategoryIds(parentId: number): number[] {
    const children = this.categories.filter(c => c.parentId === parentId);
    let ids: number[] = [];
    for (const child of children) {
      ids.push(child.id);
      ids = ids.concat(this.getAllDescendantCategoryIds(child.id));
    }
    return ids;
  }

  private enrichPart(part: PartRecord) {
    const category = this.categories.find(c => c.id === part.categoryId);
    const parentCategory = category?.parentId ? this.categories.find(c => c.id === category.parentId) : undefined;
    const rootCategory = parentCategory?.parentId ? this.categories.find(c => c.id === parentCategory.parentId) : parentCategory || category;

    const compatibleModels = this.getCompatibleModels(part.fitmentModelIds);
    const brandsSet = new Set<string>();
    compatibleModels.forEach(m => {
      const b = this.brands.find(br => br.id === m.brandId);
      if (b) brandsSet.add(b.name);
    });

    return {
      ...part,
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug,
        level: category.level,
        parent: parentCategory ? { id: parentCategory.id, name: parentCategory.name, slug: parentCategory.slug } : null,
        root: rootCategory ? { id: rootCategory.id, name: rootCategory.name, slug: rootCategory.slug } : null
      } : null,
      compatibleModels,
      compatibleBrands: Array.from(brandsSet)
    };
  }

  public getCompatibleModels(modelIds: number[]) {
    return this.models
      .filter(m => modelIds.includes(m.id))
      .map(m => {
        const brand = this.brands.find(b => b.id === m.brandId);
        return {
          id: m.id,
          name: m.name,
          slug: m.slug,
          type: m.type,
          yearFrom: m.yearFrom,
          yearTo: m.yearTo,
          brandId: m.brandId,
          brandName: brand?.name || 'Unknown',
          brandSlug: brand?.slug || ''
        };
      });
  }

  // --- Category Tree for Mega Menu ---
  public getCategoryTree() {
    const level1 = this.categories.filter(c => c.level === 1 && c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

    return level1.map(l1 => {
      const subcategories = this.categories
        .filter(c => c.parentId === l1.id && c.level === 2 && c.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(l2 => {
          const partTypes = this.categories
            .filter(c => c.parentId === l2.id && c.level === 3 && c.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder);
          return {
            ...l2,
            children: partTypes
          };
        });

      return {
        ...l1,
        children: subcategories
      };
    });
  }

  // --- Brand & Model methods ---
  public getBrands(vehicleType?: string) {
    let list = this.brands.filter(b => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
    if (vehicleType) {
      list = list.filter(b => b.types.some(t => t.toUpperCase() === vehicleType.toUpperCase()));
    }
    return list.map(b => {
      const models = this.models.filter(m => m.brandId === b.id && m.isActive);
      return {
        ...b,
        modelsCount: models.length
      };
    });
  }

  public getModelsByBrandSlug(brandSlug: string, vehicleType?: string) {
    const brand = this.brands.find(b => b.slug.toLowerCase() === brandSlug.toLowerCase() && b.isActive);
    if (!brand) return null;

    let models = this.models.filter(m => m.brandId === brand.id && m.isActive);
    if (vehicleType) {
      models = models.filter(m => m.type.toUpperCase() === vehicleType.toUpperCase());
    }

    return {
      brand,
      models: models.map(m => {
        const partsCount = this.parts.filter(p => p.fitmentModelIds.includes(m.id) && p.isActive).length;
        return {
          ...m,
          partsCount
        };
      })
    };
  }

  // --- Enquiries ---
  public createEnquiry(data: {
    name: string;
    company?: string;
    country: string;
    email: string;
    phone?: string;
    message?: string;
    attachmentUrl?: string;
    items: Array<{
      partId?: number;
      partNumber: string;
      partName?: string;
      quantity: number;
    }>;
  }) {
    const year = new Date().getFullYear();
    const refNo = `ENQ-${year}-${String(this.enquiryCounter++).padStart(6, '0')}`;
    const enquiryId = this.enquiries.length + 1;

    const items: EnquiryItemRecord[] = data.items.map((it, idx) => ({
      id: idx + 1,
      enquiryId,
      partId: it.partId,
      partNumber: it.partNumber,
      partName: it.partName,
      quantity: it.quantity || 1
    }));

    const enquiry: EnquiryRecord = {
      id: enquiryId,
      refNo,
      name: data.name,
      company: data.company,
      country: data.country,
      email: data.email,
      phone: data.phone,
      message: data.message,
      attachmentUrl: data.attachmentUrl,
      status: 'NEW',
      createdAt: new Date(),
      updatedAt: new Date(),
      items
    };

    this.enquiries.unshift(enquiry);
    return enquiry;
  }

  public getEnquiries(filters?: { status?: string; search?: string; country?: string }) {
    let list = [...this.enquiries];
    if (filters?.status) {
      list = list.filter(e => e.status.toUpperCase() === filters.status?.toUpperCase());
    }
    if (filters?.country) {
      list = list.filter(e => e.country.toLowerCase() === filters.country?.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(e =>
        e.refNo.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.company && e.company.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public updateEnquiryStatus(id: number, status: 'NEW' | 'QUOTED' | 'WON' | 'LOST', notes?: string, assignedTo?: number) {
    const enquiry = this.enquiries.find(e => e.id === id);
    if (!enquiry) return null;
    enquiry.status = status;
    if (notes !== undefined) enquiry.notes = notes;
    if (assignedTo !== undefined) enquiry.assignedTo = assignedTo;
    enquiry.updatedAt = new Date();
    return enquiry;
  }

  // --- Search Logging & Analytics ---
  public logSearch(query: string, results: number, country?: string) {
    this.searchLogs.unshift({
      id: this.searchLogIdCounter++,
      query,
      results,
      country,
      createdAt: new Date()
    });
  }

  public getSearchAnalytics() {
    const totalSearches = this.searchLogs.length;
    const zeroResults = this.searchLogs.filter(s => s.results === 0);

    // Group zero results by query
    const zeroQueryCounts: Record<string, number> = {};
    zeroResults.forEach(s => {
      const q = s.query.toLowerCase().trim();
      zeroQueryCounts[q] = (zeroQueryCounts[q] || 0) + 1;
    });

    const topZeroResults = Object.entries(zeroQueryCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top searched terms
    const allQueryCounts: Record<string, number> = {};
    this.searchLogs.forEach(s => {
      const q = s.query.toLowerCase().trim();
      allQueryCounts[q] = (allQueryCounts[q] || 0) + 1;
    });

    const topSearches = Object.entries(allQueryCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Enquiries by country
    const countryCounts: Record<string, number> = {};
    this.enquiries.forEach(e => {
      countryCounts[e.country] = (countryCounts[e.country] || 0) + 1;
    });

    return {
      totalSearches,
      zeroResultCount: zeroResults.length,
      topSearches,
      topZeroResults,
      enquiriesByCountry: countryCounts,
      totalEnquiries: this.enquiries.length,
      newEnquiriesCount: this.enquiries.filter(e => e.status === 'NEW').length,
      quotedEnquiriesCount: this.enquiries.filter(e => e.status === 'QUOTED').length,
      totalParts: this.parts.filter(p => p.isActive).length
    };
  }

  // --- Admin Part CRUD ---
  public createPart(data: Omit<SeedPart, 'id'>) {
    const id = ++this.partIdCounter;
    const newPart: PartRecord = {
      ...data,
      id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.parts.unshift(newPart);
    return this.enrichPart(newPart);
  }

  public updatePart(id: number, data: Partial<SeedPart> & { isActive?: boolean }) {
    const idx = this.parts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.parts[idx] = {
      ...this.parts[idx],
      ...data,
      updatedAt: new Date()
    };
    return this.enrichPart(this.parts[idx]);
  }

  public deletePart(id: number) {
    const idx = this.parts.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.parts.splice(idx, 1);
    return true;
  }
}

export const store = new InMemoryDataStore();
