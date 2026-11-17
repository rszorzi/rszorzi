export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/boards/:path*',
    '/teams/:path*',
    '/settings/:path*',
    '/integrations/:path*',
    '/subscriptions/:path*',
  ],
};
