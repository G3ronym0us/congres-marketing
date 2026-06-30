'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { adminDiscountCodeService, discountUtils } from '@/services/discountCode';
import { DiscountCode } from '@/types/discountCode';
import { Edition } from '@/types/edition';
import EditionSelect from '@/components/admin/EditionSelect';
import CreateDiscountCodeModal from './CreateDiscountCodeModal';
import EditDiscountCodeModal from './EditDiscountCodeModal';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const StatusBadge = ({ code }: { code: DiscountCode }) => {
  if (!code.isActive)
    return <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE, background: 'rgba(255,255,255,.08)', borderRadius: 6, padding: '3px 9px' }}>Inactivo</span>;
  if (discountUtils.isCodeExpired(code.expiresAt))
    return <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#ff6b6b', background: 'rgba(255,80,80,.1)', borderRadius: 6, padding: '3px 9px' }}>Expirado</span>;
  if (code.currentUses >= code.maxUses)
    return <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#f97316', background: 'rgba(249,115,22,.12)', borderRadius: 6, padding: '3px 9px' }}>Agotado</span>;
  return <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: NEON, background: 'rgba(4,238,98,.1)', borderRadius: 6, padding: '3px 9px' }}>Activo</span>;
};

export default function DiscountCodesAdmin({
  editionId,
  editions = [],
  onEditionChange,
}: {
  editionId?: number;
  editions?: Edition[];
  onEditionChange?: (id: number) => void;
}) {
  const [codes, setCodes]             = useState<DiscountCode[]>([]);
  const [loading, setLoading]         = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);

  const load = async () => {
    if (!editionId) { setCodes([]); setLoading(false); return; }
    try {
      setLoading(true);
      setCodes(await adminDiscountCodeService.getAllCodes(editionId));
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar los códigos de descuento' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [editionId]);

  const handleDelete = async (uuid: string) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar código?', text: 'Esta acción no se puede revertir',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    try {
      await adminDiscountCodeService.deleteCode(uuid);
      load();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el código' });
    }
  };

  const handleToggle = async (code: DiscountCode) => {
    try {
      await adminDiscountCodeService.updateCode(code.uuid, { isActive: !code.isActive });
      setCodes(prev => prev.map(c => c.id === code.id ? { ...c, isActive: !c.isActive } : c));
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el código' });
    }
  };

  const activeCount = codes.filter(c => c.isActive && !discountUtils.isCodeExpired(c.expiresAt) && c.currentUses < c.maxUses).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            Códigos de Descuento
          </h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            {codes.length} en total · {activeCount} activos
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <EditionSelect editions={editions} editionId={editionId} onChange={onEditionChange} />
          <button onClick={() => setIsCreateOpen(true)} className="adm-btn neon" disabled={!editionId}>
            + Crear código
          </button>
        </div>
      </div>

      {!editionId && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          Selecciona una edición para gestionar sus códigos de descuento.
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : codes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          No hay códigos de descuento · Crea el primero
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {codes.map(code => (
            <div key={code.id} style={{ background: PANEL, border: `1px solid ${code.isActive ? LINE2 : LINE}`, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', opacity: code.isActive ? 1 : .6 }}>

              {/* Código + badge */}
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 16, color: NEON, letterSpacing: '.05em' }}>
                    {code.code}
                  </span>
                  <StatusBadge code={code} />
                </div>
                <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                  Expira: {formatDate(code.expiresAt)}
                  {' · '}Creado: {formatDate(code.createdAt)}
                </div>
              </div>

              {/* Métricas */}
              <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>
                    {parseFloat(code.discountPercentage)}%
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: MUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    descuento
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>
                    {code.currentUses}/{code.maxUses}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: MUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    usos
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                <button onClick={() => handleToggle(code)} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                  {code.isActive ? 'Desactivar' : 'Activar'}
                </button>
                <button onClick={() => setEditingCode(code)} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                  Editar
                </button>
                <button onClick={() => handleDelete(code.uuid)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 12px' }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Modales */}
      {isCreateOpen && editionId && (
        <CreateDiscountCodeModal
          editionId={editionId}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => { setIsCreateOpen(false); load(); }}
        />
      )}
      {editingCode && (
        <EditDiscountCodeModal
          discountCode={editingCode}
          onClose={() => setEditingCode(null)}
          onSuccess={() => { setEditingCode(null); load(); }}
        />
      )}
    </div>
  );
}
