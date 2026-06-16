'use client';

import React from 'react';
import { Edition } from '@/types/edition';

/**
 * Selector de edición reutilizable para las pantallas del panel que filtran por
 * edición. Está sincronizado con el selector global del dashboard (comparten el
 * mismo estado `viewEdition`).
 */
export default function EditionSelect({
  editions,
  editionId,
  onChange,
}: {
  editions: Edition[];
  editionId?: number;
  onChange?: (id: number) => void;
}) {
  if (!editions.length || !onChange) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
        Edición:
      </span>
      <select
        className="adm-btn"
        value={editionId ?? ''}
        onChange={e => onChange(parseInt(e.target.value, 10))}
        style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
        title="Filtrar por edición"
      >
        {editions.map(ed => (
          <option key={ed.id} value={ed.id} style={{ color: '#000' }}>
            {ed.name}
          </option>
        ))}
      </select>
    </div>
  );
}
