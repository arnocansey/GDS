import { NextResponse } from "next/server";
import { getBookingsForCustomer } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const bookings = await getBookingsForCustomer(query);

  return NextResponse.json({ bookings });
}
