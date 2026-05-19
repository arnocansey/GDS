import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLoginPage() {
  if (await getAdminSession()) {
    redirect("/admin");
  }

  return (
    <section className="section-shell login-section">
      <AdminLoginForm />
    </section>
  );
}
