// // // // // import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// // // // // import { NextResponse } from "next/server";

// // // // // const isPublicRoute = createRouteMatcher([
// // // // //   "/sign-in(.*)",
// // // // //   "/sign-up(.*)",
// // // // //   "/auth(.*)",                // ensure this covers your sign-in route
// // // // //   "/api/webhooks/clerk(.*)"
// // // // // ]);

// // // // // export default clerkMiddleware(
// // // // //   async (auth, req) => {
// // // // //     const { pathname } = req.nextUrl;
// // // // //     // If public, let it through
// // // // //     if (isPublicRoute(req)) {
// // // // //       return NextResponse.next();
// // // // //     }

// // // // //     const { userId, redirectToSignIn, sessionClaims } = await auth();
// // // // //     // If not logged in, redirect to sign-in (unless already there)
// // // // //     if (!userId) {
// // // // //       if (!pathname.startsWith("/auth/sign-in")) {
// // // // //         return redirectToSignIn({ returnBackUrl: req.url });
// // // // //       } else {
// // // // //         return NextResponse.next();
// // // // //       }
// // // // //     }

// // // // //     // If user is logged in, enforce onboarding / verification logic
// // // // //     const role = (sessionClaims as any)?.publicMetadata?.role;
// // // // //     const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus;


// // // // //     // Onboarding
// // // // //     if (role === "UNASSIGNED" && pathname !== "/dashboard/onboarding") {
// // // // //       return NextResponse.redirect(new URL("/dashboard/onboarding", req.url));
// // // // //     }

// // // // //     // Verification pending
// // // // //     if (verificationStatus === "PENDING" && pathname !== "/dashboard/awaiting-verification") {
// // // // //       return NextResponse.redirect(new URL("/dashboard/awaiting-verification", req.url));
// // // // //     }

// // // // //     // If verification done but user is trying to access onboarding or awaiting-verification
// // // // //     if (verificationStatus !== "PENDING" && (
// // // // //       pathname === "/dashboard/onboarding" ||
// // // // //       pathname === "/dashboard/awaiting-verification"
// // // // //     )) {
// // // // //       return NextResponse.redirect(new URL("/dashboard", req.url));
// // // // //     }

// // // // //     // Superadmin guard
// // // // //     if (pathname.startsWith("/dashboard/superadmin") && role !== "SUPERADMIN") {
// // // // //       return NextResponse.redirect(new URL("/dashboard", req.url));
// // // // //     }

// // // // //     return NextResponse.next();
// // // // //   },
// // // // // );

// // // // // export const config = {
// // // // //   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
// // // // // };


// // // // import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// // // // import { NextResponse } from "next/server";

// // // // const isPublicRoute = createRouteMatcher([
// // // //   "/sign-in(.*)",
// // // //   "/sign-up(.*)",
// // // //   "/auth(.*)",                // ensure this covers your sign-in route
// // // //   "/api/webhooks/clerk(.*)"
// // // // ]);

// // // // export default clerkMiddleware(
// // // //   async (auth, req) => {
// // // //     const { pathname } = req.nextUrl;
// // // //     // If public, let it through
// // // //     if (isPublicRoute(req)) {
// // // //       return NextResponse.next();
// // // //     }

// // // //     const { userId, redirectToSignIn, sessionClaims } = await auth();
// // // //     // If not logged in, redirect to sign-in (unless already there)
// // // //     if (!userId) {
// // // //       if (!pathname.startsWith("/auth/sign-in")) {
// // // //         return redirectToSignIn({ returnBackUrl: req.url });
// // // //       } else {
// // // //         return NextResponse.next();
// // // //       }
// // // //     }
// // // // // If user is logged in, enforce onboarding / verification logic
// // // // const role = (sessionClaims as any)?.publicMetadata?.role;
// // // // const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus;
// // // //     console.log(role)

// // // //     if (!role && pathname !== "/dashboard/onboarding") {
// // // //       return NextResponse.redirect(new URL("/dashboard/onboarding", req.url));
// // // //     }

