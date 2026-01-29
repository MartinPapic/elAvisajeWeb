'use client';

import React from 'react';
import { Event } from '@/models';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
    events: Event[];
    onClose: () => void;
    onEventClick?: (event: Event) => void;
}

export function EventListPopup({ events, onClose, onEventClick }: Props) {
    if (events.length === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow-xl max-w-sm w-80 max-h-96 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-900">
                    {events.length} eventos en esta ubicación
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Cerrar"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {/* Scrollable Event List */}
            <div className="overflow-y-auto flex-1">
                {events.map((event, index) => (
                    <button
                        key={event._id}
                        onClick={() => onEventClick?.(event)}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${index !== events.length - 1 ? 'border-b' : ''
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            {/* Category Icon/Color */}
                            {event.category && (
                                <div
                                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                                    style={{ backgroundColor: event.category.color || '#3b82f6' }}
                                    title={event.category.title}
                                />
                            )}

                            <div className="flex-1 min-w-0">
                                {/* Title */}
                                <h4 className="font-medium text-gray-900 truncate">
                                    {event.title}
                                </h4>

                                {/* Date */}
                                <p className="text-sm text-gray-600 mt-1">
                                    {format(new Date(event.dateRange.start), 'd MMM yyyy', { locale: es })}
                                    {event.dateRange.end && event.dateRange.end !== event.dateRange.start && (
                                        <> - {format(new Date(event.dateRange.end), 'd MMM yyyy', { locale: es })}</>
                                    )}
                                </p>

                                {/* Short Description */}
                                {event.shortDescription && (
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {event.shortDescription}
                                    </p>
                                )}

                                {/* Tags */}
                                {event.tags && event.tags.length > 0 && (
                                    <div className="flex gap-1 mt-2">
                                        {event.tags.slice(0, 2).map(tag => (
                                            <span
                                                key={tag.slug}
                                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
