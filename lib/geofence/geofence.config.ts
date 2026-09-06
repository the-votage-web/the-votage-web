export interface GeofenceZone {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export interface GeofenceConfig {
  enabled: boolean;
  zones: GeofenceZone[];
  highAccuracy: boolean;
  timeoutMs: number;
  maximumAgeMs: number;
}

export const DEFAULT_GEOFENCE_ZONES: GeofenceZone[] = [
  {
    id: 'winlos-centre',
    name: 'The Winlos Centre',
    address: 'The Winlos Centre, Benin City, Edo State',
    latitude: 6.260650427468145,
    longitude: 5.601475436188118,
    radiusKm: 1, // 1 km radius
  },
  {
    id: 'airport-rd-oka',
    name: '144 Airport Road',
    address: '144 Airport Rd, Oka, Benin City 300251, Edo State',
    latitude: 6.2973797,
    longitude: 5.5921004,
    radiusKm: 1, // 1 km radius
  },
];

export const GEOFENCE_CONFIG: GeofenceConfig = {
  // Geofence active
  enabled: process.env.NEXT_PUBLIC_GEOFENCE_ENABLED !== 'false',
  zones: DEFAULT_GEOFENCE_ZONES,
  highAccuracy: true,
  timeoutMs: 6000, // 6 seconds for initial high-accuracy check before fast cellular fallback
  maximumAgeMs: 30000, // Allow fresh cache within 30s for instant loading on mobile
};
