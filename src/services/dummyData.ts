import { Event } from '../models';

export const DUMMY_EVENTS: Event[] = [
    {
        _id: '1',
        title: 'Festival de la Lluvia',
        slug: 'festival-de-la-lluvia',
        shortDescription: 'Celebración anual en Puerto Varas.',
        description: 'El Festival de la Lluvia es un evento icónico que celebra la identidad local y el clima del sur de Chile. Durante tres días, la ciudad se llena de paraguas decorados, desfiles y música en vivo.',
        dateRange: { start: '2024-06-20', end: '2024-06-22' },
        location: { lat: -41.3194, lng: -72.9854 },
        category: { title: 'Cultura', slug: 'cultura', color: '#3b82f6' }
    },
    {
        _id: '2',
        title: 'Feria Rural de Frutillar',
        slug: 'feria-rural-frutillar',
        shortDescription: 'Productos locales y artesanía.',
        description: 'Encuentro de productores locales que ofrecen hortalizas frescas, quesos artesanales, mermeladas y artesanía en lana y madera. Un espacio para conectar con las tradiciones del campo.',
        dateRange: { start: '2024-07-05', end: '2024-07-07' },
        location: { lat: -41.1235, lng: -73.0427 },
        category: { title: 'Feria', slug: 'feria', color: '#10b981' }
    }
];
