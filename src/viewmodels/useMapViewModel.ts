import { useState, useEffect, useMemo } from 'react';
import { Event } from '../models';
import { getEvents } from '../services/sanityService';

export interface ViewState {
    latitude: number;
    longitude: number;
    zoom: number;
}

const INITIAL_VIEW_STATE: ViewState = {
    latitude: -41.3194, // Puerto Varas
    longitude: -72.9854,
    zoom: 10,
};

export function useMapViewModel() {
    const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

    // Filters
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<{ start: string; end?: string } | null>(null);
    const [dateRangeLabel, setDateRangeLabel] = useState<string | null>(null);

    // Derived state for available tags
    const availableTags = useMemo(() => {
        const uniqueTags = new Map<string, { name: string, slug: string }>();
        allEvents.forEach(event => {
            event.tags?.forEach(tag => {
                if (!uniqueTags.has(tag.slug)) {
                    uniqueTags.set(tag.slug, tag);
                }
            });
        });
        return Array.from(uniqueTags.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [allEvents]);

    useEffect(() => {
        getEvents()
            .then(data => {
                console.log("Fetched events:", data);
                setAllEvents(data);
                setFilteredEvents(data);
            })
            .catch(err => console.error("Failed to fetch events:", err));
    }, []);

    // Apply filters
    useEffect(() => {
        let result = allEvents;

        // Category Filter (multi-select)
        if (selectedCategories.length > 0) {
            result = result.filter(e =>
                e.category && selectedCategories.includes(e.category.slug)
            );
        }

        // Tags Filter (OR logic: match ANY selected tag)
        if (selectedTags.length > 0) {
            result = result.filter(e =>
                e.tags && e.tags.some(tag => selectedTags.includes(tag.slug))
            );
        }

        // Date Filter
        if (dateRange) {
            result = result.filter(e => {
                // Parse event dates
                const eventStart = new Date(e.dateRange.start).getTime();
                // If no end date, assume single day event (start=end for logic)
                const eventEnd = e.dateRange.end ? new Date(e.dateRange.end).getTime() : eventStart;

                // Parse filter dates
                const filterStart = new Date(dateRange.start).getTime();
                // If filter end is missing, decide logic. For now default to long future if not provided?
                // Actually dateRange filter should always have end provided by helper, or we handle it here.
                const filterEnd = dateRange.end ? new Date(dateRange.end).getTime() : 8640000000000000;

                // Check for overlap
                // Event overlaps Filter if: EventStart <= FilterEnd AND EventEnd >= FilterStart
                return eventStart <= filterEnd && eventEnd >= filterStart;
            });
        }

        setFilteredEvents(result);
    }, [allEvents, selectedCategories, dateRange]);

    return {
        viewState,
        setViewState,
        events: filteredEvents,
        allEvents, // Expose all events for CategoryFilter to prevent categories from disappearing

        // Filter actions
        selectedCategories,
        setSelectedCategories,
        selectedTags,
        setSelectedTags,
        dateRange,
        setDateRange,
        dateRangeLabel,
        setDateRangeLabel,

        // Exposed Data
        availableTags
    };
}
