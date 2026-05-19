import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  Clock3,
  Headphones,
  MapPin,
  Package,
  ShieldCheck,
  TrendingUp,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Fast Delivery",
    text: "Optimized routing for minimum transit times.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Service",
    text: "Insured packages and trained professionals.",
  },
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    text: "Reaching every corner of Ghana's 16 regions.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    text: "Always here when you need us.",
  },
];

const services = [
  {
    icon: Clock3,
    title: "Same-Day Delivery",
    text: "Lightning fast local delivery within major cities.",
  },
  {
    icon: Package,
    title: "Parcel Services",
    text: "Secure nationwide package handling for everyday shipping.",
  },
  {
    icon: Truck,
    title: "Express Dispatch",
    text: "Priority courier service for urgent and high-value items.",
  },
  {
    icon: TrendingUp,
    title: "Business Logistics",
    text: "Enterprise-grade solutions for retail and manufacturing.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <span className="eyebrow">
            <span />
            Premium Logistics in Ghana
          </span>
          <h1>
            Fast Delivery <mark>Across Ghana</mark>
          </h1>
          <p>
            Experience world-class logistics with a proud Ghanaian identity.
            Speed, reliability, and precision for every parcel, every time.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/book">
              Book Delivery <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="button secondary" href="/track">
              Track Parcel
            </Link>
          </div>
          <div className="trust-row" aria-label="Delivery guarantees">
            <span>Insured parcels</span>
            <span>Live tracking</span>
            <span>Verified riders</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Delivery truck on the road">
          <div className="photo-panel hero-photo">
            <Image
              src="/images/delivery-truck.jpg"
              alt="Delivery truck on the road"
              fill
              priority
              sizes="(max-width: 980px) 92vw, 42vw"
            />
            <div className="secure-chip">
              <ShieldCheck aria-hidden="true" />
              <span>
                <strong>100% Secure</strong>
                <small>Guaranteed delivery</small>
              </span>
            </div>
            <div className="route-board hero-route-card">
              <div className="route-stop">
                <MapPin aria-hidden="true" />
                <span>
                  <small>Pickup</small>
                  <strong>Accra Ridge</strong>
                </span>
              </div>
              <div className="route-line">
                <span />
              </div>
              <div className="route-stop">
                <Truck aria-hidden="true" />
                <span>
                  <small>ETA</small>
                  <strong>Today, 4:30 PM</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-band">
        <div>
          <strong>10k+</strong>
          <span>Deliveries</span>
        </div>
        <div>
          <strong>16</strong>
          <span>Regions</span>
        </div>
        <div>
          <strong>99%</strong>
          <span>On-time</span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>Support</span>
        </div>
      </section>

      <section className="section-shell quick-quote">
        <div>
          <span className="section-kicker">Instant Estimate</span>
          <h2>Price a route before you book</h2>
          <p>
            Give customers a clearer starting point with common Ghana delivery
            routes, service levels, and expected handoff times.
          </p>
        </div>
        <div className="quote-preview panel">
          <div>
            <span>From</span>
            <strong>Accra</strong>
          </div>
          <ArrowRight aria-hidden="true" />
          <div>
            <span>To</span>
            <strong>Kumasi</strong>
          </div>
          <div className="quote-total">
            <span>Express dispatch</span>
            <strong>GHC 45</strong>
          </div>
          <Link className="button primary" href="/book">
            Book This Route
          </Link>
        </div>
      </section>

      <section className="split section-shell">
        <div>
          <h2>Why Choose GDS Ghana?</h2>
          <p>
            We blend international logistics standards with deep local knowledge.
            Our technology-driven approach keeps your deliveries visible, secure,
            and on time.
          </p>
          <div className="feature-list">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title}>
                  <Icon aria-hidden="true" />
                  <span>
                    <strong>{feature.title}</strong>
                    <small>{feature.text}</small>
                  </span>
                </article>
              );
            })}
          </div>
        </div>

        <div className="delivery-card">
          <Image
            src="/images/warehouse-operations.jpg"
            alt="Warehouse aisle with stored goods and a forklift"
            fill
            sizes="(max-width: 980px) 92vw, 44vw"
          />
          <Truck aria-hidden="true" />
          <div className="tracking-mini">
            <div>
              <strong>GDS-2024-8921</strong>
              <span>In Transit to Kumasi</span>
            </div>
            <em>On Time</em>
            <div className="progress">
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell centered">
        <span className="section-kicker">Our Services</span>
        <h2>Logistics Solutions for Every Need</h2>
        <p>
          From personal parcels to enterprise supply chains, we deliver with
          speed and precision.
        </p>
        <div className="service-grid compact">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className="service-card" key={service.title}>
                <Icon aria-hidden="true" />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <Link href="/services">
                  Learn More <ArrowRight aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="app-banner section-shell">
        <span>Coming Soon</span>
        <h2>The GDS Mobile App</h2>
        <p>
          Track parcels in real time, book deliveries in seconds, and manage
          shipments from anywhere.
        </p>
        <Link className="button light" href="/contact">
          Stay Tuned
        </Link>
      </section>
    </>
  );
}
