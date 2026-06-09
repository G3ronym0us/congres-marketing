'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  getLocalidadTypes,
  createLocalidadType,
  updateLocalidadType,
  deleteLocalidadType,
} from '@/services/localidadTypes';
import { LocalidadType, CreateLocalidadTypeInput } from '@/types/localidadTypes';

/* ── design tokens ── */
const INK    = '#1A1418';
const PANEL  = '#2A2228';
const PANEL2 = '#332A30';
const NEON   = '#04EE62';
const LINE   = 'rgba(255,255,255,.08)';
const LINE2  = 'rgba(255,255,255,.14)';
const MUTE   = 'rgba(255,255,255,.45)';
const MUTE2  = 'rgba(255,255,255,.28)';

const fmt = (n: number) =>
  n === 0
    ? 'Gratis'
    : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const EMPTY: CreateLocalidadTypeInput = {
  slug: '', name: '', price: 0, icon: '🎫',
  features: [], withMemories: false, active: true, pushable: true, sortOrder: 0,
};

/* ── emoji catalog ── */
const ICON_GROUPS = [
  {
    label: 'Entradas',
    icons: ['🎫', '🎟️', '🏷️', '🎪', '🎭', '🎬', '🎤', '🎙️', '🎧', '🎼'],
  },
  {
    label: 'Categoría',
    icons: ['💎', '🟣', '🔵', '🟢', '🟡', '🟠', '🔴', '⭐', '🌟', '✨'],
  },
  {
    label: 'Personas',
    icons: ['👑', '🤝', '👥', '👤', '🙋', '🧑‍💼', '👔', '🎓', '🏆', '🥇'],
  },
  {
    label: 'Tecnología',
    icons: ['🌐', '📡', '💻', '📱', '🖥️', '📺', '📡', '🔗', '📶', '🛜'],
  },
  {
    label: 'Eventos',
    icons: ['🎉', '🎊', '🥂', '🍾', '🎆', '🎇', '☕', '🍵', '🥐', '🍽️'],
  },
  {
    label: 'Otros',
    icons: ['📀', '💿', '📸', '📷', '🖼️', '🎨', '📋', '📌', '📎', '🔖'],
  },
];

