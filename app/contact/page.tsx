import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WebMap } from "@/components/WebMap";
import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  return (
    <>
      <section className="page-hero plain">
        <h1>Contact Us</h1>
        <p>
          We're here to help. Reach out to our customer support team for
          inquiries about your deliveries.
        </p>
      </section>

      <section className="section-shell contact-grid">
        <aside className="contact-stack">
          <article className="contact-card red-top">
            <Mail aria-hidden="true" />
            <strong>Email Us</strong>
            <span>
              info@gdsghana.com
              <br />
              support@gdsghana.com
            </span>
          </article>
          <article className="contact-card green-top">
            <Phone aria-hidden="true" />
            <strong>Call Us</strong>
            <span>
              +233 30 294 5678
              <br />
              +233 54 123 4567
            </span>
          </article>
          <article className="contact-card yellow-top">
            <MapPin aria-hidden="true" />
            <strong>Visit Us</strong>
            <span>
              14 Independence Avenue
              <br />
              Ridge, Accra, Ghana
            </span>
          </article>
          <article className="contact-card dark">
            <Clock aria-hidden="true" />
            <strong>Support Hours</strong>
            <span>
              Mon - Sat: 8:00 AM - 8:00 PM
              <br />
              Sunday: Closed
            </span>
          </article>
        </aside>

        <ContactForm />
      </section>

      <section className="section-shell">
        <WebMap
          className="contact-map"
          pickup="Ridge, Accra"
          subtitle="14 Independence Avenue, Ridge, Accra"
          title="GDS Headquarters"
        />
      </section>
    </>
  );
}
