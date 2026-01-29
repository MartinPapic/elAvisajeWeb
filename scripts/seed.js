const sanityClient = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = sanityClient.default({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN, // You'll need to add this
    apiVersion: '2024-01-01'
});

const categories = [
    {
        _type: 'category',
        title: 'Cultura & Artes',
        slug: { _type: 'slug', current: 'cultura-artes' },
        icon: '🎭',
        description: 'Eventos con foco cultural, artístico y patrimonial',
        color: { _type: 'color', hex: '#3b82f6' }
    },
    {
        _type: 'category',
        title: 'Festividades & Tradiciones',
        slug: { _type: 'slug', current: 'festividades-tradiciones' },
        icon: '🎉',
        description: 'Eventos identitarios, recurrentes o comunitarios',
        color: { _type: 'color', hex: '#ef4444' }
    },
    {
        _type: 'category',
        title: 'Ferias & Mercados',
        slug: { _type: 'slug', current: 'ferias-mercados' },
        icon: '🧺',
        description: 'Eventos comerciales y productivos de escala local',
        color: { _type: 'color', hex: '#10b981' }
    },
    {
        _type: 'category',
        title: 'Gastronomía',
        slug: { _type: 'slug', current: 'gastronomia' },
        icon: '🍽️',
        description: 'Eventos donde la comida es el eje central',
        color: { _type: 'color', hex: '#f59e0b' }
    },
    {
        _type: 'category',
        title: 'Deporte & Aire Libre',
        slug: { _type: 'slug', current: 'deporte-aire-libre' },
        icon: '🏃',
        description: 'Actividades físicas y recreativas',
        color: { _type: 'color', hex: '#6366f1' }
    },
    {
        _type: 'category',
        title: 'Naturaleza & Bienestar',
        slug: { _type: 'slug', current: 'naturaleza-bienestar' },
        icon: '🌿',
        description: 'Eventos asociados a salud, naturaleza y autocuidado',
        color: { _type: 'color', hex: '#059669' }
    },
    {
        _type: 'category',
        title: 'Educación & Comunidad',
        slug: { _type: 'slug', current: 'educacion-comunidad' },
        icon: '🧠',
        description: 'Eventos formativos o de interés social',
        color: { _type: 'color', hex: '#8b5cf6' }
    },
    {
        _type: 'category',
        title: 'Nocturno & Entretenimiento',
        slug: { _type: 'slug', current: 'nocturno-entretenimiento' },
        icon: '🎶',
        description: 'Eventos recreativos de horario nocturno',
        color: { _type: 'color', hex: '#ec4899' }
    }
];

const tags = [
    { _type: 'tag', name: 'Gratuito', slug: { _type: 'slug', current: 'gratuito' } },
    { _type: 'tag', name: 'Familiar', slug: { _type: 'slug', current: 'familiar' } },
    { _type: 'tag', name: 'Pet Friendly', slug: { _type: 'slug', current: 'pet-friendly' } },
    { _type: 'tag', name: 'Accesible', slug: { _type: 'slug', current: 'accesible' } },
    { _type: 'tag', name: 'Al Aire Libre', slug: { _type: 'slug', current: 'al-aire-libre' } },
    { _type: 'tag', name: 'Recurrente', slug: { _type: 'slug', current: 'recurrente' } },
    { _type: 'tag', name: 'Temporal', slug: { _type: 'slug', current: 'temporal' } },
];

async function seedData() {
    console.log('🌱 Iniciando seed de datos...\n');

    try {
        // Create categories
        console.log('📂 Creando categorías...');
        for (const category of categories) {
            const result = await client.create(category);
            console.log(`  ✓ ${category.icon} ${category.title}`);
        }

        console.log('\n🏷️  Creando etiquetas...');
        for (const tag of tags) {
            const result = await client.create(tag);
            console.log(`  ✓ ${tag.name}`);
        }

        console.log('\n✅ ¡Seed completado exitosamente!');
        console.log('\n📍 Puedes ver los datos en: http://localhost:3000/studio');
    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        process.exit(1);
    }
}

seedData();
