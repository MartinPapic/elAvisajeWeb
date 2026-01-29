'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Props {
    lat: number;
    lng: number;
    onPositionChange: (lat: number, lng: number) => void;
}

export function MapPicker({ lat, lng, onPositionChange }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
            center: [lng, lat],
            zoom: 13,
        });

        // Create draggable marker
        marker.current = new maplibregl.Marker({
            draggable: true,
            color: '#ef4444'
        })
            .setLngLat([lng, lat])
            .addTo(map.current);

        // Update position on drag end
        marker.current.on('dragend', () => {
            const lngLat = marker.current!.getLngLat();
            onPositionChange(lngLat.lat, lngLat.lng);
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    }, []);

    // Update marker position when props change
    useEffect(() => {
        if (marker.current) {
            marker.current.setLngLat([lng, lat]);
        }
        if (map.current) {
            map.current.setCenter([lng, lat]);
        }
    }, [lat, lng]);

    return (
        <div ref={mapContainer} className="w-full h-80 rounded-lg border" />
    );
}
