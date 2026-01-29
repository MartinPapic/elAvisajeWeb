'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, User } from 'lucide-react';

interface SubmissionFormData {
    title: string;
    locationName: string;
    location: { lat: number; lng: number };
    dateRange: { start: string; end?: string };
    description?: string;
    externalLink?: string;
    submittedBy: {
        name: string;
        email: string;
        phone?: string;
        relation?: string;
    };
}

export default function EventSubmissionForm() {
    const [formData, setFormData] = useState<SubmissionFormData>({
        title: '',
        locationName: '',
        location: { lat: -41.3, lng: -72.9 }, // Default to Llanquihue region
        dateRange: { start: '' },
        submittedBy: { name: '', email: '' }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/events/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus({
                    type: 'success',
                    message: data.message || '¡Evento enviado con éxito! Será revisado antes de publicarse.'
                });
                // Reset form
                setFormData({
                    title: '',
                    locationName: '',
                    location: { lat: -41.3, lng: -72.9 },
                    dateRange: { start: '' },
                    submittedBy: { name: '', email: '' }
                });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: data.error || 'Error al enviar el evento. Por favor, intenta nuevamente.'
                });
            }
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Error de conexión. Por favor, verifica tu conexión a internet.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Proponer un Evento</h1>
                <p className="text-muted-foreground">
                    Comparte eventos culturales y turísticos de la Provincia de Llanquihue.
                    Tu aporte será revisado antes de publicarse.
                </p>
            </div>

            {submitStatus && (
                <div className={`p-4 mb-6 rounded-lg ${submitStatus.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {submitStatus.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Details */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Información del Evento
                    </h2>

                    <div>
                        <Label htmlFor="title">Título del Evento *</Label>
                        <Input
                            id="title"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej: Festival de Jazz en Puerto Varas"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe brevemente el evento..."
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="startDate">Fecha de Inicio *</Label>
                            <Input
                                id="startDate"
                                type="date"
                                required
                                value={formData.dateRange.start}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    dateRange: { ...formData.dateRange, start: e.target.value }
                                })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="endDate">Fecha de Término (opcional)</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.dateRange.end || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    dateRange: { ...formData.dateRange, end: e.target.value }
                                })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="externalLink">Enlace Externo (opcional)</Label>
                        <Input
                            id="externalLink"
                            type="url"
                            value={formData.externalLink || ''}
                            onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                            placeholder="https://ejemplo.com/evento"
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Ubicación
                    </h2>

                    <div>
                        <Label htmlFor="locationName">Lugar *</Label>
                        <Input
                            id="locationName"
                            required
                            value={formData.locationName}
                            onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                            placeholder="Ej: Plaza de Armas, Puerto Varas"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Indica la ciudad y lugar específico
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="lat">Latitud *</Label>
                            <Input
                                id="lat"
                                type="number"
                                step="any"
                                required
                                value={formData.location.lat}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    location: { ...formData.location, lat: parseFloat(e.target.value) }
                                })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="lng">Longitud *</Label>
                            <Input
                                id="lng"
                                type="number"
                                step="any"
                                required
                                value={formData.location.lng}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    location: { ...formData.location, lng: parseFloat(e.target.value) }
                                })}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Puedes obtener las coordenadas desde Google Maps
                    </p>
                </div>

                {/* Submitter Information */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Tus Datos
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="submitterName">Tu Nombre *</Label>
                            <Input
                                id="submitterName"
                                required
                                value={formData.submittedBy.name}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    submittedBy: { ...formData.submittedBy, name: e.target.value }
                                })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="submitterEmail">Tu Email *</Label>
                            <Input
                                id="submitterEmail"
                                type="email"
                                required
                                value={formData.submittedBy.email}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    submittedBy: { ...formData.submittedBy, email: e.target.value }
                                })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="submitterPhone">Teléfono (opcional)</Label>
                            <Input
                                id="submitterPhone"
                                type="tel"
                                value={formData.submittedBy.phone || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    submittedBy: { ...formData.submittedBy, phone: e.target.value }
                                })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="relation">Relación con el Evento (opcional)</Label>
                            <Input
                                id="relation"
                                value={formData.submittedBy.relation || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    submittedBy: { ...formData.submittedBy, relation: e.target.value }
                                })}
                                placeholder="Ej: Organizador, Asistente"
                            />
                        </div>
                    </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Enviando...' : 'Enviar Evento para Revisión'}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                    * Campos obligatorios. Tu evento será revisado por nuestro equipo antes de publicarse.
                </p>
            </form>
        </div>
    );
}
