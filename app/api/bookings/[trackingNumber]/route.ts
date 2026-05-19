import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getBookingByTracking, updateBookingOperations } from "@/lib/storage";
import type { DeliveryStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const statuses: DeliveryStatus[] = [
  "pending",
  "confirmed",
  "collected",
  "in_transit",
  "delivered",
  "cancelled",
];

type RouteContext = {
  params: Promise<{
    trackingNumber: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { trackingNumber } = await context.params;
  const booking = await getBookingByTracking(decodeURIComponent(trackingNumber));

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { trackingNumber } = await context.params;
  const body = (await request.json()) as {
    status?: string;
    assignedRiderId?: string | null;
    internalNotes?: string;
    proofReceiverName?: string;
    proofPhotoUrl?: string;
    proofSignature?: string;
  };
  const nextStatus = body.status;

  if (nextStatus && !statuses.includes(nextStatus as DeliveryStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const booking = await updateBookingOperations(decodeURIComponent(trackingNumber), {
    status: nextStatus as DeliveryStatus | undefined,
    assignedRiderId: body.assignedRiderId,
    internalNotes: body.internalNotes,
    proofReceiverName: body.proofReceiverName,
    proofPhotoUrl: body.proofPhotoUrl,
    proofSignature: body.proofSignature,
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
