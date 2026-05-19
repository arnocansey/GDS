import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getAllBookings,
  getAllContacts,
  getAllRiders,
  getAuditLogs,
  getOperationsAnalytics,
} from "@/lib/storage";
import { AdminBookingsTable } from "./AdminBookingsTable";
import { AdminLogoutButton } from "./AdminLogoutButton";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminPage() {
  if (!(await getAdminSession())) {
    redirect("/admin/login");
  }

  const bookings = await getAllBookings();
  const contacts = await getAllContacts();
  const riders = await getAllRiders();
  const analytics = await getOperationsAnalytics();
  const auditLogs = await getAuditLogs();
  const activeBookings = bookings.filter(
    (booking) => !["delivered", "cancelled"].includes(booking.status),
  );
  const revenue = bookings.reduce((total, booking) => total + booking.amount, 0);

  return (
    <section className="section-shell admin-page">
      <div className="admin-title-row">
        <div>
          <span className="section-kicker">Operations</span>
          <h1>Admin Dashboard</h1>
          <p>Review bookings, update shipment statuses, and monitor customer inquiries.</p>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="admin-stats">
        <article>
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
        </article>
        <article>
          <span>Active Shipments</span>
          <strong>{activeBookings.length}</strong>
        </article>
        <article>
          <span>Quoted Revenue</span>
          <strong>GHC {analytics.revenue}</strong>
        </article>
        <article>
          <span>Messages</span>
          <strong>{contacts.length}</strong>
        </article>
      </div>

      <div className="admin-ops-grid">
        <article className="panel admin-mini-panel">
          <span>Average Route</span>
          <strong>{analytics.averageDistance} km</strong>
        </article>
        <article className="panel admin-mini-panel">
          <span>Delivered</span>
          <strong>{analytics.delivered}</strong>
        </article>
        <article className="panel admin-mini-panel">
          <span>Riders</span>
          <strong>{riders.length}</strong>
        </article>
        <a className="button secondary" href="/api/admin/export">
          Export CSV
        </a>
      </div>

      <div className="admin-section">
        <AdminBookingsTable bookings={bookings} riders={riders} />
      </div>

      <div className="admin-section">
        <h2>Contact Messages</h2>
        <div className="message-list">
          {contacts.length ? (
            contacts.map((message) => (
              <article className="message-card" key={message.id}>
                <div>
                  <strong>{message.subject}</strong>
                  <small>
                    {message.name} | {message.email} | {formatDate(message.createdAt)}
                  </small>
                </div>
                <p>{message.message}</p>
              </article>
            ))
          ) : (
            <p>No contact messages yet.</p>
          )}
        </div>
      </div>

      <div className="admin-section">
        <h2>Audit Log</h2>
        <div className="message-list">
          {auditLogs.slice(0, 10).map((log) => (
            <article className="message-card" key={log.id}>
              <div>
                <strong>{log.action}</strong>
                <small>
                  {log.actor} | {log.trackingNumber || "workspace"} | {formatDate(log.createdAt)}
                </small>
              </div>
              <p>{log.details}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
