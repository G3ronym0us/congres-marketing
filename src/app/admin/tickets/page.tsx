'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import validator from 'validator';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const PANEL2= '#332A30';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

const iS: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: '10px 14px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

const Field = ({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
      {label}
    </label>
    {children}
    {error && <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#ff6b6b' }}>{error}</span>}
  </div>
);

type Ticket = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  document: string;
  phone: string;
  type: string;
  role: string;
  number: number;
  row: string;
};

type TicketErrors = { name?: string; lastname?: string; email?: string; document?: string };

const Tickets = () => {
  const [data, setData]               = useState<Ticket[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen]           = useState(false);
  const [ticketEdit, setTicketEdit]   = useState<Ticket | null>(null);
  const [saving, setSaving]           = useState(false);

  const [name, setName]               = useState('');
  const [lastname, setLastname]       = useState('');
  const [email, setEmail]             = useState('');
  const [documentUser, setDocumentUser] = useState('');
  const [phone, setPhone]             = useState('');
  const [errors, setErrors]           = useState<TicketErrors>({});

  const itemsPerPage = 10;

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/admin/tickets');
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter(t => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      t.name?.toLowerCase().includes(q) ||
      t.lastname?.toLowerCase().includes(q) ||
      t.document?.toLowerCase().includes(q) ||
      t.phone?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pageItems  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openEdit = (t: Ticket) => {
    setTicketEdit(t);
    setName(t.name || '');
    setLastname(t.lastname || '');
    setEmail(t.email || '');
    setDocumentUser(t.document || '');
    setPhone(t.phone || '');
    setErrors({});
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: TicketErrors = {};
    if (!name.trim()) errs.name = 'Requerido';
    if (!lastname.trim()) errs.lastname = 'Requerido';
    if (!validator.isEmail(email)) errs.email = 'Email no válido';
    if (!documentUser.trim()) errs.document = 'Requerido';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const updated = { ...ticketEdit, name, lastname, email, document: documentUser, phone };
      const res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/admin/tickets/update/' + ticketEdit!.id, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated),
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Ticket actualizado', timer: 1500, showConfirmButton: false });
        setIsOpen(false);
        load();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el ticket' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResend = async (id: number) => {
    const res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/admin/tickets/resend/' + id);
    if (res.ok)
      Swal.fire({ icon: 'success', title: 'Correo enviado', timer: 1500, showConfirmButton: false });
    else
      Swal.fire({ icon: 'error', title: 'Error al enviar', timer: 1500, showConfirmButton: false });
  };

  const handleDownload = async (t: Ticket) => {
    const res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/admin/tickets/download/' + t.id);
    if (res.ok) {
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `CNMP_COLOMBIA_BOLETO(${t.name.toUpperCase()} ${t.lastname.toUpperCase()}).pdf`;
      document.body.appendChild(link); link.click(); link.remove();
    }
  };

  const handleDelete = async (id: number) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar ticket?', text: 'Esta acción no se puede revertir',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    const res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/admin/tickets/delete/' + id);
    if (res.ok) {
      Swal.fire({ icon: 'success', title: 'Ticket eliminado', timer: 1500, showConfirmButton: false });
      load();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el ticket' });
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            Tickets
          </h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            {data.length} en total
          </p>
        </div>
      </div>

      {/* Filtro */}
      <div style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: MUTE, pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Buscar por nombre, documento, email…"
            value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ ...iS, paddingLeft: 34 }} />
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : pageItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          No se encontraron tickets
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pageItems.map(t => (
            <div key={t.id} style={{ background: PANEL, border: `1px solid ${LINE2}`, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 3 }}>
                  {!t.name ? 'Reservada' : `${t.lastname?.toUpperCase()}, ${t.name}`}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
                  {t.document || '—'}
                  {' · '}{t.phone || 'Sin teléfono'}
                  {' · '}{t.email || '—'}
                </div>
              </div>

              {/* Asiento */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 14, color: NEON }}>
                  {t.row}-{t.number}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE }}>
                  {t.type}
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                <button onClick={() => handleResend(t.id)} className="adm-btn" style={{ fontSize: 11, padding: '6px 10px' }} title="Reenviar correo">
                  ✉
                </button>
                <button onClick={() => handleDownload(t)} className="adm-btn" style={{ fontSize: 11, padding: '6px 10px' }} title="Descargar PDF">
                  ⬇
                </button>
                <button onClick={() => openEdit(t)} className="adm-btn" style={{ fontSize: 11, padding: '6px 12px' }}>
                  Editar
                </button>
                <button onClick={() => handleDelete(t.id)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 12px' }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} className="adm-btn"
              style={{ padding: '6px 12px', fontSize: 12, ...(currentPage === page ? { background: NEON, color: INK, borderColor: NEON, fontWeight: 700 } : {}) }}>
              {page}
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Modal editar */}
      {isOpen && ticketEdit && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)' }} onClick={() => setIsOpen(false)} />

          <div style={{ position: 'relative', zIndex: 1, background: PANEL, border: `1px solid ${LINE}`, borderRadius: 20, padding: '28px 28px 24px', width: '100%', maxWidth: 480, boxShadow: '0 32px 80px rgba(0,0,0,.6)' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
                Editar Ticket
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
            </div>

            {/* Info de solo lectura */}
            <div style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 10, padding: '10px 14px', marginBottom: 18 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
                Localidad: <span style={{ color: NEON, fontWeight: 600 }}>{ticketEdit.type}</span>
                {' · '}Asiento: <span style={{ color: '#fff' }}>{ticketEdit.row}-{ticketEdit.number}</span>
              </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Nombres *" error={errors.name}>
                  <input value={name} onChange={e => setName(e.target.value)}
                    style={{ ...iS, borderColor: errors.name ? '#ff6b6b' : LINE2 }} />
                </Field>
                <Field label="Apellidos *" error={errors.lastname}>
                  <input value={lastname} onChange={e => setLastname(e.target.value)}
                    style={{ ...iS, borderColor: errors.lastname ? '#ff6b6b' : LINE2 }} />
                </Field>
              </div>

              <Field label="Correo *" error={errors.email}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ ...iS, borderColor: errors.email ? '#ff6b6b' : LINE2 }} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Documento *" error={errors.document}>
                  <input value={documentUser} onChange={e => setDocumentUser(e.target.value)}
                    style={{ ...iS, borderColor: errors.document ? '#ff6b6b' : LINE2 }} />
                </Field>
                <Field label="Teléfono">
                  <input value={phone} onChange={e => setPhone(e.target.value)} style={iS} />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: `1px solid ${LINE}` }}>
                <button type="button" onClick={() => setIsOpen(false)} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: saving ? .6 : 1 }}>
                  {saving ? 'Guardando…' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
