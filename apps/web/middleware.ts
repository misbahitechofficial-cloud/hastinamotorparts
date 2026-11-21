import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Skip static assets, API calls, diagrams and favicon
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/diagrams') ||
    url.pathname.startsWith('/images') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // admin.hastinamotorparts.in => /admin
  if (hostname.startsWith('admin.') && !url.pathname.startsWith('/admin')) {
    url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // manager.hastinamotorparts.in => /admin
  if (hostname.startsWith('manager.') && !url.pathname.startsWith('/admin')) {
    url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // editor.hastinamotorparts.in => /admin/parts
  if (hostname.startsWith('editor.') && !url.pathname.startsWith('/admin')) {
    url.pathname = `/admin/parts${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
