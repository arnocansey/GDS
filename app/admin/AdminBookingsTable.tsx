"use client";

import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type { Booking, DeliveryStatus, Rider } from "@/lib/types";
import { AdminBookingControls } from "./AdminBookingControls";

const columnHelper = createColumnHelper<Booking>();
const statuses: Array<DeliveryStatus | "all"> = [
  "all",
  "pending",
  "confirmed",
  "collected",
  "in_transit",
  "delivered",
  "cancelled",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  return status.replace("_", " ");
}

export function AdminBookingsTable({ bookings, riders }: { bookings: Booking[]; riders: Rider[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DeliveryStatus | "all">("all");
  const [service, setService] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const services = useMemo(
    () => [...new Set(bookings.map((booking) => booking.service))],
    [bookings],
  );
  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          booking.trackingNumber,
          booking.pickup,
          booking.destination,
          booking.senderPhone,
          booking.receiverPhone,
          booking.service,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesStatus = status === "all" || booking.status === status;
      const matchesService = service === "all" || booking.service === service;

      return matchesQuery && matchesStatus && matchesService;
    });
  }, [bookings, query, service, status]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("trackingNumber", {
        header: "Tracking",
        cell: ({ row, getValue }) => (
          <span>
            <Link href={`/track/${getValue()}`}>{getValue()}</Link>
            <small>{formatDate(row.original.createdAt)}</small>
            <details className="admin-row-details">
              <summary>Details</summary>
              <small>Sender: {row.original.senderPhone}</small>
              <small>Receiver: {row.original.receiverPhone}</small>
              <small>Package: {row.original.description}</small>
              <small>
                {row.original.weight}
                {row.original.fragile ? " | Fragile" : ""}
              </small>
            </details>
          </span>
        ),
      }),
      columnHelper.accessor("pickup", {
        header: "Route",
        cell: ({ row, getValue }) => (
          <span>
            {getValue()}
            <small>to {row.original.destination}</small>
          </span>
        ),
      }),
      columnHelper.accessor("service", {
        header: "Service",
      }),
      columnHelper.accessor("amount", {
        header: "Fee",
        cell: ({ getValue }) => `GHC ${getValue()}`,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => (
          <span className={`status-badge status-${getValue()}`}>{statusLabel(getValue())}</span>
        ),
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => (
          <AdminBookingControls booking={row.original} riders={riders} />
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: () => null,
      }),
    ],
    [riders],
  );

  const table = useReactTable({
    columns,
    data: filteredBookings,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <h2>Bookings</h2>
          <p>{filteredBookings.length} visible of {bookings.length} total bookings.</p>
        </div>
        <div className="admin-filters">
          <input
            aria-label="Search bookings"
            name="q"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tracking, route, phone..."
            value={query}
          />
          <select
            aria-label="Filter by status"
            onChange={(event) => setStatus(event.target.value as DeliveryStatus | "all")}
            value={status}
          >
            {statuses.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All statuses" : statusLabel(option)}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by service"
            onChange={(event) => setService(event.target.value)}
            value={service}
          >
            <option value="all">All services</option>
            {services.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
              setService("all");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="admin-table tanstack-table">
        <div className="admin-row admin-head">
          {table.getHeaderGroups()[0].headers
            .filter((header) => header.id !== "createdAt")
            .map((header) => (
              <button
                key={header.id}
                type="button"
                disabled={!header.column.getCanSort()}
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.getIsSorted() === "asc" ? " ↑" : ""}
                {header.column.getIsSorted() === "desc" ? " ↓" : ""}
              </button>
            ))}
        </div>
        {table.getRowModel().rows.map((row) => (
          <div className="admin-row" key={row.id}>
            {row
              .getVisibleCells()
              .filter((cell) => cell.column.id !== "createdAt")
              .map((cell) => (
                <span key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </span>
              ))}
          </div>
        ))}
        {!table.getRowModel().rows.length ? (
          <div className="admin-empty">No bookings match the current filters.</div>
        ) : null}
      </div>
    </>
  );
}
