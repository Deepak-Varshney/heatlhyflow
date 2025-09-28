// app/api/webhooks/clerk/new/route.ts

import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Organization from "@/models/Organization";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    // Header verification (remains the same)
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
    // --- USER EVENTS ---
    if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const res = await User.create({
            clerkUserId: id,
            email: email_addresses[0].email_address,
            firstName: first_name,
            lastName: last_name,
            imageUrl: image_url,
            role: "UNASSIGNED",
        });
        return new Response(res, { status: 200 });


    }

    if (eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const res = await User.findOneAndUpdate(
            { clerkUserId: id },
            {
                email: email_addresses[0].email_address,
                firstName: first_name,
                lastName: last_name,
                imageUrl: image_url,
            }
        );
        return new Response(res, { status: 200 });

    }

    //   // --- ORGANIZATION EVENTS ---
    //   if (eventType === "organization.created") {
    //     const { id, name, created_by } = evt.data;
    //     const owner = await User.findOne({ clerkUserId: created_by });
    //     if (owner) {
    //       await Organization.create({
    //         clerkOrgId: id,
    //         name: name,
    //         status: "PENDING",
    //         owner: owner._id,
    //       });
    //     }
    //   }

    //   if (eventType === "organization.updated") {
    //     const { id, name } = evt.data;
    //     await Organization.findOneAndUpdate({ clerkOrgId: id }, { name: name });
    //   }

    //   if (eventType === "organization.deleted") {
    //     const { id } = evt.data;
    //     // For safety, you might want to soft-delete (set status to "DELETED")
    //     // but for now, a hard delete is fine for this event.
    //     await Organization.findOneAndDelete({ clerkOrgId: id });
    //   }

    //   // --- MEMBERSHIP EVENTS ---
    //   if (eventType === "organizationMembership.deleted") {
    //     const { public_user_data } = evt.data;
    //     // When a user is removed from an org, we reset their role to UNASSIGNED.
    //     await User.findOneAndUpdate(
    //       { clerkUserId: public_user_data.user_id },
    //       { role: 'UNASSIGNED' }
    //     );
    //   }

    return new Response("", { status: 200 });
}