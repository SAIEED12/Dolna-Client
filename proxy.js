import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDashboardPathByRole } from "@/lib/dashboard-nav";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  let session = null;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch {
    session = null; // fail open → layout guards re-check
  }

  // Not logged in → login
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = session.user.role ?? "customer";

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(getDashboardPathByRole(role), request.url));
  }
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }
  if (pathname.startsWith("/dashboard/customer") && role === "admin") {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};