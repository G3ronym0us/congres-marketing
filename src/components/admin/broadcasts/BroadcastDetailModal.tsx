'use client';

import { useState } from 'react';
import { EmailBroadcast, ResendEmailBroadcastRequest } from '../../../types/emailBroadcast';
import { emailBroadcastService } from '../../../services/emailBroadcast';
import Swal from 'sweetalert2';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const PANEL2= '#332A30';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

const STATUS: Record<string, { color: string; bg: string; label: string }> = {
  PENDING:   { color: '#f59e0b', bg: 'rgba(245,158,11,.12)',  label: 'Pendiente'  },
  SENDING:   { color: '#60a5fa', bg: 'rgba(96,165,250,.12)',  label: 'Enviando'   },
  COMPLETED: { color: NEON,      bg: 'rgba(4,238,98,.1)',     label: 'Completado' },
  FAILED:    { color: '#ff6b6b', bg: 'rgba(255,80,80,.1)',    label: 'Fallido'    },
};

const iS: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: '10px 14px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE, marginBottom: 12 }}>
    {children}
  </div>
);

const CheckRow = ({
  emoji, label, hint, checked, name, onChange
}: { emoji: string; label: string; hint: string; checked: boolean; name: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} style={{ display: 'none' }} />
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

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

interface Props {
  isOpen: boolean;
  onClose: () => void;
  broadcast: EmailBroadcast;
  onResend: () => void;
  onUpdate: () => void;
}

export default function BroadcastDetailModal({ isOpen, onClose, broadcast, onResend, onUpdate }: Props) {
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending]     = useState(false);
  const [resendData, setResendData]   = useState<ResendEmailBroadcastRequest>({
    include_ticket: false, force_regenerate_ticket: false,
    include_certificate: false, force_regenerate_certificate: false,
  });

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setResendData(prev => ({
      ...prev,
      [name]: checked,
      ...(name === 'include_ticket' && !checked ? { force_regenerate_ticket: false } : {}),
      ...(name === 'include_certificate' && !checked ? { force_regenerate_certificate: false } : {}),
    }));
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await emailBroadcastService.resendBroadcast(broadcast.id, {
        ...resendData,
        specific_email: resendEmail || undefined,
      });
      setResendEmail('');
      setResendData({ include_ticket: false, force_regenerate_ticket: false, include_certificate: false, force_regenerate_certificate: false });
      Swal.fire({ icon: 'success', title: 'Reenviado', timer: 1500, showConfirmButton: false });
      onUpdate();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo reenviar el broadcast' });
    } finally {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  const s        = STATUS[broadcast.status] ?? STATUS.PENDING;
  const pct      = broadcast.total_recipients > 0
    ? Math.round((broadcast.sent_count / broadcast.total_recipients) * 100) : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      <div style={{ position: 'relative', zIndex: 1, background: PANEL, border: `1px solid ${LINE}`, borderRadius: 20, padding: '28px 28px 24px', width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,.6)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            Detalle del Broadcast
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Info básica */}
          <div style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
              <div>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 4 }}>
                  {broadcast.title}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: MUTE }}>
                  Por: {broadcast.sender_name}
                </div>
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: s.color, background: s.bg, borderRadius: 6, padding: '3px 10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {s.label}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, color: MUTE, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Tipo</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff' }}>
                  {broadcast.type === 'ALL_USERS' ? '👥 Todos los usuarios' : `✉️ ${broadcast.specific_email}`}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, color: MUTE, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Fecha</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff' }}>{formatDate(broadcast.createdAt)}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE, marginBottom: 6 }}>
                <span>Progreso de envío</span>
                <span style={{ color: '#fff' }}>{broadcast.sent_count}/{broadcast.total_recipients} ({pct}%)</span>
              </div>
              <div style={{ width: '100%', height: 6, background: LINE2, borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: NEON, borderRadius: 99, transition: 'width .3s' }} />
              </div>
              {broadcast.failed_count > 0 && (
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#ff6b6b', marginTop: 6 }}>
                  {broadcast.failed_count} emails fallaron en el envío
                </div>
              )}
            </div>

            {broadcast.error_message && (
              <div style={{ marginTop: 12, background: 'rgba(255,80,80,.08)', border: '1px solid rgba(255,80,80,.2)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, color: '#ff6b6b', textTransform: 'uppercase', marginBottom: 4 }}>Error</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#ff9999' }}>{broadcast.error_message}</div>
              </div>
            )}
          </div>

          {/* Contenido */}
          <div style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 12, padding: '18px 20px' }}>
            <SectionLabel>Contenido del email</SectionLabel>
            <div style={{ background: INK, border: `1px solid ${LINE2}`, borderRadius: 8, padding: '14px 16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'rgba(255,255,255,.85)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {broadcast.content}
            </div>
          </div>

          {/* Adjuntos */}
          {broadcast.attachments && broadcast.attachments.length > 0 && (
            <div style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 12, padding: '18px 20px' }}>
              <SectionLabel>Archivos adjuntos</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {broadcast.attachments.map((att, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: INK, border: `1px solid ${LINE2}`, borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 14 }}>📎</span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#fff' }}>
                      {att.split('/').pop()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reenvío */}
          {broadcast.status === 'COMPLETED' && (
            <div style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 12, padding: '18px 20px' }}>
              <SectionLabel>✉️ Reenviar broadcast</SectionLabel>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE, marginBottom: 6 }}>
                    Email específico (dejar vacío para reenviar a todos los destinatarios originales)
                  </div>
                  <input type="email" value={resendEmail} onChange={e => setResendEmail(e.target.value)}
                    style={iS} placeholder="usuario@example.com" />
                </div>

                {/* Adjuntos automáticos */}
                <div style={{ background: INK, border: `1px solid ${LINE2}`, borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, color: MUTE, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
                    Adjuntos automáticos
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, color: MUTE }}>Boletos</div>
                      <CheckRow emoji="🎫" label="Incluir Boleto" hint="Adjuntar el boleto del usuario"
                        checked={resendData.include_ticket} name="include_ticket" onChange={handleCheckbox} />
                      {resendData.include_ticket && (
                        <div style={{ paddingLeft: 28 }}>
                          <CheckRow emoji="🔄" label="Regenerar Boleto" hint="Generar nuevos PDF y QR"
                            checked={resendData.force_regenerate_ticket} name="force_regenerate_ticket" onChange={handleCheckbox} />
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, color: MUTE }}>Certificados</div>
                      <CheckRow emoji="🏆" label="Incluir Certificado" hint="Adjuntar el certificado del usuario"
                        checked={resendData.include_certificate} name="include_certificate" onChange={handleCheckbox} />
                      {resendData.include_certificate && (
                        <div style={{ paddingLeft: 28 }}>
                          <CheckRow emoji="🔄" label="Regenerar Certificado" hint="Generar nuevo PDF"
                            checked={resendData.force_regenerate_certificate} name="force_regenerate_certificate" onChange={handleCheckbox} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleResend} disabled={resending}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: resending ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: resending ? .6 : 1 }}>
                    {resending ? 'Reenviando…' : '✉️ Reenviar broadcast'}
                  </button>
                  <button
                    onClick={() => { setResendData({ include_ticket: false, force_regenerate_ticket: false, include_certificate: false, force_regenerate_certificate: false }); onResend(); }}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: '#fff', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
                    👥 Reenviar a todos
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cerrar */}
          <button onClick={onClose} style={{ width: '100%', padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
