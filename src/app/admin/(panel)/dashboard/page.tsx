'use client';

import { useState, useEffect } from 'react';
import { useAdminEditions } from '@/context/AdminEditionsContext';
import { useMetrics } from '@/hooks/useMetrics';
import apiClient from '@/utils/apiClient';
import { getLocalidadTypes } from '@/services/localidadTypes';
import { formatEditionDateShort } from '@/utils/editionFormat';

const TYPE_ICONS: Record<string, string> = {
  diamond: '💎', gold: '🥇', silver: '🥈', vip: '🟣', general: '🔵',
  streaming: '🌐', allied: '🤝', staff: '👥', journalist: '🎤',
};

export default function DashboardPage() {
  const { editions, defaultEdition, viewEdition, setViewEdition, makeDefault } = useAdminEditions();

  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isSwitchingEdition, setIsSwitchingEdition] = useState(false);
  // Icono/nombre por slug de localidad de la edición vista (gráfico dinámico)
  const [localidadMeta, setLocalidadMeta] = useState<Record<string, { icon: string; name: string }>>({});

  const { metrics, loading: metricsLoading, refetch } = useMetrics(viewEdition);

  const selectedEdition = editions.find(e => e.id === viewEdition);
  const eventDate = selectedEdition?.display?.iso
    ? new Date(selectedEdition.display.iso)
    : selectedEdition?.eventStartDate
      ? new Date(selectedEdition.eventStartDate)
      : null;
  const daysLeft = eventDate
    ? Math.max(0, Math.ceil((eventDate.getTime() - Date.now()) / 86400000))
    : 0;
  // Fecha corta derivada de la edición (no del texto legacy display.dateShort)
  const eventDateShort = formatEditionDateShort(selectedEdition);

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

  const activateEdition = async () => {
    if (!viewEdition || viewEdition === defaultEdition) return;
    const target = editions.find(e => e.id === viewEdition);
    const ok = window.confirm(
      `¿Marcar "${target?.name ?? viewEdition}" como edición por defecto? Se usará como respaldo cuando no se especifique una edición.`,
    );
    if (!ok) return;
    try {
      setIsSwitchingEdition(true);
      await makeDefault(viewEdition);
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

  const paid     = metrics?.seatsOverview.totalPaid     ?? 0;
  const reserved = metrics?.seatsOverview.totalReserved ?? 0;
  const total    = metrics?.totalTickets                ?? 0;
  const pending  = total - paid - reserved;

  return (
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
          <div className="adm-stat-sub">{eventDateShort || selectedEdition?.name || '—'}</div>
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
  );
}
