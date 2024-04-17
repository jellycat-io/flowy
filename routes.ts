/**
 * An array of routes that are public and do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ['/', '/auth/email-verification'];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to `/settings`.
 * @type {string[]}
 */
export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/forgot-password',
  '/auth/reset-password',
];

/**
 * An array of routes that are protected and require authentication.
 * @type {string[]}
 */
export const protectedRoutes = ['/org'];

/**
 * The prefix for api authentication routes.
 * Routes that starts with this prefix are used for API authentication process.
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * Routes for the application.
 * @type {Object}
 */
export const Routes = {
  org: '/org',
  landing: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    error: '/auth/error',
    forgotPassword: '/auth/forgot-password',
    emailVerification: '/auth/email-verification',
    resetPassword: '/auth/reset-password',
  },
};
