import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getAllBookings } from "@/lib/storage";

export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await getAllBookings();
  const rows = [
    [
      "trackingNumber",
      "status",
      "service",
      "pickup",
      "destination",
      "customerEmail",
      "senderPhone",
      "receiverPhone",
      "assignedRider",
      "amount",
      "distanceKm",
      "durationMinutes",
      "createdAt",
    ],
    ...bookings.map((booking) => [
      booking.trackingNumber,
      booking.status,
      booking.service,
      booking.pickup,
      booking.destination,
      booking.customerEmail || "",
      booking.senderPhone,
      booking.receiverPhone,
      booking.assignedRiderName || "",
      booking.amount,
      booking.distanceKm || "",
      booking.durationMinutes || "",
      booking.createdAt,
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=gds-bookings.csv",
    },
  });
}
