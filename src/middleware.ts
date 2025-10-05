// // middleware.ts

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/auth/(.*)",
//   "/",
//   "/api/webhooks/(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isPublicRoute(req)) return NextResponse.next();

//   const { userId, sessionClaims } = await auth();
//   const { pathname } = req.nextUrl;

//   // If the user is not signed in, redirect them to the sign-in page.
//   if (!userId) {
//     const signInUrl = new URL("/auth/sign-in", req.url);
//     signInUrl.searchParams.set("redirect_url", req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   // Extract custom metadata from the session.
//   const role = (sessionClaims as any)?.publicMetadata?.role as string;
//   const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus as string;
//   const organizationStatus = (sessionClaims as any)?.publicMetadata?.organizationStatus as string;

//   // --- Onboarding & Verification Flow ---

//   // 1. If the user has no role, they must complete onboarding first.
//   if ((!role || role === "UNASSIGNED") && !pathname.startsWith("/onboarding")) {
//     return NextResponse.redirect(new URL("/onboarding", req.url));
//   }

//   // 2. --- UPDATED LOGIC ---
//   // If the user has a role but is not yet verified OR their organization is not active,
//   // redirect them to the awaiting verification page.
//   // This prevents them from accessing any other part of the app.
//   if (
//     (verificationStatus !== "VERIFIED" || organizationStatus !== "ACTIVE") &&
//     !pathname.startsWith("/awaiting-verification")
//   ) {
//     return NextResponse.redirect(new URL("/awaiting-verification", req.url));
//   }

//   // 3. --- ALSO RECOMMENDED ---
//   // If a fully verified and active user tries to access onboarding/verification pages,
//   // redirect them to their appropriate dashboard.
//   if (
//     verificationStatus === "VERIFIED" &&
//     organizationStatus === "ACTIVE" &&
//     (pathname.startsWith("/onboarding") || pathname.startsWith("/awaiting-verification"))
//   ) {
//     const dashboardUrl = role === 'DOCTOR' ? '/doctor/dashboard' : '/receptionist/dashboard';
//     return NextResponse.redirect(new URL(dashboardUrl, req.url));
//   }


//   // --- Role-Based Route Protection (Only for VERIFIED & ACTIVE users) ---
//   // This section now correctly assumes that any user reaching this point
//   // is both VERIFIED and part of an ACTIVE organization.

//   // SUPERADMIN can access everything.
//   if (role === "SUPERADMIN") {
//     return NextResponse.next();
//   }
//   // Block access to superadmin area for everyone else.
//   if (pathname.startsWith("/superadmin")) {
//     return NextResponse.redirect(new URL("/dashboard", req.url)); // Or a general 404/unauthorized page
//   }
//   // ADMIN can access everything except superadmin.
//   if (role === "ADMIN") {
//     return NextResponse.next();
//   }
//   // Specific rules for other roles.
//   if (role === "DOCTOR" && !pathname.startsWith("/doctor")) {
//     return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
//   }
//   if (role === "RECEPTIONIST" && !pathname.startsWith("/receptionist")) {
//     return NextResponse.redirect(new URL("/receptionist/dashboard", req.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/auth/(.*)",
  "/",
  "/api/webhooks/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
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
  const organizationStatus = (sessionClaims as any)?.publicMetadata?.organizationStatus as string;

  // --- Onboarding & Verification Flow (This part runs first and is correct) ---
  if ((!role || role === "UNASSIGNED") && !pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
  if ((verificationStatus !== "VERIFIED" || organizationStatus !== "ACTIVE") && !pathname.startsWith("/awaiting-verification")) {
    return NextResponse.redirect(new URL("/awaiting-verification", req.url));
  }
  if (role && role !== "UNASSIGNED" && verificationStatus !== "PENDING" && organizationStatus !== "PENDING" &&
    (pathname.startsWith("/onboarding") || pathname.startsWith("/awaiting-verification"))) {
    const dashboardUrl = role === 'DOCTOR' ? '/doctor/dashboard' : '/receptionist/dashboard';
    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  // --- Role-Based Route Protection (Only for VERIFIED users) ---

  // THE FIX: We wrap all role-based rules in a check to ensure the user is NOT pending.
  if (verificationStatus !== "PENDING") {
    // SUPERADMIN can access everything.
    if (role === "SUPERADMIN") {
      return NextResponse.next();
    }
    // Block access to superadmin area for everyone else.
    if (pathname.startsWith("/superadmin")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // ADMIN can access everything except superadmin.
    if (role === "ADMIN") {
      return NextResponse.next();
    }
    // Specific rules for other roles.
    if (role === "DOCTOR" && !pathname.startsWith("/doctor")) {
      return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
    }
    if (role === "RECEPTIONIST" && !pathname.startsWith("/receptionist")) {
      return NextResponse.redirect(new URL("/receptionist/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};