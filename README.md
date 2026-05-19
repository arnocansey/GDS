# GDS Ghana Delivery Service

A Next.js logistics website and delivery management MVP for GDS Ghana Delivery Service.

## Features

- Public marketing pages: Home, Services, About, Contact
- Delivery booking flow with generated tracking numbers
- Customer portal for shipment history lookup by email or phone
- Quote calculation based on service, weight, and fragile handling
- Pickup windows, parcel categories, customer/receiver details, and route ETA data
- Track order search plus detail pages at `/track/[trackingNumber]`
- Road-following web maps powered by OSRM-compatible route geometry
- Contact form backed by an API route
- Admin dashboard at `/admin`
- Admin filters for search, service, and shipment status
- Admin dispatch controls for rider assignment, notes, and status updates
- Admin analytics, audit log, and CSV export
- Rider dashboard for assigned deliveries and proof-of-delivery updates
- Admin status updates that append to shipment timelines
- Optional email and SMS notifications for bookings, status updates, and contact messages
- Prisma ORM connected to Postgres/Neon
- Password-protected admin dashboard

## Tech Stack

- Next.js App Router
- React
- TypeScript
- lucide-react icons
- Prisma Client
- Neon Postgres

## Getting Started

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

If port 3000 is busy:

```bash
npm run dev -- -p 3010
```

## Admin Login

Create a `.env.local` file from `.env.example`:

```bash
cp .env.example .env.local
```

Set these values:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require
ADMIN_PASSWORD=your-strong-admin-password
ADMIN_SESSION_SECRET=your-long-random-session-secret
```

Admin auth fails closed if `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` is missing.

Failed admin login attempts are rate-limited per IP in the application process.

## Notifications

Email notifications are sent only when SMTP variables are configured:

```text
ADMIN_NOTIFY_EMAIL=ops@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=notifications@example.com
SMTP_PASS=replace-with-smtp-password
NOTIFICATION_FROM="GDS Ghana <notifications@example.com>"
```

SMS notifications are sent only when Twilio-compatible variables are configured:

```text
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=replace-with-twilio-token
TWILIO_FROM_NUMBER=+1234567890
```

## Database Setup

Create a Neon database, copy the Postgres connection string, and put it in `.env.local` as `DATABASE_URL`.

Then push the Prisma schema:

```bash
npm run db:push
```

If Prisma's schema engine fails on your local machine but the Neon connection is valid, use the SQL fallback:

```bash
npm run db:ensure
```

Generate Prisma Client after schema changes:

```bash
npm run db:generate
```

Open Prisma Studio:

```bash
npm run db:studio
```

## Useful Routes

- `/` - homepage
- `/services` - service catalog
- `/about` - company story
- `/track` - tracking lookup
- `/track/GDS-2024-001234` - demo tracking page
- `/portal` - customer shipment history lookup
- `/book` - delivery booking
- `/contact` - customer support form
- `/rider` - rider dashboard
- `/admin` - operations dashboard
- `/admin/login` - admin sign in

## Verification

```bash
npm run verify:core
npm run typecheck
npm run build
```

## Deployment

The project is ready for Vercel once production environment variables are set.

Recommended Vercel env vars:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_OSRM_ROUTE_URL=https://router.project-osrm.org/route/v1/driving
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require
ADMIN_PASSWORD=replace-with-production-admin-password
ADMIN_SESSION_SECRET=replace-with-production-session-secret
ADMIN_NOTIFY_EMAIL=ops@example.com
```

`NEXT_PUBLIC_OSRM_ROUTE_URL` powers the road-following map lines. The default
uses the public OSRM demo route service, which is best for light usage. For a
production logistics app, point it at your own OSRM server or a paid routing
provider with compatible GeoJSON route responses.

Optional notification vars are listed in `.env.production.example`.

Deploy commands:

```bash
npx vercel login
npx vercel env add DATABASE_URL production
npx vercel env add ADMIN_PASSWORD production
npx vercel env add ADMIN_SESSION_SECRET production
npx vercel --prod
```

For CI, set `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as CI secrets.

## Notes

The datastore uses Prisma with Postgres. Neon is the intended hosted database. The app seeds a demo tracking record the first time bookings are read if the `Booking` table is empty.

Admin authentication is intentionally lightweight: a password creates a signed HTTP-only cookie. For a public production system with multiple users, replace it with Clerk, Auth0, or another managed auth provider.
