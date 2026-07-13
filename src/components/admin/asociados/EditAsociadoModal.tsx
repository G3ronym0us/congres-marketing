'use client';

import ModalShell, { confirmDiscard } from '@/components/admin/ModalShell';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { adminAsociadoService } from '@/services/asociado';
import { Asociado, UpdateAsociadoInput } from '@/types/asociado';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL2= '#332A30';
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

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
      {label}
    </label>
    {children}
    {hint && <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'rgba(255,255,255,.28)' }}>{hint}</span>}
  </div>
);

const formatDate = (d: string) =>
  new Date(d).toLocaleString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

interface FormState {
  name: string;
  code: string;
  company: string;
  email: string;
  website: string;
  discountPercentage: string;
  isActive: boolean;
}

interface Props {
  asociado: Asociado;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditAsociadoModal({ asociado, onClose, onSuccess }: Props) {
  const initialForm: FormState = {
    name: asociado.name,
    code: asociado.code,
    company: asociado.company ?? '',
    email: asociado.email ?? '',
    website: asociado.website ?? '',
    discountPercentage: asociado.discountPercentage !== null ? String(parseFloat(asociado.discountPercentage)) : '',
    isActive: asociado.isActive,
  };

  const [formData, setFormData] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const input: UpdateAsociadoInput = {
        name: formData.name,
        code: formData.code,
        isActive: formData.isActive,
        ...(formData.company && { company: formData.company }),
        ...(formData.email && { email: formData.email }),
        ...(formData.website && { website: formData.website }),
        ...(formData.discountPercentage !== ''
          ? { discountPercentage: parseFloat(formData.discountPercentage) }
          : asociado.discountPercentage !== null
            ? { discountPercentage: null }
            : {}),
      };
      await adminAsociadoService.update(asociado.uuid, input);
      Swal.fire({ icon: 'success', title: 'Asociado actualizado', timer: 1500, showConfirmButton: false });
      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Error al actualizar el asociado'));
    } finally {
      setLoading(false);
    }
  };

  const isDirty =
    formData.name !== initialForm.name ||
    formData.code !== initialForm.code ||
    formData.company !== initialForm.company ||
    formData.email !== initialForm.email ||
    formData.website !== initialForm.website ||
    formData.discountPercentage !== initialForm.discountPercentage ||
    formData.isActive !== initialForm.isActive;

  const handleClose = async () => {
    if (isDirty && !(await confirmDiscard())) return;
    onClose();
  };

  return (
    <ModalShell onClose={handleClose} maxWidth={460}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            Editar Asociado
          </h3>
          <button onClick={handleClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
        </div>

        {/* Info de solo lectura */}
        <div style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 10, padding: '12px 14px', marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 16, color: NEON, letterSpacing: '.05em', textTransform: 'uppercase' }}>
            {asociado.code}
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
            Creado: <span style={{ color: '#fff' }}>{formatDate(asociado.createdAt)}</span>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,80,80,.1)', border: '1px solid rgba(255,80,80,.25)', borderRadius: 8, padding: '10px 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#ff9999', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <Field label="Nombre *">
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              required maxLength={150} placeholder="ej: Clínica Dental X" style={iS} />
          </Field>

          <Field label="Código *" hint="Se usará como URL: tudominio.com/CODIGO">
            <input type="text" name="code" value={formData.code} onChange={handleChange}
              required minLength={3} maxLength={50} placeholder="ej: PARTNERX"
              style={{ ...iS, textTransform: 'uppercase', letterSpacing: '.05em' }} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Empresa">
              <input type="text" name="company" value={formData.company} onChange={handleChange}
                placeholder="ej: Clínica X S.A.S" style={iS} />
            </Field>
            <Field label="Email">
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="contacto@empresa.com" style={iS} />
            </Field>
          </div>

          <Field label="Website">
            <input type="url" name="website" value={formData.website} onChange={handleChange}
              placeholder="https://…" style={iS} />
          </Field>

          <Field label="Descuento (%)" hint="Déjalo vacío si el código es solo para atribuir ventas, sin descuento">
            <input type="number" name="discountPercentage" value={formData.discountPercentage}
              onChange={handleChange} min="1" max="100" step="0.01" placeholder="15.50" style={iS} />
          </Field>

          {/* Toggle activo */}
          <div
            onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
            role="checkbox" aria-checked={formData.isActive} tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setFormData(p => ({ ...p, isActive: !p.isActive })); }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 10, border: `1px solid ${formData.isActive ? 'rgba(4,238,98,.35)' : LINE2}`, background: formData.isActive ? 'rgba(4,238,98,.06)' : 'transparent', cursor: 'pointer', transition: 'all .15s' }}
          >
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: formData.isActive ? NEON : MUTE }}>
              Estado: {formData.isActive ? 'Activo' : 'Inactivo'}
            </span>
            <span style={{ fontSize: 20, color: formData.isActive ? NEON : MUTE }}>
              {formData.isActive ? '●' : '○'}
            </span>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: `1px solid ${LINE}` }}>
            <button type="button" onClick={handleClose} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: loading ? .6 : 1 }}>
              {loading ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
    </ModalShell>
  );
}