// // // //     if (verificationStatus) {
// // // //       // Verification pending
// // // //       if (verificationStatus === "PENDING" && pathname !== "/dashboard/awaiting-verification") {
// // // //         return NextResponse.redirect(new URL("/dashboard/awaiting-verification", req.url));
// // // //       }

// // // //     }
// // // //     // If verification done but user is trying to access onboarding or awaiting-verification
// // // //     if (verificationStatus !== "PENDING" && (
// // // //       pathname === "/dashboard/onboarding" ||
// // // //       pathname === "/dashboard/awaiting-verification"
// // // //     )) {
// // // //       return NextResponse.redirect(new URL("/dashboard", req.url));
// // // //     }

// // // //     // Superadmin guard
// // // //     if (pathname.startsWith("/dashboard/superadmin") && role !== "SUPERADMIN") {
// // // //       return NextResponse.redirect(new URL("/dashboard", req.url));
// // // //     }

// // // //     return NextResponse.next();
// // // //   },
// // // // );

// // // // export const config = {
// // // //   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
// // // // };


// // // // middleware.ts

// // // import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// // // import { NextResponse } from "next/server";

// // // const isPublicRoute = createRouteMatcher([
// // //   "/sign-in(.*)",
// // //   "/auth(.*)",                // ensure this covers your sign-in route
// // //   "/sign-up(.*)",
// // //   "/api/webhooks(.*)",
// // // ]);

// // // export default clerkMiddleware(async (auth, req) => {
// // //   if (isPublicRoute(req)) {
// // //     return NextResponse.next();
// // //   }

// // //   const { userId, sessionClaims } = await auth();
// // //   const { pathname } = req.nextUrl;

// // //   if (!userId) {
// // //     const signInUrl = new URL("/sign-in", req.url);
// // //     signInUrl.searchParams.set("redirect_url", req.url);
// // //     return NextResponse.redirect(signInUrl);
// // //   }
// // //   // If user is logged in, enforce onboarding / verification logic
// // //   const role = (sessionClaims as any)?.publicMetadata?.role;
// // //   const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus;

// // //   // Rule 1: For new users, force them to onboarding. This is correct.
// // //   if ((!role || role === "UNASSIGNED") && pathname !== "/dashboard/onboarding") {
// // //     return NextResponse.redirect(new URL("/dashboard/onboarding", req.url));
// // //   }

// // //   // Rule 2: For pending users, trap them on the awaiting-verification page. This is correct.
// // //   if (verificationStatus === "PENDING" && pathname !== "/dashboard/awaiting-verification") {
// // //     return NextResponse.redirect(new URL("/dashboard/awaiting-verification", req.url));
// // //   }

// // //   // THE FIX: This rule is now more specific. It only runs if a user has an
// // //   // assigned role AND is not pending, preventing the loop for new users.
// // //   if (
// // //     role && role !== "UNASSIGNED" &&
// // //     verificationStatus !== "PENDING" &&
// // //     (pathname === "/dashboard/onboarding" || pathname === "/dashboard/awaiting-verification")
// // //   ) {
// // //     return NextResponse.redirect(new URL("/dashboard", req.url));
// // //   }

// // //   // Rule 4: Protect superadmin routes. This is correct.
// // //   if (pathname.startsWith("/superadmin") && role !== "SUPERADMIN") {
// // //     return NextResponse.redirect(new URL("/dashboard", req.url));
// // //   }

// // //   return NextResponse.next();
// // // });

// // // export const config = {
// // //   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// // // };

// // // middleware.ts

// // import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// // import { NextResponse } from "next/server";

// // // This now correctly matches your 'app/auth/*' directory structure.
// // const isPublicRoute = createRouteMatcher([
// //   "/auth(.*)",
// //   "/api/webhooks(.*)",
// // ]);

// // export default clerkMiddleware(async(auth, req) => {
// //   if (isPublicRoute(req)) {
// //     return NextResponse.next();
// //   }

