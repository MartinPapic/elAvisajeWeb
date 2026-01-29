'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import { useMapViewModel } from '@/viewmodels/useMapViewModel';
import { CategoryFilter } from '../filters/CategoryFilter';
import { DateFilter } from '../filters/DateFilter';
import { EventListPopup } from '@/components/EventListPopup';
import { groupEventsByLocation, eventsToGeoJSON } from '@/lib/clusterUtils';
import { Event } from '@/models';
import { createRoot } from 'react-dom/client';

export function MapView() {
    const {
        viewState, setViewState, events, allEvents,
        selectedCategories, setSelectedCategories,
        dateRangeLabel, setDateRangeLabel, setDateRange
    } = useMapViewModel();

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const clusterIndexRef = useRef<Supercluster | null>(null);

    const [status, setStatus] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [popup, setPopup] = useState<{ events: Event[]; lngLat: [number, number] } | null>(null);

    // Initialize Supercluster when events change
    useEffect(() => {
        const features = eventsToGeoJSON(events);
        const index = new Supercluster({
            radius: 50,
            maxZoom: 16,
            minZoom: 0,
            minPoints: 2
        });

        index.load(features);
        clusterIndexRef.current = index;
    }, [events]);

    // Initial Map Setup
    useEffect(() => {
        console.log("MapView useEffect - Starting map setup");
        console.log("mapContainer.current:", mapContainer.current);
        console.log("viewState:", viewState);

        if (map.current) {
            console.log("Map already initialized");
            return;
        }
        if (!mapContainer.current) {
            console.log("No map container found!");
            return;
        }

        try {
            console.log("Creating MapLibre instance...");
            setStatus('Cargando mapa...');

            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
                center: [viewState.longitude, viewState.latitude],
                zoom: viewState.zoom,
                attributionControl: false,
            });

            console.log("MapLibre instance created");

            map.current.on('load', () => {
                console.log("Map loaded successfully!");
                console.log("Map container:", map.current?.getContainer());
                console.log("Map canvas:", map.current?.getCanvas());

                map.current?.resize();
                setStatus('Mapa cargado');
                setTimeout(() => setStatus(''), 2000);
            });

            map.current.on('error', (e) => {
                console.error('Map error:', e);
                setErrorMsg(`Map Error: ${e.error?.message || JSON.stringify(e)}`);
            });

            map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
            map.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

        } catch (err: any) {
            console.error("Map Setup Error", err);
            setErrorMsg("Error al cargar el mapa");
        }

    }, []);

    // Update markers when events or map zoom changes
    useEffect(() => {
        if (!map.current || !clusterIndexRef.current) return;

        const updateMarkers = () => {
            const mapInstance = map.current!;
            const zoom = mapInstance.getZoom();
            const bounds = mapInstance.getBounds();

            const bbox: [number, number, number, number] = [
                bounds.getWest(),
                bounds.getSouth(),
                bounds.getEast(),
                bounds.getNorth()
            ];

            const clusters = clusterIndexRef.current!.getClusters(bbox, Math.floor(zoom));
            const eventGroups = groupEventsByLocation(events);

            // Clear existing markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            clusters.forEach((cluster) => {
                const [lng, lat] = cluster.geometry.coordinates;
                const isCluster = cluster.properties.cluster;

                if (isCluster) {
                    const count = cluster.properties.point_count;
                    const clusterId = cluster.properties.cluster_id;

                    const el = document.createElement('div');
                    el.className = 'cluster-marker';
                    el.innerHTML = `
                        <div class="cluster-inner" style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border-radius: 50%;
                            width: ${30 + (count / 10) * 10}px;
                            height: ${30 + (count / 10) * 10}px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            font-size: ${count >= 100 ? '12px' : '14px'};
                            border: 3px solid white;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                            cursor: pointer;
                            transition: transform 0.2s;
                        ">
                            ${count}
                        </div>
                    `;

                    // Zoom on click
                    el.addEventListener('mouseenter', () => {
                        const inner = el.querySelector('.cluster-inner') as HTMLElement;
                        if (inner) inner.style.transform = 'scale(1.1)';
                    });
                    el.addEventListener('mouseleave', () => {
                        const inner = el.querySelector('.cluster-inner') as HTMLElement;
                        if (inner) inner.style.transform = 'scale(1)';
                    });
                    el.addEventListener('click', () => {
                        const expansionZoom = clusterIndexRef.current!.getClusterExpansionZoom(clusterId);
                        mapInstance.flyTo({
                            center: [lng, lat],
                            zoom: Math.min(expansionZoom, 18)
                        });
                    });

                    const marker = new maplibregl.Marker({ element: el })
                        .setLngLat([lng, lat])
                        .addTo(mapInstance);

                    markersRef.current.push(marker);

                } else {
                    // Single event or multiple events at same location
                    const event = cluster.properties.event as Event;
                    const locationKey = `${event.location.lat.toFixed(6)},${event.location.lng.toFixed(6)}`;
                    const eventsAtLocation = eventGroups.get(locationKey) || [event];

                    if (eventsAtLocation.length > 1) {
                        // Multiple events at exact same location
                        const el = document.createElement('div');
                        const color = event.category?.color || '#3b82f6';
                        el.innerHTML = `
                            <div style="position: relative;">
                                <div style="
                                    width: 28px;
                                    height: 28px;
                                    background: ${color};
                                    border-radius: 50%;
                                    border: 3px solid white;
                                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                    cursor: pointer;
                                    transition: transform 0.2s;
                                " class="marker-dot"></div>
                                <div style="
                                    position: absolute;
                                    top: -8px;
                                    right: -8px;
                                    background: #ef4444;
                                    color: white;
                                    border-radius: 50%;
                                    width: 18px;
                                    height: 18px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 10px;
                                    font-weight: bold;
                                    border: 2px solid white;
                                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                ">${eventsAtLocation.length}</div>
                            </div>
                        `;

                        el.addEventListener('mouseenter', () => {
                            const dot = el.querySelector('.marker-dot') as HTMLElement;
                            if (dot) dot.style.transform = 'scale(1.2)';
                        });
                        el.addEventListener('mouseleave', () => {
                            const dot = el.querySelector('.marker-dot') as HTMLElement;
                            if (dot) dot.style.transform = 'scale(1)';
                        });
                        el.addEventListener('click', (e) => {
                            e.stopPropagation();
                            setPopup({ events: eventsAtLocation, lngLat: [lng, lat] });
                        });

                        const marker = new maplibregl.Marker({ element: el })
                            .setLngLat([lng, lat])
                            .addTo(mapInstance);

                        markersRef.current.push(marker);

                    } else {
                        // Single event marker
                        const container = document.createElement('div');
                        container.className = 'w-7 h-7 flex items-center justify-center cursor-pointer group';

                        const inner = document.createElement('div');
                        inner.className = 'w-5 h-5 rounded-full border-2 border-white shadow-lg transition-transform group-hover:scale-125';
                        inner.style.backgroundColor = event.category?.color || '#3b82f6';

                        container.appendChild(inner);

                        const marker = new maplibregl.Marker({ element: container })
                            .setLngLat([lng, lat])
                            .setPopup(new maplibregl.Popup({ offset: 25 })
                                .setHTML(`
                                    <div class="p-2">
                                        <h3 class="font-bold text-sm text-black">${event.title}</h3>
                                        <p class="text-xs text-gray-600">${event.shortDescription || ''}</p>
                                        <a href="/events/${event.slug}" class="text-xs text-blue-600 hover:underline mt-1 block">Ver detalles</a>
                                    </div>
                                `)
                            )
                            .addTo(mapInstance);

                        markersRef.current.push(marker);
                    }
                }
            });
        };

        if (map.current.loaded()) {
            updateMarkers();
        }

        map.current.on('moveend', updateMarkers);
        map.current.on('zoomend', updateMarkers);

        return () => {
            map.current?.off('moveend', updateMarkers);
            map.current?.off('zoomend', updateMarkers);
        };
    }, [events]);

    // Render custom React popup
    useEffect(() => {
        if (!popup || !map.current) return;

        const popupContainer = document.createElement('div');
        const root = createRoot(popupContainer);

        root.render(
            <EventListPopup
                events={popup.events}
                onClose={() => setPopup(null)}
                onEventClick={(event) => {
                    window.location.href = `/events/${event.slug}`;
                }}
            />
        );

        const maplibrePopup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: true,
            offset: 25
        })
            .setLngLat(popup.lngLat)
            .setDOMContent(popupContainer)
            .addTo(map.current);

        maplibrePopup.on('close', () => {
            setPopup(null);
            root.unmount();
        });

        return () => {
            maplibrePopup.remove();
            root.unmount();
        };
    }, [popup]);

    return (
        <div className="relative w-full h-full bg-gray-100">
            <div
                ref={mapContainer}
                className="absolute inset-0 w-full h-full"
            />

            {/* Filters - Left side vertical stack */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none max-w-xs flex flex-col gap-3">
                {/* Date Filter */}
                <div className="pointer-events-auto">
                    <DateFilter
                        selectedRangeValue={dateRangeLabel}
                        onChange={(val) => {
                            setDateRangeLabel(val.label);
                            setDateRange(val.value as any);
                        }}
                    />
                </div>

                {/* Category Filter */}
                <div className="pointer-events-auto">
                    <CategoryFilter
                        events={allEvents}
                        selectedCategories={selectedCategories}
                        onSelectCategories={setSelectedCategories}
                    />
                </div>
            </div>

            {status && (
                <div className="absolute top-2 right-2 z-50 bg-white/90 p-2 rounded shadow text-xs font-mono">
                    {status}
                </div>
            )}

            {errorMsg && (
                <div className="absolute top-2 left-2 z-50 bg-red-100 text-red-800 p-3 rounded shadow">
                    <strong>Error:</strong> {errorMsg}
                </div>
            )}
        </div>
    );
}
