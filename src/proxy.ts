import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicMetadataFromClaims } from "@/lib/auth-claims";

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/(.*)",
  "/onboarding(.*)",
  "/access-blocked",
  "/api/webhooks/(.*)",
  "/billing(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Public routes - allow without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  // Not logged in - redirect to sign-in
  if (!userId) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const { role, organizationStatus, organizationId } =
    getPublicMetadataFromClaims(sessionClaims);

  // Superadmin bypasses org checks
  if (role === "SUPERADMIN" || role === "DEVIL") {
    return NextResponse.next();
  }

  // User without role - redirect to onboarding
  if (!role || role === "UNASSIGNED") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Organization not active - don't allow access to protected routes
  if (!organizationId || organizationStatus !== "ACTIVE") {
    return NextResponse.redirect(new URL("/access-blocked", req.url));
  }

  // All checks passed - allow access
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
