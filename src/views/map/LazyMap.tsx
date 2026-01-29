'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView').then(mod => mod.MapView), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">Cargando mapa...</div>
});

export function LazyMap() {
    return <MapView />;
}
