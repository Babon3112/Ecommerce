import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/", "/signup", "/verify/:path*", "/signin", "/interests"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET_KEY,
  });

  const { pathname } = request.nextUrl;

  if (
    token &&
    (pathname.startsWith("/signup") ||
      pathname.startsWith("/verify") ||
      pathname.startsWith("/signin"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!token && pathname.startsWith("/interests")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
