import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/auth(.*)",                // ensure this covers your sign-in route
  "/api/webhooks/clerk(.*)"
]);

export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;
    console.log("➡️ Path:", pathname);

    // If public, let it through
    if (isPublicRoute(req)) {
      console.log("🟢 Public route, skipping auth");
      return NextResponse.next();
    }

    const { userId, redirectToSignIn, sessionClaims } = await auth();
    console.log("Auth result:", { userId, sessionClaims });

    // If not logged in, redirect to sign-in (unless already there)
    if (!userId) {
      if (!pathname.startsWith("/auth/sign-in")) {
        console.log("🔴 Not authenticated, redirect to sign-in");
        return redirectToSignIn({ returnBackUrl: req.url });
      } else {
        console.log("Already on sign-in page, not redirecting again");
        return NextResponse.next();
      }
    }

    // If user is logged in, enforce onboarding / verification logic
    const role = (sessionClaims as any)?.publicMetadata?.role;
    const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus;

    console.log("User has role:", role, "verificationStatus:", verificationStatus);

    // Onboarding
    if (role === "UNASSIGNED" && pathname !== "/dashboard/onboarding") {
      console.log("Redirect -> /dashboard/onboarding");
      return NextResponse.redirect(new URL("/dashboard/onboarding", req.url));
    }

    // Verification pending
    if (verificationStatus === "PENDING" && pathname !== "/dashboard/awaiting-verification") {
      console.log("Redirect -> /dashboard/awaiting-verification");
      return NextResponse.redirect(new URL("/dashboard/awaiting-verification", req.url));
    }

    // If verification done but user is trying to access onboarding or awaiting-verification
    if (verificationStatus !== "PENDING" && (
      pathname === "/dashboard/onboarding" ||
      pathname === "/dashboard/awaiting-verification"
    )) {
      console.log("Redirect -> /dashboard (already verified)");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Superadmin guard
    if (pathname.startsWith("/dashboard/superadmin") && role !== "SUPERADMIN") {
      console.log("Role not superadmin, redirect -> /dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    console.log("✅ Proceed to next");
    return NextResponse.next();
  },
  { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
