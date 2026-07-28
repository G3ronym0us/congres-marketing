'use client';

import React, { useState, useEffect, useRef } from 'react';
import { adminEditionService } from '@/services/editions';
import { Edition, CloneEditionInput } from '@/types/edition';
import EditionForm, {
  EditionFormState,
  stripFormMeta,
} from './EditionForm';

/* ── design tokens ── */
const PANEL  = '#2A2228';
const PANEL2 = '#332A30';
const NEON   = '#04EE62';
const LINE2  = 'rgba(255,255,255,.14)';
const MUTE   = 'rgba(255,255,255,.45)';
const MUTE2  = 'rgba(255,255,255,.28)';

const EMPTY: EditionFormState = {
  slug: '', name: '', year: new Date().getFullYear(), country: '',
  city: '', venue: '', status: 'DRAFT', salesOpen: false, visible: false,
  certificatesEnabled: false, sortOrder: 0,
  discountStages: [],
};

export default function EditionsAdmin({
  onChanged,
  onOpen,
}: {
  onChanged?: () => void;
  // Abre el workspace de la edición (submenú de recursos por edición).
  onOpen?: (edition: Edition) => void;
}) {
  const [items, setItems] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setFormMeta] = useState<{ mode: 'create' | 'edit' | 'clone'; data: EditionFormState } | null>(null);
  const [toast, setToast] = useState('');
  const toastRef = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 3000);
  };

  const load = async () => {
    setLoading(true);
    try { setItems(await adminEditionService.getAll()); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const refresh = () => { load(); onChanged?.(); };

  const handleSave = async (data: EditionFormState) => {
    if (form?.mode === 'clone') {
      const payload: CloneEditionInput = {
        ...stripFormMeta(data),
        sourceEditionId: data.sourceEditionId!,
        cloneLocalidades: data.cloneLocalidades,
        cloneLecturers: data.cloneLecturers,
        cloneDiscountCodes: data.cloneDiscountCodes,
      };
      await adminEditionService.clone(payload);
      showToast('Edición clonada');
    } else if (data.uuid) {
      await adminEditionService.update(data.uuid, stripFormMeta(data));
      showToast('Edición actualizada');
    } else {
      await adminEditionService.create(stripFormMeta(data));
      showToast('Edición creada');
    }
    setFormMeta(null);
    refresh();
  };

  const handleFlag = async (e: Edition, key: 'salesOpen' | 'visible') => {
    await adminEditionService.setFlags(e.uuid, { [key]: !e[key] });
    refresh();
  };

  const handleDelete = async (e: Edition) => {
    if (!confirm(`¿Eliminar la edición "${e.name}"? Solo es posible si no tiene tickets/transacciones asociadas.`)) return;
    try {
      await adminEditionService.remove(e.uuid);
      showToast('Edición eliminada');
      refresh();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg ?? 'No se pudo eliminar la edición');
    }
  };

  if (form) {
    return (
      <EditionForm
        mode={form.mode}
        initial={form.data}
        onSave={handleSave}
        onBack={() => setFormMeta(null)}
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>Ediciones</h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            Cada sede/año es una edición con sus propias localidades, conferencistas y códigos.
          </p>
        </div>
        <button onClick={() => setFormMeta({ mode: 'create', data: { ...EMPTY } })} className="adm-btn neon">
          + Nueva edición
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(e => (
            <div key={e.id} style={{ background: PANEL, border: `1px solid ${LINE2}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>{e.name}</span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE2, background: 'rgba(255,255,255,.06)', borderRadius: 6, padding: '2px 8px' }}>{e.slug}</span>
                  {e.salesOpen && <span style={{ fontSize: 11, color: NEON, background: 'rgba(4,238,98,.1)', borderRadius: 6, padding: '2px 8px' }}>En venta</span>}
                  {e.visible && <span style={{ fontSize: 11, color: '#60a5fa', background: 'rgba(96,165,250,.1)', borderRadius: 6, padding: '2px 8px' }}>Visible</span>}
                </div>
                <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {[e.city, e.country].filter(Boolean).join(', ')} · {e.year} · {e.status}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                <button onClick={() => handleFlag(e, 'salesOpen')} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                  {e.salesOpen ? 'Cerrar ventas' : 'Abrir ventas'}
                </button>
                <button onClick={() => handleFlag(e, 'visible')} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                  {e.visible ? 'Ocultar' : 'Mostrar'}
                </button>
                <button
                  onClick={() => setFormMeta({ mode: 'clone', data: { ...EMPTY, sourceEditionId: e.id, year: e.year, country: e.country, cloneLocalidades: true, cloneLecturers: true, cloneDiscountCodes: false } })}
                  className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}
                >
                  Clonar
                </button>
                <button
                  onClick={() => onOpen?.(e)}
                  className="adm-btn neon" style={{ fontSize: 11, padding: '6px 12px' }}
                >
                  Gestionar
                </button>
                <button onClick={() => handleDelete(e)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 12px' }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
              No hay ediciones. Crea la primera.
            </div>
          )}
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: PANEL2, border: `1px solid rgba(4,238,98,.3)`, borderRadius: 12, padding: '12px 20px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,.5)' }}>
          ✅ {toast}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
