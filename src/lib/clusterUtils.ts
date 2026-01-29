import { Event } from '@/models';

/**
 * Group events by exact coordinates (lat, lng)
 * Returns a Map where key is "lat,lng" and value is array of events at that location
 */
export function groupEventsByLocation(events: Event[]): Map<string, Event[]> {
    const grouped = new Map<string, Event[]>();

    events.forEach(event => {
        const key = `${event.location.lat.toFixed(6)},${event.location.lng.toFixed(6)}`;
        const existing = grouped.get(key) || [];
        existing.push(event);
        grouped.set(key, existing);
    });

    return grouped;
}

/**
 * Convert events to GeoJSON features for clustering
 */
export function eventsToGeoJSON(events: Event[]) {
    return events.map(event => ({
        type: 'Feature' as const,
        properties: {
            eventId: event._id,
            title: event.title,
            category: event.category,
            // Store full event data for quick access
            event: event
        },
        geometry: {
            type: 'Point' as const,
            coordinates: [event.location.lng, event.location.lat]
        }
    }));
}

/**
 * Check if two coordinates are exactly the same (within tolerance)
 */
export function coordinatesMatch(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
    tolerance = 0.000001
): boolean {
    return (
        Math.abs(lat1 - lat2) < tolerance &&
        Math.abs(lng1 - lng2) < tolerance
    );
}
