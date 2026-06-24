'use client';

import React, { useState, useRef } from 'react';
import { adminEditionService } from '@/services/editions';
import { Edition } from '@/types/edition';
import EditionForm, {
  EditionFormState,
  stripFormMeta,
  toLocalInput,
  toDateInput,
} from './EditionForm';
import DiscountStagesAdmin from './DiscountStagesAdmin';
import TicketsTable from '@/components/tickets/table';
import Lecturers from '@/components/admin/Lecturers';
import LocalidadesAdmin from '@/components/admin/LocalidadesAdmin';
import AddOnsAdmin from '@/components/admin/addOns/AddOnsAdmin';
import DiscountCodesAdmin from '@/components/admin/discountCodes/DiscountCodesAdmin';

/* ── design tokens ── */
const PANEL2 = '#332A30';
const NEON   = '#04EE62';
const LINE   = 'rgba(255,255,255,.08)';
const MUTE   = 'rgba(255,255,255,.45)';
const MUTE2  = 'rgba(255,255,255,.28)';

type SubTab =
  | 'overview' | 'tickets' | 'lecturers'
  | 'localidades' | 'addons' | 'discount-codes' | 'discount-stages';

const SUBS: { id: SubTab; label: string }[] = [
  { id: 'overview',        label: 'Resumen' },
  { id: 'tickets',         label: 'Tickets' },
  { id: 'lecturers',       label: 'Conferencistas' },
  { id: 'localidades',     label: 'Localidades' },
  { id: 'addons',          label: 'Add-ons' },
  { id: 'discount-codes',  label: 'Códigos de descuento' },
  { id: 'discount-stages', label: 'Etapas de descuento' },
];

// Edition -> estado del formulario de "Resumen" (misma forma que en EditionsAdmin)
const toFormState = (e: Edition): EditionFormState => ({
  id: e.id, slug: e.slug, name: e.name, year: e.year, country: e.country,
  city: e.city ?? '', venue: e.venue ?? '',
  iso: toLocalInput(e.display?.iso ?? e.eventStartDate),
  endDate: toDateInput(e.eventEndDate),
  display: e.display ?? undefined,
  status: e.status, salesOpen: e.salesOpen, visible: e.visible, sortOrder: e.sortOrder,
});

/**
 * Espacio de trabajo de una edición: submenú con sus recursos (resumen, tickets,
 * conferencistas, localidades, add-ons, códigos y etapas de descuento). El
 * contexto de edición es fijo, por eso los componentes hijos no muestran su
 * propio selector de edición.
 */
export default function EditionWorkspace({
  edition,
  editions,
  onBack,
  onChanged,
}: {
  edition: Edition;
  editions: Edition[];
  onBack: () => void;
  onChanged: () => void;
}) {
  const [sub, setSub] = useState<SubTab>('overview');
  const [toast, setToast] = useState('');
  const toastRef = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 3000);
  };

  const handleSaveOverview = async (data: EditionFormState) => {
    await adminEditionService.update(edition.id, stripFormMeta(data));
    showToast('Edición actualizada');
    onChanged();
  };

  return (
    <div>
      {/* Header del workspace */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
        <button onClick={onBack} type="button" className="adm-btn" style={{ fontSize: 12, padding: '6px 12px' }}>
          ← Ediciones
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            {edition.name}
          </h2>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE2, background: 'rgba(255,255,255,.06)', borderRadius: 6, padding: '2px 8px' }}>{edition.slug}</span>
          {edition.salesOpen && <span style={{ fontSize: 11, color: NEON, background: 'rgba(4,238,98,.1)', borderRadius: 6, padding: '2px 8px' }}>En venta</span>}
        </div>
      </div>

      {/* Submenú de recursos */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, borderBottom: `1px solid ${LINE}`, paddingBottom: 14 }}>
        {SUBS.map(s => (
          <button
            key={s.id}
            onClick={() => setSub(s.id)}
            className={`adm-btn${sub === s.id ? ' neon' : ''}`}
            style={{ fontSize: 12, padding: '7px 14px' }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Contenido del sub-tab activo */}
      {sub === 'overview' && (
        <EditionForm
          mode="edit"
          embedded
          initial={toFormState(edition)}
          onSave={handleSaveOverview}
          onBack={onBack}
        />
      )}
      {sub === 'tickets'         && <TicketsTable editionId={edition.id} editions={editions} />}
      {sub === 'lecturers'       && <Lecturers editionId={edition.id} editions={editions} />}
      {sub === 'localidades'     && <LocalidadesAdmin editionId={edition.id} editions={editions} />}
      {sub === 'addons'          && <AddOnsAdmin editionId={edition.id} editions={editions} />}
      {sub === 'discount-codes'  && <DiscountCodesAdmin editionId={edition.id} editions={editions} />}
      {sub === 'discount-stages' && <DiscountStagesAdmin editionId={edition.id} editions={editions} onChanged={onChanged} />}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: PANEL2, border: `1px solid rgba(4,238,98,.3)`, borderRadius: 12, padding: '12px 20px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,.5)' }}>
          ✅ {toast}
        </div>
      )}
    </div>
  );
}
