import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const adminCookieName = "gds_admin_session";
const sessionDurationMs = 1000 * 60 * 60 * 8;

function adminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }
  return password;
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isValidAdminPassword(password: string) {
  return safeEqual(password, adminPassword());
}

export function createAdminSessionValue() {
  const expiresAt = Date.now() + sessionDurationMs;
  const payload = `${expiresAt}.${randomBytes(16).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionValue(value?: string) {
  if (!value) return false;

  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const [expiresAt, nonce, signature] = parts;
  if (!expiresAt || !nonce || !signature) return false;
  if (Number(expiresAt) < Date.now()) return false;

  return safeEqual(signature, sign(`${expiresAt}.${nonce}`));
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSessionValue(cookieStore.get(adminCookieName)?.value);
}

export function setAdminSessionCookie(response: NextResponse) {
  response.cookies.set(adminCookieName, createAdminSessionValue(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionDurationMs / 1000,
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function isAdminRequest(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${adminCookieName}=`));

  if (!cookie) return false;
  return verifyAdminSessionValue(decodeURIComponent(cookie.split("=").slice(1).join("=")));
}
