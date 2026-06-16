'use client';

import React from 'react';

const SidebarAdmin = ({
  isOpen,
  toggleSidebar,
  activeTab,
  setActiveTab,
  menuItems,
  user,
  onLogout,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  menuItems: { id: string; label: string; icon: any }[];
  user: { username: string };
  onLogout: () => void;
  logo?: string;
}) => {
  const handleNav = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 900) toggleSidebar();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="adm-overlay open"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`adm-sidebar${isOpen ? ' mobile-open' : ''}`}>
        {/* Logo */}
        <div className="adm-sidebar-logo">
          <img src="/logo-principal.png" alt="CNMP 2026" />
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`adm-nav-item${activeTab === item.id ? ' active' : ''}`}
            >
              <NavIcon id={item.id} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="adm-sidebar-foot">
          <div className="adm-sidebar-user">
            {user?.username || 'admin'}
          </div>
          <button className="adm-nav-item danger" onClick={onLogout} style={{ color: 'rgba(255,80,80,.7)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};

/* Inline SVG icons per tab id — avoids FontAwesome dependency in admin shell */
function NavIcon({ id }: { id: string }) {
  const s = { width: 16, height: 16, flexShrink: 0 };
  const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, style: s };
  switch (id) {
    case 'dashboard':
      return <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case 'editions':
      return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
    case 'table':
      return <svg {...props}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>;
    case 'lecturers':
      return <svg {...props}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case 'testimonials':
      return <svg {...props}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
    case 'broadcasts':
      return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case 'discount-codes':
      return <svg {...props}><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;
    case 'certificates':
      return <svg {...props}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
    case 'localidades':
      return <svg {...props}><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

export default SidebarAdmin;
