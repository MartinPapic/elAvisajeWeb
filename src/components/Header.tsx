import React from 'react';
import Link from 'next/link';

export function Header() {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / Brand */}
                    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <span className="text-2xl">🌋</span>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg text-gray-900">El Avisaje</span>
                            <span className="text-xs text-gray-500 hidden sm:block">Llanquihue</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-6">
                        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            Mapa
                        </Link>
                        <Link href="/studio" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            CMS
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
