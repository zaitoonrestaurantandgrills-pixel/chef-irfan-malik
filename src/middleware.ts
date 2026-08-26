import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;

  // ── Public Admin Auth Routes ──────────────────────────────────────
  const isAdminAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/forgot-password';

  if (isAdminAuthPage) {
    if (isLoggedIn && (role === 'ADMIN' || role === 'SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // ── Protected Admin Routes (/admin/*) ─────────────────────────────
  if (pathname.startsWith('/admin')) {
    // 1. Must be logged in
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Must be ADMIN or SUPER_ADMIN
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // 3. User Management (/admin/users) is strictly restricted to SUPER_ADMIN
    if (pathname.startsWith('/admin/users') && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // ── Customer Protected Routes ─────────────────────────────────────
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/my-recipes') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/checkout')
  ) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Customer Auth Pages (/login & /register) ──────────────────────
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
