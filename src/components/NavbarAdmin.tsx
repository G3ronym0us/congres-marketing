'use client';

import React from 'react';

const NavbarAdmin = ({
  title,
  onLogout,
  onToggleSidebar,
  sidebarOpen,
}: {
  title: string;
  onLogout: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}) => {
  return (
    <header className="adm-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="adm-btn adm-burger"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          style={{ padding: '6px 10px' }}
        >
          {sidebarOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
        <span className="adm-topbar-title">{title}</span>
      </div>

      <div className="adm-topbar-actions">
        <button className="adm-btn danger" onClick={onLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default NavbarAdmin;
