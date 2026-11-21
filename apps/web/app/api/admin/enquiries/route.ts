import { NextRequest, NextResponse } from 'next/server';
import { getEnquiries, saveEnquiry, updateEnquiryStatus } from '@/lib/serverDb';

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

// GET /api/admin/enquiries (Super Admin & Manager only; Editor is FORBIDDEN)
export async function GET(req: NextRequest) {
  const role = getUserRole(req);

  if (!role) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Please login' }, { status: 401 });
  }

  if (role === 'EDITOR') {
    return NextResponse.json(
      {
        success: false,
        error: 'Forbidden: Content Editors do not have permission to view customer RFQs and lead data.'
      },
      { status: 403 }
    );
  }

  const enquiries = getEnquiries();
  return NextResponse.json({ success: true, enquiries });
}

// POST /api/admin/enquiries (Can be called from public RFQ basket or admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const enquiry = saveEnquiry(body);
    return NextResponse.json({ success: true, enquiry, refNo: enquiry.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/admin/enquiries (Update RFQ status)
export async function PUT(req: NextRequest) {
  const role = getUserRole(req);
  if (!role || role === 'EDITOR') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id, status } = await req.json();
    const success = updateEnquiryStatus(id, status);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
