"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Booking, DeliveryStatus, Rider } from "@/lib/types";

const riderStatuses: DeliveryStatus[] = ["collected", "in_transit", "delivered"];

export function RiderDashboard({
  riders,
  selectedRider,
  bookings,
}: {
  riders: Rider[];
  selectedRider?: Rider;
  bookings: Booking[];
}) {
  const router = useRouter();
  const [savingTracking, setSavingTracking] = useState("");

  async function updateShipment(formData: FormData) {
    const trackingNumber = String(formData.get("trackingNumber"));
    const status = String(formData.get("status")) as DeliveryStatus;
    setSavingTracking(trackingNumber);
    await fetch(`/api/rider/bookings/${encodeURIComponent(trackingNumber)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        riderId: selectedRider?.id,
        status,
        proofReceiverName: formData.get("proofReceiverName"),
        proofPhotoUrl: formData.get("proofPhotoUrl"),
        proofSignature: formData.get("proofSignature"),
      }),
    });
    setSavingTracking("");
    router.refresh();
  }

  return (
    <section className="section-shell rider-page">
      <span className="section-kicker">Rider App</span>
      <h1>Assigned Deliveries</h1>
      <form className="rider-selector">
        <select
          aria-label="Choose rider"
          defaultValue={selectedRider?.id || ""}
          name="riderId"
          onChange={(event) => router.push(`/rider?riderId=${event.target.value}`)}
        >
          <option value="">Select rider</option>
          {riders.map((rider) => (
            <option key={rider.id} value={rider.id}>
              {rider.name} - {rider.city}
            </option>
          ))}
        </select>
      </form>

      {selectedRider ? (
        <div className="portal-grid rider-grid">
          {bookings.map((booking) => (
            <article className="portal-card rider-card" key={booking.id}>
              <span className={`status-badge status-${booking.status}`}>{booking.status.replace("_", " ")}</span>
              <h2>{booking.trackingNumber}</h2>
              <p>{booking.pickup} to {booking.destination}</p>
              <small>{booking.receiverName || "Receiver"} | {booking.receiverPhone}</small>
              <form action={updateShipment} className="rider-update-form">
                <input name="trackingNumber" type="hidden" value={booking.trackingNumber} />
                <select name="status" defaultValue={booking.status}>
                  {riderStatuses.map((option) => (
                    <option key={option} value={option}>
                      {option.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <input name="proofReceiverName" placeholder="Receiver name" />
                <input name="proofSignature" placeholder="Signature text" />
                <input name="proofPhotoUrl" placeholder="Proof photo URL" />
                <button className="button primary" disabled={savingTracking === booking.trackingNumber} type="submit">
                  {savingTracking === booking.trackingNumber ? "Saving..." : "Update"}
                </button>
              </form>
            </article>
          ))}
          {!bookings.length ? <p>No assigned shipments for this rider.</p> : null}
        </div>
      ) : (
        <p>Select a rider to view assigned deliveries.</p>
      )}
    </section>
  );
}
