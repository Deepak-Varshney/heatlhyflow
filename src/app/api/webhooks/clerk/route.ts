// app/api/webhooks/clerk/route.ts

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { NextResponse } from "next/server";

let isDbConnected = false;

async function ensureDbConnection() {
    if (!isDbConnected) {
        await connectDB();
        isDbConnected = true;
    }
}

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        return NextResponse.json("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
    }

    // Header verification (remains the same)
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json("Error: no svix headers", { status: 400 });
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
        console.error("Error verifying webhook:", err);
        return NextResponse.json("Error verifying webhook", { status: 400 });
    }

    const eventType = evt.type;
    await ensureDbConnection();

    // --- USER EVENTS ---
    if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        try {
            const res = await User.create({
                clerkUserId: id,
                email: email_addresses[0].email_address,
                firstName: first_name,
                lastName: last_name,
                imageUrl: image_url,
                role: "UNASSIGNED",
            });
            return NextResponse.json(res, { status: 200 });
        } catch (err) {
            console.error("Error creating user:", err);
            return NextResponse.json("Error creating user", { status: 500 });
        }
    }

    if (eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        try {
            const res = await User.findOneAndUpdate(
                { clerkUserId: id },
                {
                    email: email_addresses[0].email_address,
                    firstName: first_name,
                    lastName: last_name,
                    imageUrl: image_url,
                }
            );
            if (!res) {
                return NextResponse.json("User not found", { status: 404 });
            }
            return NextResponse.json(res, { status: 200 });
        } catch (err) {
            console.error("Error updating user:", err);
            return NextResponse.json("Error updating user", { status: 500 });
        }
    }

    // --- ORGANIZATION EVENTS ---
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
                return NextResponse.json("Organization created", { status: 200 });
            }
            return NextResponse.json("Owner not found", { status: 404 });
        } catch (err) {
            console.error("Error creating organization:", err);
            return NextResponse.json("Error creating organization", { status: 500 });
        }
    }

    if (eventType === "organization.updated") {
        const { id, name } = evt.data;
        try {
            const res = await Organization.findOneAndUpdate({ clerkOrgId: id }, { name: name });
            if (!res) {
                return NextResponse.json("Organization not found", { status: 404 });
            }
            return NextResponse.json(res, { status: 200 });
        } catch (err) {
            console.error("Error updating organization:", err);
            return NextResponse.json("Error updating organization", { status: 500 });
        }
    }

    if (eventType === "organization.deleted") {
        const { id } = evt.data;
        try {
            // Soft delete instead of hard delete
            await Organization.findOneAndUpdate({ clerkOrgId: id }, { status: "DELETED" });
            return NextResponse.json("Organization deleted", { status: 200 });
        } catch (err) {
            console.error("Error deleting organization:", err);
            return NextResponse.json("Error deleting organization", { status: 500 });
        }
    }

    // --- MEMBERSHIP EVENTS ---
    if (eventType === "organizationMembership.deleted") {
        const { public_user_data } = evt.data;
        try {
            const user = await User.findOneAndUpdate(
                { clerkUserId: public_user_data.user_id },
                { role: 'UNASSIGNED' }
            );
            if (!user) {
                return NextResponse.json("User not found", { status: 404 });
            }
            return NextResponse.json("User role reset", { status: 200 });
        } catch (err) {
            console.error("Error resetting user role:", err);
            return NextResponse.json("Error resetting user role", { status: 500 });
        }
    }

    // Default case for unhandled events
    console.warn(`Unhandled event type: ${eventType}`);
    return NextResponse.json("Unhandled event", { status: 200 });
}

export async function GET() {
    try {
        await ensureDbConnection();
        return NextResponse.json("WORKING", { status: 200 });
    } catch (err) {
        console.error("Error with DB connection:", err);
        return NextResponse.json("Error with DB connection", { status: 500 });
    }
}
