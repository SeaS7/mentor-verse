import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/', '/verify/:path*', '/payment/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect authenticated users away from login, register, or verify pages
  if (token && (url.pathname.startsWith('/login') || url.pathname.startsWith('/register') || url.pathname.startsWith('/verify'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users trying to access any /payment page
  if (!token && url.pathname.startsWith('/payment')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
