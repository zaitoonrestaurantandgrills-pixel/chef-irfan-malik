import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session;
  const role = session?.user?.role;

  // ── Admin routes — require ADMIN or SUPER_ADMIN ─────────────────
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login?callbackUrl=/admin', req.url));
    }
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // ── Dashboard routes — require any authenticated user ───────────
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/my-recipes') || pathname.startsWith('/profile')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url));
    }
  }

  // ── Checkout routes — require authentication ────────────────────
  if (pathname.startsWith('/checkout')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url));
    }
  }

  // ── Redirect logged-in users away from auth pages ───────────────
  if ((pathname === '/login' || pathname === '/register') && isLoggedIn) {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/my-recipes/:path*',
    '/profile/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
  ],
};
