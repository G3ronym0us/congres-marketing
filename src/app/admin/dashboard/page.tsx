'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavbarAdmin from '@/components/NavbarAdmin';
import SidebarAdmin from '@/components/SIdebarAdmin';
import { AuthContext } from '@/context/AuthContext';
import { useMetrics } from '@/hooks/useMetrics';
import { getCurrentEdition, setCurrentEdition } from '@/services/tickets';
import apiClient from '@/utils/apiClient';
import TestimonialsAdmin from '@/app/admin/testimonials/page';
import BroadcastsAdmin from '@/components/admin/broadcasts/BroadcastsAdmin';
import CertificatesAdmin from '@/components/admin/certificates/CertificatesAdmin';
import EditionsAdmin from '@/components/admin/editions/EditionsAdmin';
import EditionWorkspace from '@/components/admin/editions/EditionWorkspace';
import { adminEditionService } from '@/services/editions';
import { getLocalidadTypes } from '@/services/localidadTypes';
import { Edition } from '@/types/edition';
import '../admin.css';

// Recursos por edición (Tickets, Conferencistas, Localidades, Add-ons, Códigos
// y Etapas de descuento) ya no viven en el sidebar: se gestionan dentro del
// workspace de cada edición (ver EditionWorkspace).
const MENU_ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',           icon: null },
  { id: 'editions',       label: 'Ediciones',           icon: null },
  { id: 'testimonials',   label: 'Testimonios',         icon: null },
  { id: 'broadcasts',     label: 'Email Broadcasts',    icon: null },
  { id: 'certificates',   label: 'Certificados',        icon: null },
];

const PAGE_TITLES: Record<string, string> = {
  dashboard:      'Dashboard',
  editions:       'Ediciones',
  testimonials:   'Testimonios',
  broadcasts:     'Email Broadcasts',
  certificates:   'Certificados',
};

const TYPE_ICONS: Record<string, string> = {
  diamond: '💎', gold: '🥇', silver: '🥈', vip: '🟣', general: '🔵',
  streaming: '🌐', allied: '🤝', staff: '👥', journalist: '🎤',
};

// Fecha de referencia de una edición (para ordenar por más reciente)
const editionDate = (e: Edition): number => {
  if (e.display?.iso) return new Date(e.display.iso).getTime();
  if (e.eventStartDate) return new Date(e.eventStartDate).getTime();
  return new Date(e.year, 0, 1).getTime();
};

