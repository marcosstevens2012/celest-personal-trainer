import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If there's a token, the user is authenticated
        if (token) return true;

        // Allow access to auth pages
        if (req.nextUrl.pathname.startsWith("/auth")) return true;

        // Deny access to protected pages
        return false;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
