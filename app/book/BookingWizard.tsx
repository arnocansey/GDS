"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { Booking } from "@/lib/types";

const steps = [
  { label: "Locations", icon: MapPin },
  { label: "Details", icon: Package },
  { label: "Payment", icon: CreditCard },
];

const serviceOptions = [
  {
    label: "Same-Day Delivery",
    detail: "Best for urgent documents and small city parcels.",
    icon: Clock3,
  },
  {
    label: "Parcel Services",
    detail: "Reliable nationwide handling for everyday packages.",
    icon: Package,
  },
  {
    label: "Express Dispatch",
    detail: "Priority courier for sensitive or high-value items.",
    icon: Truck,
  },
  {
    label: "Business Logistics",
    detail: "Bulk movement and account support for teams.",
    icon: ShieldCheck,
  },
];

const timeWindows = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

function formatPickupWindow(date: FormDataEntryValue | null, time: FormDataEntryValue | null) {
  const pickupDate = String(date || "").trim();
  const pickupTime = String(time || "").trim();

  if (!pickupDate && !pickupTime) return "";
  if (!pickupDate) return pickupTime;
  if (!pickupTime) return pickupDate;

  return `${pickupDate}, ${pickupTime}`;
}

function calculateQuote(form: HTMLFormElement | null) {
  if (!form) return 25;

  const data = new FormData(form);
  const service = data.get("service");
  const weight = data.get("weight");
  const fragile = data.get("fragile");
  let total = 25;

  if (service === "Same-Day Delivery") total = 15;
  if (service === "Express Dispatch") total = 45;
  if (service === "Business Logistics") total = 80;
  if (weight === "5 to 20 kg") total += 20;
  if (weight === "20 kg plus") total += 45;
  if (fragile) total += 10;

  return total;
}

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState("");
  const [quote, setQuote] = useState(25);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateQuote(form: HTMLFormElement) {
    setQuote(calculateQuote(form));
  }

  function validateStep(form: HTMLFormElement, step: number) {
    const page = form.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const requiredFields = [...(page?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      "input[required], textarea[required], select[required]",
    ) || [])];
    const invalid = requiredFields.find((field) => !field.value.trim());

    if (invalid) {
      invalid.focus();
      setStatus("Please complete the required fields before continuing.");
      return false;
    }

    return true;
  }

  function goToStep(form: HTMLFormElement, nextStep: number) {
    if (nextStep > currentStep && !validateStep(form, currentStep)) return;
    updateQuote(form);
    setStatus("");
    setCurrentStep(nextStep);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    updateQuote(form);
    setIsSubmitting(true);
    setStatus("Submitting delivery booking...");
    setBooking(null);

    const data = new FormData(form);
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickup: data.get("pickup"),
        destination: data.get("destination"),
        senderPhone: data.get("senderPhone"),
        receiverPhone: data.get("receiverPhone"),
        customerName: data.get("customerName"),
        customerEmail: data.get("customerEmail"),
        receiverName: data.get("receiverName"),
        service: data.get("service"),
        weight: data.get("weight"),
        parcelCategory: data.get("parcelCategory"),
        pickupWindow: formatPickupWindow(data.get("pickupDate"), data.get("pickupTime")),
        description: data.get("description"),
        fragile: data.get("fragile") === "on",
        payment: data.get("payment"),
      }),
    });

    const result = (await response.json()) as { booking?: Booking; error?: string };
    setIsSubmitting(false);

    if (!response.ok || !result.booking) {
      setStatus(result.error || "Unable to submit delivery booking.");
      return;
    }

    form.reset();
    setCurrentStep(0);
    setQuote(25);
    setBooking(result.booking);
    setStatus("Delivery booking submitted. Keep the tracking number below.");
  }

  return (
    <div className="booking-workspace">
      <form
        className="panel booking-panel"
        onChange={(event) => updateQuote(event.currentTarget)}
        onSubmit={handleSubmit}
      >
        <div className="wizard-steps" aria-label="Booking progress">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <button
                className={currentStep === index ? "active" : undefined}
                key={step.label}
                type="button"
                onClick={(event) => goToStep(event.currentTarget.form!, index)}
              >
                <Icon aria-hidden="true" />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        <section className={`wizard-page${currentStep === 0 ? " active" : ""}`} data-step="0">
          <h2>Pickup &amp; Destination</h2>
          <div className="route-input-grid">
            <div className="form-grid">
              <label>
                Customer Name
                <input name="customerName" placeholder="e.g. Kwame Mensah" />
              </label>
              <label>
                Customer Email
                <input name="customerEmail" placeholder="kwame@example.com" type="email" />
              </label>
            </div>
            <label>
              Pickup Address
              <input name="pickup" placeholder="e.g. East Legon, Accra" required />
            </label>
            <label>
              Sender Phone Number
              <input name="senderPhone" placeholder="+233 XX XXX XXXX" required />
            </label>
            <div className="route-dot">
              <ArrowDown aria-hidden="true" />
            </div>
            <label>
              Destination Address
              <input name="destination" placeholder="e.g. Kumasi Central" required />
            </label>
            <label>
              Receiver Name
              <input name="receiverName" placeholder="e.g. Ama Serwaa" />
            </label>
            <label>
              Receiver Phone Number
              <input name="receiverPhone" placeholder="+233 XX XXX XXXX" required />
            </label>
            <div className="pickup-window-grid">
              <label>
                Pickup Date
                <input name="pickupDate" required type="date" />
              </label>
              <label>
                Pickup Time
                <select name="pickupTime" required>
                  {timeWindows.map((window) => (
                    <option key={window}>{window}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className={`wizard-page${currentStep === 1 ? " active" : ""}`} data-step="1">
          <h2>Package Details</h2>
          <div className="service-options" role="radiogroup" aria-label="Service type">
            {serviceOptions.map((service, index) => {
              const Icon = service.icon;
              return (
                <label className="service-option" key={service.label}>
                  <input
                    defaultChecked={index === 0}
                    name="service"
                    type="radio"
                    value={service.label}
                  />
                  <span>
                    <Icon aria-hidden="true" />
                    <strong>{service.label}</strong>
                    <small>{service.detail}</small>
                  </span>
                </label>
              );
            })}
          </div>
          <label>
            Package Weight
            <select name="weight">
              <option>Under 2 kg</option>
              <option>2 to 5 kg</option>
              <option>5 to 20 kg</option>
              <option>20 kg plus</option>
            </select>
          </label>
          <label>
            Parcel Category
            <select name="parcelCategory">
              <option>General</option>
              <option>Documents</option>
              <option>Food</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Fragile</option>
              <option>Bulk Goods</option>
            </select>
          </label>
          <label>
            Package Description
            <textarea name="description" placeholder="Documents, clothing, electronics..." required />
          </label>
          <label className="checkbox">
            <input type="checkbox" name="fragile" /> Fragile package
          </label>
        </section>

        <section className={`wizard-page${currentStep === 2 ? " active" : ""}`} data-step="2">
          <h2>Review &amp; Payment</h2>
          <div className="quote-box">
            <span>Estimated delivery fee</span>
            <strong>GHC {quote}</strong>
          </div>
          <label>
            Payment Method
            <select name="payment">
              <option>Pay on Pickup</option>
              <option>Mobile Money</option>
              <option>Cash on Delivery</option>
            </select>
          </label>
          <p className="fine-print">A support agent will confirm pickup availability after submission.</p>
        </section>

        <div className="wizard-actions">
          <button
            className={`button secondary${currentStep === 0 ? " hidden" : ""}`}
            type="button"
            onClick={() => {
              setStatus("");
              setCurrentStep((step) => Math.max(step - 1, 0));
            }}
          >
            Back
          </button>
          <button
            className={`button primary${currentStep === steps.length - 1 ? " hidden" : ""}`}
            type="button"
            onClick={(event) => goToStep(event.currentTarget.form!, Math.min(currentStep + 1, steps.length - 1))}
          >
            Next <ArrowRight aria-hidden="true" />
          </button>
          <button
            className={`button primary${currentStep !== steps.length - 1 ? " hidden" : ""}`}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Submitting..." : "Submit Booking"}
          </button>
        </div>

        <p className="form-status" aria-live="polite">
          {status}
        </p>
        {booking ? (
          <div className="confirmation-box">
            <span>Tracking Number</span>
            <strong>{booking.trackingNumber}</strong>
            <p>Estimated fee: GHC {booking.amount}. Status: {booking.status.replace("_", " ")}.</p>
            <Link className="button secondary" href={`/track/${booking.trackingNumber}`}>
              View Tracking
            </Link>
          </div>
        ) : null}
      </form>

      <aside className="booking-summary" aria-label="Booking summary">
        <span className="section-kicker">Live Quote</span>
        <strong>GHC {quote}</strong>
        <p>Calculated from service speed, weight, and handling requirements.</p>
        <div className="summary-route">
          <span>Accra pickup</span>
          <i />
          <span>Nationwide delivery</span>
        </div>
        <div className="summary-perks">
          <span>Insured handling</span>
          <span>SMS updates</span>
          <span>Tracking number issued instantly</span>
        </div>
      </aside>
    </div>
  );
}
