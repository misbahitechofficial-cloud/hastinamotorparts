import { NextRequest, NextResponse } from 'next/server';
import { CATALOGUE_DB, getCatalogueBrands } from '@/lib/embeddedCatalogue';
import fs from 'fs';
import path from 'path';

const OVERRIDES_FILE = path.join(process.cwd(), 'data', 'parts_overrides.json');

interface PartOverride {
  id: string; // or partNo
  partNo: string;
  name: string;
  fig: string;
  category: string;
  qty: string;
  refNo: string;
  brand: string;
  modelCode: string;
  modelLabel: string;
  img?: string;
  isDeleted?: boolean;
}

function getOverrides(): Record<string, PartOverride> {
  try {
    if (fs.existsSync(OVERRIDES_FILE)) {
      return JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf-8'));
    }
  } catch {
    // ignore
  }
  return {};
}

function saveOverrides(overrides: Record<string, PartOverride>) {
  const dir = path.dirname(OVERRIDES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(overrides, null, 2), 'utf-8');
}

function getUserRole(req: NextRequest): string | null {
  const token = req.cookies.get('hastina_session')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [, role] = decoded.split(':');
    return role || null;
  } catch {
    return null;
  }
}

// GET /api/admin/parts - List catalogue parts with pagination & search
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const brand = searchParams.get('brand') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));

    const overrides = getOverrides();

    // Map base catalogue
    let allParts = CATALOGUE_DB.r.map((row, idx) => {
      const m = CATALOGUE_DB.m[row[0]];
      const key = `${m.code}_${row[3]}_${row[1]}`;
      const over = overrides[key];

      if (over?.isDeleted) return null;

      return {
        id: idx + 1,
        key,
        modelCode: over?.modelCode || m.code,
        modelLabel: over?.modelLabel || m.label,
        brand: over?.brand || m.brand,
        fig: over?.fig || row[1],
        category: over?.category || CATALOGUE_DB.c[row[2]],
        partNumber: over?.partNo || row[3],
        name: over?.name || row[4],
        qty: over?.qty || String(row[5] || '1'),
        refNo: over?.refNo || String(row[6] || ''),
        img: over?.img || String(row[7] || ''),
        grade: 'GENUINE',
        moq: parseInt(over?.qty || String(row[5] || '1'), 10) || 1
      };
    }).filter(Boolean) as any[];

    // Add any newly created custom parts
    Object.values(overrides).forEach((op) => {
      if (!op.isDeleted && op.id?.startsWith('custom_')) {
        allParts.unshift({
          id: op.id,
          key: op.id,
          modelCode: op.modelCode,
          modelLabel: op.modelLabel,
          brand: op.brand,
          fig: op.fig,
          category: op.category,
          partNumber: op.partNo,
          name: op.name,
          qty: op.qty,
          refNo: op.refNo,
          img: op.img || '',
          grade: 'GENUINE',
          moq: parseInt(op.qty, 10) || 1
        });
      }
    });

    // Filter
    if (brand && brand !== 'ALL') {
      allParts = allParts.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (q) {
      allParts = allParts.filter((p) =>
        p.partNumber.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fig.toLowerCase().includes(q) ||
        p.modelLabel.toLowerCase().includes(q)
      );
    }

    const total = allParts.length;
    const start = (page - 1) * limit;
    const items = allParts.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/admin/parts - Add new part (Admin, Manager, Editor)
export async function POST(req: NextRequest) {
  const role = getUserRole(req);
  // Allowed for SUPER_ADMIN, MANAGER, EDITOR

  try {
    const body = await req.json();
    const { partNumber, name, fig, category, qty, refNo, brand, modelLabel, img } = body;

    if (!partNumber || !name) {
      return NextResponse.json({ success: false, error: 'Part Number and Name are required' }, { status: 400 });
    }

    const overrides = getOverrides();
    const id = `custom_${Date.now()}`;
    const newPart: PartOverride = {
      id,
      partNo: String(partNumber).trim(),
      name: String(name).trim(),
      fig: String(fig || 'PLATE 1').trim(),
      category: String(category || 'General Components').trim(),
      qty: String(qty || '1'),
      refNo: String(refNo || '1'),
      brand: String(brand || 'Universal').trim(),
      modelCode: 'CUSTOM',
      modelLabel: String(modelLabel || 'Export Genuine').trim(),
      img: img || ''
    };

    overrides[id] = newPart;
    saveOverrides(overrides);

    return NextResponse.json({ success: true, part: newPart });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/admin/parts - Update part (Admin, Manager, Editor)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, partNumber, name, fig, category, qty, refNo, brand, modelLabel, img } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: 'Part identifier key is required' }, { status: 400 });
    }

    const overrides = getOverrides();
    const current = overrides[key] || {
      id: key,
      partNo: partNumber,
      name,
      fig,
      category,
      qty,
      refNo,
      brand: brand || 'Export',
      modelCode: 'MOD',
      modelLabel: modelLabel || 'Export Part',
      img: img || ''
    };

    if (partNumber) current.partNo = String(partNumber).trim();
    if (name) current.name = String(name).trim();
    if (fig) current.fig = String(fig).trim();
    if (category) current.category = String(category).trim();
    if (qty) current.qty = String(qty).trim();
    if (refNo) current.refNo = String(refNo).trim();
    if (img !== undefined) current.img = img;

    overrides[key] = current;
    saveOverrides(overrides);

    return NextResponse.json({ success: true, part: current });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/parts - Delete part (Admin & Manager only; Editor forbidden!)
export async function DELETE(req: NextRequest) {
  const role = getUserRole(req);
  if (role === 'EDITOR') {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Content Editors cannot delete parts. Please request Manager or Admin.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ success: false, error: 'Part key is required' }, { status: 400 });
    }

    const overrides = getOverrides();
    if (overrides[key]) {
      overrides[key].isDeleted = true;
    } else {
      overrides[key] = {
        id: key,
        partNo: key,
        name: '',
        fig: '',
        category: '',
        qty: '1',
        refNo: '',
        brand: '',
        modelCode: '',
        modelLabel: '',
        isDeleted: true
      };
    }
    saveOverrides(overrides);

    return NextResponse.json({ success: true, message: 'Part deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
