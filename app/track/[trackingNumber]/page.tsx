import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, ShieldCheck } from "lucide-react";
import { WebMap } from "@/components/WebMap";
import { getBookingByTracking } from "@/lib/storage";
import type { Booking } from "@/lib/types";

export const dynamic = "force-dynamic";

type TrackDetailPageProps = {
  params: Promise<{
    trackingNumber: string;
  }>;
};

const progressByStatus: Record<Booking["status"], number> = {
  pending: 18,
  confirmed: 32,
  collected: 52,
  in_transit: 72,
  delivered: 100,
  cancelled: 8,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function TrackDetailPage({ params }: TrackDetailPageProps) {
  const { trackingNumber } = await params;
  const booking = await getBookingByTracking(decodeURIComponent(trackingNumber));

  if (!booking) {
    notFound();
  }

  return (
    <section className="section-shell detail-page">
      <Link className="back-link" href="/track">
        <ArrowLeft aria-hidden="true" /> Back to tracking
      </Link>
      <span className="section-kicker">Shipment Tracking</span>
      <h1>{booking.trackingNumber}</h1>
      <p>
        {booking.service} from {booking.pickup} to {booking.destination}.
      </p>

      <div className="shipment-command">
        <WebMap
          className="detail-map"
          destination={booking.destination}
          pickup={booking.pickup}
          subtitle={`${booking.pickup} to ${booking.destination}`}
          title="Live route map"
        />
      </div>

      <div className="command-stack route-command-stack">
        <article>
          <Clock3 aria-hidden="true" />
          <span>Current ETA</span>
          <strong>{booking.status === "delivered" ? "Delivered" : "On schedule"}</strong>
        </article>
        <article>
          <ShieldCheck aria-hidden="true" />
          <span>Service</span>
          <strong>{booking.service}</strong>
        </article>
        <article>
          <Clock3 aria-hidden="true" />
          <span>Route Estimate</span>
          <strong>
            {booking.distanceKm ? `${booking.distanceKm} km` : "Calculating"}
            {booking.durationMinutes ? ` | ${booking.durationMinutes} min` : ""}
          </strong>
        </article>
      </div>

      <div className="result-card detail-card">
        <div className="detail-header">
          <div>
            <span>Status</span>
            <strong className={`status-badge status-${booking.status}`}>
              {booking.status.replace("_", " ")}
            </strong>
          </div>
          <div>
            <span>Estimated Fee</span>
            <strong>GHC {booking.amount}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>{booking.payment}</strong>
          </div>
          <div>
            <span>Rider</span>
            <strong>{booking.assignedRiderName || "Unassigned"}</strong>
          </div>
        </div>
        <div className="progress detail-progress">
          <span style={{ width: `${progressByStatus[booking.status]}%` }} />
        </div>

        <div className="detail-grid">
          <article>
            <h2>Pickup</h2>
            <p>{booking.pickup}</p>
            <small>{booking.senderPhone}</small>
          </article>
          <article>
            <h2>Destination</h2>
            <p>{booking.destination}</p>
            <small>{booking.receiverPhone}</small>
          </article>
          <article>
            <h2>Package</h2>
            <p>{booking.description}</p>
            <small>
              {booking.parcelCategory} | {booking.weight}
              {booking.fragile ? " | Fragile" : ""}
            </small>
          </article>
          <article>
            <h2>Pickup Window</h2>
            <p>{booking.pickupWindow || "To be confirmed"}</p>
            <small>{booking.customerEmail || booking.customerName || "Customer details pending"}</small>
          </article>
          <article>
            <h2>Proof of Delivery</h2>
            <p>{booking.proofReceiverName || "Not uploaded yet"}</p>
            <small>{booking.proofSignature || booking.proofPhotoUrl || "Awaiting rider update"}</small>
          </article>
        </div>

        <h2>Timeline</h2>
        <div className="timeline">
          {booking.timeline.map((event) => (
            <article key={`${event.label}-${event.at}`}>
              <i />
              <div>
                <strong>{event.label}</strong>
                <p>{event.description}</p>
                <small>{formatDate(event.at)}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
