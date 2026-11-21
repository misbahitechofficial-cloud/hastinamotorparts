import fs from 'fs';
import path from 'path';

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'MANAGER' | 'EDITOR';
  status: 'active' | 'suspended';
  passwordHash: string; // Plain/SHA/Bcrypt for server auth
  allowedModules: string[];
  createdAt: string;
}

export interface SiteSettingsRecord {
  company_name: string;
  brand_trade_name: string;
  website: string;
  official_email: string;
  sales_email: string;
  phone: string;
  whatsapp: string;
  address: string;
  gstin_iec: string;
  working_hours: string;
}

export interface RfqEnquiryRecord {
  id: string;
  customerName: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  type: string;
  message?: string;
  items: Array<{
    partNumber: string;
    name: string;
    quantity: number;
  }>;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'CLOSED';
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 1. Users DB
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'usr_admin_01',
    email: 'admin@hastinamotorparts.in',
    name: 'Alisons Executive Admin',
    role: 'SUPER_ADMIN',
    status: 'active',
    passwordHash: 'Admin@Hastina2026',
    allowedModules: [
      'dashboard',
      'parts',
      'brands',
      'categories',
      'enquiries',
      'import',
      'analytics',
      'users',
      'settings'
    ],
    createdAt: '2026-11-21T00:00:00.000Z'
  },
  {
    id: 'usr_mgr_02',
    email: 'manager@hastinamotorparts.in',
    name: 'Export Sales Manager',
    role: 'MANAGER',
    status: 'active',
    passwordHash: 'Manager@Hastina2026',
    allowedModules: [
      'dashboard',
      'parts',
      'brands',
      'categories',
      'enquiries',
      'import',
      'analytics'
    ],
    createdAt: '2026-11-21T00:00:00.000Z'
  },
  {
    id: 'usr_edit_03',
    email: 'editor@hastinamotorparts.in',
    name: 'Technical Catalogue Editor',
    role: 'EDITOR',
    status: 'active',
    passwordHash: 'Editor@Hastina2026',
    allowedModules: [
      'dashboard',
      'parts',
      'brands',
      'categories'
    ],
    createdAt: '2026-11-21T00:00:00.000Z'
  }
];

export function getUsers(): AdminUserRecord[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(INITIAL_USERS, null, 2), 'utf-8');
    return INITIAL_USERS;
  }
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: AdminUserRecord[]): void {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// 2. Settings DB
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

const INITIAL_SETTINGS: SiteSettingsRecord = {
  company_name: 'Alisons General Trading LLP',
  brand_trade_name: 'Hastina Motor Parts',
  website: 'www.hastinamotorparts.in',
  official_email: 'contect@hastinamotorparts.in',
  sales_email: 'contect@hastinamotorparts.in',
  phone: '+91 97178 29768',
  whatsapp: '919717829768',
  address: 'Unit No. 43, Ground Floor, Living Style Mall, Jasola, New Delhi – 110025, India',
  gstin_iec: 'LLP-IN / Registered Exporter',
  working_hours: 'Monday – Saturday: 9:00 AM – 7:00 PM (IST)'
};

export function getSiteSettings(): SiteSettingsRecord {
  ensureDataDir();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(INITIAL_SETTINGS, null, 2), 'utf-8');
    return INITIAL_SETTINGS;
  }
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveSiteSettings(settings: Partial<SiteSettingsRecord>): SiteSettingsRecord {
  ensureDataDir();
  const current = getSiteSettings();
  const updated = { ...current, ...settings };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// 3. Enquiries DB
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

const INITIAL_ENQUIRIES: RfqEnquiryRecord[] = [
  {
    id: 'RFQ-20261120-001',
    customerName: 'Tariq Al-Mansoor',
    company: 'Gulf Motor Supplies LLC',
    country: 'United Arab Emirates',
    email: 'procurement@gulfmotorspares.ae',
    phone: '+971 52 984 1120',
    type: 'Wholesale Supply',
    message: 'Urgent inquiry for 2025 Suzuki Access & Bajaj RE 4-Stroke components.',
    items: [
      { partNumber: '39 1013 21', name: "'O' ring (Engine Crankcase)", quantity: 200 },
      { partNumber: '11170-02L10-000', name: 'COVER, CYLINDER HEAD', quantity: 50 },
      { partNumber: 'AA 1017 13', name: 'Engine assly. comp.', quantity: 10 }
    ],
    status: 'NEW',
    createdAt: '2026-11-20T14:30:00.000Z'
  },
  {
    id: 'RFQ-20261119-002',
    customerName: 'Kwame Mensah',
    company: 'Accra Auto Fleet Distributors',
    country: 'Ghana',
    email: 'k.mensah@accraparts.com',
    phone: '+233 24 555 8901',
    type: 'Export Order',
    message: 'Seeking container shipment of Bajaj Boxer BM150 cylinder assemblies and valves.',
    items: [
      { partNumber: '36 AN00 14', name: 'Ring set piston CNG / Petrol', quantity: 500 },
      { partNumber: 'AN 1014 18', name: 'Valve - intake', quantity: 400 }
    ],
    status: 'QUOTED',
    createdAt: '2026-11-19T09:15:00.000Z'
  }
];

export function getEnquiries(): RfqEnquiryRecord[] {
  ensureDataDir();
  if (!fs.existsSync(ENQUIRIES_FILE)) {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(INITIAL_ENQUIRIES, null, 2), 'utf-8');
    return INITIAL_ENQUIRIES;
  }
  try {
    const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_ENQUIRIES;
  }
}

export function saveEnquiry(enquiry: Omit<RfqEnquiryRecord, 'id' | 'createdAt'>): RfqEnquiryRecord {
  ensureDataDir();
  const current = getEnquiries();
  const id = `RFQ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const record: RfqEnquiryRecord = {
    ...enquiry,
    id,
    createdAt: new Date().toISOString()
  };
  current.unshift(record);
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(current, null, 2), 'utf-8');
  return record;
}

export function updateEnquiryStatus(id: string, status: RfqEnquiryRecord['status']): boolean {
  ensureDataDir();
  const list = getEnquiries();
  const item = list.find((e) => e.id === id);
  if (!item) return false;
  item.status = status;
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return true;
}
