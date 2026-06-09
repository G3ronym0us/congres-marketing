'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Testimonial } from '@/types/testimonials';
import { getTestimonials, deleteTestimonial, toggleTestimonialActive } from '@/services/testimonials';
import CreateTestimonialModal from '@/components/admin/testimonials/CreateTestimonialModal';
import EditTestimonialModal from '@/components/admin/testimonials/EditTestimonialModal';
import ImageUploadModal from '@/components/admin/testimonials/ImageUploadModal';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';

const iS: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: '9px 14px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
};

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials]             = useState<Testimonial[]>([]);
  const [filtered, setFiltered]                     = useState<Testimonial[]>([]);
  const [loading, setLoading]                       = useState(true);
  const [searchTerm, setSearchTerm]                 = useState('');
  const [showActiveOnly, setShowActiveOnly]         = useState(false);
  const [currentPage, setCurrentPage]               = useState(1);
  const [isCreateOpen, setIsCreateOpen]             = useState(false);
  const [isEditOpen, setIsEditOpen]                 = useState(false);
  const [isImageOpen, setIsImageOpen]               = useState(false);
  const [selected, setSelected]                     = useState<Testimonial | null>(null);

  const itemsPerPage = 10;

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let f = testimonials;
    if (showActiveOnly) f = f.filter(t => t.active);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      f = f.filter(t =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q)  ||
        t.position.toLowerCase().includes(q)  ||
        t.content.toLowerCase().includes(q),
      );
    }
    setFiltered(f);
    setCurrentPage(1);
  }, [testimonials, searchTerm, showActiveOnly]);

  const load = async () => {
    try {
      setLoading(true);
      setTestimonials(await getTestimonials());
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los testimonios' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (t: Testimonial) => {
    try {
      await toggleTestimonialActive(t.id);
      setTestimonials(prev => prev.map(x => x.id === t.id ? { ...x, active: !x.active } : x));
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cambiar el estado' });
    }
  };

  const handleDelete = async (t: Testimonial) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el testimonio de ${t.firstName} ${t.lastName}`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    try {
      await deleteTestimonial(t.id);
      setTestimonials(prev => prev.filter(x => x.id !== t.id));
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el testimonio' });
    }
  };

  const totalPages  = Math.ceil(filtered.length / itemsPerPage);
  const pageItems   = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const activeCount = testimonials.filter(t => t.active).length;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            Testimonios
          </h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            {testimonials.length} en total · {activeCount} activos
          </p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="adm-btn neon">
          + Nuevo testimonio
        </button>
      </div>

      {/* ── Filtros ── */}
      <div style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: MUTE, pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar testimonios..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ ...iS, width: '100%', paddingLeft: 34 }}
          />
        </div>
        <button
          onClick={() => setShowActiveOnly(v => !v)}
          className="adm-btn"
          style={{ fontSize: 12, ...(showActiveOnly ? { borderColor: `rgba(4,238,98,.4)`, color: NEON } : {}) }}
        >
          {showActiveOnly ? 'Solo activos' : 'Todos'}
        </button>
      </div>

      {/* ── Lista ── */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : pageItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          No se encontraron testimonios
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pageItems.map(t => (
            <div key={t.id} style={{
              background: PANEL,
              border: `1px solid ${t.active ? LINE2 : LINE}`,
              borderRadius: 14,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: t.active ? 1 : .55,
              transition: 'opacity .2s',
            }}>
              {/* Avatar */}
              {t.image ? (
                <img src={t.image} alt={`${t.firstName} ${t.lastName}`}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${LINE2}` }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: LINE2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                  👤
                </div>
              )}

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                  <span style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                    {t.firstName} {t.lastName}
                  </span>
                  {!t.active && (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#ff6b6b', background: 'rgba(255,80,80,.1)', borderRadius: 6, padding: '2px 8px' }}>
                      Inactivo
                    </span>
                  )}
                </div>
                <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>
                  {t.position}
                </div>
                <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 480 }}>
                  "{t.content}"
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleToggle(t)}
                  className="adm-btn"
                  style={{ fontSize: 11, padding: '6px 12px' }}
                >
                  {t.active ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => { setSelected(t); setIsImageOpen(true); }}
                  className="adm-btn"
                  style={{ fontSize: 11, padding: '6px 12px' }}
                >
                  Imagen
                </button>
                <button
                  onClick={() => { setSelected(t); setIsEditOpen(true); }}
                  className="adm-btn"
                  style={{ fontSize: 11, padding: '6px 12px' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(t)}
                  className="adm-btn danger"
                  style={{ fontSize: 11, padding: '6px 12px' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Paginación ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className="adm-btn"
              style={{ padding: '6px 12px', fontSize: 12, ...(currentPage === page ? { background: NEON, color: INK, borderColor: NEON, fontWeight: 700 } : {}) }}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ── Modales ── */}
      <CreateTestimonialModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => { setIsCreateOpen(false); load(); }}
      />
      {selected && (
        <>
          <EditTestimonialModal
            isOpen={isEditOpen}
            onClose={() => { setIsEditOpen(false); setSelected(null); }}
            testimonial={selected}
            onSuccess={() => { setIsEditOpen(false); setSelected(null); load(); }}
          />
          <ImageUploadModal
            isOpen={isImageOpen}
            onClose={() => { setIsImageOpen(false); setSelected(null); }}
            testimonial={selected}
            onSuccess={() => { setIsImageOpen(false); setSelected(null); load(); }}
          />
        </>
      )}
    </div>
  );
};

export default TestimonialsAdmin;
