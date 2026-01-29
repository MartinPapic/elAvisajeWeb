import React from 'react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    {/* Branding */}
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🌋</span>
                        <div>
                            <p className="font-bold text-white">El Avisaje</p>
                            <p className="text-xs text-gray-400">Información local, visible en el territorio</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex space-x-6 text-sm">
                        <a href="mailto:contacto@elavisaje.cl" className="hover:text-white transition-colors">
                            Contacto
                        </a>
                        <a href="/agregar-evento" className="hover:text-white transition-colors">
                            Agregar Evento
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-xs text-gray-500">
                        © {currentYear} El Avisaje
                    </div>
                </div>
            </div>
        </footer>
    );
}
