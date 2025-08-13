import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRoleFromDb, checkRoleFromDb } from './utils/roles';

const isPublicRoute = createRouteMatcher([
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/reset-password',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isCompletionRoute = createRouteMatcher(['/completion(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, redirectToSignIn } = await auth();

  if (isPublicRoute(req)) {
    console.log('Public route, skipping middleware:', req.nextUrl.pathname);
    return NextResponse.next();
  }

  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId && req.nextUrl.pathname === '/') {
    const role = await getRoleFromDb(userId);
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    } else if (role === 'completion') {
      return NextResponse.redirect(new URL('/completion', req.url));
    } else {
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }
  }

  if (isAdminRoute(req) && userId) {
    const isAdmin = await checkRoleFromDb(userId, 'admin');
    if (!isAdmin) {
      const role = await getRoleFromDb(userId);
      const redirectPath = role === 'completion' ? '/completion' : '/';
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
  }

  if (isCompletionRoute(req) && userId) {
    const isCompletion = await checkRoleFromDb(userId, 'completion');
    if (!isCompletion) {
      const role = await getRoleFromDb(userId);
      const redirectPath = role === 'admin' ? '/admin/dashboard' : '/';
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
