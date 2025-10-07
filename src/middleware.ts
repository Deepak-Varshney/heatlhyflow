// // // // // middleware.ts

// // // // import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// // // // import { NextResponse } from "next/server";

// // // // const isPublicRoute = createRouteMatcher([
// // // //   "/auth/(.*)",
// // // //   "/",
// // // //   "/api/webhooks/(.*)",
// // // // ]);

// // // // export default clerkMiddleware(async (auth, req) => {
// // // //   if (isPublicRoute(req)) return NextResponse.next();

// // // //   const { userId, sessionClaims } = await auth();
// // // //   const { pathname } = req.nextUrl;

// // // //   // If the user is not signed in, redirect them to the sign-in page.
// // // //   if (!userId) {
// // // //     const signInUrl = new URL("/auth/sign-in", req.url);
// // // //     signInUrl.searchParams.set("redirect_url", req.url);
// // // //     return NextResponse.redirect(signInUrl);
// // // //   }

// // // //   // Extract custom metadata from the session.
// // // //   const role = (sessionClaims as any)?.publicMetadata?.role as string;
// // // //   const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus as string;
// // // //   const organizationStatus = (sessionClaims as any)?.publicMetadata?.organizationStatus as string;

// // // //   // --- Onboarding & Verification Flow ---

// // // //   // 1. If the user has no role, they must complete onboarding first.
// // // //   if ((!role || role === "UNASSIGNED") && !pathname.startsWith("/onboarding")) {
// // // //     return NextResponse.redirect(new URL("/onboarding", req.url));
// // // //   }

// // // //   // 2. --- UPDATED LOGIC ---
// // // //   // If the user has a role but is not yet verified OR their organization is not active,
// // // //   // redirect them to the awaiting verification page.
// // // //   // This prevents them from accessing any other part of the app.
// // // //   if (
// // // //     (verificationStatus !== "VERIFIED" || organizationStatus !== "ACTIVE") &&
// // // //     !pathname.startsWith("/awaiting-verification")
// // // //   ) {
// // // //     return NextResponse.redirect(new URL("/awaiting-verification", req.url));
// // // //   }

// // // //   // 3. --- ALSO RECOMMENDED ---
// // // //   // If a fully verified and active user tries to access onboarding/verification pages,
// // // //   // redirect them to their appropriate dashboard.
// // // //   if (
// // // //     verificationStatus === "VERIFIED" &&
// // // //     organizationStatus === "ACTIVE" &&
// // // //     (pathname.startsWith("/onboarding") || pathname.startsWith("/awaiting-verification"))
// // // //   ) {
// // // //     const dashboardUrl = role === 'DOCTOR' ? '/doctor/dashboard' : '/receptionist/dashboard';
// // // //     return NextResponse.redirect(new URL(dashboardUrl, req.url));
// // // //   }


// // // //   // --- Role-Based Route Protection (Only for VERIFIED & ACTIVE users) ---
// // // //   // This section now correctly assumes that any user reaching this point
// // // //   // is both VERIFIED and part of an ACTIVE organization.

// // // //   // SUPERADMIN can access everything.
// // // //   if (role === "SUPERADMIN") {
// // // //     return NextResponse.next();
// // // //   }
// // // //   // Block access to superadmin area for everyone else.
// // // //   if (pathname.startsWith("/superadmin")) {
// // // //     return NextResponse.redirect(new URL("/dashboard", req.url)); // Or a general 404/unauthorized page
// // // //   }
// // // //   // ADMIN can access everything except superadmin.
// // // //   if (role === "ADMIN") {
// // // //     return NextResponse.next();
// // // //   }
// // // //   // Specific rules for other roles.
// // // //   if (role === "DOCTOR" && !pathname.startsWith("/doctor")) {
// // // //     return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
// // // //   }
// // // //   if (role === "RECEPTIONIST" && !pathname.startsWith("/receptionist")) {
// // // //     return NextResponse.redirect(new URL("/receptionist/dashboard", req.url));
// // // //   }

// // // //   return NextResponse.next();
// // // // });

// // // // export const config = {
// // // //   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// // // // };

// // // // middleware.ts

// // // import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// // // import { NextResponse } from "next/server";

// // // const isPublicRoute = createRouteMatcher([
// // //   "/auth/(.*)",
// // //   "/",
// // //   "/api/webhooks/(.*)",
// // // ]);

// // // export default clerkMiddleware(async (auth, req) => {
// // //   if (isPublicRoute(req)) return NextResponse.next();

// // //   const { userId, sessionClaims } = await auth();
// // //   const { pathname } = req.nextUrl;

