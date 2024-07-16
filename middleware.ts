import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  console.log("Middleware called for:", request.nextUrl.pathname);
  return NextResponse.next();
}
