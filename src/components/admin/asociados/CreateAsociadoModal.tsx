'use client';

import ModalShell, { confirmDiscard } from '@/components/admin/ModalShell';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { adminAsociadoService } from '@/services/asociado';
import { adminDiscountCodeService } from '@/services/discountCode';
import { CreateAsociadoInput } from '@/types/asociado';
import { DiscountCode } from '@/types/discountCode';

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

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
      {label}
    </label>
    {children}
    {hint && <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'rgba(255,255,255,.28)' }}>{hint}</span>}
  </div>
);

interface FormState {
  name: string;
  code: string;
  company: string;
  email: string;
  website: string;
  discountCodeUuid: string;
  isActive: boolean;
}

interface Props {
  editionId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm: FormState = {
  name: '', code: '', company: '', email: '', website: '', discountCodeUuid: '', isActive: true,
};

export default function CreateAsociadoModal({ editionId, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [codes, setCodes]     = useState<DiscountCode[]>([]);

  useEffect(() => {
    adminDiscountCodeService.getAllCodes(editionId)
      .then(setCodes)
      .catch(() => setCodes([]));
  }, [editionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const input: CreateAsociadoInput = {
        edition: editionId,
        name: formData.name,
        code: formData.code,
        isActive: formData.isActive,
        ...(formData.company && { company: formData.company }),
        ...(formData.email && { email: formData.email }),
        ...(formData.website && { website: formData.website }),
        ...(formData.discountCodeUuid && { discountCodeUuid: formData.discountCodeUuid }),
      };
      await adminAsociadoService.create(input);
      Swal.fire({ icon: 'success', title: 'Asociado creado', timer: 1500, showConfirmButton: false });
      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Error al crear el asociado'));
    } finally {
      setLoading(false);
    }
  };

  const isDirty =
    !!(formData.name || formData.code || formData.company || formData.email || formData.website || formData.discountCodeUuid) ||
    formData.isActive !== true;

  const handleClose = async () => {
    if (isDirty && !(await confirmDiscard())) return;
    onClose();
  };

  return (
    <ModalShell onClose={handleClose} maxWidth={460}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            Crear Asociado
          </h3>
          <button onClick={handleClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
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

          <Field label="Código de descuento" hint="Aporta el % y hereda sus usos máximos y expiración. Déjalo en &quot;Sin descuento&quot; si el código solo atribuye ventas.">
            <select name="discountCodeUuid" value={formData.discountCodeUuid} onChange={handleChange} style={{ ...iS, colorScheme: 'dark' }}>
              <option value="">Sin descuento</option>
              {codes.map(c => (
                <option key={c.uuid} value={c.uuid}>
                  {c.code} — {parseFloat(c.discountPercentage)}% ({c.currentUses}/{c.maxUses} usos)
                </option>
              ))}
            </select>
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
              {loading ? 'Creando…' : 'Crear asociado'}
            </button>
          </div>
        </form>
    </ModalShell>
  );
}
