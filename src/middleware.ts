// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/auth(.*)",                // ensure this covers your sign-in route
//   "/api/webhooks/clerk(.*)"
// ]);

// export default clerkMiddleware(
//   async (auth, req) => {
//     const { pathname } = req.nextUrl;
//     // If public, let it through
//     if (isPublicRoute(req)) {
//       return NextResponse.next();
//     }

//     const { userId, redirectToSignIn, sessionClaims } = await auth();
//     // If not logged in, redirect to sign-in (unless already there)
//     if (!userId) {
//       if (!pathname.startsWith("/auth/sign-in")) {
//         return redirectToSignIn({ returnBackUrl: req.url });
//       } else {
//         return NextResponse.next();
//       }
//     }

//     // If user is logged in, enforce onboarding / verification logic
//     const role = (sessionClaims as any)?.publicMetadata?.role;
//     const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus;


//     // Onboarding
//     if (role === "UNASSIGNED" && pathname !== "/dashboard/onboarding") {
//       return NextResponse.redirect(new URL("/dashboard/onboarding", req.url));
//     }

//     // Verification pending
//     if (verificationStatus === "PENDING" && pathname !== "/dashboard/awaiting-verification") {
//       return NextResponse.redirect(new URL("/dashboard/awaiting-verification", req.url));
//     }

//     // If verification done but user is trying to access onboarding or awaiting-verification
//     if (verificationStatus !== "PENDING" && (
//       pathname === "/dashboard/onboarding" ||
//       pathname === "/dashboard/awaiting-verification"
//     )) {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//     // Superadmin guard
//     if (pathname.startsWith("/dashboard/superadmin") && role !== "SUPERADMIN") {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//     return NextResponse.next();
//   },
// );

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
// };


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
    // If public, let it through
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    const { userId, redirectToSignIn, sessionClaims } = await auth();
    // If not logged in, redirect to sign-in (unless already there)
    if (!userId) {
      if (!pathname.startsWith("/auth/sign-in")) {
        return redirectToSignIn({ returnBackUrl: req.url });
      } else {
        return NextResponse.next();
      }
    }
    // If user is logged in, enforce onboarding / verification logic
    const role = (sessionClaims as any)?.publicMetadata?.role;
    const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus;


    if (!role && pathname !== "/dashboard/onboarding") {
      return NextResponse.redirect(new URL("/dashboard/onboarding", req.url));
    }


    // // Onboarding
    // if (role === "UNASSIGNED" && pathname !== "/dashboard/onboarding") {
    //   return NextResponse.redirect(new URL("/dashboard/onboarding", req.url));
    // }

    // Verification pending
    if (verificationStatus === "PENDING" && pathname !== "/dashboard/awaiting-verification") {
    return NextResponse.redirect(new URL("/dashboard/awaiting-verification", req.url));
    }

    // If verification done but user is trying to access onboarding or awaiting-verification
    if (verificationStatus !== "PENDING" && (
      pathname === "/dashboard/onboarding" ||
      pathname === "/dashboard/awaiting-verification"
    )) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // // Superadmin guard
    // if (pathname.startsWith("/dashboard/superadmin") && role !== "SUPERADMIN") {
    //   return NextResponse.redirect(new URL("/dashboard", req.url));
    // }

    return NextResponse.next();
  },
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
