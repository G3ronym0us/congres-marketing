'use client';

import React from 'react';
import Swal from 'sweetalert2';
import {
  deleteTickets,
  downloadCertificate,
  downloadTicket,
  downloadTicketsExcel,
  getTicketsApproved,
  resendEmailTicket,
  adminSaveTickets,
  adminEditTicket,
} from '@/services/tickets';
import {
  TicketStatus,
  FilterGetTicketsInput,
  AdminCreateTicketInput,
  AdminEditTicketInput,
  Ticket,
} from '@/types/tickets';
import TicketModal from './Modals/CreateTicket';
import EditTicketModal from './Modals/EditTicket';
import { Edition } from '@/types/edition';
import { getLocalidadTypes } from '@/services/localidadTypes';
import { editionCertificatesAvailable } from '@/utils/editionFormat';

/* ── helpers ── */
const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  diamond:    { bg: 'rgba(4,238,98,.12)',   color: '#04EE62' },
  gold:       { bg: 'rgba(224,165,38,.15)', color: '#e0a526' },
  silver:     { bg: 'rgba(156,163,175,.15)',color: '#cbd5e1' },
  vip:        { bg: 'rgba(168,85,247,.15)', color: '#c084fc' },
  general:    { bg: 'rgba(59,130,246,.15)', color: '#60a5fa' },
  streaming:  { bg: 'rgba(6,182,212,.15)',  color: '#22d3ee' },
  allied:     { bg: 'rgba(251,146,60,.15)', color: '#fb923c' },
  staff:      { bg: 'rgba(148,163,184,.12)',color: '#94a3b8' },
  journalist: { bg: 'rgba(250,204,21,.12)', color: '#fbbf24' },
};
const TYPE_ICONS: Record<string, string> = {
  diamond: '💎', gold: '🥇', silver: '🥈', vip: '🟣', general: '🔵',
  streaming: '🌐', allied: '🤝', staff: '👥', journalist: '🎤',
};

function TypeBadge({ type, icon, label }: { type: string; icon?: string; label?: string }) {
  const c = TYPE_COLORS[type] ?? { bg: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.6)' };
  return (
    <span style={{
      background: c.bg, color: c.color,
      border: `1px solid ${c.color}33`,
      borderRadius: 100, padding: '3px 10px',
      fontSize: 11, fontFamily: 'Oxanium, sans-serif',
      fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {icon ?? TYPE_ICONS[type] ?? '🎫'} {label ?? type}
    </span>
  );
}

function IconBtn({ title, onClick, danger = false, children }: {
  title: string; onClick: () => void; danger?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        background: 'none', border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 7, padding: '5px 8px', cursor: 'pointer',
        color: danger ? 'rgba(255,80,80,.7)' : 'rgba(255,255,255,.45)',
        transition: 'all .15s',
        display: 'inline-flex', alignItems: 'center',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.color = danger ? '#ff6b6b' : '#04EE62';
        (e.currentTarget as HTMLButtonElement).style.borderColor = danger ? 'rgba(255,80,80,.4)' : 'rgba(4,238,98,.3)';
        (e.currentTarget as HTMLButtonElement).style.background = danger ? 'rgba(255,80,80,.08)' : 'rgba(4,238,98,.07)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.color = danger ? 'rgba(255,80,80,.7)' : 'rgba(255,255,255,.45)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.08)';
        (e.currentTarget as HTMLButtonElement).style.background = 'none';
      }}
    >
      {children}
    </button>
  );
}

const s16 = { width: 14, height: 14 };

/* ══════════════════════════════════════════════════ */

