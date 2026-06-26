'use client';

import React, { useRef, useState } from 'react';
import { TicketTemplate } from '@/types/localidadTypes';
import { uploadTicketBackground, downloadTicketPreview } from '@/services/localidadTypes';

/* ── design tokens ── */
const INK    = '#1A1418';
const PANEL2 = '#332A30';
const NEON   = '#04EE62';
const LINE   = 'rgba(255,255,255,.08)';
const LINE2  = 'rgba(255,255,255,.14)';
const MUTE   = 'rgba(255,255,255,.45)';

// Geometría del PDF (coincide con pdf.service): carta 612x792, imagen a 612 de
// ancho manteniendo proporción 1080:1350.
const IMG_W = 612;
const IMG_H = (1350 * IMG_W) / 1080; // 765
const PREVIEW_W = 420; // más grande
const SCALE = PREVIEW_W / IMG_W;
const PREVIEW_H = IMG_H * SCALE; // ≈525

const DEFAULT_TEMPLATE: TicketTemplate = {
  background: '',
  elements: {
    qrCode: { x: 445, y: 510, width: 140, height: 140 },
    name: { x: 60, y: 440, size: 26, align: 'left', color: [1, 1, 1] },
    document: { x: 60, y: 410, size: 26, align: 'left', color: [1, 1, 1] },
  },
};

// Casos límite anonimizados (longitudes, tildes, ñ y dígitos conservados).
const TEST_EXAMPLES: { label: string; name: string; lastname: string; document: string }[] = [
  { label: 'Nombre largo (2 nombres + 2 apellidos)', name: 'Diego Fernanto', lastname: 'Maldorano Valbedrama', document: '1142903765' },
  { label: 'Con tildes y ñ', name: 'Eber Alexánder', lastname: 'Ballesnero Peñaroda', document: '17582640' },
  { label: 'Tildes (María / Hernández)', name: 'María Alejandra', lastname: 'Aristibal Hernárdez', document: '1009742318' },
  { label: '3 nombres', name: 'Juan José María', lastname: 'Restrepo Ángel', document: '71234509' },
  { label: 'Apellido compuesto largo', name: 'Pablo Santino', lastname: 'Rondríguez Bentacurte', document: '1136802597' },
  { label: 'Documento corto (6 dígitos)', name: 'Ana Ruiz', lastname: 'Soto', document: '904512' },
  { label: 'Nombre corto', name: 'Ana', lastname: 'Ríos', document: '80123456' },
];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const rgb01ToHex = (c: number[]): string => {
  const h = (v: number) => clamp(Math.round((v ?? 0) * 255), 0, 255).toString(16).padStart(2, '0');
  return `#${h(c?.[0])}${h(c?.[1])}${h(c?.[2])}`;
};
const hexToRgb01 = (hex: string): number[] => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [1, 1, 1];
  const int = parseInt(m[1], 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
};
const cssColor = (c: number[]) =>
  `rgb(${Math.round((c?.[0] ?? 0) * 255)}, ${Math.round((c?.[1] ?? 0) * 255)}, ${Math.round((c?.[2] ?? 0) * 255)})`;

const inputStyle: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 8, padding: '8px 10px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 13,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = {
  fontFamily: 'Oxanium, sans-serif', fontSize: 10, fontWeight: 700,
  letterSpacing: '.08em', textTransform: 'uppercase', color: MUTE,
};

/* ── botones reutilizables ── */
const btn = (variant: 'primary' | 'ghost' | 'danger', extra: React.CSSProperties = {}): React.CSSProperties => {
  const base: React.CSSProperties = {
    border: 'none', borderRadius: 10, cursor: 'pointer',
    fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 12,
    padding: '9px 16px', display: 'inline-flex', alignItems: 'center', gap: 8,
    transition: 'transform .12s ease, opacity .12s ease, background .12s ease',
  };
  if (variant === 'primary') return { ...base, background: NEON, color: INK, ...extra };
  if (variant === 'danger') return { ...base, background: 'rgba(255,80,80,.1)', color: '#ff8a8a', border: `1px solid rgba(255,80,80,.3)`, ...extra };
  return { ...base, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.8)', border: `1px solid ${LINE2}`, ...extra };
};

