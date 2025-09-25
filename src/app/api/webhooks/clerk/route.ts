// app/api/webhooks/clerk/route.ts

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Organization from "@/models/Organization";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  // ... (Svix header verification code remains the same)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: no svix headers", { status: 400 });
  }
  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Error verifying webhook", { status: 400 });
  }

  const eventType = evt.type;
  await connectDB();

  // --- HANDLE USER CREATION ---
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      await User.create({
        clerkUserId: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
        role: "UNASSIGNED", // Default role
      });
    } catch (dbError) {
      console.error("DB Error on User Creation:", dbError);
      return new Response("Database error during user creation", { status: 500 });
    }
  }

  // --- HANDLE ORGANIZATION CREATION ---
  if (eventType === "organization.created") {
    const { id, name, created_by } = evt.data;
    try {
      const owner = await User.findOne({ clerkUserId: created_by });
      if (owner) {
        await Organization.create({
          clerkOrgId: id,
          name: name,
          status: "PENDING",
          owner: owner._id,
        });
      }
    } catch (dbError) {
      console.error("DB Error on Org Creation:", dbError);
      return new Response("Database error during organization creation", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}