import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const jwt = request.cookies.get("token");

    if (pathname.includes("admin/dashboard")) {
      if (!jwt)
        return NextResponse.redirect(new URL("/admin/auth", request.url));

      const jwtToken = jwt.value;
      
      return NextResponse.next();
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/admin/auth", request.url));
  }
}
