export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/profile/:path*',
    '/swaps/:path*',
    '/session/:path*',
    '/dashboard/:path*',
  ],
};
