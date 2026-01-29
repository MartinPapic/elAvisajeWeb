const sanityClient = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = sanityClient.default({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN,
    apiVersion: '2024-01-01'
});

async function seedEvents() {
    console.log('🎯 Buscando categorías y etiquetas...\n');

    try {
        // Fetch existing categories and tags
        const categories = await client.fetch(`*[_type == "category"]{ _id, title, slug }`);
        const tags = await client.fetch(`*[_type == "tag"]{ _id, name, slug }`);

        console.log(`Encontradas ${categories.length} categorías y ${tags.length} etiquetas.\n`);

        // Helper to find category/tag by slug
        const getCat = (slug) => categories.find(c => c.slug.current === slug);
        const getTag = (slug) => tags.find(t => t.slug.current === slug);

        const events = [
            {
                _type: 'event',
                title: 'Feria Artesanal de Frutillar',
                slug: { _type: 'slug', current: 'feria-artesanal-frutillar' },
                shortDescription: 'Artesanías locales frente al lago.',
                description: 'La tradicional feria artesanal de Frutillar reúne a más de 50 artesanos locales ofreciendo productos de lana, madera y cerámica con vista al Lago Llanquihue.',
                startDate: '2026-02-15T10:00:00Z',
                endDate: '2026-02-15T18:00:00Z',
                address: 'Costanera Philippi, Frutillar',
                location: { _type: 'geopoint', lat: -41.1281, lng: -73.0508 },
                category: { _type: 'reference', _ref: getCat('ferias-mercados')?._id },
                tags: [
                    { _type: 'reference', _ref: getTag('gratuito')?._id },
                    { _type: 'reference', _ref: getTag('familiar')?._id }
                ]
            },
            {
                _type: 'event',
                title: 'Concierto en Vivo - Teatro del Lago',
                slug: { _type: 'slug', current: 'concierto-teatro-del-lago' },
                shortDescription: 'Orquesta Sinfónica de Chile en Frutillar.',
                description: 'La Orquesta Sinfónica de Chile presenta su temporada de invierno en el icónico Teatro del Lago, interpretando obras de Beethoven y compositores chilenos.',
                startDate: '2026-02-20T20:00:00Z',
                endDate: '2026-02-20T22:30:00Z',
                address: 'Av. Philippi 1000, Frutillar',
                location: { _type: 'geopoint', lat: -41.1234, lng: -73.0465 },
                category: { _type: 'reference', _ref: getCat('cultura-artes')?._id }
            },
            {
                _type: 'event',
                title: 'Trekking Volcán Osorno',
                slug: { _type: 'slug', current: 'trekking-volcan-osorno' },
                shortDescription: 'Caminata guiada al volcán más icónico de la región.',
                description: 'Ascenso guiado al Volcán Osorno con vistas panorámicas de lagos y montañas. Nivel intermedio, incluye almuerzo y equipamiento básico.',
                startDate: '2026-02-22T08:00:00Z',
                endDate: '2026-02-22T17:00:00Z',
                address: 'Centro de Ski Volcán Osorno',
                location: { _type: 'geopoint', lat: -41.0978, lng: -72.4934 },
                category: { _type: 'reference', _ref: getCat('deporte-aire-libre')?._id },
                tags: [
                    { _type: 'reference', _ref: getTag('al-aire-libre')?._id }
                ]
            },
            {
                _type: 'event',
                title: 'Festival Culinario de Puerto Varas',
                slug: { _type: 'slug', current: 'festival-culinario-puerto-varas' },
                shortDescription: 'Lo mejor de la gastronomía local en un solo lugar.',
                description: 'Tres días de gastronomía chilota, alemana y fusión contemporánea. Participan los mejores restaurantes de la zona con degustaciones, talleres y música en vivo.',
                startDate: '2026-03-05T12:00:00Z',
                endDate: '2026-03-07T22:00:00Z',
                address: 'Plaza de Armas, Puerto Varas',
                location: { _type: 'geopoint', lat: -41.3194, lng: -72.9854 },
                category: { _type: 'reference', _ref: getCat('gastronomia')?._id },
                tags: [
                    { _type: 'reference', _ref: getTag('familiar')?._id }
                ]
            },
            {
                _type: 'event',
                title: 'Fiesta de la Cerveza Artesanal',
                slug: { _type: 'slug', current: 'fiesta-cerveza-artesanal' },
                shortDescription: 'Cervecerías locales presentan sus mejores cervezas.',
                description: 'Celebración nocturna con más de 15 cervecerías artesanales de la región sur, música electrónica y food trucks.',
                startDate: '2026-02-28T19:00:00Z',
                endDate: '2026-03-01T02:00:00Z',
                address: 'Costanera Pablo Neruda, Puerto Varas',
                location: { _type: 'geopoint', lat: -41.3178, lng: -72.9892 },
                category: { _type: 'reference', _ref: getCat('nocturno-entretenimiento')?._id }
            },
            {
                _type: 'event',
                title: 'Yoga Frente al Lago',
                slug: { _type: 'slug', current: 'yoga-frente-al-lago' },
                shortDescription: 'Sesión gratuita de yoga al amanecer.',
                description: 'Clase de yoga y meditación con vista al Volcán Osorno. Apta para todos los niveles. Traer mat y ropa cómoda.',
                startDate: '2026-02-10T07:00:00Z',
                endDate: '2026-02-10T08:30:00Z',
                address: 'Playa Venado, Puerto Varas',
                location: { _type: 'geopoint', lat: -41.3089, lng: -72.9756 },
                category: { _type: 'reference', _ref: getCat('naturaleza-bienestar')?._id },
                tags: [
                    { _type: 'reference', _ref: getTag('gratuito')?._id },
                    { _type: 'reference', _ref: getTag('al-aire-libre')?._id }
                ]
            },
            {
                _type: 'event',
                title: 'Aniversario de Puerto Varas',
                slug: { _type: 'slug', current: 'aniversario-puerto-varas' },
                shortDescription: 'Celebración del 162° aniversario de la ciudad.',
                description: 'Desfile cívico, presentaciones artísticas, feria costumbrista y fuegos artificiales en la costanera.',
                startDate: '2026-03-12T10:00:00Z',
                endDate: '2026-03-12T23:00:00Z',
                address: 'Costanera, Puerto Varas',
                location: { _type: 'geopoint', lat: -41.3194, lng: -72.9854 },
                category: { _type: 'reference', _ref: getCat('festividades-tradiciones')?._id },
                tags: [
                    { _type: 'reference', _ref: getTag('gratuito')?._id },
                    { _type: 'reference', _ref: getTag('familiar')?._id }
                ]
            },
            {
                _type: 'event',
                title: 'Taller de Fotografía de Paisaje',
                slug: { _type: 'slug', current: 'taller-fotografia-paisaje' },
                shortDescription: 'Aprende a capturar la belleza del sur de Chile.',
                description: 'Taller práctico de 4 horas sobre composición, luz natural y edición básica. Salida fotográfica incluida a miradores cercanos.',
                startDate: '2026-02-18T14:00:00Z',
                endDate: '2026-02-18T18:00:00Z',
                address: 'Casa del Arte Diego Rivera, Puerto Varas',
                location: { _type: 'geopoint', lat: -41.3145, lng: -72.9812 },
                category: { _type: 'reference', _ref: getCat('educacion-comunidad')?._id }
            }
        ];

        console.log('📝 Creando eventos de ejemplo...\n');

        for (const event of events) {
            const result = await client.create(event);
            console.log(`  ✓ ${event.title}`);
        }

        console.log(`\n✅ ${events.length} eventos creados exitosamente!`);
        console.log('\n📍 Visita http://localhost:3000 para verlos en el mapa');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedEvents();
