import { useState, useEffect } from 'react';
import { Event } from '../models';
import { getEventBySlug } from '../services/sanityService';

export function useEventDetailViewModel(slug: string) {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getEventBySlug(slug)
            .then(data => {
                if (data) {
                    setEvent(data);
                    setError(null);
                } else {
                    setError('Evento no encontrado');
                    setEvent(null);
                }
            })
            .catch(err => {
                console.error(err);
                setError('Error al cargar el evento');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [slug]);

    return { event, loading, error };
}
