'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminEditionService } from '@/services/editions';
import { useAdminEditions } from '@/context/AdminEditionsContext';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#332A30';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

const TAGS: { tag: string; desc: string }[] = [
  { tag: '{nombre}',     desc: 'Nombre del comprador' },
  { tag: '{referencia}', desc: 'Referencia de la compra' },
  { tag: '{tipo}',       desc: 'Tipo de boleto' },
  { tag: '{fecha}',      desc: 'Fecha del evento' },
  { tag: '{lugar}',      desc: 'Lugar del evento' },
];

const taStyle: React.CSSProperties = {
  width: '100%', minHeight: 160, resize: 'vertical',
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: 12, boxSizing: 'border-box',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, lineHeight: 1.5, outline: 'none',
};

export default function EditionEmailPage() {
  const params = useParams();
  const { editions, loadEditions } = useAdminEditions();
  const uuid = String(params?.uuid ?? '');
  const edition = editions.find((e) => e.uuid === uuid);

  const [es, setEs] = useState('');
  const [en, setEn] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const initialized = useRef(false);
  const toastRef = useRef<ReturnType<typeof setTimeout>>();

  // Brochure de hoteles
  const [hasBrochure, setHasBrochure] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Vista previa del correo
  const [previewLang, setPreviewLang] = useState<'es' | 'en'>('es');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  // Texto por defecto (el del template anterior), derivado de la edición. Se usa
  // para precargar el editor cuando la edición aún no tiene un mensaje propio.
  const suffix = edition?.country
    ? ` - ${edition.country}${edition.year ? ` ${edition.year}` : ''}`
    : '';
  const defaultEs =
    `Has asegurado tu cupo para participar del Congreso Nacional de Marketing Político${suffix}.\n\n` +
    `Recuerda asistir puntual a las conferencias y actividades programadas, y seguir las instrucciones de nuestro personal logístico.`;
  const defaultEn =
    `You have secured your spot at the National Congress of Political Marketing${suffix}.\n\n` +
    `Remember to arrive on time to the scheduled conferences and activities, and to follow the instructions of our logistics staff.`;

  // Inicializa los textos una vez que la edición está disponible. Si no tiene
  // mensaje guardado, precarga el texto por defecto del template anterior.
  useEffect(() => {
    if (edition && !initialized.current) {
      initialized.current = true;
      setEs(edition.purchaseEmailMessage?.es ?? defaultEs);
      setEn(edition.purchaseEmailMessage?.en ?? defaultEn);
      setHasBrochure(!!edition.hotelBrochureKey);
    }
  }, [edition, defaultEs, defaultEn]);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 3000);
  };

  if (!edition) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: 200, alignItems: 'center', color: MUTE, fontFamily: 'Space Grotesk, sans-serif', fontSize: 13 }}>
        Cargando…
      </div>
    );
  }

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminEditionService.update(edition.uuid, {
        // Cadenas vacías se guardan como undefined → el correo usa su texto por defecto.
        purchaseEmailMessage: {
          es: es.trim() || undefined,
          en: en.trim() || undefined,
        },
      });
      await loadEditions();
      showToast('Mensaje guardado');
    } catch {
      showToast('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      await adminEditionService.uploadHotelBrochure(edition.uuid, file);
      setHasBrochure(true);
      await loadEditions();
      showToast('Brochure subido');
    } catch {
      showToast('Error al subir (¿es un PDF de máx. 15MB?)');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemoveBrochure = async () => {
    try {
      await adminEditionService.removeHotelBrochure(edition.uuid);
      setHasBrochure(false);
      await loadEditions();
      showToast('Brochure quitado');
    } catch {
      showToast('Error al quitar');
    }
  };

  const handleViewBrochure = async () => {
    const url = await adminEditionService.getHotelBrochureUrl(edition.uuid);
    if (url) window.open(url, '_blank');
  };

  const handlePreview = async (lang: 'es' | 'en') => {
    try {
      setPreviewLang(lang);
      setPreviewLoading(true);
      const html = await adminEditionService.getPurchaseEmailPreview(edition.uuid, lang);
      setPreviewHtml(html);
    } catch {
      showToast('Error al generar la vista previa');
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 880 }}>
      <p style={{ color: MUTE, fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, lineHeight: 1.5, margin: '0 0 18px' }}>
        Cuerpo del correo que recibe el comprador al pagar su boleto, en el idioma que eligió.
        Si lo dejas vacío, se usa el texto por defecto. Los datos del boleto (referencia, tipo,
        QR) se muestran aparte siempre.
      </p>

      {/* Ayuda de etiquetas */}
      <div style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
        <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 12, color: MUTE, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
          Etiquetas disponibles
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {TAGS.map((t) => (
            <span key={t.tag} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12.5, color: '#fff' }}>
              <code style={{ color: NEON }}>{t.tag}</code>
              <span style={{ color: MUTE }}> — {t.desc}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Español */}
      <label style={{ display: 'block', fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 6 }}>
        Mensaje (Español)
      </label>
      <textarea
        style={taStyle}
        value={es}
        onChange={(e) => setEs(e.target.value)}
        placeholder={'¡Hola {nombre}! 🎉\n\nAseguraste tu cupo. Tu referencia es {referencia} y compraste una entrada {tipo}.\n\nTe esperamos en {lugar} el {fecha}.'}
      />

      {/* Inglés */}
      <label style={{ display: 'block', fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', margin: '18px 0 6px' }}>
        Mensaje (Inglés)
      </label>
      <textarea
        style={taStyle}
        value={en}
        onChange={(e) => setEn(e.target.value)}
        placeholder={'Hi {name}! 🎉\n\nYour spot is secured. Your reference is {reference} and you bought a {type} ticket.\n\nSee you at {location} on {date}.'}
      />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="adm-btn neon"
          style={{ fontSize: 13, padding: '9px 20px', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Guardando…' : 'Guardar mensaje'}
        </button>
        <button
          type="button"
          onClick={() => { setEs(defaultEs); setEn(defaultEn); }}
          className="adm-btn"
          style={{ fontSize: 13, padding: '9px 16px' }}
        >
          Restablecer al texto por defecto
        </button>
        <span style={{ color: MUTE, fontFamily: 'Space Grotesk, sans-serif', fontSize: 12 }}>
          Vacío = texto por defecto del sistema.
        </span>
      </div>

      {/* ── Brochure de hoteles ── */}
      <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 28, paddingTop: 22 }}>
        <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff', margin: '0 0 6px' }}>
          Brochure de hoteles (PDF)
        </h3>
        <p style={{ color: MUTE, fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, margin: '0 0 12px' }}>
          Se adjunta al correo de compra de esta edición. Si no subes ninguno, el correo se envía sin adjunto.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
        />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="adm-btn neon" style={{ fontSize: 13, padding: '9px 16px', opacity: uploading ? 0.6 : 1 }}>
            {uploading ? 'Subiendo…' : hasBrochure ? 'Reemplazar PDF' : 'Subir PDF'}
          </button>
          {hasBrochure && (
            <>
              <button onClick={handleViewBrochure} className="adm-btn" style={{ fontSize: 13, padding: '9px 16px' }}>Ver actual</button>
              <button onClick={handleRemoveBrochure} className="adm-btn" style={{ fontSize: 13, padding: '9px 16px', color: 'rgba(255,90,90,.8)' }}>Quitar</button>
              <span style={{ color: NEON, fontFamily: 'Space Grotesk, sans-serif', fontSize: 12 }}>✓ Hay un brochure cargado</span>
            </>
          )}
        </div>
      </div>

      {/* ── Vista previa del correo ── */}
      <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 28, paddingTop: 22 }}>
        <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff', margin: '0 0 12px' }}>
          Vista previa del correo
        </h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <button onClick={() => handlePreview('es')} disabled={previewLoading} className={`adm-btn${previewLang === 'es' && previewHtml ? ' neon' : ''}`} style={{ fontSize: 13, padding: '9px 16px' }}>
            Previsualizar (Español)
          </button>
          <button onClick={() => handlePreview('en')} disabled={previewLoading} className={`adm-btn${previewLang === 'en' && previewHtml ? ' neon' : ''}`} style={{ fontSize: 13, padding: '9px 16px' }}>
            Previsualizar (Inglés)
          </button>
          {previewLoading && <span style={{ color: MUTE, fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, alignSelf: 'center' }}>Generando…</span>}
        </div>
        {previewHtml ? (
          <iframe
            title="Vista previa del correo"
            srcDoc={previewHtml}
            style={{ width: '100%', height: 600, border: `1px solid ${LINE2}`, borderRadius: 10, background: '#fff' }}
          />
        ) : (
          <div style={{ color: MUTE, fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, background: PANEL, border: `1px solid ${LINE}`, borderRadius: 10, padding: '24px', textAlign: 'center' }}>
            Genera una vista previa con datos de ejemplo. <strong>Guarda</strong> tus cambios antes para verlos reflejados.
          </div>
        )}
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: PANEL, border: `1px solid rgba(4,238,98,.3)`, borderRadius: 12, padding: '12px 20px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,.5)' }}>
          ✅ {toast}
        </div>
      )}
    </div>
  );
}
