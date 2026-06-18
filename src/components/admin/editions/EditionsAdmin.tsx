'use client';

import React, { useState, useEffect, useRef } from 'react';
import { adminEditionService } from '@/services/editions';
import {
  Edition,
  CreateEditionInput,
  CloneEditionInput,
} from '@/types/edition';
import ModalShell, { confirmDiscard } from '@/components/admin/ModalShell';

/* ── design tokens ── */
const INK    = '#1A1418';
const PANEL  = '#2A2228';
const PANEL2 = '#332A30';
const NEON   = '#04EE62';
const LINE   = 'rgba(255,255,255,.08)';
const LINE2  = 'rgba(255,255,255,.14)';
const MUTE   = 'rgba(255,255,255,.45)';
const MUTE2  = 'rgba(255,255,255,.28)';

const EMPTY: CreateEditionInput = {
  slug: '', name: '', year: new Date().getFullYear(), country: '',
  city: '', venue: '', status: 'DRAFT', salesOpen: false, visible: false, sortOrder: 0,
};

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// ISO/iso del backend -> valor para <input type="datetime-local"> ("YYYY-MM-DDTHH:mm")
const toLocalInput = (s?: string | null): string => {
  if (!s) return '';
  if (s.includes('T')) return s.slice(0, 16);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T09:00`;
  return s.slice(0, 16);
};

// valor del input -> ISO v\u00e1lido para el backend (asegura segundos)
const toIso = (s?: string): string | undefined =>
  !s ? undefined : s.length === 16 ? `${s}:00` : s;

// timestamp/fecha del backend -> valor para <input type="date"> ("YYYY-MM-DD")
const toDateInput = (s?: string | null): string => (s ? String(s).slice(0, 10) : '');

const inputStyle: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: '10px 14px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

type FormState = CreateEditionInput & {
  id?: number;
  // Fecha y hora de inicio (alimenta countdown y todos los textos de fecha)
  iso?: string;
  // Fecha de finalización, solo fecha (opcional) -> eventEndDate
  endDate?: string;
  sourceEditionId?: number;
  cloneLocalidades?: boolean;
  cloneLecturers?: boolean;
  cloneDiscountCodes?: boolean;
};

function EditionModal({
  initial,
  mode,
  onSave,
  onClose,
}: {
  initial: FormState;
  mode: 'create' | 'edit' | 'clone';
  onSave: (data: FormState) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof FormState, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      await onSave(form);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setErr(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);
  const handleClose = async () => {
    if (isDirty && !(await confirmDiscard())) return;
    onClose();
  };

  const field = (label: string, children: React.ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
        {label}
      </label>
      {children}
    </div>
  );

  const title = mode === 'create' ? 'Nueva edición' : mode === 'clone' ? 'Clonar edición' : 'Editar edición';

  return (
    <ModalShell onClose={handleClose} maxWidth={560}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>{title}</h3>
        <button onClick={handleClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {field('Nombre *',
          <input style={inputStyle} required value={form.name}
            onChange={e => {
              const name = e.target.value;
              setForm(f => ({ ...f, name, slug: f.slug || slugify(name) }));
            }}
            placeholder="CNMP Colombia 2026" />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {field('Slug *',
            <input style={inputStyle} required value={form.slug}
              onChange={e => set('slug', slugify(e.target.value))} placeholder="colombia-2026" />
          )}
          {field('Año *',
            <input style={inputStyle} type="number" required value={form.year}
              onChange={e => set('year', Number(e.target.value))} />
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {field('País *',
            <input style={inputStyle} required value={form.country}
              onChange={e => set('country', e.target.value)} placeholder="Colombia" />
          )}
          {field('Ciudad',
            <input style={inputStyle} value={form.city ?? ''}
              onChange={e => set('city', e.target.value)} placeholder="Cartagena" />
          )}
        </div>

        {field('Sede',
          <input style={inputStyle} value={form.venue ?? ''}
            onChange={e => set('venue', e.target.value)} placeholder="Sede por confirmar" />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {field('Fecha y hora de inicio *',
            <input style={{ ...inputStyle, colorScheme: 'dark' }} type="datetime-local" required value={form.iso ?? ''}
              onChange={e => set('iso', e.target.value)} />
          )}
          {field('Fecha de finalización (opcional)',
            <input style={{ ...inputStyle, colorScheme: 'dark' }} type="date" value={form.endDate ?? ''}
              min={toDateInput(form.iso)}
              onChange={e => set('endDate', e.target.value)} />
          )}
        </div>
        <p style={{ margin: '-8px 0 0', fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
          La fecha de inicio alimenta el countdown y todos los textos de fecha de la web
          (hero, La Gira, pestañas). El texto se genera solo: 1 día → “28 de Agosto, 2026”,
          2 días → “28 y 29 de Agosto, 2026”, +2 → “del 28 al 31 de Agosto, 2026”.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {field('Estado',
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status ?? 'DRAFT'}
              onChange={e => set('status', e.target.value)}>
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicada</option>
              <option value="ARCHIVED">Archivada</option>
            </select>
          )}
          {field('Orden',
            <input style={inputStyle} type="number" min={0} value={form.sortOrder ?? 0}
              onChange={e => set('sortOrder', Number(e.target.value))} />
          )}
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {([['salesOpen', 'Abierta a ventas'], ['visible', 'Visible en la web']] as [keyof FormState, string][]).map(([k, lbl]) => (
            <label key={k as string} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
              <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)} style={{ accentColor: NEON, width: 16, height: 16 }} />
              {lbl}
            </label>
          ))}
        </div>

        {mode === 'clone' && (
          <div style={{ background: PANEL2, border: `1px solid ${LINE2}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 12, fontWeight: 700, color: MUTE, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Copiar desde la edición origen
            </span>
            {([['cloneLocalidades', 'Localidades'], ['cloneLecturers', 'Conferencistas'], ['cloneDiscountCodes', 'Códigos de descuento']] as [keyof FormState, string][]).map(([k, lbl]) => (
              <label key={k as string} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
                <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)} style={{ accentColor: NEON, width: 16, height: 16 }} />
                {lbl}
              </label>
            ))}
          </div>
        )}

        {err && <p style={{ color: '#ff6b6b', fontSize: 12, margin: 0 }}>{err}</p>}

        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <button type="button" onClick={handleClose}
            style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: saving ? .7 : 1 }}>
            {saving ? 'Guardando…' : mode === 'clone' ? 'Clonar edición' : 'Guardar'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export default function EditionsAdmin({
  onChanged,
}: {
  onChanged?: () => void;
}) {
  const [items, setItems] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | 'clone'; data: FormState } | null>(null);
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

  const handleSave = async (data: FormState) => {
    if (modal?.mode === 'clone') {
      const payload: CloneEditionInput = {
        ...stripFormMeta(data),
        sourceEditionId: data.sourceEditionId!,
        cloneLocalidades: data.cloneLocalidades,
        cloneLecturers: data.cloneLecturers,
        cloneDiscountCodes: data.cloneDiscountCodes,
      };
      await adminEditionService.clone(payload);
      showToast('Edición clonada');
    } else if (data.id) {
      await adminEditionService.update(data.id, stripFormMeta(data));
      showToast('Edición actualizada');
    } else {
      await adminEditionService.create(stripFormMeta(data));
      showToast('Edición creada');
    }
    setModal(null);
    refresh();
  };

  const handleFlag = async (e: Edition, key: 'salesOpen' | 'visible') => {
    await adminEditionService.setFlags(e.id, { [key]: !e[key] });
    refresh();
  };

  const handleDelete = async (e: Edition) => {
    if (!confirm(`¿Eliminar la edición "${e.name}"? Solo es posible si no tiene tickets/transacciones asociadas.`)) return;
    try {
      await adminEditionService.remove(e.id);
      showToast('Edición eliminada');
      refresh();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg ?? 'No se pudo eliminar la edición');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>Ediciones</h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            Cada sede/año es una edición con sus propias localidades, conferencistas y códigos.
          </p>
        </div>
        <button onClick={() => setModal({ mode: 'create', data: { ...EMPTY } })} className="adm-btn neon">
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
                  onClick={() => setModal({ mode: 'clone', data: { ...EMPTY, sourceEditionId: e.id, year: e.year, country: e.country, cloneLocalidades: true, cloneLecturers: true, cloneDiscountCodes: false } })}
                  className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}
                >
                  Clonar
                </button>
                <button
                  onClick={() => setModal({ mode: 'edit', data: {
                    id: e.id, slug: e.slug, name: e.name, year: e.year, country: e.country,
                    city: e.city ?? '', venue: e.venue ?? '',
                    // Fecha/hora de inicio: display.iso (sin drift de zona) o eventStartDate
                    iso: toLocalInput(e.display?.iso ?? e.eventStartDate),
                    endDate: toDateInput(e.eventEndDate),
                    display: e.display ?? undefined,
                    status: e.status, salesOpen: e.salesOpen, visible: e.visible, sortOrder: e.sortOrder,
                  } })}
                  className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}
                >
                  Editar
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

      {modal && (
        <EditionModal
          mode={modal.mode}
          initial={modal.data}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
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

// Quita los campos auxiliares del formulario antes de mandar al backend.
// La fecha/hora del countdown se guarda en display.iso (sin drift de zona) y se
// espeja a eventStartDate para reportes.
function stripFormMeta(data: FormState): CreateEditionInput {
  const {
    id, iso, endDate, sourceEditionId, cloneLocalidades, cloneLecturers, cloneDiscountCodes,
    display, eventStartDate, eventEndDate, ...rest
  } = data as FormState;
  const isoIso = toIso(iso);
  return {
    ...rest,
    display: { ...(display ?? {}), ...(isoIso ? { iso: isoIso } : {}) },
    eventStartDate: isoIso,
    // Solo fecha; null para limpiarla si se quita en edición.
    eventEndDate: endDate ? endDate : null,
  };
}
