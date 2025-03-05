import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

export function middleware(request: NextRequest) {
  let cookie = request.cookies.get("refreshToken");
  const isLoggedIn = cookie?.value || !isTokenExpired(cookie?.value!);
  if (
    isLoggedIn &&
    (request.nextUrl.pathname === "/account/signin" ||
      request.nextUrl.pathname === "/account/signup")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/signin", "/account/signup", "/account"],
};
