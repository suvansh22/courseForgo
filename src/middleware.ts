import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const adminLoginPath = "/admin/login";
const customerLoginPath = "/login";

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === adminLoginPath;
  const isCustomerLogin = pathname === customerLoginPath;

  if (isAdminLogin || isCustomerLogin) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  if (token) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = isAdminRoute ? adminLoginPath : customerLoginPath;
  redirectUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(redirectUrl);
}
