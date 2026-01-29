import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // For MVP: Log to console
        console.log('='.repeat(80));
        console.log('📬 NUEVA SOLICITUD DE EVENTO');
        console.log('='.repeat(80));
        console.log('Evento:', data.eventName);
        console.log('Descripción:', data.shortDescription);
        console.log('Fecha:', data.startDate, data.endDate ? `- ${data.endDate}` : '');
        console.log('Ubicación:', data.venue, `(${data.commune})`);
        console.log('Coordenadas:', `${data.lat}, ${data.lng}`);
        console.log('Categorías:', data.categories.join(', '));
        console.log('Precio:', data.pricing, data.price ? `- ${data.price}` : '');
        console.log('Contacto público:', data.eventPhone || 'N/A', data.eventEmail || 'N/A');
        console.log('Contacto privado:', data.contactName, `<${data.contactEmail}>`, data.contactPhone || 'N/A');
        console.log('Relación:', data.relationship);
        console.log('='.repeat(80));

        // In a real implementation, you would:
        // - Send an email to the admin
        // - Save to a database or Google Sheets
        // - Create a draft in Sanity

        return NextResponse.json({
            success: true,
            message: 'Evento recibido correctamente'
        });

    } catch (error) {
        console.error('Error processing event submission:', error);
        return NextResponse.json(
            { success: false, error: 'Error al procesar el formulario' },
            { status: 500 }
        );
    }
}
