'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { adminDiscountCodeService } from '@/services/discountCode';
import { CreateDiscountCodeInput } from '@/types/discountCode';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
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

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateDiscountCodeModal({ onClose, onSuccess }: Props) {
  const today = new Date().toISOString().slice(0, 16);

  const [formData, setFormData] = useState<CreateDiscountCodeInput>({
    code: '', discountPercentage: 0, maxUses: 1, isActive: true, expiresAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await adminDiscountCodeService.createCode(formData);
      Swal.fire({ icon: 'success', title: 'Código creado', timer: 1500, showConfirmButton: false });
      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Error al crear el código de descuento'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      <div style={{ position: 'relative', zIndex: 1, background: PANEL, border: `1px solid ${LINE}`, borderRadius: 20, padding: '28px 28px 24px', width: '100%', maxWidth: 460, boxShadow: '0 32px 80px rgba(0,0,0,.6)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            Crear Código de Descuento
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,80,80,.1)', border: '1px solid rgba(255,80,80,.25)', borderRadius: 8, padding: '10px 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#ff9999', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <Field label="Código *" hint="3–20 caracteres, sin espacios">
            <input type="text" name="code" value={formData.code} onChange={handleChange}
              required minLength={3} maxLength={20} placeholder="ej: EARLY2025"
              style={{ ...iS, textTransform: 'uppercase', letterSpacing: '.05em' }} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Descuento (%)*" hint="Entre 0.01 y 100">
              <input type="number" name="discountPercentage" value={formData.discountPercentage}
                onChange={handleChange} required min="0.01" max="100" step="0.01"
                placeholder="15.50" style={iS} />
            </Field>
            <Field label="Usos máximos *">
              <input type="number" name="maxUses" value={formData.maxUses}
                onChange={handleChange} required min="1" style={iS} />
            </Field>
          </div>

          <Field label="Fecha de expiración *">
            <input type="datetime-local" name="expiresAt" value={formData.expiresAt}
              onChange={handleChange} required min={today}
              style={{ ...iS, colorScheme: 'dark' }} />
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
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: loading ? .6 : 1 }}>
              {loading ? 'Creando…' : 'Crear código'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