function NumField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={lbl}>{label}</span>
      <div style={{ position: 'relative' }}>
        <input style={inputStyle} type="number" value={value ?? 0}
          onChange={e => onChange(Number(e.target.value))} />
        {suffix && <span style={{ position: 'absolute', right: 10, top: 8, fontSize: 11, color: MUTE, pointerEvents: 'none' }}>{suffix}</span>}
      </div>
    </div>
  );
}

const dpadBtn: React.CSSProperties = {
  background: 'rgba(4,238,98,.1)', color: NEON, border: `1px solid rgba(4,238,98,.35)`,
  borderRadius: 8, cursor: 'pointer', fontSize: 18, fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  userSelect: 'none', transition: 'background .12s ease',
};

type ElKey = 'qrCode' | 'name' | 'document';
const EL_LABEL: Record<ElKey, string> = { qrCode: 'QR', name: 'Nombre', document: 'Documento' };

export default function TicketTemplateEditor({
  value,
  onChange,
}: {
  value?: TicketTemplate | null;
  onChange: (t: TicketTemplate | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<ElKey>('name');
  const [step, setStep] = useState(1); // paso de movimiento (pt) para el D-pad
  // Probar boleto
  const [testMode, setTestMode] = useState<'manual' | 'example'>('example');
  const [testName, setTestName] = useState('');
  const [testLast, setTestLast] = useState('');
  const [testDoc, setTestDoc] = useState('');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [dlErr, setDlErr] = useState('');

  const drag = useRef<{ key: ElKey; lastX: number; lastY: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const bgUrl = localPreview || value?.background || '';

  if (!value) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={lbl}>Plantilla del boleto</span>
        <p style={{ margin: 0, fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
          Sin plantilla propia: esta localidad usa el diseño por defecto del sistema.
        </p>
        <button type="button" onClick={() => onChange(DEFAULT_TEMPLATE)}
          style={btn('ghost', { alignSelf: 'flex-start', color: NEON, borderColor: 'rgba(4,238,98,.4)' })}>
          + Configurar plantilla
        </button>
      </div>
    );
  }

  const els = value.elements;
  const set = (patch: Partial<TicketTemplate>) => onChange({ ...value, ...patch });
  const setEl = (key: ElKey, patch: Record<string, unknown>) =>
    onChange({ ...value, elements: { ...els, [key]: { ...els[key], ...patch } } });

  const handleUpload = async (file: File) => {
    const local = URL.createObjectURL(file);
    setLocalPreview(prev => { if (prev) URL.revokeObjectURL(prev); return local; });
    setUploading(true); setErr('');
    try {
      const { url } = await uploadTicketBackground(file);
      set({ background: url });
    } catch {
      setErr('No se pudo subir la imagen (revisa tu sesión o el tamaño).');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTest = async () => {
    if (!value.background) { setDlErr('Sube primero una imagen de fondo.'); return; }
    const data = testMode === 'example'
      ? TEST_EXAMPLES[exampleIdx]
      : { name: testName.trim(), lastname: testLast.trim(), document: testDoc.trim() };
    if (!data.name || !data.document) { setDlErr('Faltan nombre y documento.'); return; }
    setDownloading(true); setDlErr('');
    try {
      await downloadTicketPreview({ template: value, name: data.name, lastname: data.lastname || undefined, document: data.document });
    } catch {
      setDlErr('No se pudo generar el boleto (revisa tu sesión).');
    } finally {
      setDownloading(false);
    }
  };

  // ── mover un elemento (compartido por drag y flechas) ──
  const moveEl = (key: ElKey, dxPdf: number, dyPdf: number) => {
    const el = els[key] as { x: number; y: number; align?: string };
    const patch: Record<string, number> = { y: Math.round(clamp(el.y + dyPdf, 0, IMG_H)) };
    if (!(key !== 'qrCode' && el.align === 'center')) {
      patch.x = Math.round(clamp(el.x + dxPdf, 0, IMG_W));
    }
    setEl(key, patch);
  };

  // ── Drag (pointer) ──
  const onDragStart = (key: ElKey) => (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { key, lastX: e.clientX, lastY: e.clientY };
    setSelected(key);
    stageRef.current?.focus();
    e.preventDefault();
  };
  const onDragMove = (key: ElKey) => (e: React.PointerEvent) => {
    if (drag.current?.key !== key) return;
    moveEl(key, (e.clientX - drag.current.lastX) / SCALE, -(e.clientY - drag.current.lastY) / SCALE);
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
  };
  const onDragEnd = () => { drag.current = null; };

  // ── Flechas ──
  const onStageKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    let dx = 0, dy = 0;
    if (e.key === 'ArrowLeft') dx = -step;
    else if (e.key === 'ArrowRight') dx = step;
    else if (e.key === 'ArrowUp') dy = step;      // PDF y hacia arriba
    else if (e.key === 'ArrowDown') dy = -step;
    else return;
    e.preventDefault();
    moveEl(selected, dx, dy);
  };

  // ── posiciones en pantalla ──
  const qr = els.qrCode;
  const qrBox: React.CSSProperties = {
    position: 'absolute', left: qr.x * SCALE, top: PREVIEW_H - (qr.y + qr.height) * SCALE,
    width: qr.width * SCALE, height: qr.height * SCALE,
  };
  const textBox = (key: 'name' | 'document'): React.CSSProperties => {
    const el = els[key];
    const center = el.align === 'center';
    return {
      position: 'absolute', bottom: el.y * SCALE,
      left: center ? 0 : el.x * SCALE, right: center ? 0 : undefined,
      textAlign: center ? 'center' : 'left',
      fontSize: Math.max(7, el.size * SCALE), lineHeight: 1,
      color: cssColor(el.color), fontFamily: 'Garet, Oxanium, sans-serif', fontWeight: 800,
      whiteSpace: 'nowrap', textShadow: '0 0 2px rgba(0,0,0,.4)',
    };
  };
  const chrome = (key: ElKey): React.CSSProperties => ({
    cursor: 'grab', touchAction: 'none',
    outline: `${selected === key ? 2 : 1}px ${selected === key ? 'solid' : 'dashed'} ${selected === key ? NEON : 'rgba(4,238,98,.5)'}`,
    outlineOffset: 2,
    boxShadow: selected === key ? `0 0 0 3px rgba(4,238,98,.18)` : 'none',
  });

  const sample = { name: 'NOMBRE APELLIDO', document: '1.234.567.890' };

  return (
    <div style={{ background: PANEL2, border: `1px solid ${LINE2}`, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ ...lbl, color: '#fff', fontSize: 12 }}>Plantilla del boleto</span>
        <button type="button" onClick={() => onChange(null)} style={btn('danger', { padding: '6px 12px' })}>
          Quitar plantilla
        </button>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* ── Preview ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={lbl}>Vista previa</span>
            {/* selector de elemento */}
            <div style={{ display: 'flex', gap: 4, background: INK, borderRadius: 8, padding: 3, border: `1px solid ${LINE2}` }}>
              {(['qrCode', 'name', 'document'] as ElKey[]).map(k => (
                <button key={k} type="button" onClick={() => { setSelected(k); stageRef.current?.focus(); }}
                  style={{ border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 11, padding: '4px 9px',
                    background: selected === k ? NEON : 'transparent', color: selected === k ? INK : MUTE }}>
                  {EL_LABEL[k]}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={stageRef}
            tabIndex={0}
            onKeyDown={onStageKeyDown}
            style={{
              position: 'relative', width: PREVIEW_W, height: PREVIEW_H,
              borderRadius: 10, overflow: 'hidden', border: `1px solid ${LINE2}`,
              background: INK, outline: 'none',
            }}
          >
            {bgUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bgUrl} alt="fondo boleto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                Sube una imagen de fondo
              </div>
            )}

            {/* QR */}
            <div onPointerDown={onDragStart('qrCode')} onPointerMove={onDragMove('qrCode')} onPointerUp={onDragEnd}
              style={{ ...qrBox, ...chrome('qrCode'), background: 'rgba(4,238,98,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontFamily: 'Oxanium, sans-serif', fontWeight: 700 }}>
              QR
            </div>

            {/* guías de maxWidth */}
            {(['name', 'document'] as const).map(key => {
              const el = els[key];
              if (!el.maxWidth) return null;
              const center = el.align === 'center';
              return (
                <div key={`guide-${key}`} style={{
                  position: 'absolute', bottom: el.y * SCALE,
                  left: center ? (IMG_W / 2 - el.maxWidth / 2) * SCALE : el.x * SCALE,
                  width: el.maxWidth * SCALE, height: 0,
                  borderTop: '1px dashed rgba(255,176,32,.85)', pointerEvents: 'none',
                }} />
              );
            })}

            {/* Nombre */}
            <div onPointerDown={onDragStart('name')} onPointerMove={onDragMove('name')} onPointerUp={onDragEnd}
              style={{ ...textBox('name'), ...chrome('name') }}>
              {sample.name}
            </div>
            {/* Documento */}
            <div onPointerDown={onDragStart('document')} onPointerMove={onDragMove('document')} onPointerUp={onDragEnd}
              style={{ ...textBox('document'), ...chrome('document') }}>
              {sample.document}
            </div>
          </div>

          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE, maxWidth: PREVIEW_W }}>
            Clic para seleccionar · <b style={{ color: '#fff' }}>arrastra</b> o usa las <b style={{ color: '#fff' }}>flechas</b> para mover (Shift = 10px). Fuente aproximada (real: Garet).
          </span>
        </div>

        {/* ── Controles ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minWidth: 240 }}>
          {/* Posición del elemento seleccionado (D-pad) */}
          <div style={{ background: INK, border: `1px solid rgba(4,238,98,.4)`, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ ...lbl, color: '#fff' }}>Mover · {EL_LABEL[selected]}</span>
              <div style={{ display: 'inline-flex', gap: 3, background: PANEL2, borderRadius: 8, padding: 3, border: `1px solid ${LINE2}` }}>
                {[1, 10].map(s => (
                  <button key={s} type="button" onClick={() => setStep(s)}
                    style={{ border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 11, padding: '3px 9px', background: step === s ? NEON : 'transparent', color: step === s ? INK : MUTE }}>
                    {s}pt
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 42px)', gridTemplateRows: 'repeat(3, 42px)', gap: 6, justifyContent: 'center' }}>
              <span />
              <button type="button" style={dpadBtn} onClick={() => moveEl(selected, 0, step)}>↑</button>
              <span />
              <button type="button" style={dpadBtn} onClick={() => moveEl(selected, -step, 0)}>←</button>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTE, fontSize: 15 }}>✛</span>
              <button type="button" style={dpadBtn} onClick={() => moveEl(selected, step, 0)}>→</button>
              <span />
              <button type="button" style={dpadBtn} onClick={() => moveEl(selected, 0, -step)}>↓</button>
              <span />
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE }}>
              Mueve el elemento seleccionado. También podés arrastrarlo en el preview o usar las flechas del teclado.
            </span>
          </div>

          {/* Fondo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={lbl}>Imagen de fondo (1080×1350)</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <label style={{ ...btn('ghost', { color: '#fff' }), cursor: uploading ? 'not-allowed' : 'pointer' }}>
                {uploading ? 'Subiendo…' : '⬆ Subir imagen'}
                <input type="file" accept="image/png,image/jpeg" hidden disabled={uploading}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }} />
              </label>
            </div>
            <input style={inputStyle} value={value.background} placeholder="o pega una URL de imagen"
              onChange={e => set({ background: e.target.value })} />
            {err && <span style={{ color: '#ff6b6b', fontSize: 12 }}>{err}</span>}
          </div>

          {/* QR (solo tamaño; posición por arrastre/flechas) */}
          <div style={{ background: INK, border: `1px solid ${selected === 'qrCode' ? 'rgba(4,238,98,.4)' : LINE}`, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ ...lbl, color: '#fff' }}>Código QR — tamaño</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <NumField label="Ancho" value={qr.width} onChange={v => setEl('qrCode', { width: v })} suffix="pt" />
              <NumField label="Alto" value={qr.height} onChange={v => setEl('qrCode', { height: v })} suffix="pt" />
            </div>
          </div>

          {/* Nombre / Documento (tamaño, alineación, color, ancho máx; sin X/Y) */}
          {(['name', 'document'] as const).map(key => {
            const el = els[key];
            return (
              <div key={key} style={{ background: INK, border: `1px solid ${selected === key ? 'rgba(4,238,98,.4)' : LINE}`, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ ...lbl, color: '#fff' }}>{key === 'name' ? 'Nombre' : 'Documento'}</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignItems: 'end' }}>
                  <NumField label="Tamaño" value={el.size} onChange={v => setEl(key, { size: v })} suffix="pt" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={lbl}>Alineación</span>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={el.align}
                      onChange={e => setEl(key, { align: e.target.value })}>
                      <option value="left">Izquierda</option>
                      <option value="center">Centro</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignItems: 'end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={lbl}>Color</span>
                    <input type="color" value={rgb01ToHex(el.color)} onChange={e => setEl(key, { color: hexToRgb01(e.target.value) })}
                      style={{ ...inputStyle, padding: 2, height: 34, cursor: 'pointer' }} />
                  </div>
                  <NumField label="Ancho máx" value={el.maxWidth ?? 0} onChange={v => setEl(key, { maxWidth: v || undefined })} suffix="pt" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Probar boleto ── */}
      <div style={{ background: INK, border: `1px solid ${LINE2}`, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ ...lbl, color: '#fff', fontSize: 11 }}>Probar boleto</span>

        {/* toggle segmentado */}
        <div style={{ display: 'inline-flex', gap: 4, background: PANEL2, borderRadius: 10, padding: 4, border: `1px solid ${LINE2}`, alignSelf: 'flex-start' }}>
          {(['example', 'manual'] as const).map(m => (
            <button key={m} type="button" onClick={() => { setTestMode(m); setDlErr(''); }}
              style={{ border: 'none', borderRadius: 7, cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 12, padding: '7px 16px',
                background: testMode === m ? NEON : 'transparent', color: testMode === m ? INK : MUTE }}>
              {m === 'example' ? 'Ejemplo' : 'Manual'}
            </button>
          ))}
        </div>

        {testMode === 'example' ? (
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={exampleIdx} onChange={e => setExampleIdx(Number(e.target.value))}>
            {TEST_EXAMPLES.map((ex, i) => (
              <option key={i} value={i}>{ex.label} — {ex.name} {ex.lastname} · {ex.document}</option>
            ))}
          </select>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={lbl}>Nombre</span>
              <input style={inputStyle} value={testName} onChange={e => setTestName(e.target.value)} placeholder="Juan Carlos" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={lbl}>Apellido</span>
              <input style={inputStyle} value={testLast} onChange={e => setTestLast(e.target.value)} placeholder="Pérez Gómez" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={lbl}>Documento</span>
              <input style={inputStyle} value={testDoc} onChange={e => setTestDoc(e.target.value)} placeholder="1234567890" />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={handleDownloadTest} disabled={downloading || !value.background}
            style={btn('primary', { opacity: (downloading || !value.background) ? .55 : 1, cursor: (downloading || !value.background) ? 'not-allowed' : 'pointer', fontSize: 13, padding: '11px 20px' })}>
            {downloading ? 'Generando…' : '⬇ Descargar boleto de prueba'}
          </button>
          {dlErr && <span style={{ color: '#ff6b6b', fontSize: 12 }}>{dlErr}</span>}
        </div>
      </div>

      <p style={{ margin: 0, fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE }}>
        La posición se ajusta visualmente (arrastre/flechas); tamaños y demás, con los campos. El preview es una guía: genera un boleto de prueba para confirmar.
      </p>
    </div>
  );
}
