import { NextResponse } from "next/server";
import { isValidAdminPassword, setAdminSessionCookie } from "@/lib/admin-auth";
import { checkRateLimit, clearRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const limit = checkRateLimit(`admin-login:${ip}`);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${limit.retryAfter} seconds.` },
      { status: 429 },
    );
  }

  try {
    if (!isValidAdminPassword(String(body.password || ""))) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Admin auth is not configured." }, { status: 500 });
  }

  clearRateLimit(`admin-login:${ip}`);
  const response = NextResponse.json({ ok: true });
  setAdminSessionCookie(response);
  return response;
}
