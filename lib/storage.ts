import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import {
  notifyBookingCreated,
  notifyBookingStatusChanged,
  notifyContactMessage,
} from "./notifications";
import { enrichRoute } from "./geo";
import { calculateQuote } from "./quote";
import type {
  AuditLog,
  Booking,
  BookingInput,
  ContactMessage,
  DeliveryStatus,
  PackageWeight,
  PaymentMethod,
  Rider,
  ServiceType,
  TimelineEvent,
} from "./types";

const statusLabels: Record<DeliveryStatus, string> = {
  pending: "Booking submitted",
  confirmed: "Booking confirmed",
  collected: "Package collected",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusDescriptions: Record<DeliveryStatus, string> = {
  pending: "Shipment details were received by GDS.",
  confirmed: "A dispatcher confirmed pickup availability.",
  collected: "A courier collected the package from the sender.",
  in_transit: "The package is moving through the GDS network.",
  delivered: "The package arrived at the destination.",
  cancelled: "The delivery request was cancelled.",
};

type BookingRecord = Prisma.BookingGetPayload<{ include: { rider: true } }>;
type ContactRecord = Awaited<ReturnType<typeof prisma.contactMessage.findFirst>>;
type RiderRecord = Awaited<ReturnType<typeof prisma.rider.findFirst>>;
type AuditRecord = Awaited<ReturnType<typeof prisma.auditLog.findFirst>>;

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${randomUUID()}`;
}

function eventForStatus(status: DeliveryStatus): TimelineEvent {
  return {
    label: statusLabels[status],
    description: statusDescriptions[status],
    at: now(),
  };
}

function demoBooking(): Booking {
  const createdAt = "2026-05-18T12:00:00.000Z";
  return {
    id: "booking_demo",
    trackingNumber: "GDS-2024-001234",
    pickup: "East Legon, Accra",
    destination: "Kumasi Central",
    senderPhone: "+233 30 294 5678",
    receiverPhone: "+233 54 123 4567",
    customerName: "Demo Customer",
    customerEmail: "demo@gdsghana.com",
    receiverName: "Kumasi Receiver",
    service: "Parcel Services",
    weight: "2 to 5 kg",
    parcelCategory: "General",
    pickupWindow: "Today, 2 PM - 4 PM",
    description: "Demo package for tracking preview",
    fragile: false,
    payment: "Pay on Pickup",
    amount: 33,
    status: "in_transit",
    pickupLat: 5.651,
    pickupLng: -0.148,
    destinationLat: 6.6666,
    destinationLng: -1.6163,
    distanceKm: 250,
    durationMinutes: 280,
    createdAt,
    updatedAt: createdAt,
    timeline: [
      {
        label: "Booking confirmed",
        description: "Shipment details were received by GDS.",
        at: createdAt,
      },
      {
        label: "Package collected",
        description: "A courier collected the package from the sender.",
        at: "2026-05-18T14:30:00.000Z",
      },
      {
        label: "In transit",
        description: "The package is moving through the GDS network.",
        at: "2026-05-18T16:15:00.000Z",
      },
    ],
  };
}

function timelineFromJson(value: Prisma.JsonValue): TimelineEvent[] {
  return Array.isArray(value) ? (value as unknown as TimelineEvent[]) : [];
}

function rowToBooking(row: BookingRecord): Booking {
  return {
    id: row.id,
    trackingNumber: row.trackingNumber,
    customerName: row.customerName || undefined,
    customerEmail: row.customerEmail || undefined,
    receiverName: row.receiverName || undefined,
    pickup: row.pickup,
    destination: row.destination,
    senderPhone: row.senderPhone,
    receiverPhone: row.receiverPhone,
    service: row.service as ServiceType,
    weight: row.weight as PackageWeight,
    parcelCategory: row.parcelCategory as Booking["parcelCategory"],
    pickupWindow: row.pickupWindow || undefined,
    description: row.description,
    fragile: row.fragile,
    payment: row.payment as PaymentMethod,
    amount: row.amount,
    status: row.status as DeliveryStatus,
    pickupLat: row.pickupLat || undefined,
    pickupLng: row.pickupLng || undefined,
    destinationLat: row.destinationLat || undefined,
    destinationLng: row.destinationLng || undefined,
    distanceKm: row.distanceKm || undefined,
    durationMinutes: row.durationMinutes || undefined,
    assignedRiderId: row.assignedRiderId || undefined,
    assignedRiderName: row.rider?.name,
    internalNotes: row.internalNotes || undefined,
    proofReceiverName: row.proofReceiverName || undefined,
    proofPhotoUrl: row.proofPhotoUrl || undefined,
    proofSignature: row.proofSignature || undefined,
    deliveredAt: row.deliveredAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    timeline: timelineFromJson(row.timeline),
  };
}

function rowToRider(row: NonNullable<RiderRecord>): Rider {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    city: row.city,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

function rowToAudit(row: NonNullable<AuditRecord>): AuditLog {
  return {
    id: row.id,
    trackingNumber: row.trackingNumber || undefined,
    actor: row.actor,
    action: row.action,
    details: row.details,
    createdAt: row.createdAt.toISOString(),
  };
}

function rowToContact(row: NonNullable<ContactRecord>): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    createdAt: row.createdAt.toISOString(),
  };
}

async function ensureSeedData() {
  const count = await prisma.booking.count();
  const riderCount = await prisma.rider.count();

  if (riderCount === 0) {
    await prisma.rider.createMany({
      data: [
        { id: id("rider"), name: "Kojo Mensah", phone: "+233 54 000 1111", city: "Accra" },
        { id: id("rider"), name: "Ama Serwaa", phone: "+233 54 000 2222", city: "Kumasi" },
        { id: id("rider"), name: "Yaw Osei", phone: "+233 54 000 3333", city: "Tamale" },
      ],
    });
  }

  if (count > 0) return;

  const demo = demoBooking();
  await prisma.booking.create({
    data: {
      ...demo,
      createdAt: new Date(demo.createdAt),
      updatedAt: new Date(demo.updatedAt),
      deliveredAt: demo.deliveredAt ? new Date(demo.deliveredAt) : undefined,
      timeline: demo.timeline as unknown as Prisma.InputJsonValue,
    },
  });
}

async function audit(action: string, details: string, trackingNumber?: string, actor = "system") {
  await prisma.auditLog.create({
    data: {
      id: id("audit"),
      trackingNumber,
      actor,
      action,
      details,
    },
  });
}

async function nextTrackingNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.booking.count();
  return `GDS-${year}-${String(count + 1).padStart(6, "0")}`;
}

export async function createBooking(input: BookingInput) {
  await ensureSeedData();
  const route = await enrichRoute(input.pickup, input.destination);
  const created = await prisma.booking.create({
    data: {
      ...input,
      pickupWindow: input.pickupWindow || null,
      id: id("booking"),
      trackingNumber: await nextTrackingNumber(),
      ...route,
      amount: calculateQuote({ ...input, distanceKm: route.distanceKm }),
      status: "pending",
      timeline: [eventForStatus("pending")] as unknown as Prisma.InputJsonValue,
    },
    include: { rider: true },
  });

  const booking = rowToBooking(created);
  await audit("booking.created", `Booking created for ${booking.pickup} to ${booking.destination}.`, booking.trackingNumber);
  await notifyBookingCreated(booking);
  return booking;
}

export async function getAllBookings() {
  await ensureSeedData();
  const rows = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { rider: true },
  });
  return rows.map(rowToBooking);
}

export async function getBookingByTracking(trackingNumber: string) {
  await ensureSeedData();
  const row = await prisma.booking.findFirst({
    where: {
      trackingNumber: {
        equals: trackingNumber,
        mode: "insensitive",
      },
    },
    include: { rider: true },
  });

  return row ? rowToBooking(row) : undefined;
}

export async function updateBookingStatus(trackingNumber: string, status: DeliveryStatus) {
  const booking = await getBookingByTracking(trackingNumber);
  if (!booking) return null;

  const updatedTimeline = [...booking.timeline, eventForStatus(status)];
  const updated = await prisma.booking.update({
    where: { trackingNumber: booking.trackingNumber },
    data: {
      status,
      deliveredAt: status === "delivered" ? new Date() : undefined,
      timeline: updatedTimeline as unknown as Prisma.InputJsonValue,
    },
    include: { rider: true },
  });

  const nextBooking = rowToBooking(updated);
  await audit("booking.status", `Status changed to ${status}.`, nextBooking.trackingNumber, "admin");
  await notifyBookingStatusChanged(nextBooking);
  return nextBooking;
}

export async function updateBookingOperations(
  trackingNumber: string,
  input: {
    status?: DeliveryStatus;
    assignedRiderId?: string | null;
    internalNotes?: string;
    proofReceiverName?: string;
    proofPhotoUrl?: string;
    proofSignature?: string;
  },
  actor = "admin",
) {
  const booking = await getBookingByTracking(trackingNumber);
  if (!booking) return null;

  const data: Prisma.BookingUpdateInput = {};
  const auditDetails: string[] = [];

  if (input.status) {
    data.status = input.status;
    data.timeline = [...booking.timeline, eventForStatus(input.status)] as unknown as Prisma.InputJsonValue;
    if (input.status === "delivered") data.deliveredAt = new Date();
    auditDetails.push(`status=${input.status}`);
  }
  if (input.assignedRiderId !== undefined) {
    data.rider = input.assignedRiderId
      ? { connect: { id: input.assignedRiderId } }
      : { disconnect: true };
    auditDetails.push(`rider=${input.assignedRiderId || "unassigned"}`);
  }
  if (input.internalNotes !== undefined) {
    data.internalNotes = input.internalNotes;
    auditDetails.push("notes updated");
  }
  if (input.proofReceiverName !== undefined) data.proofReceiverName = input.proofReceiverName;
  if (input.proofPhotoUrl !== undefined) data.proofPhotoUrl = input.proofPhotoUrl;
  if (input.proofSignature !== undefined) data.proofSignature = input.proofSignature;

  const updated = await prisma.booking.update({
    where: { trackingNumber: booking.trackingNumber },
    data,
    include: { rider: true },
  });
  const nextBooking = rowToBooking(updated);
  await audit("booking.operations", auditDetails.join(", ") || "Booking updated.", nextBooking.trackingNumber, actor);

  if (input.status) {
    await notifyBookingStatusChanged(nextBooking);
  }

  return nextBooking;
}

export async function createContactMessage(input: Omit<ContactMessage, "id" | "createdAt">) {
  const created = await prisma.contactMessage.create({
    data: {
      ...input,
      id: id("contact"),
    },
  });

  const message = rowToContact(created);
  await notifyContactMessage(message);
  return message;
}

export async function getAllContacts() {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(rowToContact);
}

export async function getAllRiders() {
  await ensureSeedData();
  const rows = await prisma.rider.findMany({ orderBy: [{ status: "asc" }, { name: "asc" }] });
  return rows.map(rowToRider);
}

export async function getRiderById(riderId: string) {
  await ensureSeedData();
  const row = await prisma.rider.findFirst({ where: { id: riderId } });
  return row ? rowToRider(row) : undefined;
}

export async function getBookingsForRider(riderId: string) {
  await ensureSeedData();
  const rows = await prisma.booking.findMany({
    where: { assignedRiderId: riderId },
    orderBy: { createdAt: "desc" },
    include: { rider: true },
  });
  return rows.map(rowToBooking);
}

export async function getBookingsForCustomer(query: string) {
  await ensureSeedData();
  const value = query.trim();
  if (!value) return [];

  const rows = await prisma.booking.findMany({
    where: {
      OR: [
        { customerEmail: { equals: value, mode: "insensitive" } },
        { senderPhone: value },
        { receiverPhone: value },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { rider: true },
  });
  return rows.map(rowToBooking);
}

export async function getAuditLogs(trackingNumber?: string) {
  const rows = await prisma.auditLog.findMany({
    where: trackingNumber ? { trackingNumber } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return rows.map(rowToAudit);
}

export async function getOperationsAnalytics() {
  await ensureSeedData();
  const bookings = await getAllBookings();
  const delivered = bookings.filter((booking) => booking.status === "delivered").length;
  const active = bookings.filter((booking) => !["delivered", "cancelled"].includes(booking.status)).length;
  const revenue = bookings.reduce((total, booking) => total + booking.amount, 0);
  const averageDistance =
    bookings.reduce((total, booking) => total + (booking.distanceKm || 0), 0) / Math.max(bookings.length, 1);

  return {
    totalBookings: bookings.length,
    activeBookings: active,
    delivered,
    revenue,
    averageDistance: Math.round(averageDistance * 10) / 10,
    byStatus: bookings.reduce<Record<string, number>>((totals, booking) => {
      totals[booking.status] = (totals[booking.status] || 0) + 1;
      return totals;
    }, {}),
    topRoutes: Object.entries(
      bookings.reduce<Record<string, number>>((totals, booking) => {
        const route = `${booking.pickup} to ${booking.destination}`;
        totals[route] = (totals[route] || 0) + 1;
        return totals;
      }, {}),
    )
      .sort(([, left], [, right]) => right - left)
      .slice(0, 5)
      .map(([route, count]) => ({ route, count })),
  };
}
