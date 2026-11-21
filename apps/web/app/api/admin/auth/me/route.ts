import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/serverDb';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('hastina_session')?.value;
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');

    const token = sessionCookie || authHeader;
    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId] = decoded.split(':');
      const users = getUsers();
      const user = users.find((u) => u.id === userId && u.status === 'active');

      if (!user) {
        return NextResponse.json({ success: false, user: null }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          allowedModules: user.allowedModules
        }
      });
    } catch {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
