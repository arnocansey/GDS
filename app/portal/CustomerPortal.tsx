"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import type { Booking } from "@/lib/types";

export function CustomerPortal() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const query = String(form.get("query") || "").trim();

    if (!query) {
      setStatus("Enter your phone number or email.");
      return;
    }

    setIsLoading(true);
    setStatus("Looking up shipments...");
    const response = await fetch(`/api/customer/bookings?q=${encodeURIComponent(query)}`);
    const result = (await response.json()) as { bookings?: Booking[] };
    setIsLoading(false);
    setBookings(result.bookings || []);
    setStatus(result.bookings?.length ? "" : "No shipments found for that phone or email.");
  }

  return (
    <section className="section-shell portal-page">
      <span className="section-kicker">Customer Portal</span>
      <h1>Find Your Deliveries</h1>
      <p>Use the phone number or email from your booking to view your shipment history.</p>

      <form className="track-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="portal-query">Phone or email</label>
        <div className="input-icon">
          <Search aria-hidden="true" />
          <input id="portal-query" name="query" placeholder="Phone number or email" />
        </div>
        <button className="button primary" disabled={isLoading} type="submit">
          {isLoading ? "Searching..." : "Find"}
        </button>
      </form>
      <p className="form-status" aria-live="polite">{status}</p>

      <div className="portal-grid">
        {bookings.map((booking) => (
          <article className="portal-card" key={booking.id}>
            <span className={`status-badge status-${booking.status}`}>{booking.status.replace("_", " ")}</span>
            <h2>{booking.trackingNumber}</h2>
            <p>{booking.pickup} to {booking.destination}</p>
            <small>{booking.service} | GHC {booking.amount}</small>
            <Link className="button secondary" href={`/track/${booking.trackingNumber}`}>
              Open Tracking
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
