'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faUser,
  faSignOutAlt,
  faHome,
  faCog,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  activeTab, 
  setActiveTab, 
  menuItems,
  user,
  onLogout,
  logo
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  menuItems: any[];
  user: { username: string };
  onLogout: () => void;
  logo: string;
}) => {
  return (
    <>
      {/* Botón de Toggle para móvil - Ya no es necesario, se mueve a la navbar */}
      {/* <div className="lg:hidden">
        <button
          onClick={toggleSidebar}
          className="fixed z-50 top-4 left-4 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-5 h-5" />
        </button>
      </div> */}

      {/* Overlay para cerrar sidebar en móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition duration-300 ease-in-out z-40 lg:static lg:inset-0 w-72 bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo y cabecera */}
          <div className="flex items-center justify-center py-8 border-b border-blue-500/30">
            <div className="px-4">
              {logo && (
                <Image
                  src={logo}
                  alt="Logo"
                  width={180}
                  height={50}
                  className="object-contain"
                />
              )}
            </div>
          </div>

          {/* Usuario actual */}
          <div className="px-6 py-5 border-b border-blue-500/30">
            <div className="flex items-center">
              <div className="bg-blue-500/30 rounded-full p-2 mr-3">
                <FontAwesomeIcon icon={faUser} className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-blue-100">Sesión iniciada como:</p>
                <p className="font-medium text-white">{user?.username || 'Usuario'}</p>
              </div>
            </div>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
            <div className="text-xs uppercase text-blue-200 font-semibold px-3 mb-2">
              Menú Principal
            </div>
            
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-white text-blue-700 shadow-md font-medium'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3 w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Botón de cerrar sesión */}
          <div className="p-4 border-t border-blue-500/30 lg:block">
            <button
              onClick={onLogout}
              className="flex items-center w-full text-left px-4 py-3 rounded-lg text-white hover:bg-blue-700 transition-all"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;