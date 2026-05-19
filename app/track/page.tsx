import { TrackForm } from "./TrackForm";

export default function TrackPage() {
  return (
    <section className="track-hero section-shell centered">
      <span className="section-kicker">Shipment Visibility</span>
      <h1>Track Your Order</h1>
      <p>Enter your GDS tracking number to see route progress, ETA, and delivery updates.</p>
      <TrackForm />
    </section>
  );
}
