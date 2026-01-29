const sanityClient = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = sanityClient.default({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN,
    apiVersion: '2024-01-01'
});

async function cleanupCategories() {
    console.log('🔍 Buscando categorías "Sociales" y "Música"...\n');

    try {
        // Find categories to delete
        const categoriesToDelete = await client.fetch(
            `*[_type == "category" && (title match "sociales" || title match "música" || title match "Sociales" || title match "Música")]`
        );

        if (categoriesToDelete.length === 0) {
            console.log('✓ No se encontraron esas categorías.');
            return;
        }

        console.log(`Encontradas ${categoriesToDelete.length} categoría(s):\n`);
        categoriesToDelete.forEach(cat => console.log(`  - ${cat.title}`));

        // Find events using these categories
        const categoryIds = categoriesToDelete.map(c => c._id);
        const eventsUsingCategories = await client.fetch(
            `*[_type == "event" && references($ids)]{ title, "categoryTitle": category->title }`,
            { ids: categoryIds }
        );

        if (eventsUsingCategories.length > 0) {
            console.log(`\n⚠️  ${eventsUsingCategories.length} evento(s) usando estas categorías:\n`);
            eventsUsingCategories.forEach(evt => console.log(`  - ${evt.title} (${evt.categoryTitle})`));

            console.log('\n🗑️  Eliminando eventos...\n');

            // Delete events first
            const eventDeletions = await client.fetch(`*[_type == "event" && references($ids)]._id`, { ids: categoryIds });
            for (const eventId of eventDeletions) {
                await client.delete(eventId);
                console.log(`  ✓ Evento eliminado`);
            }
        }

        console.log('\n🗑️  Eliminando categorías...\n');

        // Now delete categories
        for (const category of categoriesToDelete) {
            await client.delete(category._id);
            console.log(`  ✓ ${category.title}`);
        }

        console.log('\n✅ Limpieza completada!');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

cleanupCategories();
