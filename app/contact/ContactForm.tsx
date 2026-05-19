"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setIsSubmitting(true);
    setStatus("Sending message...");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        subject: data.get("subject"),
        message: data.get("message"),
      }),
    });

    const result = (await response.json()) as { error?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      setStatus(result.error || "Unable to send message.");
      return;
    }

    setStatus("Message received. The GDS support team will respond shortly.");
    form.reset();
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <h2>Send a Message</h2>
      <div className="form-grid">
        <label>
          Full Name
          <input name="name" placeholder="Kwame Mensah" required />
        </label>
        <label>
          Email Address
          <input name="email" type="email" placeholder="kwame@example.com" required />
        </label>
        <label>
          Phone Number
          <input name="phone" placeholder="+233 54 000 0000" />
        </label>
        <label>
          Subject
          <input name="subject" placeholder="How can we help?" required />
        </label>
      </div>
      <label>
        Message
        <textarea name="message" placeholder="Provide details about your inquiry..." required />
      </label>
      <button className="button primary full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
