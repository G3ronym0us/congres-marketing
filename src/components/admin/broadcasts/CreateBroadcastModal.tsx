'use client';

import ModalShell, { confirmDiscard } from '@/components/admin/ModalShell';

import { useState } from 'react';
import { CreateEmailBroadcastRequest, EmailBroadcastType } from '../../../types/emailBroadcast';
import { Edition } from '../../../types/edition';
import { emailBroadcastService } from '../../../services/emailBroadcast';
import FileUploader from './FileUploader';
import Swal from 'sweetalert2';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
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

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
      {label}
    </label>
    {children}
  </div>
);

const CheckRow = ({
  emoji, label, hint, checked, name, onChange, disabled = false
}: { emoji: string; label: string; hint: string; checked: boolean; name: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .4 : 1 }}>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} disabled={disabled} style={{ display: 'none' }} />
    <span
      style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${checked ? NEON : LINE2}`, background: checked ? 'rgba(4,238,98,.15)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
    >
      {checked && <span style={{ color: NEON, fontSize: 11, lineHeight: 1 }}>✓</span>}
    </span>
    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: checked ? '#fff' : MUTE }}>
      {emoji} {label}
    </span>
    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'rgba(255,255,255,.28)', cursor: 'help' }} title={hint}>ℹ️</span>
  </label>
);

/* ── remitente ──
   Se deriva de la edición elegida ("Equipo Organizador CNMP Colombia 2026") en
   vez de quemar el año, para que el correo nunca salga firmado con una edición
   vieja. Sin edición ("Todas las ediciones") queda el nombre genérico, que no
   envejece. */
const SENDER_PREFIX  = 'Equipo Organizador';
const DEFAULT_SENDER = `${SENDER_PREFIX} CNMP`;

const senderFor = (editions: Edition[], editionId?: number): string => {
  const name = editions.find(e => e.id === editionId)?.name;
  return name ? `${SENDER_PREFIX} ${name}` : DEFAULT_SENDER;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editions?: Edition[];
}

export default function CreateBroadcastModal({ isOpen, onClose, onSuccess, editions = [] }: Props) {
  const [loading, setLoading]         = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // Mientras el admin no escriba su propio remitente, el campo sigue a la edición.
  const [senderTouched, setSenderTouched] = useState(false);

  const [formData, setFormData] = useState<CreateEmailBroadcastRequest>({
    title: '',
    sender_name: DEFAULT_SENDER,
    content: '',
    type: 'ALL_USERS',
    specific_email: '',
    include_ticket: false,
    force_regenerate_ticket: false,
    include_certificate: false,
    force_regenerate_certificate: false,
    target_edition: undefined,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    // Si lo vacía, vuelve a seguir a la edición; si escribe algo, manda él.
    if (name === 'sender_name') setSenderTouched(value.trim() !== '');
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
      ...(name === 'include_ticket' && !checked ? { force_regenerate_ticket: false } : {}),
      ...(name === 'include_certificate' && !checked ? { force_regenerate_certificate: false } : {}),
    }));
  };

  const handleType = (type: EmailBroadcastType) => {
    setFormData(prev => ({ ...prev, type, specific_email: type === 'SPECIFIC_EMAIL' ? prev.specific_email : '' }));
  };

  // El boleto/certificado "del usuario" sólo se puede resolver dentro de una
  // edición: sin ella el backend adjuntaría uno de cualquier año.
  const handleEdition = (value: string) => {
    const target_edition = value ? parseInt(value, 10) : undefined;
    setFormData(prev => ({
      ...prev,
      target_edition,
      ...(senderTouched ? {} : { sender_name: senderFor(editions, target_edition) }),
      ...(target_edition == null ? {
        include_ticket: false, force_regenerate_ticket: false,
        include_certificate: false, force_regenerate_certificate: false,
      } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type === 'SPECIFIC_EMAIL' && !formData.specific_email) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'El email específico es requerido' });
      return;
    }
    if ((formData.include_ticket || formData.include_certificate) && formData.target_edition == null) {
      Swal.fire({
        icon: 'error', title: 'Falta la edición',
        text: 'Para adjuntar el boleto o el certificado del usuario debes elegir una edición; de lo contrario se enviaría el de un año anterior.',
      });
      return;
    }
    setLoading(true);
    try {
      if (selectedFiles.length > 0) {
        await emailBroadcastService.createBroadcastWithAttachments({
          title: formData.title, sender_name: formData.sender_name, content: formData.content,
          type: formData.type, specific_email: formData.specific_email || undefined,
          include_ticket: formData.include_ticket, force_regenerate_ticket: formData.force_regenerate_ticket,
          include_certificate: formData.include_certificate, force_regenerate_certificate: formData.force_regenerate_certificate,
          target_edition: formData.target_edition,
        }, selectedFiles);
      } else {
        await emailBroadcastService.createBroadcast(formData);
      }
      Swal.fire({ icon: 'success', title: 'Broadcast creado', timer: 1500, showConfirmButton: false });
      setFormData({
        title: '', sender_name: DEFAULT_SENDER, content: '', type: 'ALL_USERS',
        specific_email: '', include_ticket: false, force_regenerate_ticket: false,
        include_certificate: false, force_regenerate_certificate: false,
        target_edition: undefined,
      });
      setSenderTouched(false);
      setSelectedFiles([]);
      onSuccess();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error instanceof Error ? error.message : 'Error al crear el broadcast' });
    } finally {
      setLoading(false);
    }
  };

  const sinEdicion = formData.target_edition == null;
  const edicionElegida = editions.find(e => e.id === formData.target_edition)?.name
    ?? `edición ${formData.target_edition}`;
  const isDirty = !!(formData.title || formData.content || formData.specific_email) || selectedFiles.length > 0;

  const handleClose = async () => {
    if (isDirty && !(await confirmDiscard())) return;
    onClose();
  };

  if (!isOpen) return null;

  const canPreview = !!formData.title && !!formData.content;

  return (
    <>
      {/* Main modal */}
      <ModalShell onClose={handleClose} maxWidth={700}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
              Nuevo Email Broadcast
            </h3>
            <button onClick={handleClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Título + Remitente */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Título del email *">
                <input type="text" name="title" value={formData.title} onChange={handleInput} required
                  style={iS} placeholder="Ej: Información importante del congreso" />
              </Field>
              <Field label="Nombre del remitente *">
                <input type="text" name="sender_name" value={formData.sender_name} onChange={handleInput} required style={iS} />
              </Field>
            </div>

            {/* Destinatarios */}
            <Field label="Destinatarios">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(['ALL_USERS', 'SPECIFIC_EMAIL'] as EmailBroadcastType[]).map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <span
                      onClick={() => handleType(t)}
                      style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${formData.type === t ? NEON : LINE2}`, background: formData.type === t ? 'rgba(4,238,98,.15)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .15s' }}
                    >
                      {formData.type === t && <span style={{ width: 8, height: 8, borderRadius: '50%', background: NEON, display: 'block' }} />}
                    </span>
                    <span onClick={() => handleType(t)} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: formData.type === t ? '#fff' : MUTE, cursor: 'pointer' }}>
                      {t === 'ALL_USERS' ? '👥 Todos los usuarios registrados' : '✉️ Email específico'}
                    </span>
                  </label>
                ))}
                {formData.type === 'SPECIFIC_EMAIL' && (
                  <input type="email" name="specific_email" value={formData.specific_email} onChange={handleInput} required
                    style={{ ...iS, marginTop: 4 }} placeholder="usuario@example.com" />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: MUTE, whiteSpace: 'nowrap' }}>
                    🗓 Edición:
                  </span>
                  <select
                    value={formData.target_edition ?? ''}
                    onChange={e => handleEdition(e.target.value)}
                    style={{ ...iS, width: 'auto', cursor: 'pointer' }}
                  >
                    <option value="">
                      {formData.type === 'ALL_USERS' ? 'Todas las ediciones' : 'Sin edición'}
                    </option>
                    {editions.map(ed => (
                      <option key={ed.id} value={ed.id}>{ed.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Field>

            {/* Mensaje */}
            <Field label="Mensaje *">
              <textarea name="content" value={formData.content} onChange={handleInput} required rows={8}
                style={{ ...iS, resize: 'vertical', minHeight: 140 } as React.CSSProperties}
                placeholder="Escribe aquí el contenido del email..." />
            </Field>

            {/* Adjuntos */}
            <Field label="Archivos adjuntos (opcional)">
              <FileUploader onFilesChange={setSelectedFiles} maxSizeMB={5}
                acceptedTypes={['pdf', 'doc', 'docx', 'jpg', 'png', 'webp']} maxFiles={3} />
            </Field>

            {/* Adjuntos automáticos */}
            <div style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE, marginBottom: 14 }}>
                Adjuntos automáticos
              </div>
              {sinEdicion && (
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#FFC24B', background: 'rgba(255,194,75,.1)', border: '1px solid rgba(255,194,75,.25)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, lineHeight: 1.5 }}>
                  ⚠️ Elige una edición arriba para adjuntar el boleto o el certificado. Sin edición se enviaría el de un año anterior.
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 12, fontWeight: 700, color: MUTE }}>Boletos</div>
                  <CheckRow emoji="🎫" label="Incluir Boleto" hint="Adjuntar el boleto del usuario al email"
                    checked={formData.include_ticket ?? false} name="include_ticket" onChange={handleCheckbox} disabled={sinEdicion} />
                  {formData.include_ticket && (
                    <div style={{ paddingLeft: 28 }}>
                      <CheckRow emoji="🔄" label="Regenerar Boleto" hint="Generar nuevos PDF y QR en lugar de usar los existentes"
                        checked={formData.force_regenerate_ticket ?? false} name="force_regenerate_ticket" onChange={handleCheckbox} />
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 12, fontWeight: 700, color: MUTE }}>Certificados</div>
                  <CheckRow emoji="🏆" label="Incluir Certificado" hint="Adjuntar el certificado del usuario al email"
                    checked={formData.include_certificate ?? false} name="include_certificate" onChange={handleCheckbox} disabled={sinEdicion} />
                  {formData.include_certificate && (
                    <div style={{ paddingLeft: 28 }}>
                      <CheckRow emoji="🔄" label="Regenerar Certificado" hint="Generar nuevo PDF del certificado"
                        checked={formData.force_regenerate_certificate ?? false} name="force_regenerate_certificate" onChange={handleCheckbox} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: `1px solid ${LINE}` }}>
              <button
                type="button" onClick={() => setShowPreview(true)} disabled={!canPreview}
                style={{ padding: '9px 16px', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: canPreview ? '#fff' : MUTE, cursor: canPreview ? 'pointer' : 'not-allowed', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13, opacity: canPreview ? 1 : .5 }}
              >
                👁 Vista previa
              </button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={handleClose} style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
                  Cancelar
                </button>
                <button type="submit" disabled={loading || !formData.title || !formData.content}
                  style={{ padding: '9px 24px', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: loading ? .6 : 1 }}>
                  {loading ? 'Creando…' : 'Crear broadcast'}
                </button>
              </div>
            </div>
          </form>
      </ModalShell>

      {/* Preview modal */}
      {showPreview && (
        <ModalShell onClose={() => setShowPreview(false)} maxWidth={600} zIndex={1100} backdropStyle={{ background: 'rgba(0,0,0,.75)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
                Vista previa del email
              </h3>
              <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
            </div>
            <div style={{ background: INK, border: `1px solid ${LINE2}`, borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
                De: <span style={{ color: '#fff' }}>{formData.sender_name}</span>
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
                Para: <span style={{ color: '#fff' }}>{formData.type === 'ALL_USERS' ? `Todos los usuarios${formData.target_edition ? ` (${edicionElegida})` : ' (todas las ediciones)'}` : `${formData.specific_email}${formData.target_edition ? ` (${edicionElegida})` : ''}`}</span>
              </div>
              <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', borderTop: `1px solid ${LINE}`, paddingTop: 12 }}>
                {formData.title}
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'rgba(255,255,255,.8)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {formData.content}
              </div>
              {selectedFiles.length > 0 && (
                <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, color: MUTE, textTransform: 'uppercase', letterSpacing: '.08em' }}>Adjuntos</div>
                  {selectedFiles.map((f, i) => (
                    <span key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#fff' }}>📎 {f.name}</span>
                  ))}
                </div>
              )}
              {(formData.include_ticket || formData.include_certificate) && (
                <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, color: MUTE, textTransform: 'uppercase', letterSpacing: '.08em' }}>Adjuntos automáticos</div>
                  {formData.include_ticket && <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#fff' }}>🎫 Boleto del usuario</span>}
                  {formData.force_regenerate_ticket && <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#fff' }}>🔄 Regenerar PDF y QR de boleto</span>}
                  {formData.include_certificate && <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#fff' }}>🏆 Certificado del usuario</span>}
                  {formData.force_regenerate_certificate && <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#fff' }}>🔄 Regenerar PDF del certificado</span>}
                </div>
              )}
            </div>
            <button onClick={() => setShowPreview(false)} style={{ width: '100%', marginTop: 16, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
              Cerrar vista previa
            </button>
        </ModalShell>
      )}
    </>
  );
}
