// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Log the request path
  console.log(`Incoming request: ${request.nextUrl.pathname}`);

  // 2. Example: Redirect an old path to a new one
  if (request.nextUrl.pathname === '/old-page') {
    console.log('Redirecting from /old-page to /new-page');
    return NextResponse.redirect(new URL('/new-page', request.url));
  }

  // 3. Example: Add a custom header to all requests
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'Hello from Middleware!');

  return response;
}

// 4. Configure the matcher to specify which paths the middleware should run on
// ... existing code ...

export const config = {
    matcher: [
      // Match the specific /old-page so the redirect can trigger
      '/old-page',
      // Also match all API routes and all root-level pages
      // You can adjust this regex to match more specific parts of your app if needed
      '/api/:path*',
      '/',
      '/users/:path*',
      // General matcher for other pages, excluding static files etc.
      // This will ensure the 'X-Custom-Header' is applied to other pages too.
      '/((?!_next/static|_next/image|favicon.ico|images).*)',
    ],
  };