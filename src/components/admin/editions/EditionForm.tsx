'use client';

import React, { useRef, useState } from 'react';
import { CreateEditionInput, EditionDisplay } from '@/types/edition';
import { confirmDiscard } from '@/components/admin/ModalShell';
import { adminEditionService } from '@/services/editions';

const FLAG_MAX_BYTES = 1024 * 1024; // igual que el límite del backend
const FLAG_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

/* ── design tokens ── */
const INK    = '#1A1418';
const PANEL2 = '#332A30';
const NEON   = '#04EE62';
const LINE   = 'rgba(255,255,255,.08)';
const LINE2  = 'rgba(255,255,255,.14)';
const MUTE   = 'rgba(255,255,255,.45)';

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// ISO/iso del backend -> valor para <input type="datetime-local"> ("YYYY-MM-DDTHH:mm")
export const toLocalInput = (s?: string | null): string => {
  if (!s) return '';
  if (s.includes('T')) return s.slice(0, 16);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T09:00`;
  return s.slice(0, 16);
};

// valor del input -> ISO válido para el backend (asegura segundos)
const toIso = (s?: string): string | undefined =>
  !s ? undefined : s.length === 16 ? `${s}:00` : s;

// timestamp/fecha del backend -> valor para <input type="date"> ("YYYY-MM-DD")
export const toDateInput = (s?: string | null): string => (s ? String(s).slice(0, 10) : '');

const inputStyle: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: '10px 14px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

export type EditionFormState = CreateEditionInput & {
  id?: number;
  uuid?: string;
  // Fecha y hora de inicio (alimenta countdown y todos los textos de fecha)
  iso?: string;
  // Fecha de finalización, solo fecha (opcional) -> eventEndDate
  endDate?: string;
  sourceEditionId?: number;
  cloneLocalidades?: boolean;
  cloneLecturers?: boolean;
  cloneDiscountCodes?: boolean;
};

// Quita los campos auxiliares del formulario antes de mandar al backend.
// La fecha/hora del countdown se guarda en display.iso (sin drift de zona) y se
// espeja a eventStartDate para reportes.
export function stripFormMeta(data: EditionFormState): CreateEditionInput {
  const {
    id, uuid, iso, endDate, sourceEditionId, cloneLocalidades, cloneLecturers, cloneDiscountCodes,
    // discountStages se gestionan en su propia pestaña, no desde el form de edición.
    discountStages,
    display, eventStartDate, eventEndDate, ...rest
  } = data;
  const isoIso = toIso(iso);
  // Los textos legacy display.dateShort/dateLong quedaron congelados con la fecha
  // vieja y ya no los lee nadie: se descartan al guardar para purgarlos de la BD.
  const { dateShort: _ds, dateLong: _dl, ...displayRest } = display ?? {};
  return {
    ...rest,
    display: { ...displayRest, ...(isoIso ? { iso: isoIso } : {}) },
    eventStartDate: isoIso,
    // Solo fecha; null para limpiarla si se quita en edición.
    eventEndDate: endDate ? endDate : null,
  };
}

export default function EditionForm({
  initial,
  mode,
  onSave,
  onBack,
  // Dentro del workspace de edición el encabezado lo provee el contenedor,
  // así que ocultamos el header propio (botón volver + título) del form.
  embedded = false,
}: {
  initial: EditionFormState;
  mode: 'create' | 'edit' | 'clone';
  onSave: (data: EditionFormState) => Promise<void>;
  onBack: () => void;
  embedded?: boolean;
}) {
  const [form, setForm] = useState<EditionFormState>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof EditionFormState, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const setDisplay = (k: keyof EditionDisplay, v: string | undefined) =>
    setForm(f => ({ ...f, display: { ...(f.display ?? {}), [k]: v } }));

  const flagInput = useRef<HTMLInputElement>(null);
  const [uploadingFlag, setUploadingFlag] = useState(false);
  const [flagErr, setFlagErr] = useState('');

  const handleFlagImage = async (file?: File) => {
    if (!file) return;
    setFlagErr('');
    if (!FLAG_TYPES.includes(file.type)) { setFlagErr('Usa una imagen PNG, JPG o WebP.'); return; }
    if (file.size > FLAG_MAX_BYTES) { setFlagErr('La imagen pesa más de 1 MB.'); return; }
    setUploadingFlag(true);
    try {
      const { url } = await adminEditionService.uploadFlagImage(file);
      setDisplay('flagImage', url);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setFlagErr(Array.isArray(msg) ? msg.join(', ') : msg ?? 'No se pudo subir la imagen');
    } finally {
      setUploadingFlag(false);
      if (flagInput.current) flagInput.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingFlag) return;
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
  const handleBack = async () => {
    if (isDirty && !(await confirmDiscard())) return;
    onBack();
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
    <div>
      {!embedded && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <button onClick={handleBack} type="button"
          style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: MUTE, fontFamily: 'Oxanium, sans-serif', fontSize: 13, fontWeight: 600 }}>
          ← Volver
        </button>
        <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>{title}</h2>
      </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
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

        {/* Código de la edición: la caja verde 3:2 de La Gira y del countdown. */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {field('Código *',
              <input style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '.08em' }} required
                maxLength={4} pattern="[A-Za-z0-9]{2,4}"
                title="De 2 a 4 letras o números, por ejemplo SMR o CLO"
                value={form.display?.flag ?? ''}
                onChange={e => setDisplay('flag', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="SMR" />
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <input ref={flagInput} type="file" accept={FLAG_TYPES.join(',')} hidden
                onChange={e => handleFlagImage(e.target.files?.[0])} />
              <button type="button" disabled={uploadingFlag} onClick={() => flagInput.current?.click()}
                style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: '#fff', cursor: uploadingFlag ? 'wait' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 12 }}>
                {uploadingFlag ? 'Subiendo…' : form.display?.flagImage ? 'Cambiar imagen' : 'Subir imagen (opcional)'}
              </button>
              {form.display?.flagImage && !uploadingFlag && (
                <button type="button" onClick={() => setDisplay('flagImage', undefined)}
                  style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${LINE}`, background: 'none', color: MUTE, cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 12 }}>
                  Quitar imagen
                </button>
              )}
            </div>
            <p style={{ margin: 0, fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
              El código se muestra en la caja verde de La Gira y del countdown, y junto al número
              en las pestañas de ciudad. Si subes una imagen (proporción 3:2, por ejemplo 300×200 px,
              máx. 1 MB), la imagen ocupa la caja en lugar del código.
            </p>
            {flagErr && <p style={{ color: '#ff6b6b', fontSize: 12, margin: 0 }}>{flagErr}</p>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 22 }}>
            <div aria-label="Vista previa del código"
              style={{ width: 78, height: 52, borderRadius: 12, border: '1px solid rgba(4,238,98,.35)', background: 'rgba(4,238,98,.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '.06em', color: NEON }}>
              {form.display?.flagImage
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={form.display.flagImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (form.display?.flag || '—')}
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE }}>Vista previa</span>
          </div>
        </div>

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

        {field('Estado',
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status ?? 'DRAFT'}
            onChange={e => set('status', e.target.value)}>
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicada</option>
            <option value="ARCHIVED">Archivada</option>
          </select>
        )}

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {([['salesOpen', 'Abierta a ventas'], ['visible', 'Visible en la web'], ['certificatesEnabled', 'Certificados disponibles']] as [keyof EditionFormState, string][]).map(([k, lbl]) => (
            <label key={k as string} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
              <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)} style={{ accentColor: NEON, width: 16, height: 16 }} />
              {lbl}
            </label>
          ))}
        </div>

        {mode === 'edit' && (
          <p style={{ margin: 0, fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
            Las etapas de descuento por fecha se gestionan en la pestaña “Etapas de Descuento”.
          </p>
        )}

        {mode === 'clone' && (
          <div style={{ background: PANEL2, border: `1px solid ${LINE2}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 12, fontWeight: 700, color: MUTE, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Copiar desde la edición origen
            </span>
            {([['cloneLocalidades', 'Localidades'], ['cloneLecturers', 'Conferencistas'], ['cloneDiscountCodes', 'Códigos de descuento']] as [keyof EditionFormState, string][]).map(([k, lbl]) => (
              <label key={k as string} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
                <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)} style={{ accentColor: NEON, width: 16, height: 16 }} />
                {lbl}
              </label>
            ))}
          </div>
        )}

        {err && <p style={{ color: '#ff6b6b', fontSize: 12, margin: 0 }}>{err}</p>}

        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <button type="button" onClick={handleBack}
            style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: saving ? .7 : 1 }}>
            {saving ? 'Guardando…' : mode === 'clone' ? 'Clonar edición' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
