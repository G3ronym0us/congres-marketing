'use client';

import React from 'react';
import ModalShell from '@/components/admin/ModalShell';

const INK   = '#1A1418';
const LINE  = 'rgba(255,255,255,.09)';
const MUTE  = 'rgba(255,255,255,.45)';
const NEON  = '#04EE62';

/* ── Overlay + card shell ── */
export function DarkModal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <ModalShell onClose={onClose} maxWidth={460}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            {title}
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: `1px solid ${LINE}`, borderRadius: 8,
            padding: '5px 9px', cursor: 'pointer', color: MUTE,
            display: 'inline-flex', alignItems: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {children}
    </ModalShell>
  );
}

/* ── Field wrapper ── */
export function DarkField({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: 11, color: '#ff6b6b' }}>{error}</span>
      )}
    </div>
  );
}

/* ── Dark input ── */
export const DarkInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }>(
  ({ hasError, style, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      style={{
        background: INK, color: '#fff',
        border: `1px solid ${hasError ? 'rgba(255,80,80,.5)' : LINE}`,
        borderRadius: 10, padding: '10px 14px',
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
        outline: 'none', width: '100%', boxSizing: 'border-box',
        ...style,
      }}
      onFocus={e => { e.target.style.borderColor = hasError ? 'rgba(255,80,80,.8)' : 'rgba(4,238,98,.4)'; }}
      onBlur={e => { e.target.style.borderColor = hasError ? 'rgba(255,80,80,.5)' : LINE; }}
    />
  ),
);
DarkInput.displayName = 'DarkInput';

/* ── Dark select ── */
export const DarkSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ style, children, ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      style={{
        background: INK, color: '#fff',
        border: `1px solid ${LINE}`,
        borderRadius: 10, padding: '10px 14px',
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
        outline: 'none', width: '100%', boxSizing: 'border-box',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </select>
  ),
);
DarkSelect.displayName = 'DarkSelect';

/* ── Memories toggle ── */
export function MemoriesToggle({ checked, disabled, onToggle }: {
  checked: boolean; disabled: boolean; onToggle: () => void;
}) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={!disabled ? onToggle : undefined}
      onKeyPress={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) onToggle(); }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
        border: `1px solid ${checked && !disabled ? 'rgba(4,238,98,.3)' : LINE}`,
        background: checked && !disabled ? 'rgba(4,238,98,.07)' : 'rgba(255,255,255,.03)',
        opacity: disabled ? .4 : 1,
        transition: 'all .2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16 }}>📀</span>
        <div>
          <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 13, fontWeight: 600, color: checked && !disabled ? NEON : '#fff' }}>
            Memorias del evento
          </div>
          {disabled && (
            <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>No disponible para tickets gratuitos</div>
          )}
        </div>
      </div>
      {/* Toggle pill */}
      <div style={{
        width: 40, height: 22, borderRadius: 100,
        background: checked && !disabled ? NEON : 'rgba(255,255,255,.12)',
        position: 'relative', transition: 'background .2s', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 3, left: checked ? 20 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: checked && !disabled ? '#1A1418' : 'rgba(255,255,255,.6)',
          transition: 'left .2s',
        }} />
      </div>
    </div>
  );
}
