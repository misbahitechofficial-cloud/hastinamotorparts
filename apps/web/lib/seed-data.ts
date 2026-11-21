export interface SeedBrand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  types: ('MOTORCYCLE' | 'SCOOTER' | 'TUKTUK' | 'CAR')[];
  sortOrder: number;
}

export interface SeedPart {
  id: number;
  partNumber: string;
  altNumbers: string[];
  name: string;
  slug: string;
  categoryId: number;
  grade: 'GENUINE' | 'OES' | 'AFTERMARKET';
  description: string;
  specs: Record<string, string | number>;
  weightKg: number;
  moq: number;
  isFeatured: boolean;
  images: string[];
  fitmentModelIds: number[];
}

export const SEED_BRANDS: SeedBrand[] = [
  { id: 1, name: 'Bajaj', slug: 'bajaj', logoUrl: '/images/brands/bajaj.svg', types: ['MOTORCYCLE', 'TUKTUK'], sortOrder: 1 },
  { id: 2, name: 'TVS', slug: 'tvs', logoUrl: '/images/brands/tvs.svg', types: ['MOTORCYCLE', 'SCOOTER'], sortOrder: 2 },
  { id: 3, name: 'Honda', slug: 'honda', logoUrl: '/images/brands/honda.svg', types: ['MOTORCYCLE', 'SCOOTER'], sortOrder: 3 },
  { id: 4, name: 'Yamaha', slug: 'yamaha', logoUrl: '/images/brands/yamaha.svg', types: ['MOTORCYCLE', 'SCOOTER'], sortOrder: 4 },
  { id: 5, name: 'Suzuki', slug: 'suzuki', logoUrl: '/images/brands/suzuki.svg', types: ['MOTORCYCLE', 'SCOOTER'], sortOrder: 5 },
  { id: 6, name: 'Vespa', slug: 'vespa', logoUrl: '/images/brands/vespa.svg', types: ['SCOOTER'], sortOrder: 6 },
  { id: 7, name: 'Aprilia', slug: 'aprilia', logoUrl: '/images/brands/aprilia.svg', types: ['SCOOTER', 'MOTORCYCLE'], sortOrder: 7 },
  { id: 8, name: 'Piaggio', slug: 'piaggio', logoUrl: '/images/brands/piaggio.svg', types: ['SCOOTER', 'TUKTUK'], sortOrder: 8 },
  { id: 9, name: 'Maruti Suzuki', slug: 'maruti-suzuki', logoUrl: '/images/brands/maruti-suzuki.svg', types: ['CAR'], sortOrder: 9 },
  { id: 10, name: 'Hyundai', slug: 'hyundai', logoUrl: '/images/brands/hyundai.svg', types: ['CAR'], sortOrder: 10 },
  { id: 11, name: 'Kia', slug: 'kia', logoUrl: '/images/brands/kia.svg', types: ['CAR'], sortOrder: 11 }
];

export const SEED_PARTS: Partial<SeedPart>[] = [
  { id: 1, slug: 'bajaj-pulsar-150-cylinder-block-kit-36360086' },
  { id: 2, slug: 'bajaj-pulsar-clutch-friction-plate-set-ja541015' },
  { id: 3, slug: 'suzuki-access-125-cvt-drive-belt-27601-33g00' },
  { id: 4, slug: 'suzuki-gixxer-access-oil-filter-16510-05240' },
  { id: 5, slug: 'tvs-apache-rtr-front-disc-brake-pads-n9111330' },
  { id: 6, slug: 'honda-activa-drive-belt-23100-gcc-771' },
  { id: 7, slug: 'vespa-vxl-front-brake-pad-set-1b001156r' },
  { id: 8, slug: 'vespa-vxl-cvt-drive-belt-1b001859' },
  { id: 9, slug: 'aprilia-sr-150-160-cvt-drive-belt-cm273301' },
  { id: 10, slug: 'bajaj-re-tuk-tuk-differential-crown-wheel-pinion-aa101438' },
  { id: 11, slug: 'bajaj-re-tuk-tuk-piston-ring-set-ba122001' },
  { id: 12, slug: 'tvs-jupiter-ntorq-rear-brake-shoe-set-k6110020' },
  { id: 13, slug: 'yamaha-aerox-155-air-filter-b65-e4451-00' },
  { id: 14, slug: 'maruti-suzuki-swift-baleno-front-brake-pads-55810m68p00' },
  { id: 15, slug: 'bajaj-boxer-bm-150-connecting-rod-kit-pf531008' }
];
