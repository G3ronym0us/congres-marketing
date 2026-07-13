'use client';

import ModalShell from '@/components/admin/ModalShell';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { adminAsociadoService } from '@/services/asociado';
import { Asociado, AsociadoLead } from '@/types/asociado';

/* ── design tokens ── */
const PANEL = '#2A2228';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const MUTE  = 'rgba(255,255,255,.45)';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

interface Props {
  asociado: Asociado;
  onClose: () => void;
}

export default function AsociadoLeadsModal({ asociado, onClose }: Props) {
  const [leads, setLeads]     = useState<AsociadoLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setLeads(await adminAsociadoService.getLeads(asociado.uuid));
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar los leads del asociado' });
      } finally {
        setLoading(false);
      }
    })();
  }, [asociado.uuid]);

  const convertedCount = leads.filter(l => l.converted).length;

  return (
    <ModalShell onClose={onClose} maxWidth={720}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            Leads de {asociado.name}{' '}
            <span style={{ color: NEON, letterSpacing: '.05em', textTransform: 'uppercase' }}>{asociado.code}</span>
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
            Sin leads todavía
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
            {leads.map(lead => (
              <div key={lead.id} style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: '#fff', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {lead.name} {lead.lastname ?? ''}
                  </div>
                  <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {lead.email}{lead.phone ? ` · ${lead.phone}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  {lead.converted ? (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: NEON, background: 'rgba(4,238,98,.1)', borderRadius: 6, padding: '3px 9px' }}>Convertido</span>
                  ) : (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE, background: 'rgba(255,255,255,.08)', borderRadius: 6, padding: '3px 9px' }}>Pendiente</span>
                  )}
                  <span style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16, color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
          {leads.length} leads · {convertedCount} convertidos
        </div>

        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </ModalShell>
  );
}
