type Coordinate = {
  lat: number;
  lng: number;
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

function resolveLocation(value: string): Coordinate {
  const normalized = value.toLowerCase();
  const match = ghanaLocations.find((location) =>
    normalized.includes(location.label.toLowerCase()),
  );

  return match || ghanaLocations[0];
}

function toOsrmCoordinate(coordinate: Coordinate) {
  return `${coordinate.lng},${coordinate.lat}`;
}

function haversineKm(start: Coordinate, end: Coordinate) {
  const radiusKm = 6371;
  const latDelta = ((end.lat - start.lat) * Math.PI) / 180;
  const lngDelta = ((end.lng - start.lng) * Math.PI) / 180;
  const startLat = (start.lat * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function enrichRoute(pickup: string, destination: string) {
  const start = resolveLocation(pickup);
  const end = resolveLocation(destination);
  const fallbackDistanceKm = Math.round(haversineKm(start, end) * 1.28);

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_OSRM_ROUTE_URL ||
      "https://router.project-osrm.org/route/v1/driving";
    const response = await fetch(
      `${baseUrl}/${toOsrmCoordinate(start)};${toOsrmCoordinate(end)}?overview=false`,
    );
    const data = (await response.json()) as {
      routes?: Array<{ distance?: number; duration?: number }>;
    };
    const route = data.routes?.[0];

    return {
      pickupLat: start.lat,
      pickupLng: start.lng,
      destinationLat: end.lat,
      destinationLng: end.lng,
      distanceKm: route?.distance ? Math.round((route.distance / 1000) * 10) / 10 : fallbackDistanceKm,
      durationMinutes: route?.duration ? Math.ceil(route.duration / 60) : Math.ceil(fallbackDistanceKm * 1.6),
    };
  } catch {
    return {
      pickupLat: start.lat,
      pickupLng: start.lng,
      destinationLat: end.lat,
      destinationLng: end.lng,
      distanceKm: fallbackDistanceKm,
      durationMinutes: Math.ceil(fallbackDistanceKm * 1.6),
    };
  }
}
