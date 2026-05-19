"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DeliveryStatus } from "@/lib/types";

const statuses: DeliveryStatus[] = [
  "pending",
  "confirmed",
  "collected",
  "in_transit",
  "delivered",
  "cancelled",
];

export function AdminStatusForm({
  trackingNumber,
  currentStatus,
}: {
  trackingNumber: string;
  currentStatus: DeliveryStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<DeliveryStatus>(currentStatus);
  const [isSaving, setIsSaving] = useState(false);

  async function saveStatus() {
    setIsSaving(true);
    await fetch(`/api/bookings/${encodeURIComponent(trackingNumber)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setIsSaving(false);
    router.refresh();
  }

  return (
    <div className="admin-status-form">
      <select
        aria-label={`Status for ${trackingNumber}`}
        value={status}
        onChange={(event) => setStatus(event.target.value as DeliveryStatus)}
      >
        {statuses.map((option) => (
          <option key={option} value={option}>
            {option.replace("_", " ")}
          </option>
        ))}
      </select>
      <button className="button primary" disabled={isSaving} type="button" onClick={saveStatus}>
        {isSaving ? "Saving..." : "Update"}
      </button>
    </div>
  );
}
