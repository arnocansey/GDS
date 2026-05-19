"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button className="button secondary" disabled={isLoggingOut} type="button" onClick={logout}>
      {isLoggingOut ? "Signing Out..." : "Sign Out"}
    </button>
  );
}
