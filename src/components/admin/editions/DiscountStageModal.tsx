'use client';

import React, { useState } from 'react';
import ModalShell, { confirmDiscard } from '@/components/admin/ModalShell';
import { DiscountStage } from '@/types/edition';

/* ── design tokens ── */
const INK   = '#1A1418';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

const iS: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: '10px 14px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
      {label}
    </label>
    {children}
  </div>
);

const EMPTY: DiscountStage = { startDate: '', endDate: '', percentage: 0, label: '' };

// timestamp/fecha del backend -> valor para <input type="date"> ("YYYY-MM-DD")
const toDateInput = (s?: string): string => (s ? String(s).slice(0, 10) : '');

interface Props {
  // Etapa a editar; si es null se crea una nueva.
  stage: DiscountStage | null;
  onSave: (stage: DiscountStage) => Promise<void> | void;
  onClose: () => void;
}

export default function DiscountStageModal({ stage, onSave, onClose }: Props) {
  const initial = stage ?? EMPTY;
  const [form, setForm] = useState<DiscountStage>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof DiscountStage, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('La fecha de fin no puede ser anterior a la de inicio.');
      return;
    }
    setSaving(true); setError('');
    try {
      await onSave(form);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al guardar la etapa');
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);
  const handleClose = async () => {
    if (isDirty && !(await confirmDiscard())) return;
    onClose();
  };

  return (
    <ModalShell onClose={handleClose} maxWidth={460}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
          {stage ? 'Editar etapa' : 'Nueva etapa de descuento'}
        </h3>
        <button onClick={handleClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,80,80,.1)', border: '1px solid rgba(255,80,80,.25)', borderRadius: 8, padding: '10px 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#ff9999', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Etiqueta *">
          <input style={iS} required value={form.label}
            placeholder="ej. Último descuento"
            onChange={e => set('label', e.target.value)} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Desde *">
            <input style={{ ...iS, colorScheme: 'dark' }} type="date" required value={toDateInput(form.startDate)}
              onChange={e => set('startDate', e.target.value)} />
          </Field>
          <Field label="Hasta *">
            <input style={{ ...iS, colorScheme: 'dark' }} type="date" required value={toDateInput(form.endDate)}
              min={toDateInput(form.startDate)}
              onChange={e => set('endDate', e.target.value)} />
          </Field>
        </div>

        <Field label="Descuento (%) *">
          <input style={iS} type="number" required min={0} max={100} value={form.percentage}
            onChange={e => set('percentage', Number(e.target.value))} />
        </Field>

        <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: `1px solid ${LINE}` }}>
          <button type="button" onClick={handleClose} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
            Cancelar
          </button>
          <button type="submit" disabled={saving} style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: saving ? .6 : 1 }}>
            {saving ? 'Guardando…' : stage ? 'Guardar cambios' : 'Crear etapa'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
