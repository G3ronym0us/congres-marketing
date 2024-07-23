import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`Middleware called for path: ${pathname}`);

  if (pathname === "/admin/auth") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token");
    
    if (!token) {
      console.log("No token found, redirecting to /admin/auth");
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }

    try {
      await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET));
      console.log("Token verified successfully");
      return NextResponse.next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
  }

  return NextResponse.next();
}

// Asegúrate de que el middleware solo se aplique a las rutas que deseas proteger
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}