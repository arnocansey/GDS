import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createBooking, getAllBookings } from "@/lib/storage";
import { parseBookingInput } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ bookings: await getAllBookings() });
}

export async function POST(request: Request) {
  try {
    const input = parseBookingInput(await request.json());
    const booking = await createBooking(input);
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create booking" },
      { status: 400 },
    );
  }
}