// // //   if (!userId) {
// // //     const signInUrl = new URL("/auth/sign-in", req.url);
// // //     signInUrl.searchParams.set("redirect_url", req.url);
// // //     return NextResponse.redirect(signInUrl);
// // //   }

// // //   const role = (sessionClaims as any)?.publicMetadata?.role as string;
// // //   const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus as string;
// // //   const organizationStatus = (sessionClaims as any)?.publicMetadata?.organizationStatus as string;

// // //   // --- Onboarding & Verification Flow (This part runs first and is correct) ---
// // //   if ((!role || role === "UNASSIGNED") && !pathname.startsWith("/onboarding")) {
// // //     return NextResponse.redirect(new URL("/onboarding", req.url));
// // //   }
// // //   if ((verificationStatus !== "VERIFIED" || organizationStatus !== "ACTIVE") && !pathname.startsWith("/awaiting-verification")) {
// // //     return NextResponse.redirect(new URL("/awaiting-verification", req.url));
// // //   }
// // //   if (role && role !== "UNASSIGNED" && verificationStatus !== "PENDING" && organizationStatus !== "PENDING" &&
// // //     (pathname.startsWith("/onboarding") || pathname.startsWith("/awaiting-verification"))) {
// // //     const dashboardUrl = role === 'DOCTOR' ? '/doctor/dashboard' : '/receptionist/dashboard';
// // //     return NextResponse.redirect(new URL(dashboardUrl, req.url));
// // //   }

// // //   // --- Role-Based Route Protection (Only for VERIFIED users) ---

// // //   // THE FIX: We wrap all role-based rules in a check to ensure the user is NOT pending.
// // //   if (verificationStatus !== "PENDING") {
// // //     // SUPERADMIN can access everything.
// // //     if (role === "SUPERADMIN") {
// // //       return NextResponse.next();
// // //     }
// // //     // Block access to superadmin area for everyone else.
// // //     if (pathname.startsWith("/superadmin")) {
// // //       return NextResponse.redirect(new URL("/dashboard", req.url));
// // //     }
// // //     // ADMIN can access everything except superadmin.
// // //     if (role === "ADMIN") {
// // //       return NextResponse.next();
// // //     }
// // //     // Specific rules for other roles.
// // //     if (role === "DOCTOR" && !pathname.startsWith("/doctor")) {
// // //       return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
// // //     }
// // //     if (role === "RECEPTIONIST" && !pathname.startsWith("/receptionist")) {
// // //       return NextResponse.redirect(new URL("/receptionist/dashboard", req.url));
// // //     }
// // //   }

// // //   return NextResponse.next();
// // // });

// // // export const config = {
// // //   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// // // };

// // // middleware.ts

// // import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// // import { NextResponse } from "next/server";

// // const isPublicRoute = createRouteMatcher([
// //   "/auth/(.*)",
// //   "/",
// //   "/api/webhooks/(.*)",
// // ]);

// // export default clerkMiddleware(async (auth, req) => {
// //   if (isPublicRoute(req)) return NextResponse.next();

// //   const { userId, sessionClaims } = await auth();
// //   const { pathname } = req.nextUrl;

// //   if (!userId) {
// //     const signInUrl = new URL("/auth/sign-in", req.url);
// //     signInUrl.searchParams.set("redirect_url", req.url);
// //     return NextResponse.redirect(signInUrl);
// //   }

// //   const role = (sessionClaims as any)?.publicMetadata?.role as string;
// //   const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus as string;
// //   const organizationStatus = (sessionClaims as any)?.publicMetadata?.organizationStatus as string;

// //   // --- Onboarding & Verification Flow (This part runs first and is correct) ---
// //   if ((!role || role === "UNASSIGNED") && !pathname.startsWith("/onboarding")) {
// //     return NextResponse.redirect(new URL("/onboarding", req.url));
// //   }
// //   if (verificationStatus === "PENDING" && !pathname.startsWith("/awaiting-verification")) {
// //     return NextResponse.redirect(new URL("/awaiting-verification", req.url));
// //   }
// //   if (role && role !== "UNASSIGNED" && verificationStatus !== "PENDING" && organizationStatus !== "PENDING" &&
// //     (pathname.startsWith("/onboarding") || pathname.startsWith("/awaiting-verification"))) {
// //     const dashboardUrl = role === 'DOCTOR' ? '/doctor/dashboard' : '/receptionist/dashboard';
// //     return NextResponse.redirect(new URL(dashboardUrl, req.url));
// //   }

// //   // --- Role-Based Route Protection (Only for VERIFIED users) ---

