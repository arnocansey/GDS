"use client";

import { useEffect, useMemo, useRef } from "react";
import type { LatLngExpression, Map as LeafletMap } from "leaflet";

type WebMapProps = {
  pickup?: string;
  destination?: string;
  title?: string;
  subtitle?: string;
  className?: string;
};

const ghanaLocations = [
  { label: "Accra", lat: 5.6037, lng: -0.187 },
  { label: "Ridge", lat: 5.5638, lng: -0.187 },
  { label: "East Legon", lat: 5.651, lng: -0.148 },
  { label: "Osu", lat: 5.556, lng: -0.176 },
  { label: "Kumasi", lat: 6.6666, lng: -1.6163 },
  { label: "Adum", lat: 6.6933, lng: -1.6221 },
  { label: "Tamale", lat: 9.4075, lng: -0.8533 },
  { label: "Takoradi", lat: 4.8845, lng: -1.7554 },
  { label: "Tema", lat: 5.6698, lng: -0.0166 },
  { label: "Cape Coast", lat: 5.1053, lng: -1.2466 },
];

type Coordinate = [number, number];

function resolveLocation(value?: string): Coordinate {
  const normalized = value?.toLowerCase() || "";
  const match = ghanaLocations.find((location) =>
    normalized.includes(location.label.toLowerCase()),
  );

  if (match) return [match.lat, match.lng];
  return [5.6037, -0.187];
}

function toOsrmCoordinate([lat, lng]: Coordinate) {
  return `${lng},${lat}`;
}

async function getRoadRoute(start: Coordinate, end: Coordinate, signal: AbortSignal) {
  const baseUrl =
    process.env.NEXT_PUBLIC_OSRM_ROUTE_URL ||
    "https://router.project-osrm.org/route/v1/driving";
  const response = await fetch(
    `${baseUrl}/${toOsrmCoordinate(start)};${toOsrmCoordinate(end)}?overview=full&geometries=geojson`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("Route request failed.");
  }

  const data = (await response.json()) as {
    routes?: Array<{
      geometry?: {
        coordinates?: Array<[number, number]>;
      };
    }>;
  };
  const coordinates = data.routes?.[0]?.geometry?.coordinates;

  if (!coordinates?.length) {
    throw new Error("Route geometry missing.");
  }

  return coordinates.map(([lng, lat]) => [lat, lng] as Coordinate);
}

export function WebMap({
  pickup,
  destination,
  title = "GDS route map",
  subtitle,
  className = "",
}: WebMapProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const route = useMemo(
    () => ({
      pickup: resolveLocation(pickup),
      destination: destination ? resolveLocation(destination) : undefined,
    }),
    [destination, pickup],
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function createMap() {
      const leaflet = await import("leaflet");
      if (!isMounted || !elementRef.current) return;

      mapRef.current?.remove();

      const map = leaflet.map(elementRef.current, {
        attributionControl: false,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapRef.current = map;

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
        })
        .addTo(map);

      const pickupMarker = leaflet.divIcon({
        className: "gds-map-marker pickup",
        html: "<span>P</span>",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      const destinationMarker = leaflet.divIcon({
        className: "gds-map-marker destination",
        html: "<span>D</span>",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      leaflet.marker(route.pickup, { icon: pickupMarker }).addTo(map);

      if (route.destination) {
        leaflet.marker(route.destination, { icon: destinationMarker }).addTo(map);

        let routeLine: Coordinate[];
        try {
          routeLine = await getRoadRoute(route.pickup, route.destination, controller.signal);
        } catch {
          routeLine = [route.pickup, route.destination];
        }

        if (!isMounted) return;

        leaflet
          .polyline(routeLine, {
            color: "#07843e",
            opacity: 0.9,
            weight: 5,
          })
          .addTo(map);
        map.fitBounds(leaflet.latLngBounds(routeLine).pad(0.18));
      } else {
        map.setView(route.pickup, 13);
      }
    }

    createMap();

    return () => {
      isMounted = false;
      controller.abort();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [route]);

  return (
    <div className={`web-map-shell ${className}`.trim()}>
      <div className="web-map" ref={elementRef} aria-label={title} />
      <div className="web-map-caption">
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
    </div>
  );
}
