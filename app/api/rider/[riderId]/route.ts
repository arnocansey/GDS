import { NextResponse } from "next/server";
import { getBookingsForRider, getRiderById } from "@/lib/storage";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    riderId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { riderId } = await context.params;
  const rider = await getRiderById(decodeURIComponent(riderId));

  if (!rider) {
    return NextResponse.json({ error: "Rider not found" }, { status: 404 });
  }

  return NextResponse.json({
    rider,
    bookings: await getBookingsForRider(rider.id),
  });
}
