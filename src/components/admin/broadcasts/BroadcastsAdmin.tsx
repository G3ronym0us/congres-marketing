'use client';

import { useState, useEffect } from 'react';
import { EmailBroadcast } from '../../../types/emailBroadcast';
import { emailBroadcastService } from '../../../services/emailBroadcast';
import CreateBroadcastModal from './CreateBroadcastModal';
import BroadcastDetailModal from './BroadcastDetailModal';
import Swal from 'sweetalert2';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

const iS: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: '9px 14px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
};

const STATUS: Record<string, { color: string; bg: string; label: string }> = {
  PENDING:   { color: '#f59e0b', bg: 'rgba(245,158,11,.12)',  label: 'Pendiente'  },
  SENDING:   { color: '#60a5fa', bg: 'rgba(96,165,250,.12)',  label: 'Enviando'   },
  COMPLETED: { color: NEON,      bg: 'rgba(4,238,98,.1)',     label: 'Completado' },
  FAILED:    { color: '#ff6b6b', bg: 'rgba(255,80,80,.1)',    label: 'Fallido'    },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS[status] ?? STATUS.PENDING;
  return (
    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: s.color, background: s.bg, borderRadius: 6, padding: '3px 9px', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

import React from 'react';

const BroadcastsAdmin = () => {
  const [broadcasts, setBroadcasts]             = useState<EmailBroadcast[]>([]);
  const [filtered, setFiltered]                 = useState<EmailBroadcast[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [searchTerm, setSearchTerm]             = useState('');
  const [currentPage, setCurrentPage]           = useState(1);
  const [isCreateOpen, setIsCreateOpen]         = useState(false);
  const [isDetailOpen, setIsDetailOpen]         = useState(false);
  const [selected, setSelected]                 = useState<EmailBroadcast | null>(null);

  const itemsPerPage = 10;

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const q = searchTerm.toLowerCase();
    setFiltered(q
      ? broadcasts.filter(b =>
          b.title.toLowerCase().includes(q) ||
          b.sender_name.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          (b.specific_email?.toLowerCase().includes(q) ?? false))
      : broadcasts);
    setCurrentPage(1);
  }, [broadcasts, searchTerm]);

  const load = async () => {
    try {
      setLoading(true);
      setBroadcasts(await emailBroadcastService.getAllBroadcasts());
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los broadcasts' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (b: EmailBroadcast) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Reenviar broadcast?',
      text: `Se reenviará "${b.title}" a todos los destinatarios originales`,
      icon: 'question', showCancelButton: true,
      confirmButtonColor: '#04EE62', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, reenviar', cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    try {
      await emailBroadcastService.resendBroadcast(b.id, {});
      Swal.fire({ icon: 'success', title: 'Reenviado', timer: 1500, showConfirmButton: false });
      load();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo reenviar el broadcast' });
    }
  };

  const totalPages  = Math.ceil(filtered.length / itemsPerPage);
  const pageItems   = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            Email Broadcasts
          </h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            {broadcasts.length} en total · {broadcasts.filter(b => b.status === 'COMPLETED').length} completados
          </p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="adm-btn neon">
          + Nuevo broadcast
        </button>
      </div>

      {/* ── Filtros ── */}
      <div style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: MUTE, pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar broadcasts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ ...iS, width: '100%', paddingLeft: 34 }}
          />
        </div>
      </div>

      {/* ── Lista ── */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : pageItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          No se encontraron broadcasts
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pageItems.map(b => (
            <div key={b.id} style={{ background: PANEL, border: `1px solid ${LINE2}`, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>

              {/* Info */}
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                    {b.title}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
                <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {b.type === 'ALL_USERS'
                    ? `👥 Todos los usuarios${b.target_edition ? ` · 🗓 Edición ${b.target_edition}` : ''}`
                    : `✉️ ${b.specific_email}`}
                  {' · '}Por: {b.sender_name}
                  {' · '}{formatDate(b.createdAt)}
                </div>
              </div>

              {/* Métricas */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                  {b.sent_count}/{b.total_recipients}
                </div>
                {b.failed_count > 0 && (
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#ff6b6b' }}>
                    {b.failed_count} fallidos
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => { setSelected(b); setIsDetailOpen(true); }} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                  Ver detalle
                </button>
                {b.status === 'COMPLETED' && (
                  <button onClick={() => handleResend(b)} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                    Reenviar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Paginación ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} className="adm-btn"
              style={{ padding: '6px 12px', fontSize: 12, ...(currentPage === page ? { background: NEON, color: INK, borderColor: NEON, fontWeight: 700 } : {}) }}>
              {page}
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ── Modales ── */}
      <CreateBroadcastModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={() => { setIsCreateOpen(false); load(); }} />
      {selected && (
        <BroadcastDetailModal
          isOpen={isDetailOpen}
          onClose={() => { setIsDetailOpen(false); setSelected(null); }}
          broadcast={selected}
          onResend={() => handleResend(selected)}
          onUpdate={load}
        />
      )}
    </div>
  );
};

export default BroadcastsAdmin;
