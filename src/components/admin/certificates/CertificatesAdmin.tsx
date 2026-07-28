'use client';

import { useState, useEffect } from 'react';
import { adminEditionService } from '@/services/editions';
import { Edition } from '@/types/edition';
import { editionHasEnded, formatEditionDateLong } from '@/utils/editionFormat';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const PANEL2= '#332A30';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

export default function CertificatesAdmin() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    try {
      setLoading(true); setError(null);
      setEditions(await adminEditionService.getAll());
      setLastUpdated(new Date());
    } catch {
      setError('Error al cargar las ediciones');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (e: Edition) => {
    try {
      setToggling(e.uuid); setError(null);
      await adminEditionService.setFlags(e.uuid, {
        certificatesEnabled: !e.certificatesEnabled,
      });
      await load();
    } catch {
      setError('Error al cambiar el estado de los certificados');
    } finally {
      setToggling(null);
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
            Los certificados se habilitan solos cuando la edición termina. Enciende el
            interruptor solo si necesitas liberarlos antes.
          </p>
        </div>
        <button
          onClick={load} disabled={loading || !!toggling}
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

      <div style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 14, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
            <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : editions.length === 0 ? (
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: MUTE, textAlign: 'center', padding: '24px 0' }}>
            No hay ediciones registradas.
          </div>
        ) : (
          <>
            {editions.map(e => {
              const pasado    = editionHasEnded(e);
              const disponible = pasado || e.certificatesEnabled;
              const busy = toggling === e.uuid;
              return (
                <div key={e.uuid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', background: PANEL2, border: `1px solid ${disponible ? 'rgba(4,238,98,.2)' : LINE}`, borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: disponible ? 'rgba(4,238,98,.12)' : 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                      {disponible ? '✅' : '🔒'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>
                        {e.name}
                      </div>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: disponible ? NEON : MUTE }}>
                        {pasado
                          ? 'Disponibles · la edición ya terminó'
                          : e.certificatesEnabled
                            ? 'Disponibles · liberados manualmente'
                            : 'Bloqueados · la edición aún no termina'}
                      </div>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: 'rgba(255,255,255,.28)', marginTop: 2 }}>
                        {formatEditionDateLong(e) || 'Sin fecha definida'}
                      </div>
                    </div>
                  </div>

                  {/* Cuando la edición ya pasó el flag es irrelevante: no se ofrece. */}
                  {pasado ? (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
                      Habilitados automáticamente
                    </span>
                  ) : (
                    <button
                      onClick={() => handleToggle(e)} disabled={busy}
                      style={{
                        padding: '11px 24px', borderRadius: 10, border: 'none', cursor: busy ? 'not-allowed' : 'pointer',
                        background: e.certificatesEnabled ? 'rgba(255,80,80,.15)' : NEON,
                        color: e.certificatesEnabled ? '#ff6b6b' : INK,
                        fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13,
                        opacity: busy ? .6 : 1,
                        transition: 'all .2s',
                        ...(e.certificatesEnabled ? { border: '1px solid rgba(255,80,80,.3)' } : {}),
                      }}
                    >
                      {busy ? 'Cambiando…' : e.certificatesEnabled ? 'Bloquear' : 'Liberar ahora'}
                    </button>
                  )}
                </div>
              );
            })}

            {/* Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: PANEL2, border: `1px solid rgba(4,238,98,.15)`, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 13, color: NEON, marginBottom: 10 }}>
                  Cuando están disponibles
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'El asistente lo descarga desde su página de boleto',
                    'Aparece la acción de descarga en la tabla de tickets',
                    'Se puede adjuntar en los correos masivos',
                  ].map((t, i) => (
                    <li key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: 'rgba(255,255,255,.7)', display: 'flex', gap: 8 }}>
                      <span style={{ color: NEON, flexShrink: 0 }}>·</span>{t}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: PANEL2, border: `1px solid ${LINE2}`, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 13, color: MUTE, marginBottom: 10 }}>
                  Cuando están bloqueados
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'La descarga responde 403, también desde el panel',
                    'El boleto del asistente no muestra el certificado',
                    'Los ya generados se conservan en S3',
                  ].map((t, i) => (
                    <li key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: 'rgba(255,255,255,.4)', display: 'flex', gap: 8 }}>
                      <span style={{ flexShrink: 0 }}>·</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

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
