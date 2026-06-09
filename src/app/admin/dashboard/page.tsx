'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReserveTickets from '@/components/tickets/reserve';
import TicketsTable from '@/components/tickets/table';
import NavbarAdmin from '@/components/NavbarAdmin';
import SidebarAdmin from '@/components/SIdebarAdmin';
import { AuthContext } from '@/context/AuthContext';
import { useMetrics } from '@/hooks/useMetrics';
import { getCurrentEdition, setCurrentEdition } from '@/services/tickets';
import apiClient from '@/utils/apiClient';
import Lecturers from '@/components/admin/Lecturers';
import TestimonialsAdmin from '@/app/admin/testimonials/page';
import BroadcastsAdmin from '@/components/admin/broadcasts/BroadcastsAdmin';
import DiscountCodesAdmin from '@/components/admin/discountCodes/DiscountCodesAdmin';
import CertificatesAdmin from '@/components/admin/certificates/CertificatesAdmin';
import LocalidadesAdmin from '@/components/admin/LocalidadesAdmin';
import '../admin.css';

const EVENT_DATE = new Date('2026-08-28T09:00:00');

const MENU_ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',           icon: null },
  { id: 'table',          label: 'Tickets',             icon: null },
  { id: 'lecturers',      label: 'Conferencistas',      icon: null },
  { id: 'testimonials',   label: 'Testimonios',         icon: null },
  { id: 'broadcasts',     label: 'Email Broadcasts',    icon: null },
  { id: 'discount-codes', label: 'Códigos de Descuento',icon: null },
  { id: 'certificates',   label: 'Certificados',        icon: null },
  { id: 'localidades',    label: 'Localidades',         icon: null },
];

const PAGE_TITLES: Record<string, string> = {
  dashboard:      'Dashboard',
  table:          'Gestión de Tickets',
  lecturers:      'Conferencistas',
  testimonials:   'Testimonios',
  broadcasts:     'Email Broadcasts',
  'discount-codes': 'Códigos de Descuento',
  certificates:   'Certificados',
  localidades:    'Localidades',
};

const TYPE_ICONS: Record<string, string> = {
  diamond: '💎', vip: '🟣', general: '🔵',
  streaming: '🌐', allied: '🤝', staff: '👥', journalist: '🎤',
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [activeEdition, setActiveEdition] = useState<number | null>(null);
  const [viewEdition, setViewEdition] = useState<number | undefined>(undefined);
  const [isSwitchingEdition, setIsSwitchingEdition] = useState(false);

  const auth = useContext(AuthContext);
  const router = useRouter();
  const { metrics, loading: metricsLoading, refetch } = useMetrics(viewEdition);

  const daysLeft = Math.max(0, Math.ceil((EVENT_DATE.getTime() - Date.now()) / 86400000));

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

  useEffect(() => {
    if (isAuthLoading || !auth?.user) return;
    getCurrentEdition()
      .then(({ currentEdition }) => {
        setActiveEdition(currentEdition);
        setViewEdition(currentEdition);
      })
      .catch(() => setActiveEdition(null));
  }, [isAuthLoading, auth?.user]);

  const handleLogout = () => { auth?.logout(); router.push('/admin/auth'); };

  const activateEdition = async () => {
    if (!viewEdition || viewEdition === activeEdition) return;
    const ok = window.confirm(
      `¿Activar la edición ${viewEdition} del congreso? Los nuevos tickets, transacciones y conferencistas se crearán en esa edición.`,
    );
    if (!ok) return;
    try {
      setIsSwitchingEdition(true);
      const res = await setCurrentEdition(viewEdition);
      setActiveEdition(res.currentEdition);
    } catch {
      alert('Error al cambiar la edición activa.');
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
        setActiveTab={setActiveTab}
        menuItems={MENU_ITEMS}
        user={auth.user}
        onLogout={handleLogout}
      />

      <div className="adm-main">
        <NavbarAdmin
          title={PAGE_TITLES[activeTab] ?? 'Panel de Administración'}
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
                {activeEdition !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
                    <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 13 }}>Edición:</span>
                    <select
                      className="adm-btn"
                      value={viewEdition ?? activeEdition}
                      onChange={e => setViewEdition(parseInt(e.target.value, 10))}
                      style={{ cursor: 'pointer' }}
                    >
                      {Array.from(
                        { length: Math.max(activeEdition, new Date().getFullYear()) - 2025 + 2 },
                        (_, i) => 2025 + i,
                      ).map(year => (
                        <option key={year} value={year} style={{ color: '#000' }}>
                          {year}{year === activeEdition ? ' (activa)' : ''}
                        </option>
                      ))}
                    </select>
                    {viewEdition !== undefined && viewEdition !== activeEdition && (
                      <button className="adm-btn neon" onClick={activateEdition} disabled={isSwitchingEdition}>
                        {isSwitchingEdition ? 'Activando…' : `Activar edición ${viewEdition}`}
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
                  <div className="adm-stat-sub">28–29 Ago 2026</div>
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
                                {TYPE_ICONS[t.type] ?? '🎫'} {t.type}
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

          {activeTab === 'table'          && <TicketsTable />}
          {activeTab === 'lecturers'      && <Lecturers />}
          {activeTab === 'testimonials'   && <TestimonialsAdmin />}
          {activeTab === 'broadcasts'     && <BroadcastsAdmin />}
          {activeTab === 'discount-codes' && <DiscountCodesAdmin />}
          {activeTab === 'certificates'   && <CertificatesAdmin />}
          {activeTab === 'localidades'    && <LocalidadesAdmin />}

        </main>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
