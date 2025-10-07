"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSubscriptionForOrganization } from "@/actions/superadmin-actions";
import { SubscriptionPlan } from "@/types/subscription";

export async function createSubscriptionAction(formData: FormData) {
  const orgId = formData.get("organizationId") as string;
  const planType = formData.get("planType") as SubscriptionPlan;
  const billingCycle = formData.get("billingCycle") as "MONTHLY" | "YEARLY";
  
  if (!orgId || !planType) {
    throw new Error("Please fill in all required fields");
  }

  try {
    await createSubscriptionForOrganization(orgId, planType, billingCycle);
    revalidatePath("/superadmin/subscriptions");
    redirect("/superadmin/subscriptions");
  } catch (error: any) {
    console.error("Error creating subscription:", error.message);
    throw error;
  }
}