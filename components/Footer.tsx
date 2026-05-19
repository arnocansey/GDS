import Link from "next/link";
import { Brand } from "./Brand";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section>
          <Brand footer />
          <p>Premium courier and logistics solutions serving all 16 regions of Ghana.</p>
          <div className="socials">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="X">
              x
            </a>
            <a href="#" aria-label="Instagram">
              ig
            </a>
            <a href="#" aria-label="LinkedIn">
              in
            </a>
          </div>
        </section>

        <section>
          <h2>Quick Links</h2>
          <Link href="/about">About Us</Link>
          <Link href="/track">Track Order</Link>
          <Link href="/book">Book Delivery</Link>
          <Link href="/contact">Contact Support</Link>
          <Link href="/admin">Admin Dashboard</Link>
        </section>

        <section>
          <h2>Services</h2>
          <Link href="/services">Same-Day Delivery</Link>
          <Link href="/services">Parcel Services</Link>
          <Link href="/services">Express Dispatch</Link>
          <Link href="/services">Business Logistics</Link>
        </section>

        <section>
          <h2>Contact Info</h2>
          <p>
            <strong>A.</strong> 14 Independence Avenue, Ridge, Accra, Ghana
          </p>
          <p>
            <strong>E.</strong> info@gdsghana.com
          </p>
          <p>
            <strong>P.</strong> +233 30 294 5678
          </p>
        </section>
      </div>

      <div className="footer-bottom">
        <span>(c) 2026 GDS Ghana Delivery Service. All rights reserved.</span>
        <span>
          <a href="#">Privacy Policy</a> <b>|</b> <a href="#">Terms of Service</a>
        </span>
      </div>
    </footer>
  );
}
