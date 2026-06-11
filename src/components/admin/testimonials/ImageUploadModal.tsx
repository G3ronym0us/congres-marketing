'use client';

import ModalShell from '@/components/admin/ModalShell';

import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Testimonial } from '@/types/testimonials';
import { uploadTestimonialImage, deleteTestimonialImage } from '@/services/testimonials';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const PANEL2= '#332A30';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';
const MUTE2 = 'rgba(255,255,255,.28)';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  testimonial: Testimonial;
  onSuccess: () => void;
}

const ImageUploadModal: React.FC<Props> = ({ isOpen, onClose, testimonial, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]     = useState<string | null>(null);
  const [uploading, setUploading]       = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      Swal.fire({ icon: 'error', title: 'Formato no válido', text: 'Solo se permiten JPEG, JPG, PNG y WEBP' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Archivo muy grande', text: 'El archivo no puede exceder 5MB' });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = ev => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      await uploadTestimonialImage(testimonial.id, selectedFile);
      Swal.fire({ icon: 'success', title: 'Imagen subida', timer: 1500, showConfirmButton: false });
      setSelectedFile(null);
      setPreviewUrl(null);
      onSuccess();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo subir la imagen' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar imagen?', text: 'Esta acción no se puede revertir',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    try {
      setDeleting(true);
      await deleteTestimonialImage(testimonial.id);
      Swal.fire({ icon: 'success', title: 'Imagen eliminada', timer: 1500, showConfirmButton: false });
      onSuccess();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo eliminar la imagen' });
    } finally {
      setDeleting(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <ModalShell onClose={onClose} maxWidth={440}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            Gestionar imagen
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Imagen actual */}
          <div>
            <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE, marginBottom: 12 }}>
              Imagen actual
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {testimonial.image ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={testimonial.image} alt={`${testimonial.firstName} ${testimonial.lastName}`}
                    style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${LINE2}` }} />
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    title="Eliminar imagen"
                    style={{ position: 'absolute', top: -6, right: -6, width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#ff4444', color: '#fff', cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, opacity: deleting ? .6 : 1 }}
                  >
                    {deleting ? '…' : '✕'}
                  </button>
                </div>
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: LINE2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                  👤
                </div>
              )}
            </div>
          </div>

          {/* Preview de nueva imagen */}
          {previewUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
                Vista previa
              </div>
              <img src={previewUrl} alt="Vista previa"
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `3px solid rgba(4,238,98,.4)` }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleUpload} disabled={uploading} className="adm-btn neon" style={{ fontSize: 12 }}>
                  {uploading ? 'Subiendo…' : 'Confirmar'}
                </button>
                <button onClick={clearSelection} disabled={uploading} className="adm-btn" style={{ fontSize: 12 }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Zona de carga */}
          <div>
            <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE, marginBottom: 10 }}>
              {testimonial.image ? 'Cambiar imagen' : 'Subir imagen'}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileSelect} style={{ display: 'none' }} id="img-upload-testimonial" />
            <label htmlFor="img-upload-testimonial" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px 16px', border: `2px dashed ${LINE2}`, borderRadius: 12, cursor: 'pointer', transition: 'border-color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(4,238,98,.35)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = LINE2)}>
              <span style={{ fontSize: 28 }}>📁</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff', fontWeight: 500 }}>
                Haz clic para seleccionar
              </span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE2 }}>
                JPEG, JPG, PNG, WEBP · máx. 5MB
              </span>
            </label>
          </div>

          {/* Info */}
          <div style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 14 }}>ℹ️</span>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE, lineHeight: 1.6 }}>
              Usa imágenes cuadradas · resolución mínima 300×300px · al subir una nueva imagen, la anterior se reemplaza automáticamente
            </div>
          </div>

          {/* Footer */}
          <button onClick={onClose} style={{ width: '100%', padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
            Cerrar
          </button>
        </div>
    </ModalShell>
  );
};

export default ImageUploadModal;
