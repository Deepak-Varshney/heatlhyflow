import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/auth/(.*)",
  "/status(.*)",
  "/api/webhooks/(.*)",
  "/billing(.*)",
  "/subscription(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();
  const { pathname } = req.nextUrl;
  // Not logged in? Redirect to sign-in
  if (!userId) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const role = (sessionClaims as any)?.publicMetadata?.role as string;
  const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus as string;
  const organizationStatus = (sessionClaims as any)?.publicMetadata?.organizationStatus as string;

  // Step 2: Handle UNASSIGNED users - allow access to onboarding
  if ((!role || role === "UNASSIGNED")) {
    // Allow access to onboarding page for UNASSIGNED users
    if (pathname.startsWith("/onboarding")) {
      return NextResponse.next();
    }
    // Redirect all other routes to onboarding
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Step 3: Handle verification/status checks (only for users with roles)
  const isUserBlocked = verificationStatus !== "VERIFIED";
  const isOrgBlocked = organizationStatus !== "ACTIVE";

  // Redirect blocked users/orgs to status page
  if ((isUserBlocked || isOrgBlocked) && !pathname.startsWith("/status")) {
    return NextResponse.redirect(new URL("/status", req.url));
  }

  // Redirect approved users AWAY from /status if they try to access it manually
  if (!isUserBlocked && !isOrgBlocked && pathname.startsWith("/status")) {
    const dashboardUrl =
      role === "DOCTOR"
        ? "/doctor/dashboard"
        : role === "RECEPTIONIST"
          ? "/receptionist/dashboard"
          : "/dashboard";

    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  // Redirect verified/active users away from onboarding
  if (!isUserBlocked && !isOrgBlocked && pathname.startsWith("/onboarding")) {
    const dashboardUrl =
      role === "DOCTOR"
        ? "/doctor/dashboard"
        : role === "RECEPTIONIST"
          ? "/receptionist/dashboard"
          : "/dashboard";

    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  // Step 4: Role-based access (only for VERIFIED and ACTIVE users)
  if (!isUserBlocked && !isOrgBlocked) {
    if (role === "SUPERADMIN") return NextResponse.next();

    if (pathname.startsWith("/superadmin")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (role === "DOCTOR" && !pathname.startsWith("/doctor")) {
      return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
    }

    if (role === "RECEPTIONIST" && !pathname.startsWith("/receptionist")) {
      return NextResponse.redirect(new URL("/receptionist/dashboard", req.url));
    }

    // Note: Subscription checks are handled at the page/component level
    // because middleware runs on Edge Runtime which doesn't support Mongoose
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
