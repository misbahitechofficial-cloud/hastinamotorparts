// Seed dataset for Hastina Motor Parts (ALISONS GENERAL TRADING LLP)

export interface SeedBrand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  types: ('MOTORCYCLE' | 'SCOOTER' | 'TUKTUK' | 'CAR')[];
  sortOrder: number;
}

export interface SeedModel {
  id: number;
  brandId: number;
  name: string;
  slug: string;
  type: 'MOTORCYCLE' | 'SCOOTER' | 'TUKTUK' | 'CAR';
  yearFrom?: number;
  yearTo?: number;
  imageUrl?: string;
}

export interface SeedCategory {
  id: number;
  parentId?: number;
  name: string;
  slug: string;
  level: number;
  imageUrl?: string;
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

export const SEED_MODELS: SeedModel[] = [
  // Bajaj Models
  { id: 101, brandId: 1, name: 'Pulsar 150', slug: 'pulsar-150', type: 'MOTORCYCLE', yearFrom: 2005 },
  { id: 102, brandId: 1, name: 'Pulsar 220F', slug: 'pulsar-220f', type: 'MOTORCYCLE', yearFrom: 2008 },
  { id: 103, brandId: 1, name: 'Avenger 220', slug: 'avenger-220', type: 'MOTORCYCLE', yearFrom: 2010 },
  { id: 104, brandId: 1, name: 'Discover 125', slug: 'discover-125', type: 'MOTORCYCLE', yearFrom: 2011 },
  { id: 105, brandId: 1, name: 'Boxer BM 150', slug: 'boxer-bm-150', type: 'MOTORCYCLE', yearFrom: 2009 },
  { id: 106, brandId: 1, name: 'RE Compact 4S / Tuk Tuk', slug: 're-compact-tuk-tuk', type: 'TUKTUK', yearFrom: 2008 },
  { id: 107, brandId: 1, name: 'Maxima Cargo / Diesel', slug: 'maxima-cargo', type: 'TUKTUK', yearFrom: 2012 },

  // TVS Models
  { id: 201, brandId: 2, name: 'Apache RTR 160 4V', slug: 'apache-rtr-160-4v', type: 'MOTORCYCLE', yearFrom: 2018 },
  { id: 202, brandId: 2, name: 'Apache RTR 200 4V', slug: 'apache-rtr-200-4v', type: 'MOTORCYCLE', yearFrom: 2016 },
  { id: 203, brandId: 2, name: 'Jupiter 110', slug: 'jupiter-110', type: 'SCOOTER', yearFrom: 2013 },
  { id: 204, brandId: 2, name: 'Jupiter 125', slug: 'jupiter-125', type: 'SCOOTER', yearFrom: 2021 },
  { id: 205, brandId: 2, name: 'Ntorq 125', slug: 'ntorq-125', type: 'SCOOTER', yearFrom: 2018 },
  { id: 206, brandId: 2, name: 'Wego 110', slug: 'wego-110', type: 'SCOOTER', yearFrom: 2010 },

  // Honda Models
  { id: 301, brandId: 3, name: 'Activa 6G', slug: 'activa-6g', type: 'SCOOTER', yearFrom: 2020 },
  { id: 302, brandId: 3, name: 'Activa 125', slug: 'activa-125', type: 'SCOOTER', yearFrom: 2014 },
  { id: 303, brandId: 3, name: 'Shine 125', slug: 'shine-125', type: 'MOTORCYCLE', yearFrom: 2006 },
  { id: 304, brandId: 3, name: 'Unicorn 160', slug: 'unicorn-160', type: 'MOTORCYCLE', yearFrom: 2015 },

  // Yamaha Models
  { id: 401, brandId: 4, name: 'Aerox 155', slug: 'aerox-155', type: 'SCOOTER', yearFrom: 2021 },
  { id: 402, brandId: 4, name: 'RayZR 125', slug: 'rayzr-125', type: 'SCOOTER', yearFrom: 2020 },
  { id: 403, brandId: 4, name: 'FZ-S V3', slug: 'fz-s-v3', type: 'MOTORCYCLE', yearFrom: 2019 },

  // Suzuki Models
  { id: 501, brandId: 5, name: 'Access 125', slug: 'access-125', type: 'SCOOTER', yearFrom: 2016 },
  { id: 502, brandId: 5, name: 'Burgman Street 125', slug: 'burgman-street-125', type: 'SCOOTER', yearFrom: 2018 },
  { id: 503, brandId: 5, name: 'Avenis 125', slug: 'avenis-125', type: 'SCOOTER', yearFrom: 2022 },
  { id: 504, brandId: 5, name: 'Gixxer 150/160', slug: 'gixxer-150-160', type: 'MOTORCYCLE', yearFrom: 2015 },
  { id: 505, brandId: 5, name: 'Gixxer SF 250', slug: 'gixxer-sf-250', type: 'MOTORCYCLE', yearFrom: 2019 },
  { id: 506, brandId: 5, name: 'V-Strom SX 250', slug: 'v-strom-sx-250', type: 'MOTORCYCLE', yearFrom: 2022 },

  // Vespa Models
  { id: 601, brandId: 6, name: 'Vespa VXL 125', slug: 'vespa-vxl-125', type: 'SCOOTER', yearFrom: 2015 },
  { id: 602, brandId: 6, name: 'Vespa VXL 150', slug: 'vespa-vxl-150', type: 'SCOOTER', yearFrom: 2015 },
  { id: 603, brandId: 6, name: 'Vespa Classic / PX 150', slug: 'vespa-classic-px', type: 'SCOOTER', yearFrom: 1995 },

  // Aprilia Models
  { id: 701, brandId: 7, name: 'SR 125', slug: 'sr-125', type: 'SCOOTER', yearFrom: 2018 },
  { id: 702, brandId: 7, name: 'SR 150', slug: 'sr-150', type: 'SCOOTER', yearFrom: 2016 },
  { id: 703, brandId: 7, name: 'SR 160', slug: 'sr-160', type: 'SCOOTER', yearFrom: 2020 },
  { id: 704, brandId: 7, name: 'SR 175', slug: 'sr-175', type: 'SCOOTER', yearFrom: 2023 },

  // Piaggio Models
  { id: 801, brandId: 8, name: 'Ape City Plus Tuk Tuk', slug: 'ape-city-plus', type: 'TUKTUK', yearFrom: 2015 },
  { id: 802, brandId: 8, name: 'Ape Auto DX', slug: 'ape-auto-dx', type: 'TUKTUK', yearFrom: 2016 },

  // Maruti Suzuki Cars (Optional Module)
  { id: 901, brandId: 9, name: 'Swift', slug: 'swift', type: 'CAR', yearFrom: 2018 },
  { id: 902, brandId: 9, name: 'Baleno', slug: 'baleno', type: 'CAR', yearFrom: 2019 },
  { id: 903, brandId: 9, name: 'Brezza', slug: 'brezza', type: 'CAR', yearFrom: 2020 },
  { id: 904, brandId: 9, name: 'Dzire', slug: 'dzire', type: 'CAR', yearFrom: 2018 },
  { id: 905, brandId: 9, name: 'Alto K10', slug: 'alto-k10', type: 'CAR', yearFrom: 2020 },
  { id: 906, brandId: 9, name: 'Ertiga', slug: 'ertiga', type: 'CAR', yearFrom: 2019 },

  // Hyundai Cars
  { id: 1001, brandId: 10, name: 'Creta', slug: 'creta', type: 'CAR', yearFrom: 2020 },
  { id: 1002, brandId: 10, name: 'i20', slug: 'i20', type: 'CAR', yearFrom: 2020 },

  // Kia Cars
  { id: 1101, brandId: 11, name: 'Seltos', slug: 'seltos', type: 'CAR', yearFrom: 2019 },
  { id: 1102, brandId: 11, name: 'Sonet', slug: 'sonet', type: 'CAR', yearFrom: 2020 }
];

export const SEED_CATEGORIES: SeedCategory[] = [
  // Level 1 Categories
  { id: 1, name: 'Engine Parts', slug: 'engine-parts', level: 1, sortOrder: 1, imageUrl: '/images/categories/engine.svg' },
  { id: 2, name: 'Clutch Parts', slug: 'clutch-parts', level: 1, sortOrder: 2, imageUrl: '/images/categories/clutch.svg' },
  { id: 3, name: 'Transmission Parts', slug: 'transmission-parts', level: 1, sortOrder: 3, imageUrl: '/images/categories/transmission.svg' },
  { id: 4, name: 'Brake Parts', slug: 'brake-parts', level: 1, sortOrder: 4, imageUrl: '/images/categories/brakes.svg' },
  { id: 5, name: 'Electrical Parts', slug: 'electrical-parts', level: 1, sortOrder: 5, imageUrl: '/images/categories/electrical.svg' },
  { id: 6, name: 'Suspension Parts', slug: 'suspension-parts', level: 1, sortOrder: 6, imageUrl: '/images/categories/suspension.svg' },
  { id: 7, name: 'Drive Belts & Rollers', slug: 'drive-belts-rollers', level: 1, sortOrder: 7, imageUrl: '/images/categories/belts.svg' },
  { id: 8, name: 'Filters & Intake', slug: 'filters', level: 1, sortOrder: 8, imageUrl: '/images/categories/filters.svg' },
  { id: 9, name: 'Cables & Controls', slug: 'cables', level: 1, sortOrder: 9, imageUrl: '/images/categories/cables.svg' },
  { id: 10, name: 'Body & Fairings', slug: 'body-parts', level: 1, sortOrder: 10, imageUrl: '/images/categories/body.svg' },
  { id: 11, name: 'Bearings & Seals', slug: 'bearings', level: 1, sortOrder: 11, imageUrl: '/images/categories/bearings.svg' },
  { id: 12, name: 'Gaskets & O-Rings', slug: 'gaskets', level: 1, sortOrder: 12, imageUrl: '/images/categories/gaskets.svg' },
  { id: 13, name: 'Piston & Cylinder Kits', slug: 'piston-cylinder', level: 1, sortOrder: 13, imageUrl: '/images/categories/piston.svg' },
  { id: 14, name: 'Tuk Tuk & Three Wheeler Special', slug: 'tuk-tuk-parts', level: 1, sortOrder: 14, imageUrl: '/images/categories/tuktuk.svg' },

  // Level 2 Subcategories
  { id: 101, parentId: 1, name: 'Valves & Camshafts', slug: 'valves-camshafts', level: 2, sortOrder: 1 },
  { id: 102, parentId: 1, name: 'Crankshaft & Connecting Rod', slug: 'crankshaft-conrod', level: 2, sortOrder: 2 },
  { id: 103, parentId: 1, name: 'Oil Pumps & Engine Covers', slug: 'oil-pumps-covers', level: 2, sortOrder: 3 },

  { id: 201, parentId: 2, name: 'Clutch Plates & Friction', slug: 'clutch-plates-friction', level: 2, sortOrder: 1 },
  { id: 202, parentId: 2, name: 'Clutch Housings & Centrifugal Hubs', slug: 'clutch-housings', level: 2, sortOrder: 2 },

  { id: 301, parentId: 3, name: 'Gears & Shift Mechanism', slug: 'gears-shift-mechanism', level: 2, sortOrder: 1 },
  { id: 302, parentId: 3, name: 'Drive Chains & Sprocket Kits', slug: 'chains-sprockets', level: 2, sortOrder: 2 },

  { id: 401, parentId: 4, name: 'Brake Pads & Shoes', slug: 'brake-pads-shoes', level: 2, sortOrder: 1 },
  { id: 402, parentId: 4, name: 'Disc Rotors & Calipers', slug: 'disc-rotors-calipers', level: 2, sortOrder: 2 },
  { id: 403, parentId: 4, name: 'Master Cylinders & Levers', slug: 'master-cylinders', level: 2, sortOrder: 3 },

  { id: 501, parentId: 5, name: 'Ignition & Coils', slug: 'ignition-coils', level: 2, sortOrder: 1 },
  { id: 502, parentId: 5, name: 'Lighting & Indicators', slug: 'lighting-indicators', level: 2, sortOrder: 2 },
  { id: 503, parentId: 5, name: 'Starters & Relays', slug: 'starters-relays', level: 2, sortOrder: 3 },

  { id: 601, parentId: 6, name: 'Front Shock Absorbers & Fork Tubes', slug: 'front-forks', level: 2, sortOrder: 1 },
  { id: 602, parentId: 6, name: 'Rear Shock Absorbers & Monoshocks', slug: 'rear-shockers', level: 2, sortOrder: 2 },

  { id: 701, parentId: 7, name: 'CVT Variator Belts', slug: 'cvt-belts', level: 2, sortOrder: 1 },
  { id: 702, parentId: 7, name: 'Variator Weight Rollers', slug: 'variator-rollers', level: 2, sortOrder: 2 },

  { id: 801, parentId: 8, name: 'Air Filter Elements', slug: 'air-filters', level: 2, sortOrder: 1 },
  { id: 802, parentId: 8, name: 'Oil & Fuel Filters', slug: 'oil-fuel-filters', level: 2, sortOrder: 2 },

  { id: 1301, parentId: 13, name: 'Cylinder Block Assemblies', slug: 'cylinder-block-assemblies', level: 2, sortOrder: 1 },
  { id: 1302, parentId: 13, name: 'Piston Assemblies & Rings', slug: 'piston-rings', level: 2, sortOrder: 2 },

  { id: 1401, parentId: 14, name: 'Tuk Tuk Differential & Axles', slug: 'differential-axles', level: 2, sortOrder: 1 },
  { id: 1402, parentId: 14, name: 'Tuk Tuk Brake & Steering', slug: 'tuktuk-brake-steering', level: 2, sortOrder: 2 },

  // Level 3 Part Types (Specific terminal categories)
  { id: 1001, parentId: 401, name: 'Front Disc Brake Pads', slug: 'front-disc-pads', level: 3, sortOrder: 1 },
  { id: 1002, parentId: 401, name: 'Rear Drum Brake Shoes', slug: 'rear-drum-shoes', level: 3, sortOrder: 2 },
  { id: 1003, parentId: 701, name: 'Kevlar Reinforced CVT Belts', slug: 'kevlar-cvt-belts', level: 3, sortOrder: 1 },
  { id: 1004, parentId: 701, name: 'OEM Standard Drive Belts', slug: 'oem-drive-belts', level: 3, sortOrder: 2 },
  { id: 1005, parentId: 802, name: 'Spin-on Engine Oil Filters', slug: 'spin-on-oil-filters', level: 3, sortOrder: 1 },
  { id: 1006, parentId: 1301, name: 'Complete Bore & Piston Kits', slug: 'bore-piston-kits', level: 3, sortOrder: 1 },
  { id: 1007, parentId: 201, name: 'Cork & Kevlar Friction Discs', slug: 'clutch-friction-discs', level: 3, sortOrder: 1 },
  { id: 1008, parentId: 1401, name: 'Crown Wheel & Pinion Sets', slug: 'crown-wheel-pinion', level: 3, sortOrder: 1 }
];

export const SEED_PARTS: SeedPart[] = [
  // 1. Bajaj Pulsar 150/180 Cylinder Kit
  {
    id: 1,
    partNumber: '36360086',
    altNumbers: ['DH101048', '36DH4001', 'BAJ-CYL-150'],
    name: 'Cylinder Block Kit with Piston & Rings (57mm Bore)',
    slug: 'bajaj-pulsar-150-cylinder-block-kit-36360086',
    categoryId: 1006,
    grade: 'GENUINE',
    description: 'Original OEM Bajaj cylinder block assembly including premium aluminum alloy block, standard 57mm piston, wrist pin, circlips and high-performance ring set. Engineered to factory tolerances for maximum compression, heat dissipation and engine longevity.',
    specs: {
      'Bore Diameter': '57.0 mm',
      'Engine Displacement': '149.5 cc',
      'Material': 'Aluminum Alloy with Cast Iron Sleeve',
      'Stroke': '58.8 mm',
      'Country of Origin': 'India',
      'Packaging': 'Bajaj Genuine Sealed Carton'
    },
    weightKg: 2.85,
    moq: 10,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [101, 104]
  },

  // 2. Bajaj Pulsar Clutch Friction Plate Set
  {
    id: 2,
    partNumber: 'JA541015',
    altNumbers: ['36JA0012', 'FCC-PUL-05', 'JA541021'],
    name: 'Clutch Friction Plate Set (5 Plates)',
    slug: 'bajaj-pulsar-clutch-friction-plate-set-ja541015',
    categoryId: 1007,
    grade: 'GENUINE',
    description: 'Original factory clutch friction disc pack. Engineered with premium cork-paper friction material delivering smooth torque transfer, zero clutch slippage, and optimal heat dissipation under heavy stop-and-go export driving conditions.',
    specs: {
      'Plate Count': 5,
      'Outer Diameter': '119 mm',
      'Teeth Count': 30,
      'Material': 'High-Grade Composite Friction Compound',
      'Grade': 'OEM Genuine Bajaj',
      'Country of Origin': 'India'
    },
    weightKg: 0.42,
    moq: 25,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [101, 102, 103]
  },

  // 3. Suzuki Access 125 & Burgman CVT Belt
  {
    id: 3,
    partNumber: '27601-33G00',
    altNumbers: ['27601-33G00-000', 'BANDO-765-19-28', 'MITSUBOSHI-27601'],
    name: 'CVT Drive V-Belt (Continuous Variable Transmission)',
    slug: 'suzuki-access-125-cvt-drive-belt-27601-33g00',
    categoryId: 1004,
    grade: 'GENUINE',
    description: 'Genuine Suzuki / Bando export grade transmission drive belt for Suzuki Access 125, Burgman Street and Avenis. Features aramid tensile cords and chloroprene rubber compound resisting extreme heat and elongation.',
    specs: {
      'Belt Length': '765 mm',
      'Belt Top Width': '19.2 mm',
      'Tooth Angle': '28 Degrees',
      'Cord Material': 'Aramid / Kevlar Tensile Member',
      'Application': 'Suzuki 125cc Automatic Scooters',
      'Country of Origin': 'India'
    },
    weightKg: 0.22,
    moq: 20,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [501, 502, 503]
  },

  // 4. Suzuki Engine Oil Filter
  {
    id: 4,
    partNumber: '16510-05240',
    altNumbers: ['16510-05240-000', '16510-45H10', 'HF131', 'KN131'],
    name: 'Spin-On / Cartridge Engine Oil Filter Element',
    slug: 'suzuki-gixxer-access-oil-filter-16510-05240',
    categoryId: 1005,
    grade: 'GENUINE',
    description: 'Original equipment engine oil filter element manufactured for Suzuki Access 125, Burgman Street, Gixxer 150, Gixxer 250 SF, and V-Strom SX 250. High-efficiency synthetic blend media traps particles down to 20 microns.',
    specs: {
      'Filtration Rating': '99% @ 20 Microns',
      'Media Type': 'Resin-Impregnated Pleated Cellulose/Synthetic',
      'Outer Diameter': '44 mm',
      'Height': '40 mm',
      'Country of Origin': 'India'
    },
    weightKg: 0.08,
    moq: 50,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [501, 502, 503, 504, 505, 506]
  },

  // 5. TVS Apache RTR 160 4V Front Disc Brake Pads
  {
    id: 5,
    partNumber: 'N9111330',
    altNumbers: ['N9111300', 'KBE-D102', 'EBC-FA197'],
    name: 'Front Disc Brake Pad Set (Non-Asbestos Organic)',
    slug: 'tvs-apache-rtr-front-disc-brake-pads-n9111330',
    categoryId: 1001,
    grade: 'GENUINE',
    description: 'Factory original TVS Motor front brake pad set. Delivers high initial bite, consistent stopping power across all temperature ranges, and minimal rotor scoring. Suitable for Apache RTR 160 4V and Apache RTR 200.',
    specs: {
      'Compound': 'Semi-Metallic Non-Asbestos (NAO)',
      'Position': 'Front Caliper',
      'Friction Coefficient': '0.42μ (Class GG)',
      'Operating Temp': 'Up to 450°C',
      'Country of Origin': 'India'
    },
    weightKg: 0.28,
    moq: 30,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [201, 202]
  },

  // 6. Honda Activa 6G / 125 Drive Belt
  {
    id: 6,
    partNumber: '23100-GCC-771',
    altNumbers: ['23100-KWP-D01', '23100-K93-N01', 'BANDO-S01-002'],
    name: 'Honda Activa 6G / 125 CVT Transmission Drive Belt',
    slug: 'honda-activa-drive-belt-23100-gcc-771',
    categoryId: 1004,
    grade: 'GENUINE',
    description: 'Original Honda Genuine CVT drive belt for Activa 6G and Activa 125 scooters. Manufactured with premium heat-resistant EPDM rubber, engineered for maximum fuel economy and quiet, vibration-free transmission operation.',
    specs: {
      'Top Width': '18.5 mm',
      'Belt Length': '743 mm',
      'Angle': '30 Degrees',
      'Material': 'EPDM Rubber with Polyester Tensile Cord',
      'Grade': 'Honda Genuine Part',
      'Country of Origin': 'India'
    },
    weightKg: 0.19,
    moq: 20,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [301, 302]
  },

  // 7. Vespa VXL 125 / 150 Front Disc Brake Pads
  {
    id: 7,
    partNumber: '1B001156R',
    altNumbers: ['1B001156', 'CM068301', 'SBS-156CT'],
    name: 'Vespa VXL 125 / 150 OEM Front Brake Pad Set',
    slug: 'vespa-vxl-front-brake-pad-set-1b001156r',
    categoryId: 1001,
    grade: 'GENUINE',
    description: 'Authentic Piaggio Vespa export front brake pad kit with backing plates. Formulated specifically for Vespa scooter weight distribution, providing progressive brake feel and ultra-low dust generation.',
    specs: {
      'Thickness': '7.5 mm',
      'Caliper Type': 'Bybre / Heng Tong Single Pin',
      'Compound Type': 'Organic Sintered Carbon Matrix',
      'Grade': 'Piaggio / Vespa Genuine',
      'Country of Origin': 'India'
    },
    weightKg: 0.24,
    moq: 25,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [601, 602, 701, 702]
  },

  // 8. Vespa VXL 125/150 CVT Variator Belt
  {
    id: 8,
    partNumber: '1B001859',
    altNumbers: ['1B001859R', 'MITSUBOSHI-VSP125', '841213'],
    name: 'Vespa VXL 125 / 150 & SXL CVT Drive Belt',
    slug: 'vespa-vxl-cvt-drive-belt-1b001859',
    categoryId: 1004,
    grade: 'GENUINE',
    description: 'Genuine Vespa OEM drive belt designed for smooth acceleration and high top speeds on VXL 125, VXL 150 and Elegante variants. Reinforced side ribs provide optimum sidewall grip without belt flutter.',
    specs: {
      'Dimensions': '815 x 19.5 x 28',
      'Tooth Profile': 'Double Cogged',
      'Application': 'Vespa 125/150cc 3V i-Get & Carburetor Models',
      'Packaging': 'Piaggio Genuine Blister / Box',
      'Country of Origin': 'India'
    },
    weightKg: 0.25,
    moq: 20,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [601, 602]
  },

  // 9. Aprilia SR 150 / 160 CVT Drive Belt
  {
    id: 9,
    partNumber: 'CM273301',
    altNumbers: ['CM273301R', 'BANDO-APR-160', '841299'],
    name: 'Aprilia SR 150 / SR 160 Sport CVT Drive Belt',
    slug: 'aprilia-sr-150-160-cvt-drive-belt-cm273301',
    categoryId: 1003,
    grade: 'GENUINE',
    description: 'High-torque transmission drive belt tuned for Aprilia SR sport scooters. Handles aggressive take-offs and higher RPM bands without slip or glazing.',
    specs: {
      'Width': '20.0 mm',
      'Length': '820 mm',
      'Tensile Member': 'Aramid Heavy-Duty',
      'Country of Origin': 'India'
    },
    weightKg: 0.27,
    moq: 15,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [701, 702, 703, 704]
  },

  // 10. Bajaj RE Tuk Tuk Crown Wheel & Pinion Set
  {
    id: 10,
    partNumber: 'AA101438',
    altNumbers: ['24101438', 'BAJ-TUK-DIFF-01', 'RE-CROWN-PINION'],
    name: 'Bajaj RE Compact Tuk Tuk Differential Crown Wheel & Pinion Set',
    slug: 'bajaj-re-tuk-tuk-differential-crown-wheel-pinion-aa101438',
    categoryId: 1008,
    grade: 'GENUINE',
    description: 'Heavy-duty differential crown wheel and bevel pinion matched gear set for Bajaj RE Compact 4S, 2S, and LPG/CNG three-wheelers. Precision hobbed and carburized steel provides exceptional wear resistance under commercial passenger and cargo hauling.',
    specs: {
      'Crown Wheel Teeth': 31,
      'Pinion Teeth': 8,
      'Gear Ratio': '3.875:1',
      'Material': 'Case-Hardened 20MnCr5 Alloy Steel',
      'Vehicle Fit': 'Bajaj RE Compact 4-Stroke & 2-Stroke Three Wheeler',
      'Country of Origin': 'India'
    },
    weightKg: 3.45,
    moq: 5,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [106, 107]
  },

  // 11. Bajaj RE Tuk Tuk Piston Ring Set STD
  {
    id: 11,
    partNumber: 'BA122001',
    altNumbers: ['BA122002', 'GOETZE-BAJ-RE', 'MAHLE-060-STD'],
    name: 'Bajaj RE 205cc Tuk Tuk Piston Ring Set (Standard Size)',
    slug: 'bajaj-re-tuk-tuk-piston-ring-set-ba122001',
    categoryId: 1302,
    grade: 'GENUINE',
    description: 'Original equipment piston ring kit manufactured by Goetze/Mahle for Bajaj RE 205cc 4-stroke commercial rickshaws. Includes top chrome compression ring, second ductile scraper ring and 3-piece oil control ring pack.',
    specs: {
      'Bore Size': '63.5 mm (STD)',
      'Ring 1 Thickness': '1.2 mm (Chrome Plated)',
      'Ring 2 Thickness': '1.2 mm (Phosphate Coated)',
      'Oil Ring Thickness': '2.5 mm (Expander Type)',
      'Country of Origin': 'India'
    },
    weightKg: 0.06,
    moq: 50,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [106]
  },

  // 12. TVS Jupiter / Ntorq Rear Brake Shoe Set
  {
    id: 12,
    partNumber: 'K6110020',
    altNumbers: ['K6110010', 'ASK-BS-JUP', 'MAKINO-BS-22'],
    name: 'Rear Drum Brake Shoe Set with Return Springs',
    slug: 'tvs-jupiter-ntorq-rear-brake-shoe-set-k6110020',
    categoryId: 1002,
    grade: 'OES',
    description: 'High-performance die-cast aluminum rear brake shoes lined with premium asbestos-free friction material. Engineered with matched high-tensile return springs for rapid release and zero drag.',
    specs: {
      'Drum Diameter': '130 mm',
      'Lining Width': '28 mm',
      'Material': 'High-Pressure Die-Cast Aluminum with Bonded Organic Lining',
      'Grade': 'OES Premium Grade',
      'Country of Origin': 'India'
    },
    weightKg: 0.38,
    moq: 40,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [203, 204, 205, 206]
  },

  // 13. Yamaha Aerox 155 Air Filter
  {
    id: 13,
    partNumber: 'B65-E4451-00',
    altNumbers: ['B65-E4451-01', 'DNA-YAM-AER', 'YAM-FILT-155'],
    name: 'Viscous Paper Air Cleaner Filter Element',
    slug: 'yamaha-aerox-155-air-filter-b65-e4451-00',
    categoryId: 801,
    grade: 'GENUINE',
    description: 'Original Yamaha genuine oil-coated viscous paper air filter for Aerox 155 and Nmax 155 engines. Traps ultra-fine road dust while maintaining optimal air flow for maximum horsepower.',
    specs: {
      'Type': 'Viscous Oil-Impregnated Pleated Cellulose',
      'Application': 'Yamaha 155cc VVA Engines',
      'Service Life': '15,000 km standard export service',
      'Country of Origin': 'India / Indonesia'
    },
    weightKg: 0.22,
    moq: 25,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [401]
  },

  // 14. Maruti Suzuki Swift / Baleno Brake Pad Set (Car Module)
  {
    id: 14,
    partNumber: '55810M68P00',
    altNumbers: ['55810M68P01', 'TVS-GIRLING-M102', 'KBX-SWIFT-2018'],
    name: 'Maruti Suzuki Genuine Front Brake Pad Set (Swift / Baleno / Dzire)',
    slug: 'maruti-suzuki-swift-baleno-front-brake-pads-55810m68p00',
    categoryId: 1001,
    grade: 'GENUINE',
    description: 'Maruti Suzuki Genuine Parts (MSGP) front disc brake pad set. Tested and approved to strict Japanese OEM safety benchmarks. Formulated for silence, long rotor life and stable stopping power.',
    specs: {
      'Position': 'Front Axle Disc Brakes',
      'Vehicle': 'Maruti Suzuki Swift (2018+), Baleno, Dzire',
      'Material': 'Ceramic Low-Metallic Matrix',
      'Shims': 'Anti-Squeal Stainless Shims Included',
      'Country of Origin': 'India'
    },
    weightKg: 1.15,
    moq: 10,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [901, 902, 904]
  },

  // 15. Bajaj Boxer BM 150 Connecting Rod Kit
  {
    id: 15,
    partNumber: 'PF531008',
    altNumbers: ['PF531000', 'DAIDO-BOX-150', 'CON-ROD-BM150'],
    name: 'Heavy Duty Connecting Rod Kit with Needle Roller Bearing',
    slug: 'bajaj-boxer-bm-150-connecting-rod-kit-pf531008',
    categoryId: 102,
    grade: 'AFTERMARKET',
    description: 'High-tensile forged chromoly connecting rod assembly designed for heavy-duty commercial export use on Bajaj Boxer BM 150. Precision-honed big and small ends with silver-plated needle roller cage bearing.',
    specs: {
      'Center-to-Center Length': '104 mm',
      'Big End Diameter': '36 mm',
      'Small End Pin': '15 mm',
      'Bearing Type': 'Silver-Plated High-Speed Needle Bearing',
      'Country of Origin': 'India'
    },
    weightKg: 0.45,
    moq: 20,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
    ],
    fitmentModelIds: [105]
  }
];