// //   // THE FIX: We wrap all role-based rules in a check to ensure the user is NOT pending.
// //   if (verificationStatus !== "PENDING") {
// //     // SUPERADMIN can access everything.
// //     if (role === "SUPERADMIN") {
// //       return NextResponse.next();
// //     }
// //     // Block access to superadmin area for everyone else.
// //     if (pathname.startsWith("/superadmin")) {
// //       return NextResponse.redirect(new URL("/dashboard", req.url));
// //     }
// //     // ADMIN can access everything except superadmin.
// //     if (role === "ADMIN") {
// //       return NextResponse.next();
// //     }
// //     // Specific rules for other roles.
// //     if (role === "DOCTOR" && !pathname.startsWith("/doctor")) {
// //       return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
// //     }
// //     if (role === "RECEPTIONIST" && !pathname.startsWith("/receptionist")) {
// //       return NextResponse.redirect(new URL("/receptionist/dashboard", req.url));
// //     }
// //   }

// //   return NextResponse.next();
// // });

// // export const config = {
// //   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// // };

// // middleware.ts

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/auth/(.*)",
//   "/",
//     "/onboarding(.*)",
//   "/awaiting-verification(.*)",
//   "/status(.*)",
//   "/api/webhooks/(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isPublicRoute(req)) return NextResponse.next();

//   const { userId, sessionClaims } = await auth();
//   const { pathname } = req.nextUrl;

//   // Not logged in? Redirect to sign-in
//   if (!userId) {
//     const signInUrl = new URL("/auth/sign-in", req.url);
//     signInUrl.searchParams.set("redirect_url", req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   const role = (sessionClaims as any)?.publicMetadata?.role as string;
//   const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus as string;
//   const organizationStatus = (sessionClaims as any)?.publicMetadata?.organizationStatus as string;

//   const isUserBlocked = verificationStatus !== "VERIFIED";
//   const isOrgBlocked = organizationStatus !== "ACTIVE";

//   // 🔁 Redirect blocked users/orgs to the unified status page
//   if ((isUserBlocked || isOrgBlocked) && !pathname.startsWith("/status")) {
//     return NextResponse.redirect(new URL("/status", req.url));
//   }

//   // ✅ Redirect approved users AWAY from /status if they try to access it manually
//   if (!isUserBlocked && !isOrgBlocked && pathname.startsWith("/status")) {
//     const dashboardUrl =
//       role === "DOCTOR"
//         ? "/doctor/dashboard"
//         : role === "RECEPTIONIST"
//         ? "/receptionist/dashboard"
//         : "/dashboard";

//     return NextResponse.redirect(new URL(dashboardUrl, req.url));
//   }

//   // ⛔️ UNASSIGNED users must complete onboarding
//   if ((!role || role === "UNASSIGNED") && !pathname.startsWith("/onboarding")) {
//     return NextResponse.redirect(new URL("/onboarding", req.url));
//   }

//   // 🔒 Role-based access (only after passing verification/org check)
//   if (!isUserBlocked && !isOrgBlocked) {
//     if (role === "SUPERADMIN") return NextResponse.next();

//     if (pathname.startsWith("/superadmin")) {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//     if (role === "ADMIN") return NextResponse.next();

//     if (role === "DOCTOR" && !pathname.startsWith("/doctor")) {
//       return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
//     }

//     if (role === "RECEPTIONIST" && !pathname.startsWith("/receptionist")) {
//       return NextResponse.redirect(new URL("/receptionist/dashboard", req.url));
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };


import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSubscriptionContext } from "@/lib/subscription";

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

    // Step 5: Subscription checks for non-superadmin users
    if (role !== "SUPERADMIN") {
      try {
        const subscriptionContext = await getSubscriptionContext();
        
        // If no subscription context, redirect to billing
        if (!subscriptionContext) {
          if (!pathname.startsWith("/billing") && !pathname.startsWith("/subscription")) {
            return NextResponse.redirect(new URL("/billing", req.url));
          }
        } else {
          // Check if subscription is active
          if (!subscriptionContext.isActive) {
            if (!pathname.startsWith("/billing") && !pathname.startsWith("/subscription")) {
              return NextResponse.redirect(new URL("/billing", req.url));
            }
          }

          // Check specific feature access for certain routes
          if (pathname.includes("/analytics") && !subscriptionContext.limits.canAccessAnalytics) {
            return NextResponse.redirect(new URL("/billing?feature=analytics", req.url));
          }

          if (pathname.includes("/api") && !subscriptionContext.limits.canUseApiAccess) {
            return NextResponse.redirect(new URL("/billing?feature=api", req.url));
          }

          if (pathname.includes("/branding") && !subscriptionContext.limits.canUseCustomBranding) {
            return NextResponse.redirect(new URL("/billing?feature=branding", req.url));
          }
        }
      } catch (error) {
        console.error("Subscription check error:", error);
        // Allow access but log the error
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
