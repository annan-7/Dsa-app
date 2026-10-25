import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;
      return pathname === "/" || pathname === "/api/auth" ||
        pathname.startsWith("/api/auth/") || Boolean(token);
    },
  },
});

// Only framework assets and the existing public images bypass authentication.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico$|next.svg$|globe.svg$|vercel.svg$|window.svg$|file.svg$).*)"],
};
