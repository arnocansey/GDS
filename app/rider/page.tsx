import { getAllRiders, getBookingsForRider, getRiderById } from "@/lib/storage";
import { RiderDashboard } from "./RiderDashboard";

export const dynamic = "force-dynamic";

type RiderPageProps = {
  searchParams: Promise<{
    riderId?: string;
  }>;
};

export default async function RiderPage({ searchParams }: RiderPageProps) {
  const { riderId } = await searchParams;
  const riders = await getAllRiders();
  const selectedRider = riderId ? await getRiderById(riderId) : undefined;
  const bookings = selectedRider ? await getBookingsForRider(selectedRider.id) : [];

  return <RiderDashboard bookings={bookings} riders={riders} selectedRider={selectedRider} />;
}
