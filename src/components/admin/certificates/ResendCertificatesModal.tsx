'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import ModalShell from '@/components/admin/ModalShell';
import { emailBroadcastService } from '@/services/emailBroadcast';
import { senderFor } from '@/utils/broadcastSender';
import type { Edition } from '@/types/edition';

/* ── design tokens ── */
const INK  = '#1A1418';
const NEON = '#04EE62';
const LINE = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE = 'rgba(255,255,255,.45)';

const iS: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: '10px 14px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700,
  letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE,
};

interface Props {
  edition: Edition;
  recipients: number;
  /** Cuántos ya tienen un certificado emitido con un formato anterior. */
  outdated?: number;
  onClose: () => void;
}

export default function ResendCertificatesModal({ edition, recipients, outdated = 0, onClose }: Props) {
  const [title, setTitle] = useState(`Tu certificado del ${edition.name}`);
  const [content, setContent] = useState(
    `Hola,\n\nTe compartimos tu certificado de participación en el ${edition.name}; lo encuentras adjunto a este correo.\n\nGracias por acompañarnos.`,
  );
  const [sending, setSending] = useState(false);

  const canSend = recipients > 0 && !!title.trim() && !!content.trim() && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    try {
      await emailBroadcastService.createBroadcast({
        title: title.trim(),
        content: content.trim(),
        sender_name: senderFor([edition], edition.id),
        type: 'ALL_USERS',
        target_edition: edition.id,
        include_certificate: true,
        force_regenerate_certificate: false,
      });
      await Swal.fire({
        icon: 'success', title: 'Envío creado',
        html: 'Puedes seguir su avance en <a href="/admin/broadcasts" style="color:#04EE62">Broadcasts</a>.',
        background: '#2A2228', color: '#fff', confirmButtonColor: NEON,
      });
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error', title: 'Error', background: '#2A2228', color: '#fff',
        text: error instanceof Error ? error.message : 'No se pudo crear el envío',
      });
      setSending(false);
    }
  };

  return (
    <ModalShell onClose={() => { if (!sending) onClose(); }} maxWidth={560}>
      <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: '0 0 8px' }}>
        ¿Enviar los certificados?
      </h3>
      <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: recipients > 0 ? NEON : MUTE, margin: '0 0 18px' }}>
        {recipients > 0
          ? `Se enviará a ${recipients} asistentes de ${edition.name} con el formato actual.`
          : `No hay asistentes de ${edition.name} a quienes enviar.`}
        {recipients > 0 && outdated > 0 && (
          <span style={{ display: 'block', color: MUTE, marginTop: 4 }}>
            {outdated} ya tenían uno con un formato anterior; recibirán el actualizado.
          </span>
        )}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={labelStyle}>Asunto</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={iS} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={labelStyle}>Mensaje</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={6}
            style={{ ...iS, resize: 'vertical', minHeight: 120 }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${LINE}` }}>
        <button type="button" onClick={onClose} disabled={sending}
          style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
          Ahora no
        </button>
        <button type="button" onClick={handleSend} disabled={!canSend}
          style={{ padding: '9px 24px', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: canSend ? 'pointer' : 'not-allowed', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: canSend ? 1 : .5 }}>
          {sending ? 'Enviando…' : 'Enviar'}
        </button>
      </div>
    </ModalShell>
  );
}
