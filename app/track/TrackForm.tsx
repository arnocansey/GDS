"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Clock3, MapPin, Search, ShieldCheck } from "lucide-react";
import { WebMap } from "@/components/WebMap";
import type { Booking } from "@/lib/types";

type TrackingState =
  | { type: "empty" }
  | {
      type: "result";
      booking: Booking;
      progress: number;
    }
  | {
      type: "missing";
      trackingNumber: string;
    };

export function TrackForm() {
  const [tracking, setTracking] = useState<TrackingState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const trackingNumber = String(form.get("trackingNumber") || "").trim().toUpperCase();

    if (!trackingNumber) {
      setTracking({ type: "empty" });
      return;
    }

    setIsLoading(true);
    const response = await fetch(`/api/track/${encodeURIComponent(trackingNumber)}`);
    const result = (await response.json()) as { booking?: Booking };
    setIsLoading(false);

    if (!response.ok || !result.booking) {
      setTracking({ type: "missing", trackingNumber });
      return;
    }

    const progressByStatus: Record<Booking["status"], number> = {
      pending: 18,
      confirmed: 32,
      collected: 52,
      in_transit: 72,
      delivered: 100,
      cancelled: 8,
    };

    setTracking({
      type: "result",
      booking: result.booking,
      progress: progressByStatus[result.booking.status],
    });
  }

  return (
    <>
      <form className="track-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="tracking-number">
          Tracking number
        </label>
        <div className="input-icon">
          <Search aria-hidden="true" />
          <input
            id="tracking-number"
            name="trackingNumber"
            placeholder="e.g. GDS-2024-001234"
          />
        </div>
        <button className="button primary" disabled={isLoading} type="submit">
          {isLoading ? "Checking..." : "Track"}
        </button>
      </form>
      <small>Try: GDS-2024-001234 for a demo</small>

      {tracking?.type === "empty" ? (
        <section className="section-shell track-result" aria-live="polite">
          <div className="result-card">
            <h2>Enter a tracking number</h2>
            <p>Please add your GDS tracking number to continue.</p>
          </div>
        </section>
      ) : null}

      {tracking?.type === "missing" ? (
        <section className="section-shell track-result" aria-live="polite">
          <div className="result-card">
            <span className="section-kicker">Not Found</span>
            <h2>{tracking.trackingNumber}</h2>
            <p>No shipment was found for this tracking number. Check the code and try again.</p>
          </div>
        </section>
      ) : null}

      {tracking?.type === "result" ? (
        <section className="section-shell track-result" aria-live="polite">
          <div className="result-card">
            <div className="result-topline">
              <span className={`status-badge status-${tracking.booking.status}`}>
                {tracking.booking.status.replace("_", " ")}
              </span>
              <strong>{tracking.booking.trackingNumber}</strong>
            </div>
            <h2>Your parcel is headed to {tracking.booking.destination}.</h2>
            <WebMap
              destination={tracking.booking.destination}
              pickup={tracking.booking.pickup}
              subtitle={`${tracking.booking.pickup} to ${tracking.booking.destination}`}
              title="Shipment route map"
            />
            <div className="result-metrics">
              <article>
                <Clock3 aria-hidden="true" />
                <span>ETA</span>
                <strong>{tracking.booking.status === "delivered" ? "Delivered" : "On schedule"}</strong>
              </article>
              <article>
                <ShieldCheck aria-hidden="true" />
                <span>Handling</span>
                <strong>{tracking.booking.fragile ? "Fragile" : "Standard"}</strong>
              </article>
              <article>
                <MapPin aria-hidden="true" />
                <span>Route</span>
                <strong>{tracking.booking.pickup} to {tracking.booking.destination}</strong>
              </article>
            </div>
            <div className="tracking-mini">
              <div>
                <strong>Destination</strong>
                <span>{tracking.booking.destination}</span>
              </div>
              <em>{tracking.booking.status === "delivered" ? "Complete" : "On Time"}</em>
              <div className="progress">
                <span style={{ width: `${tracking.progress}%` }} />
              </div>
            </div>
            <div className="timeline">
              {tracking.booking.timeline.map((event) => (
                <article key={`${event.label}-${event.at}`}>
                  <i />
                  <div>
                    <strong>{event.label}</strong>
                    <p>{event.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <Link className="button secondary result-link" href={`/track/${tracking.booking.trackingNumber}`}>
              Open Tracking Page
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
