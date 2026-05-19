"use client";

import Link from "next/link";
import { CalendarCheck, Menu, PhoneCall, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "./Brand";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/track", label: "Track Order" },
  { href: "/portal", label: "Customer Portal" },
  { href: "/rider", label: "Rider" },
  { href: "/contact", label: "Contact Us" },
  { href: "/admin", label: "Admin", utility: true },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <Brand />

        <button
          className="icon-button menu-toggle"
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav className={`site-nav${isOpen ? " open" : ""}`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={[
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  ? "active"
                  : "",
                item.utility ? "utility-link" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="button primary header-cta" href="/book">
          Book Delivery
        </Link>
      </header>

      <nav className="mobile-action-bar" aria-label="Quick actions">
        <Link href="/book">
          <CalendarCheck aria-hidden="true" />
          <span>Book</span>
        </Link>
        <Link href="/track">
          <Search aria-hidden="true" />
          <span>Track</span>
        </Link>
        <a href="tel:+233302945678">
          <PhoneCall aria-hidden="true" />
          <span>Call</span>
        </a>
      </nav>
    </>
  );
}
