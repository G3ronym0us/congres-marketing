'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { adminEditionService } from '@/services/editions';
import { Edition, DiscountStage } from '@/types/edition';
import EditionSelect from '@/components/admin/EditionSelect';
import DiscountStageModal from './DiscountStageModal';

/* ── design tokens ── */
const PANEL = '#2A2228';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

const formatRange = (s: DiscountStage): string => {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
  return `${fmt(s.startDate)} → ${fmt(s.endDate)}`;
};

// ¿La etapa está vigente hoy?
const isActiveNow = (s: DiscountStage): boolean => {
  const now = new Date();
  const start = new Date(s.startDate);
  const end = new Date(s.endDate);
  return !isNaN(start.getTime()) && !isNaN(end.getTime()) && now >= start && now <= end;
};

export default function DiscountStagesAdmin({
  editionId,
  editions = [],
  onEditionChange,
  onChanged,
}: {
  editionId?: number;
  editions?: Edition[];
  onEditionChange?: (id: number) => void;
  onChanged?: () => void;
}) {
  const [stages, setStages] = useState<DiscountStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // null = sin modal; { stage } = editar/crear (stage null = nueva)
  const [modal, setModal] = useState<{ stage: DiscountStage | null; index: number | null } | null>(null);

  const load = async () => {
    if (!editionId) { setStages([]); setLoading(false); return; }
    try {
      setLoading(true);
      const edition = await adminEditionService.getById(editionId);
      setStages(edition.discountStages ?? []);
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar las etapas de descuento' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [editionId]);

  // Persiste el array completo y refresca el estado local.
  const persist = async (next: DiscountStage[]) => {
    if (!editionId) return;
    setSaving(true);
    try {
      const updated = await adminEditionService.update(editionId, { discountStages: next });
      setStages(updated.discountStages ?? next);
      onChanged?.();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      Swal.fire({ icon: 'error', title: 'Error', text: msg ?? 'No se pudo guardar la etapa' });
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (stage: DiscountStage) => {
    const next = modal?.index != null
      ? stages.map((s, i) => (i === modal.index ? stage : s))
      : [...stages, stage];
    await persist(next);
    setModal(null);
  };

  const handleDelete = async (index: number) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar etapa?', text: 'Esta acción no se puede revertir',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    await persist(stages.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            Etapas de Descuento
          </h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            Descuentos por rango de fechas que el carrito aplica automáticamente.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <EditionSelect editions={editions} editionId={editionId} onChange={onEditionChange} />
          <button onClick={() => setModal({ stage: null, index: null })} className="adm-btn neon" disabled={!editionId || saving}>
            + Nueva etapa
          </button>
        </div>
      </div>

      {!editionId ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          Selecciona una edición para gestionar sus etapas de descuento.
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : stages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          <p style={{ margin: '0 0 16px' }}>Esta edición no tiene etapas de descuento.</p>
          <button onClick={() => setModal({ stage: null, index: null })} className="adm-btn neon">
            + Crear la primera etapa
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stages.map((stage, index) => {
            const active = isActiveNow(stage);
            return (
              <div key={index} style={{ background: PANEL, border: `1px solid ${active ? 'rgba(4,238,98,.35)' : LINE2}`, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                      {stage.label || 'Sin etiqueta'}
                    </span>
                    {active && (
                      <span style={{ fontSize: 11, color: NEON, background: 'rgba(4,238,98,.1)', borderRadius: 6, padding: '2px 8px' }}>
                        Vigente
                      </span>
                    )}
                  </div>
                  <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {formatRange(stage)}
                  </div>
                </div>

                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>
                    {stage.percentage}%
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: MUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    descuento
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                  <button onClick={() => setModal({ stage, index })} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }} disabled={saving}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(index)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 12px' }} disabled={saving}>
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {modal && (
        <DiscountStageModal
          stage={modal.stage}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
