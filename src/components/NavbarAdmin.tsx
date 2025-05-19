'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faSignOutAlt,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

// Componente principal de la Navbar
const Navbar = ({ title, onLogout, onToggleSidebar, sidebarOpen }: { title: string, onLogout: () => void, onToggleSidebar: () => void, sidebarOpen: boolean }) => {
  return (
    <header className="bg-white shadow-sm z-10 border-b border-gray-200">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Sección izquierda: Título e ícono */}
          <div className="flex items-center">
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-2 text-blue-600 hidden sm:block" />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
              {title}
            </h1>
          </div>
          
          {/* Sección derecha: Botón de hamburguesa y cerrar sesión */}
          <div className="flex items-center space-x-3">
            {/* Botón de hamburguesa (siempre visible) */}
            <button
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={onToggleSidebar}
              aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} className="w-5 h-5" />
            </button>
            
            {/* Botón de cerrar sesión */}
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

