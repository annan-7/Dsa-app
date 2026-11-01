import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const publicAssets = new Set(["/favicon.ico", "/file.svg", "/globe.svg", "/next.svg", "/vercel.svg", "/window.svg"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/" || pathname === "/signin" || pathname.startsWith("/api/auth/") || publicAssets.has(pathname)) {
    return NextResponse.next();
  }
  const token = process.env.NEXTAUTH_SECRET
    ? await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    : null;
  if (!token?.sub) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const destination = new URL("/signin", request.url);
    destination.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
    return NextResponse.redirect(destination);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
