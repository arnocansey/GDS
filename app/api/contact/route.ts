import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createContactMessage, getAllContacts } from "@/lib/storage";
import { parseContactInput } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ contacts: await getAllContacts() });
}

export async function POST(request: Request) {
  try {
    const input = parseContactInput(await request.json());
    const contact = await createContactMessage(input);
    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send message" },
      { status: 400 },
    );
  }
}
