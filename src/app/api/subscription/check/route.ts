import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSubscriptionContext } from "@/lib/subscription";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    const { feature } = await request.json();
    
    if (!feature) {
      return NextResponse.json({ hasAccess: false }, { status: 400 });
    }

    const subscriptionContext = await getSubscriptionContext();
    
    if (!subscriptionContext) {
      return NextResponse.json({ hasAccess: false }, { status: 404 });
    }

    // Check if subscription is active
    if (!subscriptionContext.isActive) {
      return NextResponse.json({ hasAccess: false }, { status: 403 });
    }

    // Check specific feature access
    const hasAccess = subscriptionContext.limits[feature as keyof typeof subscriptionContext.limits] || false;

    return NextResponse.json({ 
      hasAccess,
      subscription: subscriptionContext.subscription,
      limits: subscriptionContext.limits
    });

  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json({ hasAccess: false }, { status: 500 });
  }
}