export const SEED_USERS = [
  {
    id: 1,
    name: 'Admin Alisons',
    email: 'admin@hastinamotorparts.com',
    passwordHash: '$2a$10$wTfk1w3UqQ0oF9s5C0H/8e9B7y4K5J3Z1D2G6A7X8M9P0R1S2T3U4', // Hash for Hastina@2026
    role: 'SUPER_ADMIN' as const,
    isActive: true
  },
  {
    id: 2,
    name: 'Catalogue Specialist',
    email: 'catalogue@hastinamotorparts.com',
    passwordHash: '$2a$10$wTfk1w3UqQ0oF9s5C0H/8e9B7y4K5J3Z1D2G6A7X8M9P0R1S2T3U4',
    role: 'CATALOGUE' as const,
    isActive: true
  },
  {
    id: 3,
    name: 'Export Sales Desk',
    email: 'sales@hastinamotorparts.com',
    passwordHash: '$2a$10$wTfk1w3UqQ0oF9s5C0H/8e9B7y4K5J3Z1D2G6A7X8M9P0R1S2T3U4',
    role: 'SALES' as const,
    isActive: true
  }
];

export const SEED_BANNERS = [
  {
    id: 1,
    title: 'Motorcycle • Scooter • Tuk Tuk Spare Parts',
    subtitle: 'From India to the World — Your Reliable Export Partner',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=85',
    link: '/parts',
    sortOrder: 1,
    isActive: true
  },
  {
    id: 2,
    title: 'Genuine OEM & Quality Aftermarket Solutions',
    subtitle: 'Bajaj • TVS • Honda • Yamaha • Suzuki • Vespa • Aprilia • Piaggio',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1920&q=85',
    link: '/brands',
    sortOrder: 2,
    isActive: true
  },
  {
    id: 3,
    title: 'Supplying Wholesalers Worldwide',
    subtitle: 'Middle East • Africa • Asia • Europe • South America',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1920&q=85',
    link: '/markets',
    sortOrder: 3,
    isActive: true
  }
];

