'use client';

import React, { useState, useEffect, useRef } from 'react';
import { adminAddOnService } from '@/services/addOns';
import { AddOn, CreateAddOnInput } from '@/types/addOn';
import { Edition } from '@/types/edition';
import EditionSelect from '@/components/admin/EditionSelect';
import ModalShell, { confirmDiscard } from '@/components/admin/ModalShell';

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

const EMPTY: CreateAddOnInput = {
  edition: 0, slug: '', name: '', description: '', price: 0, icon: '📀', active: true, sortOrder: 0,
};

const inputStyle: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: '10px 14px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

function AddOnModal({
  initial,
  onSave,
  onClose,
}: {
  initial: CreateAddOnInput & { id?: number; uuid?: string };
  onSave: (data: CreateAddOnInput & { id?: number; uuid?: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof CreateAddOnInput, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      await onSave(form);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setErr(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);
  const handleClose = async () => {
    if (isDirty && !(await confirmDiscard())) return;
    onClose();
  };

  const field = (label: string, children: React.ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <ModalShell onClose={handleClose} maxWidth={500}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
          {form.id ? 'Editar add-on' : 'Nuevo add-on'}
        </h3>
        <button onClick={handleClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {field('Slug *',
          <input style={inputStyle} required value={form.slug}
            onChange={e => set('slug', e.target.value)} placeholder="ej: memorias" />
        )}
        {field('Nombre *',
          <input style={inputStyle} required value={form.name}
            onChange={e => set('name', e.target.value)} placeholder="Memorias del Evento" />
        )}
        {field('Descripción',
          <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' } as React.CSSProperties}
            value={form.description ?? ''} onChange={e => set('description', e.target.value)} />
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {field('Precio (COP)',
            <input style={inputStyle} type="number" min={0} value={form.price}
              onChange={e => set('price', Number(e.target.value))} />
          )}
          {field('Ícono',
            <input style={inputStyle} value={form.icon ?? ''} maxLength={4}
              onChange={e => set('icon', e.target.value)} />
          )}
          {field('Orden',
            <input style={inputStyle} type="number" min={0} value={form.sortOrder ?? 0}
              onChange={e => set('sortOrder', Number(e.target.value))} />
          )}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
          <input type="checkbox" checked={!!form.active} onChange={e => set('active', e.target.checked)} style={{ accentColor: NEON, width: 16, height: 16 }} />
          Activo
        </label>

        {err && <p style={{ color: '#ff6b6b', fontSize: 12, margin: 0 }}>{err}</p>}

        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <button type="button" onClick={handleClose}
            style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: saving ? .7 : 1 }}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export default function AddOnsAdmin({
  editionId,
  editions = [],
  onEditionChange,
}: {
  editionId?: number;
  editions?: Edition[];
  onEditionChange?: (id: number) => void;
}) {
  const [items, setItems] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<(CreateAddOnInput & { id?: number; uuid?: string }) | null>(null);
  const [toast, setToast] = useState('');
  const toastRef = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 3000);
  };

  const load = async () => {
    if (!editionId) { setItems([]); setLoading(false); return; }
    setLoading(true);
    try { setItems(await adminAddOnService.getAll(editionId)); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [editionId]);

  const handleSave = async (data: CreateAddOnInput & { id?: number; uuid?: string }) => {
    if (data.uuid) {
      const { id, uuid, ...rest } = data;
      await adminAddOnService.update(data.uuid!, rest);
      showToast('Add-on actualizado');
    } else {
      await adminAddOnService.create({ ...data, edition: editionId! });
      showToast('Add-on creado');
    }
    setModal(null);
    load();
  };

  const handleDelete = async (item: AddOn) => {
    if (!confirm(`¿Eliminar el add-on "${item.name}"? Se quitará de las localidades que lo ofrecen.`)) return;
    await adminAddOnService.remove(item.uuid);
    showToast('Add-on eliminado');
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>Add-ons</h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            Complementos que las localidades pueden ofrecer (incluidos u opcionales).
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <EditionSelect editions={editions} editionId={editionId} onChange={onEditionChange} />
          <button onClick={() => setModal({ ...EMPTY, edition: editionId ?? 0 })} className="adm-btn neon" disabled={!editionId}>
            + Nuevo add-on
          </button>
        </div>
      </div>

      {!editionId && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          Selecciona una edición para gestionar sus add-ons.
        </div>
      )}

      {editionId && loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : editionId ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: PANEL, border: `1px solid ${item.active ? LINE2 : LINE}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', opacity: item.active ? 1 : .5 }}>
              <div style={{ fontSize: 26, flexShrink: 0, minWidth: 36, textAlign: 'center' }}>{item.icon}</div>
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>{item.name}</span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE2, background: 'rgba(255,255,255,.06)', borderRadius: 6, padding: '2px 8px' }}>{item.slug}</span>
                  {!item.active && <span style={{ fontSize: 11, color: '#ff6b6b', background: 'rgba(255,80,80,.1)', borderRadius: 6, padding: '2px 8px' }}>Inactivo</span>}
                </div>
                {item.description && (
                  <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>{item.description}</div>
                )}
              </div>
              <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 17, color: item.price === 0 ? NEON : '#fff', flexShrink: 0 }}>
                {fmt(item.price)}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                <button onClick={() => setModal({ id: item.id, uuid: item.uuid, edition: item.edition, slug: item.slug, name: item.name, description: item.description ?? '', price: item.price, icon: item.icon, active: item.active, sortOrder: item.sortOrder })} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
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
              No hay add-ons en esta edición. Crea el primero.
            </div>
          )}
        </div>
      ) : null}

      {modal && (
        <AddOnModal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: PANEL2, border: `1px solid rgba(4,238,98,.3)`, borderRadius: 12, padding: '12px 20px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,.5)' }}>
          ✅ {toast}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
