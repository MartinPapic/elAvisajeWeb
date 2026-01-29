import React, { useState, useCallback, useMemo } from 'react'
import { Stack, Text, Card, TextInput, Button, Box } from '@sanity/ui'
import { set, unset, PatchEvent } from 'sanity'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition, onChange }: any) {
    const map = useMapEvents({
        click(e) {
            const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
            setPosition(newPos);
            // Patch Sanity value
            onChange(PatchEvent.from(set({
                _type: 'geopoint',
                lat: newPos.lat,
                lng: newPos.lng,
                alt: 0
            })));
        },
    });

    // Fly to position when it updates
    React.useEffect(() => {
        if (position) {
            map.flyTo([position.lat, position.lng], map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={[position.lat, position.lng]} />
    )
}

export const OSMGeopointInput = (props: any) => {
    const { value, onChange } = props;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Initial position from Sanity value or default (Puerto Varas)
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
        value ? { lat: value.lat, lng: value.lng } : null
    );

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsLoading(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Geocoding error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectResult = (result: any) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        const newPos = { lat, lng: lon };

        setPosition(newPos);
        setSearchResults([]); // Clear results

        onChange(PatchEvent.from(set({
            _type: 'geopoint',
            lat: lat,
            lng: lon,
            alt: 0
        })));
    };

    return (
        <Stack space={3}>
            <Text size={1} weight="bold">Search Location (Free / OSM)</Text>

            <Box>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <TextInput
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        placeholder="Type address (e.g. Puerto Varas)"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button
                        text={isLoading ? "Searching..." : "Search"}
                        onClick={handleSearch}
                        tone="primary"
                    />
                </div>
            </Box>

            {/* Search Results List */}
            {searchResults.length > 0 && (
                <Card border padding={2} style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    <Stack space={2}>
                        {searchResults.map((result: any, i) => (
                            <Card key={i} padding={2} radius={2} tone="transparent" onClick={() => handleSelectResult(result)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                                <Text size={1}>{result.display_name}</Text>
                            </Card>
                        ))}
                    </Stack>
                </Card>
            )}

            {/* Map */}
            <div style={{ height: '400px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}>
                {/* 
                  MapContainer must have a key to force re-render if needed, 
                  but usually handling state inside is better.
                */}
                <MapContainer
                    center={position ? [position.lat, position.lng] : [-41.3194, -72.9854]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker position={position} setPosition={setPosition} onChange={onChange} />
                </MapContainer>
            </div>

            {position && (
                <Text size={1} muted>Selected: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}</Text>
            )}
        </Stack>
    )
}