/* ── icon picker popover ── */
function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: INK, border: `1px solid ${open ? 'rgba(4,238,98,.4)' : LINE2}`,
          borderRadius: 10, padding: '9px 14px', cursor: 'pointer',
          width: '100%', transition: 'border-color .15s',
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>{value || '🎫'}</span>
        <span style={{ color: MUTE, fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, flex: 1, textAlign: 'left' }}>
          {open ? 'Cerrar selector' : 'Cambiar ícono'}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ width: 14, height: 14, color: MUTE, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Popover */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 100,
          background: PANEL2, border: `1px solid ${LINE2}`,
          borderRadius: 14, padding: 14,
          boxShadow: '0 16px 40px rgba(0,0,0,.6)',
          maxHeight: 340, overflowY: 'auto',
        }}>
          {ICON_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 12 }}>
              <div style={{
                fontFamily: 'Oxanium, sans-serif', fontSize: 10, fontWeight: 700,
                letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE2,
                marginBottom: 6,
              }}>
                {group.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {group.icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => { onChange(icon); setOpen(false); }}
                    title={icon}
                    style={{
                      fontSize: 22, lineHeight: 1,
                      width: 40, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 8, cursor: 'pointer',
                      border: value === icon ? `2px solid ${NEON}` : '2px solid transparent',
                      background: value === icon ? 'rgba(4,238,98,.1)' : 'rgba(255,255,255,.04)',
                      transition: 'background .15s, border-color .15s',
                    }}
                    onMouseEnter={e => {
                      if (value !== icon)
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.1)';
                    }}
                    onMouseLeave={e => {
                      if (value !== icon)
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.04)';
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── modal ── */
function LocalidadModal({
  initial,
  onSave,
  onClose,
}: {
  initial: CreateLocalidadTypeInput & { id?: number };
  onSave: (data: CreateLocalidadTypeInput & { id?: number }) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CreateLocalidadTypeInput & { id?: number }>(initial);
  const [featuresText, setFeaturesText] = useState((initial.features ?? []).join('\n'));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof CreateLocalidadTypeInput, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      const features = featuresText
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
      await onSave({ ...form, features });
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErr(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, children: React.ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
        {label}
      </label>
      {children}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    background: INK, color: '#fff', border: `1px solid ${LINE2}`,
    borderRadius: 10, padding: '10px 14px',
    fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
    outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{
        position: 'relative', zIndex: 1, background: PANEL, border: `1px solid ${LINE}`,
        borderRadius: 20, padding: '28px 28px 24px', width: '100%', maxWidth: 520,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,.6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            {form.id ? 'Editar localidad' : 'Nueva localidad'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Slug */}
          {field('Slug *',
            <input style={inputStyle} required value={form.slug}
              onChange={e => set('slug', e.target.value)} placeholder="ej: vip" />
          )}

          {/* Nombre */}
          {field('Nombre *',
            <input style={inputStyle} required value={form.name}
              onChange={e => set('name', e.target.value)} placeholder="Nombre de la localidad" />
          )}

          {/* Ícono visual */}
          {field('Ícono',
            <IconPicker value={form.icon ?? '🎫'} onChange={v => set('icon', v)} />
          )}

          {/* Precio + Orden */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('Precio (COP)',
              <input style={inputStyle} type="number" min={0} value={form.price}
                onChange={e => set('price', Number(e.target.value))} />
            )}
            {field('Orden',
              <input style={inputStyle} type="number" min={0} value={form.sortOrder ?? 0}
                onChange={e => set('sortOrder', Number(e.target.value))} />
            )}
          </div>

          {/* Beneficios */}
          {field('Beneficios (uno por línea)',
            <textarea
              style={{ ...inputStyle, minHeight: 110, resize: 'vertical' } as React.CSSProperties}
              value={featuresText}
              onChange={e => setFeaturesText(e.target.value)}
              placeholder={'Ingreso a conferencias\nCertificación digital'}
            />
          )}

          {/* Toggles */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {([
              ['withMemories', 'Incluye memorias'],
              ['pushable',     'Disponible en compra'],
              ['active',       'Activa'],
            ] as [keyof CreateLocalidadTypeInput, string][]).map(([k, lbl]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
                <input
                  type="checkbox"
                  checked={!!form[k]}
                  onChange={e => set(k, e.target.checked)}
                  style={{ accentColor: NEON, width: 16, height: 16 }}
                />
                {lbl}
              </label>
            ))}
          </div>

          {err && <p style={{ color: '#ff6b6b', fontSize: 12, margin: 0 }}>{err}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: saving ? .7 : 1 }}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── main component ── */
export default function LocalidadesAdmin() {
  const [items, setItems] = useState<LocalidadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<(CreateLocalidadTypeInput & { id?: number }) | null>(null);
  const [toast, setToast] = useState('');
  const toastRef = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 3000);
  };

  const load = async () => {
    setLoading(true);
    try { setItems(await getLocalidadTypes()); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: CreateLocalidadTypeInput & { id?: number }) => {
    if (data.id) {
      const { id, ...rest } = data;
      await updateLocalidadType(id, rest);
      showToast('Localidad actualizada');
    } else {
      await createLocalidadType(data);
      showToast('Localidad creada');
    }
    setModal(null);
    load();
  };

  const handleDelete = async (item: LocalidadType) => {
    if (!confirm(`¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`)) return;
    await deleteLocalidadType(item.id);
    showToast('Localidad eliminada');
    load();
  };

  const handleToggle = async (item: LocalidadType) => {
    await updateLocalidadType(item.id, { active: !item.active });
    showToast(item.active ? 'Localidad desactivada' : 'Localidad activada');
    load();
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            Localidades
          </h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            Tipos de entrada disponibles en el evento
          </p>
        </div>
        <button onClick={() => setModal({ ...EMPTY })} className="adm-btn neon">
          + Nueva localidad
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: PANEL, border: `1px solid ${item.active ? LINE2 : LINE}`,
              borderRadius: 14, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
              opacity: item.active ? 1 : .5,
              transition: 'opacity .2s',
            }}>
              <div style={{ fontSize: 26, flexShrink: 0, minWidth: 36, textAlign: 'center' }}>{item.icon}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                    {item.name}
                  </span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE2, background: 'rgba(255,255,255,.06)', borderRadius: 6, padding: '2px 8px' }}>
                    {item.slug}
                  </span>
                  {!item.active && (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#ff6b6b', background: 'rgba(255,80,80,.1)', borderRadius: 6, padding: '2px 8px' }}>
                      Inactiva
                    </span>
                  )}
                  {item.withMemories && (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: NEON, background: 'rgba(4,238,98,.1)', borderRadius: 6, padding: '2px 8px' }}>
                      📀 Memorias
                    </span>
                  )}
                  {!item.pushable && (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE2, background: 'rgba(255,255,255,.06)', borderRadius: 6, padding: '2px 8px' }}>
                      Cortesía
                    </span>
                  )}
                </div>
                <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {(item.features ?? []).slice(0, 2).join(' · ')}
                  {(item.features ?? []).length > 2 && ` · +${(item.features ?? []).length - 2} más`}
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 17, color: item.price === 0 ? NEON : '#fff' }}>
                  {fmt(item.price)}
                </div>
                <div style={{ fontSize: 11, color: MUTE2, fontFamily: 'Space Grotesk, sans-serif' }}>orden #{item.sortOrder}</div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => handleToggle(item)} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                  {item.active ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => setModal({
                    id: item.id,
                    slug: item.slug, name: item.name, price: item.price,
                    icon: item.icon, features: item.features, withMemories: item.withMemories,
                    active: item.active, pushable: item.pushable, sortOrder: item.sortOrder,
                  })}
                  className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}
                >
                  Editar
                </button>
                <button onClick={() => handleDelete(item)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 12px' }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
              No hay localidades configuradas. Crea la primera.
            </div>
          )}
        </div>
      )}

      {modal && (
        <LocalidadModal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: PANEL2, border: `1px solid rgba(4,238,98,.3)`,
          borderRadius: 12, padding: '12px 20px',
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff',
          boxShadow: '0 8px 32px rgba(0,0,0,.5)',
        }}>
          ✅ {toast}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
