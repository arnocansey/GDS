require("dotenv/config");

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010";

async function request(path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}: ${body.error || "unknown error"}`);
  }

  return { response, body };
}

async function main() {
  const bookingInput = {
    customerName: "Verification Customer",
    customerEmail: "verify-customer@example.com",
    receiverName: "Kumasi Receiver",
    pickup: "Osu, Accra",
    destination: "Adum, Kumasi",
    senderPhone: "+233302945678",
    receiverPhone: "+233541234567",
    service: "Express Dispatch",
    weight: "2 to 5 kg",
    parcelCategory: "Electronics",
    pickupWindow: "2026-05-20, 12:00 PM - 2:00 PM",
    description: "Verification parcel",
    fragile: false,
    payment: "Mobile Money",
  };

  const created = await request("/api/bookings", {
    method: "POST",
    body: JSON.stringify(bookingInput),
  });
  const trackingNumber = created.body.booking.trackingNumber;
  console.log(`BOOKING_CREATED ${trackingNumber}`);

  const tracked = await request(`/api/track/${encodeURIComponent(trackingNumber)}`);
  console.log(`TRACK_STATUS ${tracked.body.booking.status}`);

  const login = await request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
  });
  const cookie = login.response.headers.get("set-cookie")?.split(";")[0];
  if (!cookie) throw new Error("Admin login did not return a session cookie.");
  console.log("ADMIN_LOGIN_OK");

  const analytics = await fetch(`${baseUrl}/api/admin/analytics`, { headers: { Cookie: cookie } });
  if (!analytics.ok) throw new Error("Admin analytics failed.");
  console.log("ADMIN_ANALYTICS_OK");

  const riders = await request("/api/admin/riders", {
    headers: { Cookie: cookie },
  });
  const riderId = riders.body.riders?.[0]?.id || null;

  const updated = await request(`/api/bookings/${encodeURIComponent(trackingNumber)}`, {
    method: "PATCH",
    headers: { Cookie: cookie },
    body: JSON.stringify({
      status: "confirmed",
      assignedRiderId: riderId,
      internalNotes: "Verified by core flow script.",
    }),
  });
  console.log(`STATUS_UPDATED ${updated.body.booking.status}`);

  if (riderId) {
    await request(`/api/rider/bookings/${encodeURIComponent(trackingNumber)}`, {
      method: "PATCH",
      body: JSON.stringify({
        riderId,
        status: "in_transit",
        proofReceiverName: "Verification Receiver",
        proofSignature: "VR",
      }),
    });
    console.log("RIDER_UPDATE_OK");
  }

  await request("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      name: "Verification User",
      email: "verify@example.com",
      phone: "+233501112222",
      subject: "Verification message",
      message: "Core flow verification contact message.",
    }),
  });
  console.log("CONTACT_CREATED");

  const adminBookings = await request("/api/bookings", {
    headers: { Cookie: cookie },
  });
  const adminContacts = await request("/api/contact", {
    headers: { Cookie: cookie },
  });
  console.log(`ADMIN_BOOKINGS ${adminBookings.body.bookings.length}`);
  console.log(`ADMIN_CONTACTS ${adminContacts.body.contacts.length}`);

  const customer = await request(`/api/customer/bookings?q=${encodeURIComponent(bookingInput.customerEmail)}`);
  console.log(`CUSTOMER_BOOKINGS ${customer.body.bookings.length}`);

  const csv = await fetch(`${baseUrl}/api/admin/export`, { headers: { Cookie: cookie } });
  if (!csv.ok) throw new Error("CSV export failed.");
  console.log("CSV_EXPORT_OK");
}

main().catch((error) => {
  console.error("CORE_FLOW_FAILED", error.message);
  process.exit(1);
});
