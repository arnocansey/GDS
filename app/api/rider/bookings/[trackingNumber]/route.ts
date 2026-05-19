import { NextResponse } from "next/server";
import { getBookingByTracking, updateBookingOperations } from "@/lib/storage";
import type { DeliveryStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const riderStatuses: DeliveryStatus[] = ["collected", "in_transit", "delivered"];

type RouteContext = {
  params: Promise<{
    trackingNumber: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { trackingNumber } = await context.params;
  const body = (await request.json()) as {
    riderId?: string;
    status?: DeliveryStatus;
    proofReceiverName?: string;
    proofPhotoUrl?: string;
    proofSignature?: string;
  };
  const booking = await getBookingByTracking(decodeURIComponent(trackingNumber));

  if (!booking || booking.assignedRiderId !== body.riderId) {
    return NextResponse.json({ error: "Shipment is not assigned to this rider" }, { status: 403 });
  }

  if (!body.status || !riderStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid rider status" }, { status: 400 });
  }

  const updated = await updateBookingOperations(
    booking.trackingNumber,
    {
      status: body.status,
      proofReceiverName: body.proofReceiverName,
      proofPhotoUrl: body.proofPhotoUrl,
      proofSignature: body.proofSignature,
    },
    `rider:${body.riderId}`,
  );

  return NextResponse.json({ booking: updated });
}
