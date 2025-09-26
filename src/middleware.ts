// // middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/api/webhooks/clerk(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  if (!isPublicRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }

  const { userId, sessionClaims } = await auth();

  if (userId) {
    const role = (sessionClaims as any)?.metadata?.role as string | undefined;
    const verificationStatus = (sessionClaims as any)?.metadata?.verificationStatus as string | undefined;

    if (role === "UNASSIGNED" && pathname !== "/onboarding") {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    if (verificationStatus === "PENDING") {
      if (pathname !== "/awaiting-verification") {
        const verificationUrl = new URL("/awaiting-verification", req.url);
        return NextResponse.redirect(verificationUrl);
      }
    }

    if (verificationStatus !== "PENDING" && (pathname === "/awaiting-verification" || pathname === "/onboarding")) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }

    if (pathname.startsWith("/superadmin") && role !== "SUPERADMIN") {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};