const TicketsTable = ({
  editionId,
  editions = [],
  onEditionChange,
}: {
  editionId?: number;
  editions?: Edition[];
  onEditionChange?: (id: number) => void;
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [data, setData] = React.useState<Ticket[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [isOpenEdit, setIsOpenEdit] = React.useState(false);
  const [ticketEdit, setTicketEdit] = React.useState<Ticket | null>(null);
  // uuid del ticket cuyo certificado se está generando/descargando (evita doble clic)
  const [certUuid, setCertUuid] = React.useState<string | null>(null);
  // Metadatos de localidades de la edición (icono/nombre por slug) — dinámico
  const [localidadMeta, setLocalidadMeta] = React.useState<Record<string, { icon: string; name: string }>>({});

  // La edición a visualizar la decide el selector global del dashboard
  const edition = editionId;

  // El backend responde 403 si la edición aún no libera certificados, así que
  // la acción de descarga solo se ofrece cuando ya están disponibles.
  const certsAvailable = editionCertificatesAvailable(
    editions.find(e => e.id === editionId),
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!editionId) { setLocalidadMeta({}); return; }
    getLocalidadTypes(editionId).then(types => {
      const map: Record<string, { icon: string; name: string }> = {};
      (Array.isArray(types) ? types : []).forEach(t => {
        map[t.slug] = { icon: t.icon || '🎫', name: t.name };
      });
      setLocalidadMeta(map);
    }).catch(() => setLocalidadMeta({}));
  }, [editionId]);

  const [filters] = React.useState<FilterGetTicketsInput>({
    status: [TicketStatus.PAID, TicketStatus.RESERVED],
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { getTickets(); }, [edition]);

  // Restaura la página desde ?page= al montar, para que sobreviva recargas
  React.useEffect(() => {
    const p = parseInt(new URLSearchParams(window.location.search).get('page') ?? '', 10);
    if (p > 1) setCurrentPage(p);
  }, []);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    if (page > 1) params.set('page', String(page));
    else params.delete('page');
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  };

  const getTickets = async () => {
    setIsLoading(true);
    try {
      setData(await getTicketsApproved({ ...filters, edition }));
    } catch {
      toast('error', 'Error al cargar tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const toast = (icon: 'success' | 'error', title: string) =>
    Swal.fire({ position: 'top-end', icon, title, showConfirmButton: false, timer: 1500 });

  const filteredData = data.filter(t =>
    !searchTerm ||
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.document?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.phone?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const ITEMS = 15;
  const totalPages = Math.ceil(filteredData.length / ITEMS);
  const currentItems = filteredData.slice((currentPage - 1) * ITEMS, currentPage * ITEMS);

  // Si al filtrar o recargar la página actual queda fuera de rango, vuelve a la última válida
  React.useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) goToPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const resendEmail = async (uuid: string) => {
    const r = await resendEmailTicket(uuid);
    toast(r.status === 'ok' ? 'success' : 'error', r.status === 'ok' ? 'Correo enviado' : 'Error al enviar correo');
  };

  const downloadPDF = async (ticket: Ticket) => {
    try {
      const blob = await downloadTicket(ticket.uuid);
      if (!blob) { toast('error', 'Error al descargar PDF'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CNMP_COLOMBIA_BOLETO(${ticket.name ? `${ticket.name.toUpperCase()} ${ticket.lastname.toUpperCase()}` : ticket.uuid}).pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast('error', 'Error al descargar PDF');
    }
  };

  // El backend genera el certificado on-demand si el ticket aún no lo tiene,
  // así que esto sirve igual para boletos viejos sin certificate_url.
  const downloadCert = async (ticket: Ticket) => {
    if (certUuid) return;
    setCertUuid(ticket.uuid);
    try {
      const blob = await downloadCertificate(ticket.uuid);
      if (!blob) { toast('error', 'Error al descargar el certificado'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CNMP_CERTIFICADO(${ticket.name ? `${ticket.name.toUpperCase()} ${ticket.lastname.toUpperCase()}` : ticket.uuid}).pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast(
        'error',
        e?.response?.status === 403
          ? 'Los certificados de esta edición aún no están disponibles'
          : 'Error al descargar el certificado',
      );
    } finally {
      setCertUuid(null);
    }
  };

  const exportExcel = async () => {
    setIsExporting(true);
    try {
      const blob = await downloadTicketsExcel(edition);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets-cnmp-${edition ?? 'actual'}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast('error', 'Error al descargar el Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const deleteTicket = async (uuid: string) => {
    const confirmed = await Swal.fire({
      title: '¿Eliminar ticket?',
      text: 'Esta acción no se puede revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#04EE62',
      cancelButtonColor: '#333',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#2A2228',
      color: '#fff',
    });
    if (!confirmed.isConfirmed) return;
    const r = await deleteTickets(uuid);
    toast(r.status === 'ok' ? 'success' : 'error', r.status === 'ok' ? 'Ticket eliminado' : 'Error al eliminar');
    if (r.status === 'ok') getTickets();
  };

  const handleReserveTickets = async (ticket: AdminCreateTicketInput) => {
    setIsLoading(true);
    try {
      const r = await adminSaveTickets(ticket);
      if (r.status !== 'ok') throw new Error();
      toast('success', 'Ticket creado');
      setIsOpen(false);
      getTickets();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el ticket', background: '#2A2228', color: '#fff' });
    } finally { setIsLoading(false); }
  };

  const handleEditTicket = async (ticket: AdminEditTicketInput) => {
    setIsLoading(true);
    try {
      const r = await adminEditTicket(ticket);
      if (r.status !== 'ok') throw new Error();
      toast('success', 'Ticket actualizado');
      setIsOpenEdit(false);
      getTickets();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo editar el ticket', background: '#2A2228', color: '#fff' });
    } finally { setIsLoading(false); }
  };

  /* ── page range ── */
  const pageNums = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '…', totalPages];
    if (currentPage >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages];
  };

  const renderActions = (item: Ticket) => (
    <>
      <IconBtn title="Reenviar correo" onClick={() => resendEmail(item.uuid)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={s16}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </IconBtn>
      <IconBtn title="Descargar PDF" onClick={() => downloadPDF(item)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={s16}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
      </IconBtn>
      {certsAvailable && (
        <IconBtn
          title={certUuid === item.uuid ? 'Generando certificado…' : 'Descargar certificado'}
          onClick={() => downloadCert(item)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={s16}>
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        </IconBtn>
      )}
      <IconBtn title="Editar ticket" onClick={() => { setTicketEdit(item); setIsOpenEdit(true); }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={s16}>
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </IconBtn>
      <IconBtn title="Eliminar ticket" onClick={() => deleteTicket(item.uuid)} danger>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={s16}>
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
        </svg>
      </IconBtn>
    </>
  );

  /* ── shared input style for search ── */
  const searchStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.1)',
    borderRadius: 10,
    padding: '9px 14px 9px 38px',
    color: '#fff',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Header ── */}
      <div style={{
        background: 'var(--panel)', border: '1px solid var(--line)',
        borderRadius: '16px 16px 0 0', padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ width: 15, height: 15, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.3)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, documento, email…"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); goToPage(1); }}
            style={searchStyle}
          />
        </div>

        {/* Edition filter */}
        {editions.length > 0 && (
          <select
            className="adm-btn"
            value={editionId ?? ''}
            onChange={e => {
              onEditionChange?.(parseInt(e.target.value, 10));
              goToPage(1);
            }}
            style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
            title="Filtrar por edición"
          >
            {editions.map(ed => (
              <option key={ed.id} value={ed.id} style={{ color: '#000' }}>
                {ed.name}
              </option>
            ))}
          </select>
        )}

        {/* Count */}
        <span style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 12, color: 'var(--mute-2)', whiteSpace: 'nowrap' }}>
          {filteredData.length} ticket{filteredData.length !== 1 ? 's' : ''}
        </span>

        {/* Refresh */}
        <button className="adm-btn" onClick={getTickets} disabled={isLoading} style={{ whiteSpace: 'nowrap' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ ...s16, ...(isLoading ? { animation: 'spin 1s linear infinite' } : {}) }}>
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
          </svg>
          Actualizar
        </button>

        {/* Export Excel */}
        <button className="adm-btn" onClick={exportExcel} disabled={isLoading || isExporting} style={{ whiteSpace: 'nowrap' }} title="Descargar Excel de la edición seleccionada">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ ...s16, ...(isExporting ? { animation: 'spin 1s linear infinite' } : {}) }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          {isExporting ? 'Generando…' : 'Excel'}
        </button>

        {/* New ticket */}
        <button className="adm-btn neon" onClick={() => setIsOpen(true)} style={{ whiteSpace: 'nowrap' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={s16}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo ticket
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{
        background: 'var(--panel)', border: '1px solid var(--line)', borderTop: 'none',
        borderRadius: totalPages > 1 ? '0' : '0 0 16px 16px',
        overflowX: 'auto',
      }}>
        {isLoading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '2px solid rgba(4,238,98,.2)', borderTopColor: '#04EE62', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--mute-2)', fontSize: 13 }}>Cargando tickets…</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--mute-2)', fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎫</div>
            No se encontraron tickets
          </div>
        ) : (
          <>
          <table className="tkt-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['Documento', 'Asistente', 'Contacto', 'Localidad', 'Acciones'].map(h => (
                  <th key={h} style={{
                    padding: '11px 16px', textAlign: h === 'Acciones' ? 'center' : 'left',
                    fontFamily: 'Oxanium, sans-serif', fontSize: 11,
                    fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'var(--mute-2)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => (
                <tr key={item.uuid} style={{
                  borderBottom: idx < currentItems.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
                  transition: 'background .15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Documento */}
                  <td style={{ padding: '12px 16px', color: 'var(--mute)', fontFamily: 'Space Grotesk, monospace', fontSize: 12 }}>
                    {item.document || '—'}
                  </td>

                  {/* Asistente */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>
                      {!item.name ? <span style={{ color: 'var(--mute-2)', fontStyle: 'italic' }}>Reservada</span>
                        : `${item.lastname?.toUpperCase()}, ${item.name}`}
                    </div>
                    {item.email && (
                      <div style={{ color: 'var(--mute)', fontSize: 11, marginTop: 2 }}>{item.email}</div>
                    )}
                  </td>

                  {/* Contacto */}
                  <td style={{ padding: '12px 16px', color: 'var(--mute)', fontSize: 12 }}>
                    {item.phone || <span style={{ color: 'var(--mute-2)' }}>—</span>}
                  </td>

                  {/* Localidad */}
                  <td style={{ padding: '12px 16px' }}>
                    <TypeBadge type={item.type} icon={localidadMeta[item.type]?.icon} label={localidadMeta[item.type]?.name} />
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      {renderActions(item)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Vista mobile: tarjetas apiladas (toggle en admin.css) */}
          <div className="tkt-cards">
            {currentItems.map(item => (
              <div key={item.uuid} className="tkt-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>
                      {!item.name ? <span style={{ color: 'var(--mute-2)', fontStyle: 'italic' }}>Reservada</span>
                        : `${item.lastname?.toUpperCase()}, ${item.name}`}
                    </div>
                    <div style={{ color: 'var(--mute)', fontSize: 12, marginTop: 3, overflowWrap: 'anywhere' }}>
                      {item.document || '—'}{item.phone ? ` · ${item.phone}` : ''}
                    </div>
                    {item.email && (
                      <div style={{ color: 'var(--mute)', fontSize: 12, marginTop: 2, overflowWrap: 'anywhere' }}>
                        {item.email}
                      </div>
                    )}
                  </div>
                  <TypeBadge type={item.type} icon={localidadMeta[item.type]?.icon} label={localidadMeta[item.type]?.name} />
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                  {renderActions(item)}
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>

      {/* ── Pagination ── */}
      {!isLoading && totalPages > 1 && (
        <div style={{
          background: 'var(--panel)', border: '1px solid var(--line)', borderTop: 'none',
          borderRadius: '0 0 16px 16px', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 12, color: 'var(--mute-2)', fontFamily: 'Oxanium, sans-serif' }}>
            Página {currentPage} de {totalPages} · {filteredData.length} resultados
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {pageNums().map((p, i) =>
              p === '…' ? (
                <span key={`e${i}`} style={{ padding: '5px 8px', color: 'var(--mute-2)', fontSize: 13 }}>…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(Number(p))}
                  style={{
                    padding: '5px 10px', borderRadius: 7, fontSize: 13, cursor: 'pointer',
                    fontFamily: 'Oxanium, sans-serif', fontWeight: 600,
                    border: currentPage === p ? '1px solid var(--neon)' : '1px solid var(--line)',
                    background: currentPage === p ? 'var(--neon)' : 'transparent',
                    color: currentPage === p ? '#1A1418' : 'var(--mute)',
                    transition: 'all .15s',
                  }}
                >
                  {p}
                </button>
              )
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {isOpen && (
        <TicketModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={handleReserveTickets} editionId={editionId} />
      )}
      {isOpenEdit && ticketEdit && (
        <EditTicketModal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)} onSave={handleEditTicket} ticket={ticketEdit} editionId={editionId} />
      )}
    </div>
  );
};

export default TicketsTable;
