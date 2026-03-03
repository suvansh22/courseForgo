import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const adminLoginPath = "/admin/login";
const customerLoginPath = "/login";

export const config = {
  matcher: [
    // Skip NextAuth routes and static/public assets (e.g. /logo.png, /images/banner.jpg)
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");
  const isAdminLogin = pathname === adminLoginPath;
  const isCustomerLogin = pathname === customerLoginPath;

  if (isAdminLogin || isCustomerLogin) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  if (token) {
    return NextResponse.next();
  }

  if (isApiRoute) {
    return NextResponse.json(
      {
        code: "UNAUTHORIZED",
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = isAdminRoute ? adminLoginPath : customerLoginPath;
  redirectUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(redirectUrl);
}
