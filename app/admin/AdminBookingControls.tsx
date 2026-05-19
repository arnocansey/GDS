"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Booking, DeliveryStatus, Rider } from "@/lib/types";

const statuses: DeliveryStatus[] = [
  "pending",
  "confirmed",
  "collected",
  "in_transit",
  "delivered",
  "cancelled",
];

export function AdminBookingControls({
  booking,
  riders,
}: {
  booking: Booking;
  riders: Rider[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<DeliveryStatus>(booking.status);
  const [assignedRiderId, setAssignedRiderId] = useState(booking.assignedRiderId || "");
  const [internalNotes, setInternalNotes] = useState(booking.internalNotes || "");
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    setIsSaving(true);
    await fetch(`/api/bookings/${encodeURIComponent(booking.trackingNumber)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        assignedRiderId: assignedRiderId || null,
        internalNotes,
      }),
    });
    setIsSaving(false);
    router.refresh();
  }

  return (
    <div className="admin-status-form admin-dispatch-form">
      <select
        aria-label={`Status for ${booking.trackingNumber}`}
        value={status}
        onChange={(event) => setStatus(event.target.value as DeliveryStatus)}
      >
        {statuses.map((option) => (
          <option key={option} value={option}>
            {option.replace("_", " ")}
          </option>
        ))}
      </select>
      <select
        aria-label={`Rider for ${booking.trackingNumber}`}
        value={assignedRiderId}
        onChange={(event) => setAssignedRiderId(event.target.value)}
      >
        <option value="">Unassigned</option>
        {riders.map((rider) => (
          <option key={rider.id} value={rider.id}>
            {rider.name} - {rider.city}
          </option>
        ))}
      </select>
      <textarea
        aria-label={`Internal notes for ${booking.trackingNumber}`}
        onChange={(event) => setInternalNotes(event.target.value)}
        placeholder="Internal note"
        value={internalNotes}
      />
      <button className="button primary" disabled={isSaving} type="button" onClick={save}>
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
