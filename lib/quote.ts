import type { BookingInput, PackageWeight, ParcelCategory, ServiceType } from "./types";

const basePrices: Record<ServiceType, number> = {
  "Same-Day Delivery": 15,
  "Parcel Services": 25,
  "Express Dispatch": 45,
  "Business Logistics": 80,
};

const weightPrices: Record<PackageWeight, number> = {
  "Under 2 kg": 0,
  "2 to 5 kg": 8,
  "5 to 20 kg": 20,
  "20 kg plus": 45,
};

const categoryPrices: Record<ParcelCategory, number> = {
  Documents: 0,
  Food: 8,
  Electronics: 15,
  Fashion: 0,
  Fragile: 12,
  "Bulk Goods": 30,
  General: 0,
};

export function calculateQuote(
  input: Pick<BookingInput, "service" | "weight" | "fragile"> & {
    parcelCategory?: ParcelCategory;
    distanceKm?: number;
  },
) {
  const distanceFee = input.distanceKm ? Math.max(0, Math.ceil((input.distanceKm - 25) / 50) * 5) : 0;
  return (
    basePrices[input.service] +
    weightPrices[input.weight] +
    categoryPrices[input.parcelCategory || "General"] +
    distanceFee +
    (input.fragile ? 10 : 0)
  );
}
