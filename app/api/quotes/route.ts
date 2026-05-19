import { NextResponse } from "next/server";
import { calculateQuote } from "@/lib/quote";
import { parseBookingInput } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = parseBookingInput(await request.json());
    return NextResponse.json({ amount: calculateQuote(input) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to calculate quote" },
      { status: 400 },
    );
  }
}
