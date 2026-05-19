export type DeliveryStatus =
  | "pending"
  | "confirmed"
  | "collected"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type ServiceType =
  | "Same-Day Delivery"
  | "Parcel Services"
  | "Express Dispatch"
  | "Business Logistics";

export type PackageWeight = "Under 2 kg" | "2 to 5 kg" | "5 to 20 kg" | "20 kg plus";

export type PaymentMethod = "Pay on Pickup" | "Mobile Money" | "Cash on Delivery";

export type ParcelCategory =
  | "Documents"
  | "Food"
  | "Electronics"
  | "Fashion"
  | "Fragile"
  | "Bulk Goods"
  | "General";

export type BookingInput = {
  customerName?: string;
  customerEmail?: string;
  receiverName?: string;
  pickup: string;
  destination: string;
  senderPhone: string;
  receiverPhone: string;
  service: ServiceType;
  weight: PackageWeight;
  parcelCategory: ParcelCategory;
  pickupWindow?: string;
  description: string;
  fragile: boolean;
  payment: PaymentMethod;
};

export type TimelineEvent = {
  label: string;
  description: string;
  at: string;
};

export type Booking = BookingInput & {
  id: string;
  trackingNumber: string;
  amount: number;
  status: DeliveryStatus;
  pickupLat?: number;
  pickupLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  distanceKm?: number;
  durationMinutes?: number;
  assignedRiderId?: string;
  assignedRiderName?: string;
  internalNotes?: string;
  proofReceiverName?: string;
  proofPhotoUrl?: string;
  proofSignature?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type Rider = {
  id: string;
  name: string;
  phone: string;
  city: string;
  status: string;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  trackingNumber?: string;
  actor: string;
  action: string;
  details: string;
  createdAt: string;
};

export type DataStore = {
  bookings: Booking[];
  contacts: ContactMessage[];
};
