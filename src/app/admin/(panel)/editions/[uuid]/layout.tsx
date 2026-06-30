'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useAdminEditions } from '@/context/AdminEditionsContext';

/* ── design tokens ── */
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const MUTE2 = 'rgba(255,255,255,.28)';

// Sub-recursos de una edición, ahora como rutas anidadas (cada uno deep-linkable).
// `seg` vacío = ruta índice (Resumen) en /admin/editions/[uuid].
const SUBS: { seg: string; label: string }[] = [
  { seg: '',                label: 'Resumen' },
  { seg: 'tickets',         label: 'Tickets' },
  { seg: 'lecturers',       label: 'Conferencistas' },
  { seg: 'localidades',     label: 'Localidades' },
  { seg: 'addons',          label: 'Add-ons' },
  { seg: 'discount-codes',  label: 'Códigos de descuento' },
  { seg: 'discount-stages', label: 'Etapas de descuento' },
  { seg: 'email',           label: 'Correo de compra' },
];

export default function EditionDetailLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const { editions } = useAdminEditions();

  const uuid = String(params?.uuid ?? '');
  const base = `/admin/editions/${uuid}`;
  const edition = editions.find((e) => e.uuid === uuid);

  const hrefFor = (seg: string) => (seg ? `${base}/${seg}` : base);
  const isActive = (seg: string) => pathname === hrefFor(seg);

  return (
    <div>
      {/* Header del detalle de edición */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
        <Link href="/admin/editions" className="adm-btn" style={{ fontSize: 12, padding: '6px 12px' }}>
          ← Ediciones
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            {edition?.name ?? 'Edición'}
          </h2>
          {edition && (
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE2, background: 'rgba(255,255,255,.06)', borderRadius: 6, padding: '2px 8px' }}>{edition.slug}</span>
          )}
          {edition?.salesOpen && <span style={{ fontSize: 11, color: NEON, background: 'rgba(4,238,98,.1)', borderRadius: 6, padding: '2px 8px' }}>En venta</span>}
        </div>
      </div>

      {/* Submenú de recursos (navegación por URL) */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, borderBottom: `1px solid ${LINE}`, paddingBottom: 14 }}>
        {SUBS.map((s) => (
          <Link
            key={s.seg || 'overview'}
            href={hrefFor(s.seg)}
            className={`adm-btn${isActive(s.seg) ? ' neon' : ''}`}
            style={{ fontSize: 12, padding: '7px 14px' }}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
