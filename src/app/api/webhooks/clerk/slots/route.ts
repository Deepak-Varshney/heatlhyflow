import { getAvailableSlots } from "@/actions/availability-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {id, date} = await req.json();
    const res = await getAvailableSlots(id, date)
    return NextResponse.json(res)
}
