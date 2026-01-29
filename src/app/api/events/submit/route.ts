import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['title', 'locationName', 'location', 'dateRange', 'submittedBy'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Campo requerido: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Validate submittedBy has required contact info
        if (!body.submittedBy.name || !body.submittedBy.email) {
            return NextResponse.json(
                { error: 'Se requiere nombre y email del remitente' },
                { status: 400 }
            );
        }

        // Generate slug from title
        const slug = body.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Create the event document as a DRAFT (unpublished)
        // Sanity will automatically handle this - drafts are prefixed with "drafts."
        const event = {
            _type: 'event',
            title: body.title,
            slug: {
                _type: 'slug',
                current: slug
            },
            description: body.description || '',
            locationName: body.locationName,
            location: {
                _type: 'geopoint',
                lat: body.location.lat,
                lng: body.location.lng
            },
            dateRange: {
                start: body.dateRange.start,
                end: body.dateRange.end || null
            },
            externalLink: body.externalLink || null,
            submittedBy: {
                name: body.submittedBy.name,
                email: body.submittedBy.email,
                phone: body.submittedBy.phone || null,
                relation: body.submittedBy.relation || null
            },
            submittedAt: new Date().toISOString(),
            // Categories and tags will be added by admin after approval
            categories: [],
            tags: []
        };

        // Create document in Sanity
        const result = await client.create(event);

        return NextResponse.json({
            success: true,
            message: 'Evento enviado exitosamente. Será revisado antes de publicarse.',
            eventId: result._id
        });

    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json(
            { error: 'Error al enviar el evento. Por favor, intenta nuevamente.' },
            { status: 500 }
        );
    }
}
