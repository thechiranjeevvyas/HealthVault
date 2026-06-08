import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public routes
  const isPublicRoute = path === "/login";
  
  const sessionCookie = request.cookies.get("healthvault_session");
  let isSessionValid = false;
  
  if (sessionCookie) {
    const [status, timestampStr] = sessionCookie.value.split(":");
    if (status === "unlocked") {
      const timestamp = parseInt(timestampStr, 10);
      const SESSION_DURATION = 8 * 60 * 60 * 1000;
      if (!isNaN(timestamp) && Date.now() - timestamp <= SESSION_DURATION) {
        isSessionValid = true;
      }
    }
  }

  // Redirect to login if accessing protected route without valid session
  if (!isPublicRoute && !isSessionValid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if accessing login with valid session
  if (isPublicRoute && isSessionValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