// Edición seleccionada por defecto: la activa (en venta) con la fecha más reciente;
// si ninguna está en venta, la más reciente de todas.
const pickDefaultEditionId = (list: Edition[]): number | undefined => {
  const active = list.filter(e => e.salesOpen);
  const pool = active.length ? active : list;
  return [...pool].sort((a, b) => editionDate(b) - editionDate(a))[0]?.id;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [defaultEdition, setDefaultEdition] = useState<number | null>(null);
  const [viewEdition, setViewEdition] = useState<number | undefined>(undefined);
  const [isSwitchingEdition, setIsSwitchingEdition] = useState(false);
  // Edición abierta en su workspace (submenú de recursos por edición); null = lista.
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  // Icono/nombre por slug de localidad de la edición vista (gráfico dinámico)
  const [localidadMeta, setLocalidadMeta] = useState<Record<string, { icon: string; name: string }>>({});

  const auth = useContext(AuthContext);
  const router = useRouter();
  const { metrics, loading: metricsLoading, refetch } = useMetrics(viewEdition);

  const selectedEdition = editions.find(e => e.id === viewEdition);
  const workspaceEdition = workspaceId != null ? editions.find(e => e.id === workspaceId) : undefined;
  const eventDate = selectedEdition?.display?.iso
    ? new Date(selectedEdition.display.iso)
    : selectedEdition?.eventStartDate
      ? new Date(selectedEdition.eventStartDate)
      : null;
  const daysLeft = eventDate
    ? Math.max(0, Math.ceil((eventDate.getTime() - Date.now()) / 86400000))
    : 0;

  useEffect(() => {
    const t = setTimeout(() => setIsAuthLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Sincroniza el tab activo con ?tab= para que recargar y el botón atrás funcionen
  useEffect(() => {
    const readTab = () => {
      const tab = new URLSearchParams(window.location.search).get('tab');
      setActiveTab(tab && MENU_ITEMS.some(m => m.id === tab) ? tab : 'dashboard');
    };
    readTab();
    window.addEventListener('popstate', readTab);
    return () => window.removeEventListener('popstate', readTab);
  }, []);

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    setWorkspaceId(null); // salir del workspace de edición al cambiar de sección
    const url = tab === 'dashboard'
      ? window.location.pathname
      : `${window.location.pathname}?tab=${tab}`;
    window.history.pushState(null, '', url);
  };

  useEffect(() => {
    if (!isAuthLoading && !auth?.user) router.push('/admin/auth');
  }, [isAuthLoading, auth?.user, router]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 900) setSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const loadEditions = async () => {
    try {
      const [list, current] = await Promise.all([
        adminEditionService.getAll(),
        getCurrentEdition().catch(() => ({ currentEdition: null as number | null })),
      ]);
      setEditions(list);
      setDefaultEdition(current.currentEdition);
      // Por defecto se muestra la edición activa (en venta) con la fecha más reciente
      setViewEdition(prev =>
        prev ?? pickDefaultEditionId(list) ?? current.currentEdition ?? list[0]?.id ?? undefined,
      );
    } catch {
      setEditions([]);
    }
  };

  useEffect(() => {
    if (isAuthLoading || !auth?.user) return;
    loadEditions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading, auth?.user]);

  // Localidades de la edición vista (para íconos/nombres dinámicos del gráfico)
  useEffect(() => {
    if (!viewEdition) { setLocalidadMeta({}); return; }
    getLocalidadTypes(viewEdition)
      .then(types => {
        const map: Record<string, { icon: string; name: string }> = {};
        (Array.isArray(types) ? types : []).forEach(t => {
          map[t.slug] = { icon: t.icon || '🎫', name: t.name };
        });
        setLocalidadMeta(map);
      })
      .catch(() => setLocalidadMeta({}));
  }, [viewEdition]);

  const handleLogout = () => { auth?.logout(); router.push('/admin/auth'); };

  const activateEdition = async () => {
    if (!viewEdition || viewEdition === defaultEdition) return;
    const target = editions.find(e => e.id === viewEdition);
    const ok = window.confirm(
      `¿Marcar "${target?.name ?? viewEdition}" como edición por defecto? Se usará como respaldo cuando no se especifique una edición.`,
    );
    if (!ok) return;
    try {
      setIsSwitchingEdition(true);
      const res = await setCurrentEdition(viewEdition);
      setDefaultEdition(res.currentEdition);
    } catch {
      alert('Error al cambiar la edición por defecto.');
    } finally {
      setIsSwitchingEdition(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setIsDownloadingPDF(true);
      const res = await apiClient.get('/tickets/report/download', {
        responseType: 'blob',
        params: viewEdition ? { edition: viewEdition } : undefined,
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-cnmp-${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Error al descargar el reporte.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

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

  const paid     = metrics?.seatsOverview.totalPaid     ?? 0;
  const reserved = metrics?.seatsOverview.totalReserved ?? 0;
  const total    = metrics?.totalTickets                ?? 0;
  const pending  = total - paid - reserved;

  return (
    <div className="admin-shell">
      <SidebarAdmin
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(v => !v)}
        activeTab={activeTab}
        setActiveTab={changeTab}
        menuItems={MENU_ITEMS}
        user={auth.user}
        onLogout={handleLogout}
      />

      <div className="adm-main">
        <NavbarAdmin
          title={workspaceEdition ? workspaceEdition.name : (PAGE_TITLES[activeTab] ?? 'Panel de Administración')}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          sidebarOpen={sidebarOpen}
        />

        <main className="adm-content">

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <>
              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                {editions.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
                    <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 13 }}>Edición:</span>
                    <select
                      className="adm-btn"
                      value={viewEdition ?? ''}
                      onChange={e => setViewEdition(parseInt(e.target.value, 10))}
                      style={{ cursor: 'pointer' }}
                    >
                      {editions.map(e => (
                        <option key={e.id} value={e.id} style={{ color: '#000' }}>
                          {e.name}{e.id === defaultEdition ? ' (por defecto)' : ''}
                        </option>
                      ))}
                    </select>
                    {viewEdition !== undefined && viewEdition !== defaultEdition && (
                      <button className="adm-btn neon" onClick={activateEdition} disabled={isSwitchingEdition}>
                        {isSwitchingEdition ? 'Guardando…' : 'Marcar por defecto'}
                      </button>
                    )}
                  </div>
                )}
                <button className="adm-btn" onClick={refetch} disabled={metricsLoading}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, ...(metricsLoading ? { animation: 'spin 1s linear infinite' } : {}) }}>
                    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                  </svg>
                  Actualizar
                </button>
                <button className="adm-btn neon" onClick={downloadPDF} disabled={isDownloadingPDF || metricsLoading}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  {isDownloadingPDF ? 'Generando…' : 'Reporte PDF'}
                </button>
              </div>

              {/* KPI cards */}
              <div className="adm-stats">
                <div className="adm-stat">
                  <div className="adm-stat-label">Tickets pagados</div>
                  <div className={`adm-stat-value${paid > 0 ? ' neon' : ''}`}>
                    {metricsLoading ? '—' : paid}
                  </div>
                  <div className="adm-stat-sub">asistentes confirmados</div>
                </div>
                <div className="adm-stat">
                  <div className="adm-stat-label">Reservados</div>
                  <div className="adm-stat-value">{metricsLoading ? '—' : reserved}</div>
                  <div className="adm-stat-sub">pago pendiente</div>
                </div>
                <div className="adm-stat">
                  <div className="adm-stat-label">Total tickets</div>
                  <div className="adm-stat-value">{metricsLoading ? '—' : total}</div>
                  <div className="adm-stat-sub">{pending} pendientes</div>
                </div>
                <div className="adm-stat">
                  <div className="adm-stat-label">Días para el evento</div>
                  <div className={`adm-stat-value${daysLeft <= 30 ? ' neon' : ''}`}>{daysLeft}</div>
                  <div className="adm-stat-sub">{selectedEdition?.display?.dateShort ?? selectedEdition?.name ?? '—'}</div>
                </div>
              </div>

              {/* Two-column grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* Tickets by type */}
                <div className="adm-section">
                  <div className="adm-section-title">Por tipo de localidad</div>
                  {metricsLoading ? (
                    <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13 }}>Cargando…</p>
                  ) : (
                    <div className="adm-bar-row">
                      {(metrics?.ticketsByType ?? []).map(t => {
                        const pct = total > 0 ? Math.round((t.total / total) * 100) : 0;
                        return (
                          <div key={t.type} className="adm-bar-item">
                            <div className="adm-bar-meta">
                              <span className="adm-bar-name">
                                {localidadMeta[t.type]?.icon ?? TYPE_ICONS[t.type] ?? '🎫'} {localidadMeta[t.type]?.name ?? t.type}
                              </span>
                              <span className="adm-bar-nums">
                                {t.paid} pag · {t.reserved} res · {t.total} total
                              </span>
                            </div>
                            <div className="adm-bar-track">
                              <div className="adm-bar-fill paid" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Status summary */}
                <div className="adm-section">
                  <div className="adm-section-title">Estado de tickets</div>
                  {metricsLoading ? (
                    <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13 }}>Cargando…</p>
                  ) : (
                    <>
                      {[
                        { label: 'Pagados',   val: paid,     cls: 'paid',  pct: total ? (paid / total) * 100 : 0 },
                        { label: 'Reservados',val: reserved, cls: 'res',   pct: total ? (reserved / total) * 100 : 0 },
                        { label: 'Pendientes',val: pending,  cls: 'pend',  pct: total ? (pending / total) * 100 : 0 },
                      ].map(row => (
                        <div key={row.label} className="adm-bar-item" style={{ marginBottom: 16 }}>
                          <div className="adm-bar-meta">
                            <span className="adm-bar-name">{row.label}</span>
                            <span className="adm-bar-nums">{row.val} ({Math.round(row.pct)}%)</span>
                          </div>
                          <div className="adm-bar-track">
                            <div className={`adm-bar-fill ${row.cls}`} style={{ width: `${row.pct}%` }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 10, background: 'rgba(4,238,98,.05)', border: '1px solid rgba(4,238,98,.12)', fontSize: 12, color: 'rgba(255,255,255,.5)' }}>
                        Última actualización: {metrics?.lastUpdated ? new Date(metrics.lastUpdated).toLocaleString('es-ES') : 'N/A'}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'editions' && (
            workspaceEdition
              ? <EditionWorkspace
                  edition={workspaceEdition}
                  editions={editions}
                  onBack={() => setWorkspaceId(null)}
                  onChanged={loadEditions}
                />
              : <EditionsAdmin onChanged={loadEditions} onOpen={(e) => setWorkspaceId(e.id)} />
          )}
          {activeTab === 'testimonials'   && <TestimonialsAdmin />}
          {activeTab === 'broadcasts'     && <BroadcastsAdmin editions={editions} />}
          {activeTab === 'certificates'   && <CertificatesAdmin />}

        </main>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
