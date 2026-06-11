'use client';

import ModalShell from '@/components/admin/ModalShell';

import React from 'react';
import {
  CreateLecturerData,
  CreateAcademicFormation,
  CreatePublication,
} from '@/types/lecturer';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const PANEL2= '#332A30';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';
const MUTE2 = 'rgba(255,255,255,.28)';

const iS: React.CSSProperties = {
  background: INK, color: '#fff', border: `1px solid ${LINE2}`,
  borderRadius: 10, padding: '10px 14px',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
      {label}
    </label>
    {children}
  </div>
);

const SectionTitle = ({ title, onAdd }: { title: string; onAdd?: () => void }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${LINE}` }}>
    <span style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE2 }}>
      {title}
    </span>
    {onAdd && (
      <button type="button" onClick={onAdd} className="adm-btn" style={{ fontSize: 11, padding: '4px 10px' }}>
        + Agregar
      </button>
    )}
  </div>
);

interface CreateLecturerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lecturer: CreateLecturerData) => Promise<{ success: boolean; message: string }>;
}

const CreateLecturerModal: React.FC<CreateLecturerModalProps> = ({ isOpen, onClose, onSave }) => {
  const [firstName, setFirstName]   = React.useState('');
  const [lastName, setLastName]     = React.useState('');
  const [alt, setAlt]               = React.useState('');
  const [title, setTitle]           = React.useState('');
  const [country, setCountry]       = React.useState('');
  const [type, setType]             = React.useState<'INTERNATIONAL' | 'NATIONAL'>('INTERNATIONAL');
  const [position, setPosition]     = React.useState('');
  const [nickname, setNickname]     = React.useState('');
  const [biography, setBiography]   = React.useState('');
  const [image, setImage]           = React.useState('');
  const [show, setShow]             = React.useState(true);
  const [instagram, setInstagram]   = React.useState('');
  const [facebook, setFacebook]     = React.useState('');
  const [x, setX]                   = React.useState('');
  const [youtube, setYoutube]       = React.useState('');
  const [experienceAreas, setExperienceAreas]           = React.useState<string[]>(['']);
  const [awards, setAwards]                             = React.useState<string[]>(['']);
  const [createdMethodologies, setCreatedMethodologies] = React.useState<string[]>(['']);
  const [academicFormations, setAcademicFormations]     = React.useState<CreateAcademicFormation[]>([{ title: '', institution: '', year: undefined, place: '' }]);
  const [publications, setPublications]                 = React.useState<CreatePublication[]>([{ title: '', editorial: '', year: undefined, role: '', description: '' }]);
  const [isLoading, setIsLoading]   = React.useState(false);

  React.useEffect(() => {
    if (firstName && lastName) {
      setAlt(`${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-'));
    } else if (firstName) {
      setAlt(firstName.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-'));
    }
  }, [firstName, lastName]);

  const resetForm = () => {
    setFirstName(''); setLastName(''); setAlt(''); setTitle(''); setCountry('');
    setType('INTERNATIONAL'); setPosition(''); setNickname(''); setBiography('');
    setImage(''); setShow(true); setInstagram(''); setFacebook(''); setX(''); setYoutube('');
    setExperienceAreas(['']); setAwards(['']); setCreatedMethodologies(['']);
    setAcademicFormations([{ title: '', institution: '', year: undefined, place: '' }]);
    setPublications([{ title: '', editorial: '', year: undefined, role: '', description: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await onSave({
        firstName, lastName: lastName || undefined, alt,
        title: title || undefined, country, type,
        position: position || undefined, nickname: nickname || undefined,
        biography: biography || undefined, image, show,
        socialMedia: {
          instagram: instagram || undefined, facebook: facebook || undefined,
          x: x || undefined, youtube: youtube || undefined,
        },
        experienceAreas: experienceAreas.filter(a => a.trim()),
        awards: awards.filter(a => a.trim()),
        createdMethodologies: createdMethodologies.filter(m => m.trim()),
        academicFormations: academicFormations.filter(f => f.title.trim()),
        publications: publications.filter(p => p.title.trim()),
      });
      if (response.success) resetForm();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => { resetForm(); onClose(); };

  /* ── array helpers ── */
  const updateStr = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, i: number, v: string) => {
    const next = [...arr]; next[i] = v; setArr(next);
  };
  const removeStr = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, i: number) => {
    if (arr.length > 1) setArr(arr.filter((_, j) => j !== i));
  };

  if (!isOpen) return null;

  return (
    <ModalShell onClose={handleClose} maxWidth={720}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            Nuevo conferencista
          </h3>
          <button onClick={handleClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Información básica ── */}
          <SectionTitle title="Información básica" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Nombre *">
              <input style={iS} required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Nombre" />
            </Field>
            <Field label="Apellido">
              <input style={iS} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Apellido" />
            </Field>
            <Field label="Slug (alt) *">
              <input style={iS} required value={alt} onChange={e => setAlt(e.target.value)} placeholder="se-genera-automaticamente" />
            </Field>
            <Field label="País *">
              <input style={iS} required value={country} onChange={e => setCountry(e.target.value)} placeholder="Colombia" />
            </Field>
            <Field label="Tipo *">
              <select style={{ ...iS, cursor: 'pointer' }} value={type} onChange={e => setType(e.target.value as typeof type)}>
                <option value="INTERNATIONAL">Internacional</option>
                <option value="NATIONAL">Nacional</option>
              </select>
            </Field>
            <Field label="URL de imagen *">
              <input style={iS} type="url" required value={image} onChange={e => setImage(e.target.value)} placeholder="https://…" />
            </Field>
          </div>

          {/* ── Info adicional ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Título de conferencia">
              <input style={iS} value={title} onChange={e => setTitle(e.target.value)} placeholder="Tema de su charla" />
            </Field>
            <Field label="Cargo / Posición">
              <input style={iS} value={position} onChange={e => setPosition(e.target.value)} placeholder="Director de Marketing" />
            </Field>
            <Field label="Apodo">
              <input style={iS} value={nickname} onChange={e => setNickname(e.target.value)} />
            </Field>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff' }}>
                <input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} style={{ accentColor: NEON, width: 16, height: 16 }} />
                Mostrar en público
              </label>
            </div>
          </div>

          {/* ── Biografía ── */}
          <Field label="Biografía">
            <textarea style={{ ...iS, minHeight: 90, resize: 'vertical' } as React.CSSProperties} value={biography} onChange={e => setBiography(e.target.value)} placeholder="Reseña biográfica del conferencista…" />
          </Field>

          {/* ── Redes sociales ── */}
          <SectionTitle title="Redes sociales" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Instagram"><input style={iS} type="url" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/…" /></Field>
            <Field label="Facebook"><input style={iS} type="url" value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://facebook.com/…" /></Field>
            <Field label="X (Twitter)"><input style={iS} type="url" value={x} onChange={e => setX(e.target.value)} placeholder="https://x.com/…" /></Field>
            <Field label="YouTube"><input style={iS} type="url" value={youtube} onChange={e => setYoutube(e.target.value)} placeholder="https://youtube.com/…" /></Field>
          </div>

          {/* ── Áreas de experiencia ── */}
          <SectionTitle title="Áreas de experiencia" onAdd={() => setExperienceAreas([...experienceAreas, ''])} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {experienceAreas.map((area, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...iS, flex: 1 }} value={area} onChange={e => updateStr(experienceAreas, setExperienceAreas, i, e.target.value)} placeholder="Área de experiencia" />
                {experienceAreas.length > 1 && (
                  <button type="button" onClick={() => removeStr(experienceAreas, setExperienceAreas, i)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 10px', flexShrink: 0 }}>✕</button>
                )}
              </div>
            ))}
          </div>

          {/* ── Premios ── */}
          <SectionTitle title="Premios y reconocimientos" onAdd={() => setAwards([...awards, ''])} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {awards.map((award, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...iS, flex: 1 }} value={award} onChange={e => updateStr(awards, setAwards, i, e.target.value)} placeholder="Premio o reconocimiento" />
                {awards.length > 1 && (
                  <button type="button" onClick={() => removeStr(awards, setAwards, i)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 10px', flexShrink: 0 }}>✕</button>
                )}
              </div>
            ))}
          </div>

          {/* ── Metodologías ── */}
          <SectionTitle title="Metodologías creadas" onAdd={() => setCreatedMethodologies([...createdMethodologies, ''])} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {createdMethodologies.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...iS, flex: 1 }} value={m} onChange={e => updateStr(createdMethodologies, setCreatedMethodologies, i, e.target.value)} placeholder="Metodología creada" />
                {createdMethodologies.length > 1 && (
                  <button type="button" onClick={() => removeStr(createdMethodologies, setCreatedMethodologies, i)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 10px', flexShrink: 0 }}>✕</button>
                )}
              </div>
            ))}
          </div>

          {/* ── Formación académica ── */}
          <SectionTitle title="Formación académica" onAdd={() => setAcademicFormations([...academicFormations, { title: '', institution: '', year: undefined, place: '' }])} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {academicFormations.map((f, i) => (
              <div key={i} style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input style={iS} value={f.title} onChange={e => { const n=[...academicFormations]; n[i]={...n[i],title:e.target.value}; setAcademicFormations(n); }} placeholder="Título académico" />
                  </div>
                  <input style={iS} value={f.institution||''} onChange={e => { const n=[...academicFormations]; n[i]={...n[i],institution:e.target.value}; setAcademicFormations(n); }} placeholder="Institución" />
                  <input style={iS} type="number" value={f.year||''} onChange={e => { const n=[...academicFormations]; n[i]={...n[i],year:parseInt(e.target.value)||undefined}; setAcademicFormations(n); }} placeholder="Año" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input style={iS} value={f.place||''} onChange={e => { const n=[...academicFormations]; n[i]={...n[i],place:e.target.value}; setAcademicFormations(n); }} placeholder="Lugar" />
                  </div>
                </div>
                {academicFormations.length > 1 && (
                  <button type="button" onClick={() => setAcademicFormations(academicFormations.filter((_,j)=>j!==i))} className="adm-btn danger" style={{ fontSize: 11, padding: '5px 10px', alignSelf: 'flex-start' }}>
                    Eliminar formación
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ── Publicaciones ── */}
          <SectionTitle title="Publicaciones" onAdd={() => setPublications([...publications, { title: '', editorial: '', year: undefined, role: '', description: '' }])} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {publications.map((p, i) => (
              <div key={i} style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input style={iS} value={p.title} onChange={e => { const n=[...publications]; n[i]={...n[i],title:e.target.value}; setPublications(n); }} placeholder="Título de la publicación" />
                  </div>
                  <input style={iS} value={p.editorial||''} onChange={e => { const n=[...publications]; n[i]={...n[i],editorial:e.target.value}; setPublications(n); }} placeholder="Editorial" />
                  <input style={iS} type="number" value={p.year||''} onChange={e => { const n=[...publications]; n[i]={...n[i],year:parseInt(e.target.value)||undefined}; setPublications(n); }} placeholder="Año" />
                  <input style={iS} value={p.role||''} onChange={e => { const n=[...publications]; n[i]={...n[i],role:e.target.value}; setPublications(n); }} placeholder="Rol (Autor, Co-autor…)" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <textarea style={{ ...iS, minHeight: 60, resize: 'vertical' } as React.CSSProperties} value={p.description||''} onChange={e => { const n=[...publications]; n[i]={...n[i],description:e.target.value}; setPublications(n); }} placeholder="Descripción" />
                  </div>
                </div>
                {publications.length > 1 && (
                  <button type="button" onClick={() => setPublications(publications.filter((_,j)=>j!==i))} className="adm-btn danger" style={{ fontSize: 11, padding: '5px 10px', alignSelf: 'flex-start' }}>
                    Eliminar publicación
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ── Footer ── */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: `1px solid ${LINE}`, marginTop: 4 }}>
            <button type="button" onClick={handleClose} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${LINE2}`, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
              Cancelar
            </button>
            <button type="submit" disabled={isLoading || !firstName || !country || !image} style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: isLoading || !firstName || !country || !image ? .5 : 1 }}>
              {isLoading ? 'Creando…' : 'Crear conferencista'}
            </button>
          </div>
        </form>
    </ModalShell>
  );
};

export default CreateLecturerModal;
