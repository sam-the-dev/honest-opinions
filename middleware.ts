import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  let token;
  try {
    token = await getToken({ req });
  } catch (error) {
    console.error("Error retrieving token:", error);
  }

  const url = req.nextUrl;
  const publicPaths = ["/login", "/register", "/verify", "/"];
  const isPublicPath = publicPaths.some((path) =>
    url.pathname.startsWith(path)
  );
  const isProtectedPath = url.pathname.startsWith("/dashboard");

  if (token && isPublicPath && url.pathname !== "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && isProtectedPath && url.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/", "/dashboard/:path*", "/verify/:path*"],
};

export { default } from "next-auth/middleware";
