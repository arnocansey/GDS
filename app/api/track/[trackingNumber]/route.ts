import { NextResponse } from "next/server";
import { getBookingByTracking } from "@/lib/storage";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    trackingNumber: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { trackingNumber } = await context.params;
  const booking = await getBookingByTracking(decodeURIComponent(trackingNumber));

  if (!booking) {
    return NextResponse.json({ error: "Tracking number not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
