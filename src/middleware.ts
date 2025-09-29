// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/auth/(.*)",
  "/api/webhooks/(.*)",
]);

export default clerkMiddleware(async(auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();
  const { pathname } = req.nextUrl;

  if (!userId) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  const role = (sessionClaims as any)?.publicMetadata?.role as string;
  const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus as string;

  // --- Onboarding & Verification Flow ---
  // This section remains the same, as it must run for all users first.
  if ((!role || role === "UNASSIGNED") && !pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
  if (verificationStatus === "PENDING" && !pathname.startsWith("/awaiting-verification")) {
    return NextResponse.redirect(new URL("/awaiting-verification", req.url));
  }
  if (role && role !== "UNASSIGNED" && verificationStatus !== "PENDING" &&
     (pathname.startsWith("/onboarding") || pathname.startsWith("/awaiting-verification"))) {
    const dashboardUrl = role === 'DOCTOR' ? '/doctor/dashboard' : '/receptionist/dashboard';
    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  // --- NEW: Role-Based Route Protection (with Admin rules) ---

  // Rule 1: SUPERADMIN has access to everything.
  if (role === "SUPERADMIN") {
    return NextResponse.next();
  }

  // Rule 2: Block all other roles from accessing the superadmin area.
  if (pathname.startsWith("/superadmin")) {
    // Since we already handled SUPERADMIN, anyone else reaching this point is unauthorized.
    return NextResponse.redirect(new URL("/dashboard", req.url)); 
  }

  // Rule 3: ADMIN has access to everything except the superadmin area (which we just handled).
  if (role === "ADMIN") {
    return NextResponse.next();
  }

  // Rule 4: Specific rules for other roles (run only if user is not SUPERADMIN or ADMIN)
  if (role === "DOCTOR" && !pathname.startsWith("/doctor")) {
      return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
  }

  if (role === "RECEPTIONIST" && !pathname.startsWith("/receptionist")) {
      return NextResponse.redirect(new URL("/receptionist/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};