// //   const { userId, sessionClaims } = await auth();
// //   const { pathname } = req.nextUrl;

// //   if (!userId) {
// //     // THE FIX: The redirect URL now correctly points to "/auth/sign-in"
// //     const signInUrl = new URL("/auth/sign-in", req.url);
// //     signInUrl.searchParams.set("redirect_url", req.url);
// //     return NextResponse.redirect(signInUrl);
// //   }

// // // The rest of your authorization logic remains the same...
// // const role = sessionClaims?.publicMetadata?.role as string;
// // const verificationStatus = sessionClaims?.publicMetadata?.verificationStatus as string;

// //   if ((!role || role === "UNASSIGNED") && pathname !== "/onboarding") {
// //     return NextResponse.redirect(new URL("/onboarding", req.url));
// //   }

// //   if (verificationStatus === "PENDING" && pathname !== "/awaiting-verification") {
// //     return NextResponse.redirect(new URL("/awaiting-verification", req.url));
// //   }

// //   if (
// //     role && role !== "UNASSIGNED" &&
// //     verificationStatus !== "PENDING" &&
// //     (pathname === "/onboarding" || pathname === "/awaiting-verification")
// //   ) {
// //     return NextResponse.redirect(new URL("/dashboard", req.url));
// //   }

// //   if (pathname.startsWith("/superadmin") && role !== "SUPERADMIN") {
// //     return NextResponse.redirect(new URL("/dashboard", req.url));
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
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/auth(.*)",
//   "/api/webhooks(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isPublicRoute(req)) {
//     return NextResponse.next();
//   }

//   const { userId, sessionClaims } = await auth();
//   const { pathname } = req.nextUrl;

//   if (!userId) {
//     const signInUrl = new URL("/sign-in", req.url);
//     signInUrl.searchParams.set("redirect_url", req.url);
//     return NextResponse.redirect(signInUrl);
//   }
//   // If user is logged in, enforce onboarding / verification logic
// const role = (sessionClaims as any)?.publicMetadata?.role;
// const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus;

//   // Rule 1: Handles new users (path is now top-level)
//   if ((!role || role === "UNASSIGNED") && pathname !== "/onboarding") {
//     return NextResponse.redirect(new URL("/onboarding", req.url));
//   }

//   // Rule 2: Handles pending users (path is now top-level)
//   if (verificationStatus === "PENDING" && pathname !== "/awaiting-verification") {
//     return NextResponse.redirect(new URL("/awaiting-verification", req.url));
//   }

//   // Rule 3: Prevents verified users from going back to onboarding
//   if (
//     role && role !== "UNASSIGNED" &&
//     verificationStatus !== "PENDING" &&
//     (pathname === "/onboarding" || pathname === "/awaiting-verification")
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   // Rule 4: Protects superadmin routes (path is now top-level)
//   if (pathname.startsWith("/superadmin") && role !== "SUPERADMIN") {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// THE FIX: This now correctly identifies your /auth pages as public.
const isPublicRoute = createRouteMatcher([
  "/auth/(.*)",
  "/api/webhooks/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();
  const { pathname } = req.nextUrl;

  if (!userId) {
    // THE FIX: The redirect now points to the correct sign-in URL.
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const role = (sessionClaims as any)?.publicMetadata?.role;
  const verificationStatus = (sessionClaims as any)?.publicMetadata?.verificationStatus;

  if ((!role || role === "UNASSIGNED") && !pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (verificationStatus === "PENDING" && !pathname.startsWith("/awaiting-verification")) {
    return NextResponse.redirect(new URL("/awaiting-verification", req.url));
  }

  if (
    role && role !== "UNASSIGNED" &&
    verificationStatus !== "PENDING" &&
    (pathname.startsWith("/onboarding") || pathname.startsWith("/awaiting-verification"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/superadmin") && role !== "SUPERADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)", "/dashboard/manage-client(.*)"],
};