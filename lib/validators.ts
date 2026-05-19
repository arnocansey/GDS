import type {
  BookingInput,
  ContactMessage,
  PackageWeight,
  ParcelCategory,
  PaymentMethod,
  ServiceType,
} from "./types";

const serviceTypes: ServiceType[] = [
  "Same-Day Delivery",
  "Parcel Services",
  "Express Dispatch",
  "Business Logistics",
];

const packageWeights: PackageWeight[] = ["Under 2 kg", "2 to 5 kg", "5 to 20 kg", "20 kg plus"];
const paymentMethods: PaymentMethod[] = ["Pay on Pickup", "Mobile Money", "Cash on Delivery"];
const parcelCategories: ParcelCategory[] = [
  "Documents",
  "Food",
  "Electronics",
  "Fashion",
  "Fragile",
  "Bulk Goods",
  "General",
];

function text(value: unknown) {
  return String(value ?? "").trim();
}

function pick<T extends string>(value: unknown, options: readonly T[], fallback: T) {
  const normalized = text(value);
  return options.includes(normalized as T) ? (normalized as T) : fallback;
}

export function parseBookingInput(body: unknown): BookingInput {
  const data = (body || {}) as Record<string, unknown>;
  const input: BookingInput = {
    customerName: text(data.customerName),
    customerEmail: text(data.customerEmail),
    receiverName: text(data.receiverName),
    pickup: text(data.pickup),
    destination: text(data.destination),
    senderPhone: text(data.senderPhone),
    receiverPhone: text(data.receiverPhone),
    service: pick(data.service, serviceTypes, "Parcel Services"),
    weight: pick(data.weight, packageWeights, "Under 2 kg"),
    parcelCategory: pick(data.parcelCategory, parcelCategories, "General"),
    pickupWindow: text(data.pickupWindow),
    description: text(data.description),
    fragile: Boolean(data.fragile),
    payment: pick(data.payment, paymentMethods, "Pay on Pickup"),
  };

  const missing = [
    ["pickup", input.pickup],
    ["destination", input.destination],
    ["senderPhone", input.senderPhone],
    ["receiverPhone", input.receiverPhone],
    ["description", input.description],
  ].filter(([, value]) => !value);

  if (missing.length) {
    throw new Error(`Missing required field: ${missing[0][0]}`);
  }

  return input;
}

export function parseContactInput(body: unknown): Omit<ContactMessage, "id" | "createdAt"> {
  const data = (body || {}) as Record<string, unknown>;
  const input = {
    name: text(data.name),
    email: text(data.email),
    phone: text(data.phone),
    subject: text(data.subject),
    message: text(data.message),
  };

  const missing = [
    ["name", input.name],
    ["email", input.email],
    ["subject", input.subject],
    ["message", input.message],
  ].filter(([, value]) => !value);

  if (missing.length) {
    throw new Error(`Missing required field: ${missing[0][0]}`);
  }

  return input;
}
