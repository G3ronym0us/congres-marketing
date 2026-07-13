'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { adminAsociadoService } from '@/services/asociado';
import { Asociado, AsociadoStats } from '@/types/asociado';
import { Edition } from '@/types/edition';
import EditionSelect from '@/components/admin/EditionSelect';
import CreateAsociadoModal from './CreateAsociadoModal';
import EditAsociadoModal from './EditAsociadoModal';
import AsociadoLeadsModal from './AsociadoLeadsModal';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const currencyFmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

const StatusBadge = ({ asociado }: { asociado: Asociado }) => {
  if (!asociado.isActive)
    return <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE, background: 'rgba(255,255,255,.08)', borderRadius: 6, padding: '3px 9px' }}>Inactivo</span>;
  return <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: NEON, background: 'rgba(4,238,98,.1)', borderRadius: 6, padding: '3px 9px' }}>Activo</span>;
};

export default function AsociadosAdmin({
  editionId,
  editions = [],
  onEditionChange,
}: {
  editionId?: number;
  editions?: Edition[];
  onEditionChange?: (id: number) => void;
}) {
  const [asociados, setAsociados]       = useState<Asociado[]>([]);
  const [statsByUuid, setStatsByUuid]   = useState<Record<string, AsociadoStats>>({});
  const [loading, setLoading]           = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing]           = useState<Asociado | null>(null);
  const [leadsFor, setLeadsFor]         = useState<Asociado | null>(null);

  const load = async () => {
    if (!editionId) { setAsociados([]); setStatsByUuid({}); setLoading(false); return; }
    try {
      setLoading(true);
      const [asociadosData, statsData] = await Promise.all([
        adminAsociadoService.getAll(editionId),
        adminAsociadoService.getStats(editionId),
      ]);
      setAsociados(asociadosData);
      setStatsByUuid(
        statsData.reduce((acc, s) => {
          acc[s.asociado.uuid] = s;
          return acc;
        }, {} as Record<string, AsociadoStats>),
      );
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar los asociados' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [editionId]);

  const handleCopyLink = async (asociado: Asociado) => {
    const url = `${window.location.origin}/${asociado.code}`;
    await navigator.clipboard.writeText(url);
    Swal.fire({ icon: 'success', title: 'Link copiado', text: url, timer: 1500, showConfirmButton: false });
  };

  const handleDelete = async (uuid: string) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar asociado?', text: 'Esta acción no se puede revertir y borrará también sus leads',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    try {
      await adminAsociadoService.remove(uuid);
      load();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      Swal.fire({ icon: 'error', title: 'Error', text: Array.isArray(msg) ? msg.join(', ') : (msg || 'No se pudo eliminar el asociado') });
    }
  };

  const handleToggle = async (asociado: Asociado) => {
    try {
      await adminAsociadoService.update(asociado.uuid, { isActive: !asociado.isActive });
      setAsociados(prev => prev.map(a => a.id === asociado.id ? { ...a, isActive: !a.isActive } : a));
    } catch (err: any) {
      const msg = err.response?.data?.message;
      Swal.fire({ icon: 'error', title: 'Error', text: Array.isArray(msg) ? msg.join(', ') : (msg || 'No se pudo actualizar el asociado') });
    }
  };

  const activeCount = asociados.filter(a => a.isActive).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            Asociados
          </h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            {asociados.length} en total · {activeCount} activos
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <EditionSelect editions={editions} editionId={editionId} onChange={onEditionChange} />
          <button onClick={() => setIsCreateOpen(true)} className="adm-btn neon" disabled={!editionId}>
            + Crear asociado
          </button>
        </div>
      </div>

      {!editionId && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          Selecciona una edición para gestionar sus asociados.
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : asociados.length === 0 ? (
        editionId && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
            No hay asociados · Crea el primero
          </div>
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {asociados.map(asociado => {
            const stats = statsByUuid[asociado.uuid];
            const details = [asociado.company, asociado.email, asociado.website].filter(Boolean).join(' · ');
            return (
              <div key={asociado.id} style={{ background: PANEL, border: `1px solid ${asociado.isActive ? LINE2 : LINE}`, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', opacity: asociado.isActive ? 1 : .6 }}>

                {/* Código + badge + info */}
                <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 16, color: NEON, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                      {asociado.code}
                    </span>
                    <StatusBadge asociado={asociado} />
                  </div>
                  <div style={{ color: '#fff', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 2 }}>
                    {asociado.name}
                  </div>
                  {details && (
                    <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 2 }}>
                      {details}
                    </div>
                  )}
                  <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                    Creado: {formatDate(asociado.createdAt)}
                  </div>
                </div>

                {/* Descuento */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>
                    {asociado.discountPercentage !== null ? `${parseFloat(asociado.discountPercentage)}%` : '—'}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: MUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    {asociado.discountPercentage !== null ? 'descuento' : 'sin descuento'}
                  </div>
                </div>

                {/* Métricas */}
                <div style={{ display: 'flex', gap: 16, flexShrink: 0, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                      {stats?.leadsCount ?? 0}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: MUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      Leads
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                      {stats?.convertedLeadsCount ?? 0}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: MUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      Convertidos
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                      {stats?.approvedTransactionsCount ?? 0}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: MUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      Ventas
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                      {stats?.ticketsSold ?? 0}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: MUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      Boletos
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                      {currencyFmt.format((stats?.totalAmountInCents ?? 0) / 100)}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: MUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      Monto
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                  <button onClick={() => handleCopyLink(asociado)} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                    Copiar link
                  </button>
                  <button onClick={() => setLeadsFor(asociado)} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                    Leads
                  </button>
                  <button onClick={() => handleToggle(asociado)} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                    {asociado.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                  <button onClick={() => setEditing(asociado)} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(asociado.uuid)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 12px' }}>
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Modales */}
      {isCreateOpen && editionId && (
        <CreateAsociadoModal
          editionId={editionId}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => { setIsCreateOpen(false); load(); }}
        />
      )}
      {editing && (
        <EditAsociadoModal
          asociado={editing}
          onClose={() => setEditing(null)}
          onSuccess={() => { setEditing(null); load(); }}
        />
      )}
      {leadsFor && (
        <AsociadoLeadsModal
          asociado={leadsFor}
          onClose={() => setLeadsFor(null)}
        />
      )}
    </div>
  );
}
