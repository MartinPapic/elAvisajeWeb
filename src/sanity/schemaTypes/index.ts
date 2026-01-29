import { defineField, defineType } from 'sanity'
import { OSMGeopointInput } from '../components/OSMGeopointInput'

export const categoryType = defineType({
    name: 'category',
    title: 'Categoría',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Nombre',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title' },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'icon',
            title: 'Ícono (Emoji)',
            type: 'string',
            description: 'Un emoji que represente la categoría (ej: 🎭, 🍽️, 🏃)',
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'color',
            title: 'Color',
            type: 'color',
            options: {
                colorList: [
                    { title: 'Azul (Cultura)', value: '#3b82f6' },
                    { title: 'Verde (Ferias)', value: '#10b981' },
                    { title: 'Ámbar (Gastronomía)', value: '#f59e0b' },
                    { title: 'Rojo (Festividades)', value: '#ef4444' },
                    { title: 'Púrpura (Arte)', value: '#8b5cf6' },
                    { title: 'Índigo (Deporte)', value: '#6366f1' },
                    { title: 'Esmeralda (Naturaleza)', value: '#059669' },
                    { title: 'Rosa (Nocturno)', value: '#ec4899' },
                ]
            },
            validation: Rule => Rule.required()
        }),
    ],
    preview: {
        select: {
            title: 'title',
            icon: 'icon',
        },
        prepare({ title, icon }) {
            return {
                title: `${icon || '📌'} ${title}`,
            }
        }
    }
})

export const tagType = defineType({
    name: 'tag',
    title: 'Etiqueta',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'name' },
            validation: Rule => Rule.required()
        }),
    ],
    preview: {
        select: {
            title: 'name',
        }
    }
})

export const eventType = defineType({
    name: 'event',
    title: 'Evento',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title' },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'shortDescription',
            title: 'Descripción Corta',
            type: 'text',
            rows: 3,
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'description',
            title: 'Descripción Completa',
            type: 'text',
        }),
        defineField({
            name: 'startDate',
            title: 'Fecha de Inicio',
            type: 'datetime',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'endDate',
            title: 'Fecha de Término',
            type: 'datetime',
        }),
        defineField({
            name: 'address',
            title: 'Dirección',
            type: 'string',
        }),
        defineField({
            name: 'location',
            title: 'Ubicación (Mapa)',
            type: 'geopoint',
            validation: Rule => Rule.required(),
            components: {
                // @ts-ignore
                input: OSMGeopointInput
            }
        }),
        defineField({
            name: 'category',
            title: 'Categoría Principal',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: Rule => Rule.required(),
            description: 'Selecciona UNA categoría principal'
        }),
        defineField({
            name: 'tags',
            title: 'Etiquetas',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'tag' }] }],
            description: 'Etiquetas como: Gratuito, Familiar, Pet Friendly (máx. 3)',
            validation: Rule => Rule.max(3)
        }),
        defineField({
            name: 'submittedBy',
            title: 'Enviado por',
            type: 'object',
            fields: [
                { name: 'name', type: 'string', title: 'Nombre' },
                { name: 'email', type: 'string', title: 'Email' },
                { name: 'phone', type: 'string', title: 'Teléfono' },
                { name: 'relation', type: 'string', title: 'Relación con el evento' }
            ],
            readOnly: true,
            description: 'Información del usuario que envió este evento desde el formulario público'
        }),
        defineField({
            name: 'submittedAt',
            title: 'Fecha de envío',
            type: 'datetime',
            readOnly: true,
            description: 'Fecha en que se envió desde el formulario público'
        }),
    ],
    preview: {
        select: {
            title: 'title',
            categoryTitle: 'category.title',
            categoryIcon: 'category.icon',
            startDate: 'startDate',
        },
        prepare({ title, categoryTitle, categoryIcon, startDate }) {
            const date = startDate ? new Date(startDate).toLocaleDateString('es-CL') : 'Sin fecha';
            return {
                title: title,
                subtitle: `${categoryIcon || '📌'} ${categoryTitle || 'Sin categoría'} • ${date}`,
            }
        }
    }
})

export const schema = {
    types: [eventType, categoryType, tagType],
}
