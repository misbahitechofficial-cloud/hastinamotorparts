import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/serverDb';

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

// GET /api/admin/settings
export async function GET(req: NextRequest) {
  const role = getUserRole(req);
  if (!role || (role !== 'SUPER_ADMIN' && role !== 'MANAGER')) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin or Manager role required' }, { status: 403 });
  }

  const settings = getSiteSettings();
  return NextResponse.json({ success: true, settings });
}

// PUT /api/admin/settings (Super Admin only)
export async function PUT(req: NextRequest) {
  const role = getUserRole(req);
  if (role !== 'SUPER_ADMIN') {
    return NextResponse.json({ success: false, error: 'Forbidden: Only Super Admin can change site settings' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = saveSiteSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
