import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`Middleware called for path: ${pathname}`);

  // No aplicar el middleware a la ruta de autenticación
  if (pathname === "/admin/auth") {
    return NextResponse.next();
  }

  // Aplicar el middleware solo a rutas administrativas
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token");
    
    if (!token) {
      console.log("No token found, redirecting to /admin/auth");
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }

    try {
      // Verifica el token
      // Asegúrate de reemplazar 'tu_secreto' con tu clave secreta real
      await jwtVerify(token.value, new TextEncoder().encode('tu_secreto'));
      console.log("Token verified successfully");
      return NextResponse.next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
  }

  // Para todas las demás rutas, simplemente continúa
  return NextResponse.next();
}

// Asegúrate de que el middleware solo se aplique a las rutas que deseas proteger
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}