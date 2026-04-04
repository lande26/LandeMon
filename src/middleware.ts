import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

// Export NextAuth middleware
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protect /profile and /bookmarks and /party routes
  const protectedRoutes = ["/profile", "/bookmarks", "/party"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/home", req.nextUrl));
  }
})

// Configure the paths where this middleware runs
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
