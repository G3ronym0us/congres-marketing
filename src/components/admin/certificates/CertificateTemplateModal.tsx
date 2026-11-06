'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import ModalShell, { confirmDiscard } from '@/components/admin/ModalShell';
import TicketTemplateEditor, {
  CERTIFICATE_DEFAULT_TEMPLATE,
  CERTIFICATE_PAGE,
  CERTIFICATE_ACCEPT,
  type TemplateLike,
} from '@/components/admin/TicketTemplateEditor';
import { adminEditionService } from '@/services/editions';
import type { CertificateTemplate, Edition } from '@/types/edition';

/* ── design tokens ── */
const INK  = '#1A1418';
const NEON = '#04EE62';
const LINE = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE = 'rgba(255,255,255,.45)';

interface Props {
  edition: Edition;
  onClose: () => void;
  onSaved: (r: { outdated: number; recipients: number }) => void;
}

// El editor trabaja con TemplateLike; el servicio exige las tres claves del fondo.
const toCertificateTemplate = (t: TemplateLike): CertificateTemplate => ({
  background: t.background,
  backgroundUrl: t.backgroundUrl ?? '',
  backgroundType: t.backgroundType ?? 'image',
  elements: t.elements as CertificateTemplate['elements'],
});

export default function CertificateTemplateModal({ edition, onClose, onSaved }: Props) {
  const initial = (edition.certificateTemplate ?? null) as TemplateLike | null;
  const [template, setTemplate] = useState<TemplateLike | null>(initial);
  const [saving, setSaving] = useState(false);

  const isDirty = JSON.stringify(template) !== JSON.stringify(initial);
  const canSave = !!template?.background && !saving;

  const handleClose = async () => {
    if (saving) return;
    if (isDirty && !(await confirmDiscard())) return;
    onClose();
  };

  const handleSave = async () => {
    if (!template?.background) return;
    setSaving(true);
    try {
      const r = await adminEditionService.saveCertificateTemplate(
        edition.uuid, toCertificateTemplate(template),
      );
      onSaved({ outdated: r.outdated, recipients: r.recipients });
    } catch (error) {
      Swal.fire({
        icon: 'error', title: 'Error', background: '#2A2228', color: '#fff',
        text: error instanceof Error ? error.message : 'No se pudo guardar el formato del certificado',
      });
      setSaving(false);
    }
  };

  // background = key S3, backgroundUrl = URL de lectura (la que dibuja el editor).
  const upload = async (file: File) => {
    const r = await adminEditionService.uploadCertificateBackground(edition.uuid, file);
    return { url: r.url, key: r.key, backgroundType: r.backgroundType };
  };

  const preview = async (t: TemplateLike) => {
    try {
      await adminEditionService.downloadCertificatePreview(edition.uuid, toCertificateTemplate(t));
    } catch {
      throw new Error('No se pudo generar el certificado de prueba');
    }
  };

  return (
    <ModalShell onClose={handleClose} maxWidth={1100}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
          Formato del certificado · {edition.name}
        </h3>
        <button onClick={handleClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
      </div>

      <TicketTemplateEditor
        kind="certificate"
        value={template}
        onChange={setTemplate}
        page={CERTIFICATE_PAGE}
        accept={CERTIFICATE_ACCEPT}
        defaultTemplate={CERTIFICATE_DEFAULT_TEMPLATE}
        upload={upload}
        preview={preview}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${LINE}` }}>
        <button type="button" onClick={handleClose} style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
          Cancelar
        </button>
        <button type="button" onClick={handleSave} disabled={!canSave}
          style={{ padding: '9px 24px', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: canSave ? 'pointer' : 'not-allowed', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: canSave ? 1 : .5 }}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </ModalShell>
  );
}
