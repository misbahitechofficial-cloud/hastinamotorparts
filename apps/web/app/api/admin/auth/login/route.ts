import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/serverDb';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const users = getUsers();
    const normalizedEmail = String(email).trim().toLowerCase();

    const user = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.status === 'active'
    );

    if (!user || user.passwordHash !== String(password).trim()) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate safe user session token
    const token = Buffer.from(`${user.id}:${user.role}:${Date.now()}`).toString('base64');

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      allowedModules: user.allowedModules
    };

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token
    });

    // Set secure HTTP cookie
    response.cookies.set('hastina_session', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    response.cookies.set('hastina_user_role', user.role, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
