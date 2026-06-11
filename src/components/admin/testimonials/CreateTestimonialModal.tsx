'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import { CreateTestimonialInput } from '@/types/testimonials';
import { createTestimonial } from '@/services/testimonials';
import ModalShell, { confirmDiscard } from '@/components/admin/ModalShell';

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

const Field = ({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
      {label}
    </label>
    {children}
    {error && <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#ff6b6b' }}>{error}</span>}
  </div>
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTestimonialModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset, watch, setValue } =
    useForm<CreateTestimonialInput>({ defaultValues: { firstName: '', lastName: '', position: '', content: '', active: true } });

  const active      = watch('active');
  const contentLen  = watch('content')?.length || 0;

  const onSubmit = async (data: CreateTestimonialInput) => {
    try {
      await createTestimonial(data);
      Swal.fire({ icon: 'success', title: 'Testimonio creado', timer: 1500, showConfirmButton: false });
      reset();
      onSuccess();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo crear el testimonio' });
    }
  };

  const handleClose = async () => {
    if (isDirty && !(await confirmDiscard())) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalShell onClose={handleClose} maxWidth={560}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            Nuevo testimonio
          </h3>
          <button onClick={handleClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Nombre *" error={errors.firstName?.message}>
              <Controller name="firstName" control={control}
                rules={{ required: 'Requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' }, maxLength: { value: 50, message: 'Máximo 50 caracteres' } }}
                render={({ field }) => <input {...field} style={{ ...iS, borderColor: errors.firstName ? '#ff6b6b' : LINE2 }} placeholder="Nombre" />} />
            </Field>
            <Field label="Apellido *" error={errors.lastName?.message}>
              <Controller name="lastName" control={control}
                rules={{ required: 'Requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' }, maxLength: { value: 50, message: 'Máximo 50 caracteres' } }}
                render={({ field }) => <input {...field} style={{ ...iS, borderColor: errors.lastName ? '#ff6b6b' : LINE2 }} placeholder="Apellido" />} />
            </Field>
          </div>

          <Field label="Cargo / Posición *" error={errors.position?.message}>
            <Controller name="position" control={control}
              rules={{ required: 'Requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' }, maxLength: { value: 100, message: 'Máximo 100 caracteres' } }}
              render={({ field }) => <input {...field} style={{ ...iS, borderColor: errors.position ? '#ff6b6b' : LINE2 }} placeholder="Ej: Director de Marketing" />} />
          </Field>

          <Field label="Contenido *" error={errors.content?.message}>
            <Controller name="content" control={control}
              rules={{ required: 'Requerido', minLength: { value: 10, message: 'Mínimo 10 caracteres' }, maxLength: { value: 1000, message: 'Máximo 1000 caracteres' } }}
              render={({ field }) => (
                <textarea {...field} rows={4} style={{ ...iS, resize: 'vertical', minHeight: 100 } as React.CSSProperties}
                  placeholder="Escribe aquí el testimonio..." />
              )} />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE, textAlign: 'right' }}>
              {contentLen}/1000
            </span>
          </Field>

          {/* Toggle activo */}
          <div
            onClick={() => setValue('active', !active)}
            role="checkbox"
            aria-checked={active}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setValue('active', !active); }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 10, border: `1px solid ${active ? 'rgba(4,238,98,.35)' : LINE2}`, background: active ? 'rgba(4,238,98,.06)' : 'transparent', cursor: 'pointer', transition: 'all .15s' }}
          >
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: active ? NEON : MUTE }}>
              Estado: {active ? 'Activo' : 'Inactivo'}
            </span>
            <span style={{ fontSize: 20, color: active ? NEON : MUTE }}>
              {active ? '●' : '○'}
            </span>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: `1px solid ${LINE}` }}>
            <button type="button" onClick={handleClose} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: isSubmitting ? .6 : 1 }}>
              {isSubmitting ? 'Creando…' : 'Crear testimonio'}
            </button>
          </div>
        </form>
    </ModalShell>
  );
};

export default CreateTestimonialModal;
