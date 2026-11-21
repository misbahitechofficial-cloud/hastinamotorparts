import { NextRequest, NextResponse } from 'next/server';
import { getUsers, saveUsers, AdminUserRecord } from '@/lib/serverDb';

function verifyAdmin(req: NextRequest): boolean {
  const token = req.cookies.get('hastina_session')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, role] = decoded.split(':');
    return role === 'SUPER_ADMIN';
  } catch {
    return false;
  }
}

// GET /api/admin/users - List team users (Super Admin only)
export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const users = getUsers().map(({ passwordHash, ...rest }) => ({
    ...rest,
    hasPassword: !!passwordHash
  }));

  return NextResponse.json({ success: true, users });
}

// POST /api/admin/users - Create new team user (Super Admin only)
export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const { email, name, role, password } = await req.json();

    if (!email || !name || !role || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());
    if (existing) {
      return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 400 });
    }

    const allowedModulesMap: Record<string, string[]> = {
      SUPER_ADMIN: ['dashboard', 'parts', 'brands', 'categories', 'enquiries', 'import', 'analytics', 'users', 'settings'],
      MANAGER: ['dashboard', 'parts', 'brands', 'categories', 'enquiries', 'import', 'analytics'],
      EDITOR: ['dashboard', 'parts', 'brands', 'categories']
    };

    const newUser: AdminUserRecord = {
      id: `usr_${Date.now()}`,
      email: String(email).trim().toLowerCase(),
      name: String(name).trim(),
      role: role as 'SUPER_ADMIN' | 'MANAGER' | 'EDITOR',
      status: 'active',
      passwordHash: String(password).trim(),
      allowedModules: allowedModulesMap[role] || allowedModulesMap.EDITOR,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    const { passwordHash, ...safe } = newUser;
    return NextResponse.json({ success: true, user: safe });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/admin/users - Update user role or password (Super Admin only)
export async function PUT(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const { id, name, role, password, status } = await req.json();
    const users = getUsers();
    const user = users.find((u) => u.id === id);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (name) user.name = String(name).trim();
    if (role) {
      user.role = role;
      const allowedModulesMap: Record<string, string[]> = {
        SUPER_ADMIN: ['dashboard', 'parts', 'brands', 'categories', 'enquiries', 'import', 'analytics', 'users', 'settings'],
        MANAGER: ['dashboard', 'parts', 'brands', 'categories', 'enquiries', 'import', 'analytics'],
        EDITOR: ['dashboard', 'parts', 'brands', 'categories']
      };
      user.allowedModules = allowedModulesMap[role] || user.allowedModules;
    }
    if (password && String(password).trim()) {
      user.passwordHash = String(password).trim();
    }
    if (status) user.status = status;

    saveUsers(users);
    const { passwordHash, ...safe } = user;
    return NextResponse.json({ success: true, user: safe });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/users - Remove team user
export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (id === 'usr_admin_01') {
      return NextResponse.json({ success: false, error: 'Cannot delete primary root administrator' }, { status: 400 });
    }

    const users = getUsers().filter((u) => u.id !== id);
    saveUsers(users);

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
