import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Your custom authorization logic
    const pathname = req.nextUrl.pathname

    // Allow access to specific paths without authentication
    if (
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/_next/static") ||
      pathname.startsWith("/_next/image") ||
      pathname === "/favicon.ico" ||
      pathname.startsWith("/auth/signin")
    ) {
      return NextResponse.next()
    }

    // For protected routes, just verify token exists (allowing any authenticated user)
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow any authenticated user (from any Microsoft tenant)
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - Static files
     * - Auth pages
     * - API auth routes
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|auth/signin).*)",
  ],
}
