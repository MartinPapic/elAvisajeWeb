import React from 'react';
import { Event } from '@/models';
import { cn } from '@/lib/utils';

interface Props {
    events: Event[];
    selectedCategories: string[];
    onSelectCategories: (slugs: string[]) => void;
}

export function CategoryFilter({ events, selectedCategories, onSelectCategories }: Props) {
    // Extract unique categories from events
    const categories = React.useMemo(() => {
        const unique = new Map();
        events.forEach(e => {
            if (e.category) {
                unique.set(e.category.slug, e.category);
            }
        });
        return Array.from(unique.values());
    }, [events]);

    if (categories.length === 0) return null;

    const handleCategoryToggle = (slug: string) => {
        if (selectedCategories.includes(slug)) {
            // Remove from selection
            onSelectCategories(selectedCategories.filter(s => s !== slug));
        } else {
            // Add to selection
            onSelectCategories([...selectedCategories, slug]);
        }
    };

    const handleClearAll = () => {
        onSelectCategories([]);
    };

    return (
        <div className="flex flex-col gap-2 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
            <button
                onClick={handleClearAll}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shadow-sm border flex items-center justify-between gap-2 w-full",
                    selectedCategories.length === 0
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                )}
            >
                <span className="flex items-center gap-1">
                    {selectedCategories.length > 0 && <span className="text-xs">✕</span>}
                    Todos
                </span>
                {selectedCategories.length > 0 && (
                    <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">
                        {selectedCategories.length}
                    </span>
                )}
            </button>
            {categories.map(cat => {
                const isSelected = selectedCategories.includes(cat.slug);
                return (
                    <button
                        key={cat.slug}
                        onClick={() => handleCategoryToggle(cat.slug)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shadow-sm border flex items-center gap-2 w-full",
                            isSelected
                                ? "text-white border-transparent"
                                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                        )}
                        style={{
                            backgroundColor: isSelected ? (cat.color || '#3b82f6') : undefined,
                            borderColor: isSelected ? (cat.color || '#3b82f6') : undefined
                        }}
                    >
                        {cat.icon && <span>{cat.icon}</span>}
                        <span className="flex-1 text-left">{cat.title}</span>
                    </button>
                );
            })}
        </div>
    );
}
