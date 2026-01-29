'use client';
import React from 'react';
import { useEventDetailViewModel } from '@/viewmodels/useEventDetailViewModel';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
    slug: string;
}

export function EventPageView({ slug }: Props) {
    const { event, loading, error } = useEventDetailViewModel(slug);

    if (loading) return <div className="p-10 flex justify-center items-center min-h-screen">Cargando...</div>;
    if (error || !event) return <div className="p-10 text-red-500 flex justify-center items-center min-h-screen">{error || 'Error desconocido'}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al mapa
                </Link>

                <div className="bg-white rounded-xl shadow-sm border p-6 md:p-10">
                    <div className="mb-6">
                        {event.category && (
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-4"
                                style={{ backgroundColor: event.category.color || '#333' }}>
                                {event.category.title}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                        <p className="text-gray-500">{event.dateRange.start} {event.dateRange.end ? ` - ${event.dateRange.end}` : ''}</p>
                        {event.address && <p className="text-gray-600 mt-1 font-medium">📍 {event.address}</p>}
                    </div>

                    <div className="prose max-w-none text-gray-800">
                        <p className="text-lg leading-relaxed">{event.description || event.shortDescription}</p>
                    </div>

                    <div className="mt-8 pt-8 border-t text-sm text-gray-400">
                        Coordenadas: {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                    </div>
                </div>
            </div>
        </div>
    );
}
