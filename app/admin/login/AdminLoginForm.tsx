"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setIsSubmitting(true);
    setStatus("Checking password...");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: data.get("password") }),
    });

    const result = (await response.json()) as { error?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      setStatus(result.error || "Unable to sign in.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="panel login-panel" onSubmit={handleSubmit}>
      <h1>Admin Login</h1>
      <p>Sign in to manage bookings, messages, and shipment statuses.</p>
      <label>
        Admin Password
        <input name="password" placeholder="Enter admin password" required type="password" />
      </label>
      <button className="button primary full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
