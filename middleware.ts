import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const jwt = request.cookies.get("auth-token");

    if (pathname.includes("admin/tickets")) {
      if (!jwt)
        return NextResponse.redirect(new URL("/admin/auth", request.url));

      const jwtToken = jwt.value;

      const { payload } = await jwtVerify(
        jwtToken,
        new TextEncoder().encode("Pt6HjLhoM3Pt6HjLhoM3")
      );
      
      return NextResponse.next();
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/admin/auth", request.url));
  }
}
