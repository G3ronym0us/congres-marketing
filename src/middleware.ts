import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Verifica el JWT de la cookie. Devuelve true solo si es válido y no expiró.
async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("token");
  if (!token) return false;
  try {
    await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const loggedIn = await hasValidSession(request);

  // La pantalla de login no debe ser accesible si ya hay sesión: se envía al panel.
  if (pathname === "/admin/auth") {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Resto de /admin requiere sesión válida.
  if (!loggedIn) {
    return NextResponse.redirect(new URL("/admin/auth", request.url));
  }

  return NextResponse.next();
}

// Asegúrate de que el middleware solo se aplique a las rutas que deseas proteger
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}