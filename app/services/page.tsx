import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3, MapPin, Package, ShieldCheck, TrendingUp, Truck } from "lucide-react";

const services = [
  {
    icon: Clock3,
    title: "Same-Day Delivery",
    text: "Lightning fast local delivery within major cities. Perfect for urgent documents and small packages.",
    bullets: ["Real-time tracking", "SMS updates", "Signature proof"],
    price: "From GHC 15",
    href: "/book",
    action: "Book Now",
  },
  {
    icon: Package,
    title: "Parcel Services",
    text: "Safe package handling for everyday shipping needs across Ghana.",
    bullets: ["Insured up to GHC 500", "2 to 3 day nationwide", "Drop-off locations"],
    price: "From GHC 25",
    href: "/book",
    action: "Book Now",
  },
  {
    icon: Truck,
    title: "Express Dispatch",
    text: "Priority courier service for high-value items and sensitive materials.",
    bullets: ["Dedicated courier", "Immediate dispatch", "Highest priority"],
    price: "From GHC 45",
    href: "/book",
    action: "Book Now",
  },
  {
    icon: TrendingUp,
    title: "Business Logistics",
    text: "Scalable warehousing, fulfillment, and last-mile delivery for teams.",
    bullets: ["API integration", "Bulk discounts", "Account manager"],
    price: "Custom Pricing",
    href: "/contact",
    action: "Contact Us",
  },
];

const steps = [
  { icon: Package, step: "Step 01", title: "Book", text: "Enter your details online." },
  { icon: MapPin, step: "Step 02", title: "Pickup", text: "We collect from your location." },
  { icon: Truck, step: "Step 03", title: "Transit", text: "Real-time tracking available." },
  { icon: ShieldCheck, step: "Step 04", title: "Delivered", text: "Safe arrival with signature." },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero red">
        <h1>Our Services</h1>
        <p>Comprehensive logistics solutions designed for the modern Ghanaian market.</p>
      </section>

      <section className="section-shell image-story">
        <div>
          <span className="section-kicker">Air Freight Ready</span>
          <h2>Move priority cargo with visibility from pickup to landing</h2>
          <p>
            Pair same-day pickup, airport handoff, and route tracking for
            time-sensitive shipments that need more than standard parcel
            handling.
          </p>
          <Link className="button primary" href="/book">
            Start a Shipment <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="image-frame wide">
          <Image
            src="/images/cargo-aircraft.jpg"
            alt="Cargo aircraft on an airport runway"
            fill
            sizes="(max-width: 980px) 92vw, 48vw"
          />
        </div>
      </section>

      <section className="section-shell service-grid large">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <article className="service-card big" key={service.title}>
              <Icon aria-hidden="true" />
              <h2>{service.title}</h2>
              <p>{service.text}</p>
              <ul>
                {service.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div>
                <strong>{service.price}</strong>
                <Link href={service.href}>
                  {service.action} <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="section-shell centered">
        <h2>How It Works</h2>
        <div className="steps-row">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.title}>
                <Icon aria-hidden="true" />
                <small>{step.step}</small>
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-shell faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>How long does delivery usually take?</summary>
          <p>
            Same-day deliveries arrive within business hours. Nationwide parcels
            usually arrive within 2 to 3 business days.
          </p>
        </details>
        <details>
          <summary>Can I track my package in real time?</summary>
          <p>Yes. Every shipment receives a GDS tracking number with status updates.</p>
        </details>
        <details>
          <summary>What items are prohibited from shipping?</summary>
          <p>
            Hazardous materials, illegal goods, cash, and temperature-sensitive
            medical items require special handling or are restricted.
          </p>
        </details>
        <details>
          <summary>Do you offer Cash on Delivery?</summary>
          <p>Cash on Delivery is available for approved business accounts and selected routes.</p>
        </details>
      </section>
    </>
  );
}
