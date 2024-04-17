import NextAuth from 'next-auth';

import authConfig from '@/auth.config';

import {
  Routes,
  apiAuthPrefix,
  authRoutes,
  protectedRoutes,
  publicRoutes,
} from './routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return;

  if (isAuthRoute || isProtectedRoute) {
    if (isLoggedIn) {
      if (!!req.auth) {
        try {
          const redirectUrl = new URL(
            `${Routes.org}/${req.auth.activeOrg.id}`,
            nextUrl,
          );
          return Response.redirect(redirectUrl);
        } catch (error) {
          console.error('Failed to construct redirect URL:', error);
          // Redirect to a default page or error page
          return Response.redirect(new URL(Routes.auth.error, nextUrl));
        }
      }
    }

    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(
        `${Routes.auth.login}?callbackUrl=${encodedCallbackUrl}`,
        nextUrl,
      ),
    );
  }

  return;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
