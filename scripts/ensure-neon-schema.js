require("dotenv/config");

const { Client } = require("pg");

const statements = [
  `CREATE TABLE IF NOT EXISTS "Booking" (
    "id" TEXT PRIMARY KEY,
    "trackingNumber" TEXT NOT NULL UNIQUE,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "receiverName" TEXT,
    "pickup" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "senderPhone" TEXT NOT NULL,
    "receiverPhone" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "parcelCategory" TEXT NOT NULL DEFAULT 'General',
    "pickupWindow" TEXT,
    "description" TEXT NOT NULL,
    "fragile" BOOLEAN NOT NULL DEFAULT false,
    "payment" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "pickupLat" DOUBLE PRECISION,
    "pickupLng" DOUBLE PRECISION,
    "destinationLat" DOUBLE PRECISION,
    "destinationLng" DOUBLE PRECISION,
    "distanceKm" DOUBLE PRECISION,
    "durationMinutes" INTEGER,
    "assignedRiderId" TEXT,
    "internalNotes" TEXT,
    "proofReceiverName" TEXT,
    "proofPhotoUrl" TEXT,
    "proofSignature" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "timeline" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "customerName" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "customerEmail" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "receiverName" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "parcelCategory" TEXT NOT NULL DEFAULT 'General'`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "pickupWindow" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "pickupLat" DOUBLE PRECISION`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "pickupLng" DOUBLE PRECISION`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "destinationLat" DOUBLE PRECISION`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "destinationLng" DOUBLE PRECISION`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "distanceKm" DOUBLE PRECISION`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "durationMinutes" INTEGER`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "assignedRiderId" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "internalNotes" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "proofReceiverName" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "proofPhotoUrl" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "proofSignature" TEXT`,
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "deliveredAt" TIMESTAMP(3)`,
  `CREATE INDEX IF NOT EXISTS "Booking_createdAt_idx" ON "Booking"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status")`,
  `CREATE INDEX IF NOT EXISTS "Booking_assignedRiderId_idx" ON "Booking"("assignedRiderId")`,
  `CREATE INDEX IF NOT EXISTS "Booking_customerEmail_idx" ON "Booking"("customerEmail")`,
  `CREATE INDEX IF NOT EXISTS "Booking_senderPhone_idx" ON "Booking"("senderPhone")`,
  `CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt")`,
  `CREATE TABLE IF NOT EXISTS "Rider" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "Rider_status_idx" ON "Rider"("status")`,
  `CREATE INDEX IF NOT EXISTS "Rider_city_idx" ON "Rider"("city")`,
  `CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT PRIMARY KEY,
    "trackingNumber" TEXT,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_trackingNumber_idx" ON "AuditLog"("trackingNumber")`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt")`,
];

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    for (const statement of statements) {
      await client.query(statement);
    }
    console.log("NEON_SCHEMA_READY");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("NEON_SCHEMA_ERROR", error.code || error.name, error.message);
  process.exit(1);
});
