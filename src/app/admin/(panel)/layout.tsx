'use client';

import { useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NavbarAdmin from '@/components/NavbarAdmin';
import SidebarAdmin, { AdminMenuItem } from '@/components/SIdebarAdmin';
import { AuthContext } from '@/context/AuthContext';
import { AdminEditionsProvider, useAdminEditions } from '@/context/AdminEditionsContext';
import '../admin.css';

// Recursos por edición (Tickets, Conferencistas, Localidades, Add-ons, Códigos
// y Etapas de descuento) no viven en el sidebar: se gestionan dentro de la ruta
// de cada edición (/admin/editions/[id]).
const MENU_ITEMS: AdminMenuItem[] = [
  { id: 'dashboard',    label: 'Dashboard',        href: '/admin/dashboard' },
  { id: 'editions',     label: 'Ediciones',        href: '/admin/editions' },
  { id: 'testimonials', label: 'Testimonios',      href: '/admin/testimonials' },
  { id: 'broadcasts',   label: 'Email Broadcasts', href: '/admin/broadcasts' },
  { id: 'certificates', label: 'Certificados',     href: '/admin/certificates' },
];

function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const auth = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const { editions } = useAdminEditions();

  useEffect(() => {
    const t = setTimeout(() => setIsAuthLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !auth?.user) router.push('/admin/auth');
  }, [isAuthLoading, auth?.user, router]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 900) setSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = () => { auth?.logout(); router.push('/admin/auth'); };

  // Título del navbar derivado de la ruta. En el detalle de una edición
  // (/admin/editions/[id]) se muestra el nombre de la edición.
  const title = (() => {
    const m = pathname.match(/^\/admin\/editions\/(\d+)/);
    if (m) {
      const ed = editions.find(e => e.id === Number(m[1]));
      return ed?.name ?? 'Edición';
    }
    const active = [...MENU_ITEMS]
      .sort((a, b) => b.href.length - a.href.length)
      .find(item => item.href === '/admin/dashboard' ? pathname === item.href : pathname.startsWith(item.href));
    return active?.label ?? 'Panel de Administración';
  })();

  if (isAuthLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#21191C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '2px solid rgba(4,238,98,.2)',
            borderTopColor: '#04EE62', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(255,255,255,.4)', fontFamily: 'sans-serif', fontSize: 14 }}>Cargando…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!auth?.user) return null;

  return (
    <div className="admin-shell">
      <SidebarAdmin
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(v => !v)}
        menuItems={MENU_ITEMS}
        user={auth.user}
        onLogout={handleLogout}
      />

      <div className="adm-main">
        <NavbarAdmin
          title={title}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          sidebarOpen={sidebarOpen}
        />

        <main className="adm-content">
          {children}
        </main>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <AdminEditionsProvider>
      <AdminShell>{children}</AdminShell>
    </AdminEditionsProvider>
  );
}
