import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { startOfDay, endOfDay, addDays, nextSaturday, nextSunday, isWeekend, startOfToday } from 'date-fns';
import { DateRange } from '@/models';

interface Props {
    selectedRangeValue: string | null;
    onChange: (range: { label: string, value: DateRange | null }) => void;
}

export function DateFilter({ selectedRangeValue, onChange }: Props) {
    const [showCustom, setShowCustom] = useState(false);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const presets = [
        {
            label: 'Todos',
            value: null,
            id: 'all'
        },
        {
            label: 'Hoy',
            id: 'today',
            getValue: () => {
                const now = new Date();
                return { start: startOfDay(now).toISOString(), end: endOfDay(now).toISOString() };
            }
        },
        {
            label: 'Mañana',
            id: 'tomorrow',
            getValue: () => {
                const tomorrow = addDays(new Date(), 1);
                return { start: startOfDay(tomorrow).toISOString(), end: endOfDay(tomorrow).toISOString() };
            }
        },
        {
            label: 'Fin de Semana',
            id: 'weekend',
            getValue: () => {
                const now = new Date();
                if (isWeekend(now)) {
                    return { start: startOfToday().toISOString(), end: endOfDay(nextSunday(now)).toISOString() };
                }
                const saturday = nextSaturday(now);
                const sunday = nextSunday(now);
                return { start: startOfDay(saturday).toISOString(), end: endOfDay(sunday).toISOString() };
            }
        }
    ];

    const handleCustomRange = () => {
        if (customStart && customEnd) {
            const start = new Date(customStart);
            const end = new Date(customEnd);

            onChange({
                label: 'custom',
                value: {
                    start: startOfDay(start).toISOString(),
                    end: endOfDay(end).toISOString()
                }
            });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-gray-200">
                {presets.map(preset => (
                    <button
                        key={preset.id}
                        onClick={() => {
                            setShowCustom(false);
                            onChange({
                                label: preset.id,
                                value: preset.getValue ? preset.getValue() : null
                            });
                        }}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                            selectedRangeValue === preset.id || (selectedRangeValue === null && preset.id === 'all')
                                ? "bg-black text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        )}
                    >
                        {preset.label}
                    </button>
                ))}
                <button
                    onClick={() => setShowCustom(!showCustom)}
                    className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                        selectedRangeValue === 'custom' || showCustom
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                    )}
                >
                    📅 Rango
                </button>
            </div>

            {showCustom && (
                <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-200 flex gap-2 items-center">
                    <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <span className="text-xs text-gray-500">→</span>
                    <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                        onClick={handleCustomRange}
                        disabled={!customStart || !customEnd}
                        className="px-3 py-1 bg-black text-white rounded text-xs font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Aplicar
                    </button>
                </div>
            )}
        </div>
    );
}
