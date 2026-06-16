'use client';

import React from 'react';
import Swal from 'sweetalert2';
import CreateLecturerModal from './Modals/CreateLecturer';
import EditLecturerModal from './Modals/EditLecturer';
import {
  CreateLecturerData,
  Lecturer,
  UpdateLecturerData,
} from '@/types/lecturer';
import {
  create,
  copyLecturer,
  deleteLecturer as deleteLecturerService,
  getAll,
  toggleShow,
  update,
  uploadImage,
} from '@/services/user';
import { Edition } from '@/types/edition';
import EditionSelect from '@/components/admin/EditionSelect';
import ModalShell from '@/components/admin/ModalShell';

/* ── design tokens ── */
const INK    = '#1A1418';
const PANEL  = '#2A2228';
const PANEL2 = '#332A30';
const NEON   = '#04EE62';
const LINE   = 'rgba(255,255,255,.08)';
const LINE2  = 'rgba(255,255,255,.14)';
const MUTE   = 'rgba(255,255,255,.45)';
const MUTE2  = 'rgba(255,255,255,.28)';

const inputStyle: React.CSSProperties = {
  background: INK,
  color: '#fff',
  border: `1px solid ${LINE2}`,
  borderRadius: 10,
  padding: '9px 14px',
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: 13,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

/* ── Modal: copiar conferencistas desde otra edición ── */
function CopyFromEditionModal({
  editions,
  currentEditionId,
  onClose,
  onCopied,
}: {
  editions: Edition[];
  currentEditionId?: number;
  onClose: () => void;
  onCopied: () => void;
}) {
  const sources = editions.filter((e) => e.id !== currentEditionId);
  const [sourceId, setSourceId] = React.useState<number | undefined>(sources[0]?.id);
  const [list, setList] = React.useState<Lecturer[]>([]);
  const [loadingList, setLoadingList] = React.useState(false);
  const [copyingId, setCopyingId] = React.useState<number | null>(null);
  const [copiedIds, setCopiedIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!sourceId) { setList([]); return; }
    setLoadingList(true);
    getAll(sourceId)
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoadingList(false));
  }, [sourceId]);

  const handleCopy = async (l: Lecturer) => {
    if (!currentEditionId) return;
    setCopyingId(l.id);
    try {
      await copyLecturer(l.id, currentEditionId);
      setCopiedIds((prev) => [...prev, l.id]);
      onCopied();
    } catch {
      Swal.fire({ position: 'top-end', icon: 'error', title: 'Error al copiar', showConfirmButton: false, timer: 1500 });
    } finally {
      setCopyingId(null);
    }
  };

  return (
    <ModalShell onClose={onClose} maxWidth={560}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
          Copiar conferencista de otra edición
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE }}>✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
          Edición origen
        </label>
        <select
          value={sourceId ?? ''}
          onChange={(e) => setSourceId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {sources.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {loadingList ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
          <div style={{ width: 28, height: 28, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          Esta edición no tiene conferencistas.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto' }}>
          {list.map((l) => {
            const done = copiedIds.includes(l.id);
            return (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: PANEL, border: `1px solid ${LINE}`, borderRadius: 10, padding: '10px 14px' }}>
                <img src={l.image} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>{l.firstName} {l.lastName}</div>
                  <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {[l.position, l.country].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(l)}
                  disabled={copyingId === l.id || done}
                  className={`adm-btn${done ? '' : ' neon'}`}
                  style={{ fontSize: 11, padding: '6px 12px', flexShrink: 0 }}
                >
                  {done ? '✓ Copiado' : copyingId === l.id ? 'Copiando…' : 'Copiar'}
                </button>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </ModalShell>
  );
}

const LecturersTable = ({
  editionId,
  editions = [],
  onEditionChange,
}: {
  editionId?: number;
  editions?: Edition[];
  onEditionChange?: (id: number) => void;
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [data, setData] = React.useState<Lecturer[]>([]);
  const [filteredData, setFilteredData] = React.useState<Lecturer[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCopyOpen, setIsCopyOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpenEdit, setIsOpenEdit] = React.useState(false);
  const [lecturerEdit, setLecturerEdit] = React.useState<Lecturer | null>(null);
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'INTERNATIONAL' | 'NATIONAL'>('all');
  const [showFilter, setShowFilter] = React.useState<'all' | 'visible' | 'hidden'>('all');

  const itemsPerPage = 10;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { getLecturers(); }, [editionId]);

  React.useEffect(() => {
    let filtered = data;
    if (typeFilter !== 'all') filtered = filtered.filter(l => l.type === typeFilter);
    if (showFilter === 'visible') filtered = filtered.filter(l => l.show);
    if (showFilter === 'hidden')  filtered = filtered.filter(l => !l.show);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(l =>
        l.firstName?.toLowerCase().includes(q) ||
        l.lastName?.toLowerCase().includes(q)  ||
        l.country?.toLowerCase().includes(q)   ||
        l.position?.toLowerCase().includes(q)  ||
        l.alt?.toLowerCase().includes(q),
      );
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, searchTerm, typeFilter, showFilter]);

  const getLecturers = async () => {
    if (!editionId) { setData([]); setIsLoading(false); return; }
    setIsLoading(true);
    try {
      setData(await getAll(editionId));
    } catch {
      Swal.fire({ position: 'top-end', icon: 'error', title: 'Error al cargar conferencistas', showConfirmButton: false, timer: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages    = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems  = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleToggleVisibility = async (lecturer: Lecturer) => {
    try {
      await toggleShow(lecturer.id);
      setData(prev => prev.map(l => l.id === lecturer.id ? { ...l, show: !l.show } : l));
    } catch {
      Swal.fire({ position: 'top-end', icon: 'error', title: 'Error al cambiar visibilidad', showConfirmButton: false, timer: 1500 });
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Estás seguro?', text: `Se eliminará permanentemente a ${name}`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    try {
      await deleteLecturerService(id);
      setData(prev => prev.filter(l => l.id !== id));
    } catch {
      Swal.fire({ position: 'top-end', icon: 'error', title: 'Error al eliminar', showConfirmButton: false, timer: 1500 });
    }
  };

  const handleCreate = async (lecturer: CreateLecturerData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const response = await create({ ...lecturer, edition: editionId });
      if (response instanceof Error) {
        Swal.fire({ icon: 'error', title: 'Error', text: response.message });
        return { success: false, message: response.message };
      }
      Swal.fire({ position: 'top-end', icon: 'success', title: 'Conferencista creado', showConfirmButton: false, timer: 1500 });
      setIsOpen(false);
      getLecturers();
      return { success: true, message: 'Conferencista creado' };
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el conferencista' });
      return { success: false, message: 'No se pudo crear el conferencista' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (lecturer: UpdateLecturerData) => {
    if (!lecturerEdit) return;
    setIsLoading(true);
    try {
      await update(lecturerEdit.id, {
        ...lecturer,
        academicFormations: lecturer.academicFormations?.map(f => ({ title: f.title, institution: f.institution, year: f.year, place: f.place })),
        publications: lecturer.publications?.map(p => ({ title: p.title, editorial: p.editorial, year: p.year, role: p.role, description: p.description })),
      });
      Swal.fire({ position: 'top-end', icon: 'success', title: 'Conferencista actualizado', showConfirmButton: false, timer: 1500 });
      setIsOpenEdit(false);
      setLecturerEdit(null);
      getLecturers();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el conferencista' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (lecturer: Lecturer, file: File) => {
    try {
      await uploadImage(lecturer.id, file);
      Swal.fire({ position: 'top-end', icon: 'success', title: 'Imagen actualizada', showConfirmButton: false, timer: 1500 });
      getLecturers();
    } catch {
      Swal.fire({ position: 'top-end', icon: 'error', title: 'Error al subir imagen', showConfirmButton: false, timer: 1500 });
    }
  };

  const intl = data.filter(l => l.type === 'INTERNATIONAL').length;
  const natl = data.filter(l => l.type === 'NATIONAL').length;
  const vis  = data.filter(l => l.show).length;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>
            Conferencistas
          </h2>
          <p style={{ color: MUTE, fontSize: 13, margin: '4px 0 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            {intl} internacionales · {natl} nacionales · {vis} visibles
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <EditionSelect editions={editions} editionId={editionId} onChange={onEditionChange} />
          <button onClick={() => setIsCopyOpen(true)} className="adm-btn" disabled={!editionId || editions.length < 2}>
            Copiar de otra edición
          </button>
          <button onClick={() => setIsOpen(true)} className="adm-btn neon" disabled={!editionId}>
            + Nuevo conferencista
          </button>
        </div>
      </div>

      {/* ── Filtros ── */}
      <div style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Búsqueda */}
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: MUTE, pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar conferencista..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 34 }}
          />
        </div>

        {/* Tipo */}
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
          style={{ ...inputStyle, width: 'auto', flex: '0 1 160px', cursor: 'pointer' }}
        >
          <option value="all">Todos los tipos</option>
          <option value="INTERNATIONAL">Internacionales</option>
          <option value="NATIONAL">Nacionales</option>
        </select>

        {/* Visibilidad */}
        <select
          value={showFilter}
          onChange={e => setShowFilter(e.target.value as typeof showFilter)}
          style={{ ...inputStyle, width: 'auto', flex: '0 1 140px', cursor: 'pointer' }}
        >
          <option value="all">Todos</option>
          <option value="visible">Visibles</option>
          <option value="hidden">Ocultos</option>
        </select>
      </div>

      {/* ── Lista ── */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 32, height: 32, border: `2px solid rgba(4,238,98,.2)`, borderTopColor: NEON, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : currentItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontFamily: 'Space Grotesk, sans-serif' }}>
          No se encontraron conferencistas
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currentItems.map(item => (
            <div key={item.id} style={{
              background: PANEL,
              border: `1px solid ${item.show ? LINE2 : LINE}`,
              borderRadius: 14,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
              opacity: item.show ? 1 : .55,
              transition: 'opacity .2s',
            }}>
              {/* Imagen */}
              <img
                src={item.image}
                alt={`${item.firstName} ${item.lastName}`}
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0, border: `2px solid ${LINE2}` }}
              />

              {/* Info */}
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                  <span style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                    {item.firstName} {item.lastName}
                  </span>
                  {/* Tipo */}
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
                    color: item.type === 'INTERNATIONAL' ? '#60a5fa' : NEON,
                    background: item.type === 'INTERNATIONAL' ? 'rgba(96,165,250,.1)' : 'rgba(4,238,98,.1)',
                    borderRadius: 6, padding: '2px 8px',
                  }}>
                    {item.type === 'INTERNATIONAL' ? '🌎 Internacional' : '🇨🇴 Nacional'}
                  </span>
                  {/* Visibilidad */}
                  {!item.show && (
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#ff6b6b', background: 'rgba(255,80,80,.1)', borderRadius: 6, padding: '2px 8px' }}>
                      Oculto
                    </span>
                  )}
                </div>
                <div style={{ color: MUTE, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {[item.position, item.country].filter(Boolean).join(' · ')}
                  {item.title && <span style={{ color: MUTE2 }}> · "{item.title}"</span>}
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleToggleVisibility(item)}
                  className="adm-btn"
                  style={{ fontSize: 11, padding: '6px 12px' }}
                  title={item.show ? 'Ocultar' : 'Mostrar'}
                >
                  {item.show ? 'Ocultar' : 'Mostrar'}
                </button>

                <label className="adm-btn" style={{ fontSize: 11, padding: '6px 12px', cursor: 'pointer' }} title="Cambiar imagen">
                  Imagen
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(item, f); }}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  onClick={() => { setLecturerEdit(item); setIsOpenEdit(true); }}
                  className="adm-btn"
                  style={{ fontSize: 11, padding: '6px 12px' }}
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(item.id, `${item.firstName} ${item.lastName}`)}
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className="adm-btn"
              style={{
                padding: '6px 12px', fontSize: 12,
                ...(currentPage === page ? { background: NEON, color: INK, borderColor: NEON, fontWeight: 700 } : {}),
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ── Modales ── */}
      {isOpen && (
        <CreateLecturerModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={handleCreate} />
      )}
      {isOpenEdit && lecturerEdit && (
        <EditLecturerModal
          isOpen={isOpenEdit}
          onClose={() => { setIsOpenEdit(false); setLecturerEdit(null); }}
          onSave={handleEdit}
          lecturer={lecturerEdit}
        />
      )}
      {isCopyOpen && (
        <CopyFromEditionModal
          editions={editions}
          currentEditionId={editionId}
          onClose={() => setIsCopyOpen(false)}
          onCopied={getLecturers}
        />
      )}
    </div>
  );
};

export default LecturersTable;
