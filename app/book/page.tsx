import { BookingWizard } from "./BookingWizard";

export default function BookPage() {
  return (
    <section className="book-section booking-page section-shell">
      <div className="booking-intro">
        <span className="section-kicker">Dispatch Console</span>
        <h1>Book a Delivery</h1>
        <p className="page-intro">
          Enter the route, package, and payment details. GDS will confirm pickup
          availability and issue your tracking number immediately.
        </p>
      </div>
      <BookingWizard />
    </section>
  );
}