export const SEED_SITE_SETTINGS: Record<string, string> = {
  company_name: 'ALISONS GENERAL TRADING LLP',
  brand_name: 'Hastina Motor Parts',
  website: 'www.hastinamotorparts.com',
  tagline: 'Motorcycle • Scooter • Tuk Tuk Spare Parts — From India to the World',
  address: 'Unit No. 43, Ground Floor, Living Style Mall, Jasola, New Delhi – 110025, India',
  phone: '+91 98110 00000',
  whatsapp: '919811000000',
  email: 'sales@hastinamotorparts.com',
  info_email: 'info@hastinamotorparts.com',
  enable_car_parts: 'true',
  working_hours: 'Mon - Sat: 9:30 AM – 6:30 PM (IST)'
};

export const SEED_PAGES = [
  {
    slug: 'about',
    title: 'About ALISONS GENERAL TRADING LLP',
    body: `Alisons General Trading LLP is an India-based exporter and supplier of automotive spare parts, specializing in motorcycles, scooters, tuk-tuks / three-wheelers, and selected car spare parts. We supply genuine, original, and high-quality aftermarket spare parts to customers worldwide.

Our sourcing network in India enables us to offer a wide range of products at competitive export prices. Our product portfolio covers leading brands including Suzuki, Hyundai, Kia, Bajaj, TVS, Honda, Yamaha, Vespa, Aprilia, and Piaggio.

We work with importers, wholesalers, distributors, retailers, workshops, and spare-parts dealers across the Middle East, Africa, Asia, Europe, and South America, with a strong focus on markets such as Iraq, UAE, Saudi Arabia, Iran, Afghanistan, Turkey, Libya, Algeria, Ghana, Angola, Senegal, South Africa, and Argentina.

Send us your part numbers or requirements today for availability and competitive export pricing.`
  },
  {
    slug: 'markets',
    title: 'Our International Export Markets',
    body: `We supply automotive spare parts to customers across:
- **Middle East:** Iraq, UAE, Saudi Arabia, Iran
- **Africa:** Ghana, Angola, Senegal, South Africa, Libya, Algeria
- **Asia:** Afghanistan, Turkey, and neighboring regions
- **Europe & South America:** Argentina and expanding global territories

We handle export documentation, container stuffing coordination, seaworthy and air-cargo export packaging, and transparent lead times.`
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions (FAQ)',
    body: `### 1. How do I request a quotation?
Browse parts by Brand, Model, or Part Number. Click "Add to Enquiry" with the required quantity. Once ready, visit your Enquiry List and submit your details. You will receive an instant Reference Number (ENQ-YYYY-XXXXXX) and our export desk will reply within 24 hours.

### 2. Can I submit a custom parts list or Excel sheet?
Yes! Use our "Quick Enquiry" tool on the Enquiry page to paste a list of part numbers with quantities, or upload your Excel/PDF requirements file.

### 3. What is the difference between Genuine, OES, and Aftermarket?
- **Genuine:** Official OEM factory-boxed parts (e.g. Bajaj Genuine, Suzuki Genuine, Honda Genuine).
- **OES (Original Equipment Supplier):** Produced by the tier-1 manufacturers who make parts for the assembly line (e.g., Bosch, FCC, Bando, Gabriel, ASK, Goetze) in their own packaging.
- **Aftermarket:** Quality-certified replacement parts manufactured to match OEM dimensions and reliability at competitive export price points.

### 4. What are your Minimum Order Quantities (MOQ)?
MOQ varies by part category. Most small components have an MOQ of 10-50 pieces, while complete assemblies like cylinder kits, crankshafts, or differential gear sets have lower MOQs.

### 5. What shipping terms do you support?
We support FOB (Nhava Sheva, Mundra, Delhi ICD/Air Cargo), CIF, and CFR worldwide.`
  },
  {
    slug: 'terms',
    title: 'Export Terms & Conditions',
    body: `1. **Quotations:** All export quotations are provided in USD or AED and remain valid for 15 days unless otherwise specified.
2. **Orders:** Commercial export proforma invoices are issued upon quotation confirmation.
3. **Packaging:** All goods are packed in heavy-duty sea-worthy export corrugated cartons with inner moisture barrier and palletization options.
4. **Inspection:** Pre-shipment inspection is welcomed prior to container loading.`
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    body: `ALISONS GENERAL TRADING LLP values your confidentiality. Contact information, enquiry specifications, and business documents submitted through hastinamotorparts.com are solely utilized for preparing export quotations and customer communication. We do not sell or disclose customer information to third parties.`
  }
];
