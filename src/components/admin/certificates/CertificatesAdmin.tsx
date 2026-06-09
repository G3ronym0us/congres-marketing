'use client';

import { useState, useEffect } from 'react';
import { getCertificateStatus, toggleCertificates } from '@/services/tickets';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const PANEL2= '#332A30';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

export default function CertificatesAdmin() {
  const [enabled, setEnabled]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const [toggling, setToggling]   = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    try {
      setLoading(true); setError(null);
      const res = await getCertificateStatus();
      setEnabled(res.enabled);
      setLastUpdated(new Date());
    } catch {
      setError('Error al cargar el estado de los certificados');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      setToggling(true); setError(null);
      const res = await toggleCertificates(!enabled);
      setEnabled(res.enabled);
      setLastUpdated(new Date());
    } catch {
      setError('Error al cambiar el estado de los certificados');
    } finally {
      setToggling(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            🏆 Gestión de Certificados
          </h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            Controla la disponibilidad de certificados de asistencia
          </p>
        </div>
        <button
          onClick={load} disabled={loading || toggling}
          className="adm-btn"
          style={{ fontSize: 12, opacity: (loading || toggling) ? .5 : 1, cursor: (loading || toggling) ? 'not-allowed' : 'pointer' }}
        >
          {loading ? '↻ Cargando…' : '↻ Actualizar'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,80,80,.08)', border: '1px solid rgba(255,80,80,.2)', borderRadius: 10, padding: '12px 16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#ff9999', marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Main panel */}
      <div style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 14, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
            <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* Estado + toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', background: PANEL2, border: `1px solid ${enabled ? 'rgba(4,238,98,.2)' : LINE}`, borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: enabled ? 'rgba(4,238,98,.12)' : 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  {enabled ? '✅' : '🏆'}
                </div>
                <div>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>
                    Estado de Certificados
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: enabled ? NEON : MUTE }}>
                    {enabled ? 'Habilitados' : 'Deshabilitados'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggle} disabled={toggling}
                style={{
                  padding: '11px 24px', borderRadius: 10, border: 'none', cursor: toggling ? 'not-allowed' : 'pointer',
                  background: enabled ? 'rgba(255,80,80,.15)' : NEON,
                  color: enabled ? '#ff6b6b' : INK,
                  fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13,
                  opacity: toggling ? .6 : 1,
                  transition: 'all .2s',
                  ...(enabled ? { border: '1px solid rgba(255,80,80,.3)' } : {}),
                }}
              >
                {toggling ? 'Cambiando…' : enabled ? 'Deshabilitar' : 'Habilitar'}
              </button>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: PANEL2, border: `1px solid rgba(4,238,98,.15)`, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 13, color: NEON, marginBottom: 10 }}>
                  Cuando están habilitados
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'Los usuarios pueden descargar sus certificados',
                    'Aparecen en la consulta de tickets',
                    'Se generan para tickets pagados',
                  ].map((t, i) => (
                    <li key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: 'rgba(255,255,255,.7)', display: 'flex', gap: 8 }}>
                      <span style={{ color: NEON, flexShrink: 0 }}>·</span>{t}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: PANEL2, border: `1px solid ${LINE2}`, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 13, color: MUTE, marginBottom: 10 }}>
                  Cuando están deshabilitados
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'No son visibles para los usuarios',
                    'No se pueden descargar certificados',
                    'Los existentes se mantienen',
                  ].map((t, i) => (
                    <li key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: 'rgba(255,255,255,.4)', display: 'flex', gap: 8 }}>
                      <span style={{ flexShrink: 0 }}>·</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Acciones adicionales */}
            <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 16 }}>
              <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE, marginBottom: 12 }}>
                Acciones adicionales
              </div>
              <button
                disabled={!enabled}
                className="adm-btn"
                style={{ fontSize: 12, opacity: enabled ? 1 : .4, cursor: enabled ? 'pointer' : 'not-allowed' }}
              >
                ⬇ Generar Certificados Masivos
              </button>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'rgba(255,255,255,.28)', marginTop: 8 }}>
                Solo disponible cuando los certificados están habilitados
              </div>
            </div>

            {/* Última actualización */}
            {lastUpdated && (
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'rgba(255,255,255,.28)', textAlign: 'center', borderTop: `1px solid ${LINE}`, paddingTop: 12 }}>
                Última actualización: {lastUpdated.toLocaleString('es-ES')}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
