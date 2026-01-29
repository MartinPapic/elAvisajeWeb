'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker').then(mod => ({ default: mod.MapPicker })), { ssr: false });

const COMMUNES = ['Puerto Varas', 'Puerto Montt', 'Frutillar', 'Llanquihue', 'Calbuco', 'Cochamó', 'Maullín', 'Fresia', 'Los Muermos'];

const CATEGORIES = [
    '🎶 Música y conciertos',
    '🎭 Artes escénicas',
    '🎨 Arte y exposiciones',
    '🍲 Gastronomía y ferias',
    '🌿 Naturaleza y aire libre',
    '🚴 Deportes y recreación',
    '📚 Educación y talleres',
    '🎉 Fiestas tradicionales',
    '👨‍👩‍👧‍👦 Actividades familiares',
    '🧑‍🤝‍🧑 Comunidad y encuentros'
];

export default function AgregarEventoPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        eventName: '',
        shortDescription: '',
        extendedDescription: '',
        startDate: '',
        endDate: '',
        schedule: '',
        venue: '',
        commune: 'Puerto Varas',
        address: '',
        lat: -41.3194,
        lng: -72.9854,
        categories: [] as string[],
        pricing: 'Gratuito',
        price: '',
        website: '',
        eventPhone: '',
        eventEmail: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        relationship: 'Otro',
        confirmed: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/submit-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSubmitted(true);
                window.scrollTo(0, 0);
            }
        } catch (error) {
            alert('Error al enviar el formulario. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryToggle = (category: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold text-green-900 mb-2">¡Evento enviado!</h1>
                    <p className="text-green-700 mb-6">
                        Gracias por tu aporte. Revisaremos la información y te contactaremos si es necesario.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Volver al mapa
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">🗺️ Publica un evento en El Avisaje</h1>
                <p className="text-gray-700 mb-4">
                    ¿Conoces un evento que se realizará en la Provincia de Llanquihue?
                    Ayúdanos a difundir actividades culturales, turísticas y comunitarias del territorio.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-900">
                        <strong>⚠️ El envío no garantiza publicación inmediata.</strong> Cada evento es revisado manualmente para asegurar que la información sea veraz, relevante y útil.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información principal */}
                <section className="bg-white border rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Información principal del evento</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Nombre del evento <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Feria Costumbrista de Frutillar"
                                value={formData.eventName}
                                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Descripción corta <span className="text-red-500">*</span></label>
                            <p className="text-sm text-gray-500 mb-2">Resumen breve que aparecerá en el mapa (máx. 200 caracteres)</p>
                            <textarea
                                required
                                maxLength={200}
                                rows={2}
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">{formData.shortDescription.length}/200</p>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Descripción extendida (opcional)</label>
                            <textarea
                                rows={4}
                                placeholder="Información más detallada: actividades, artistas, contexto, historia del evento, etc."
                                value={formData.extendedDescription}
                                onChange={(e) => setFormData({ ...formData, extendedDescription: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Fecha y horario */}
                <section className="bg-white border rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">📅 Fecha y horario</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Fecha de inicio <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Fecha de término</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block font-medium mb-1">Horario</label>
                        <input
                            type="text"
                            placeholder="Ej: 10:00 – 18:00"
                            value={formData.schedule}
                            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>
                </section>

                {/* Ubicación */}
                <section className="bg-white border rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">📍 Ubicación</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Lugar / recinto <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Plaza de Armas de Puerto Varas"
                                value={formData.venue}
                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Comuna <span className="text-red-500">*</span></label>
                            <select
                                required
                                value={formData.commune}
                                onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            >
                                {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Dirección o referencia</label>
                            <input
                                type="text"
                                placeholder="Calle, número, referencias"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Ubicación en el mapa <span className="text-red-500">*</span></label>
                            <p className="text-sm text-gray-500 mb-2">Arrastra el pin al lugar exacto del evento</p>
                            <MapPicker
                                lat={formData.lat}
                                lng={formData.lng}
                                onPositionChange={(lat, lng) => setFormData({ ...formData, lat, lng })}
                            />
                        </div>
                    </div>
                </section>

                {/* Categorías */}
                <section className="bg-white border rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">🏷️ Categoría del evento</h2>
                    <p className="text-sm text-gray-600 mb-4">Selecciona una o más categorías <span className="text-red-500">*</span></p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {CATEGORIES.map(cat => (
                            <label key={cat} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.categories.includes(cat)}
                                    onChange={() => handleCategoryToggle(cat)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">{cat}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Información adicional */}
                <section className="bg-white border rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">💰 Información adicional</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Entrada</label>
                            <select
                                value={formData.pricing}
                                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            >
                                <option>Gratuito</option>
                                <option>Pagado</option>
                                <option>Aporte voluntario</option>
                            </select>
                        </div>

                        {formData.pricing === 'Pagado' && (
                            <div>
                                <label className="block font-medium mb-1">Valor</label>
                                <input
                                    type="text"
                                    placeholder="Ej: $5.000 - $10.000"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block font-medium mb-1">Sitio web o redes sociales</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Teléfono de contacto público (opcional)</label>
                            <input
                                type="tel"
                                placeholder="+56 9 1234 5678"
                                value={formData.eventPhone}
                                onChange={(e) => setFormData({ ...formData, eventPhone: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Email de contacto público (opcional)</label>
                            <input
                                type="email"
                                placeholder="evento@ejemplo.cl"
                                value={formData.eventEmail}
                                onChange={(e) => setFormData({ ...formData, eventEmail: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Datos de contacto */}
                <section className="bg-white border rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">👤 Datos de contacto (no públicos)</h2>
                    <p className="text-sm text-gray-500 mb-4">Estos datos no se publican y se usan solo para verificación.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Nombre de quien envía <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={formData.contactName}
                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Correo electrónico <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                required
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Teléfono (opcional)</label>
                            <input
                                type="tel"
                                placeholder="+56 9 1234 5678"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Relación con el evento</label>
                            <select
                                value={formData.relationship}
                                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            >
                                <option>Organizador</option>
                                <option>Colaborador</option>
                                <option>Participante</option>
                                <option>Vecino / comunidad</option>
                                <option>Otro</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Confirmación */}
                <section className="bg-white border rounded-lg p-6">
                    <label className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            required
                            checked={formData.confirmed}
                            onChange={(e) => setFormData({ ...formData, confirmed: e.target.checked })}
                            className="mt-1 w-4 h-4"
                        />
                        <span className="text-sm">
                            Declaro que la información entregada es correcta según mi conocimiento y autorizo a El Avisaje a contactarme para verificarla. <span className="text-red-500">*</span>
                        </span>
                    </label>
                </section>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || formData.categories.length === 0}
                    className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Enviando...' : '📤 Enviar evento para revisión'}
                </button>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold mb-2">🧭 ¿Qué ocurre después?</h3>
                    <ul className="text-sm space-y-1 text-blue-900">
                        <li>• El evento entra en un proceso de revisión manual</li>
                        <li>• Se valida fecha, ubicación y coherencia de la información</li>
                        <li>• Si cumple los criterios editoriales, será publicado en el mapa interactivo</li>
                    </ul>
                </div>
            </form>
        </div>
    );
}
