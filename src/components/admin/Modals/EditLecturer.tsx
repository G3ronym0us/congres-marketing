'use client';

import ModalShell from '@/components/admin/ModalShell';

import React from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { UpdateLecturerData } from '@/types/lecturer';

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

const Field = ({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE }}>
      {label}
    </label>
    {children}
    {error && <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#ff6b6b' }}>{error}</span>}
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

interface EditLecturerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lecturer: UpdateLecturerData) => Promise<void>;
  lecturer: UpdateLecturerData;
}

const EditLecturerModal: React.FC<EditLecturerModalProps> = ({ isOpen, onClose, onSave, lecturer }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const getDefaults = (): UpdateLecturerData => ({
    firstName: lecturer.firstName || '',
    lastName: lecturer.lastName || '',
    alt: lecturer.alt || '',
    title: lecturer.title || '',
    country: lecturer.country || '',
    type: lecturer.type || 'INTERNATIONAL',
    position: lecturer.position || '',
    nickname: lecturer.nickname || '',
    biography: lecturer.biography || '',
    image: lecturer.image || '',
    show: lecturer.show ?? true,
    socialMedia: {
      instagram: lecturer.socialMedia?.instagram || undefined,
      facebook: lecturer.socialMedia?.facebook || undefined,
      x: lecturer.socialMedia?.x || undefined,
      youtube: lecturer.socialMedia?.youtube || undefined,
    },
    experienceAreas: lecturer.experienceAreas?.length ? lecturer.experienceAreas : [''],
    awards: lecturer.awards?.length ? lecturer.awards : [''],
    createdMethodologies: lecturer.createdMethodologies?.length ? lecturer.createdMethodologies : [''],
    academicFormations: lecturer.academicFormations?.length ? lecturer.academicFormations : [],
    publications: lecturer.publications?.length ? lecturer.publications : [],
  });

  const { control, handleSubmit, watch, reset, setValue, formState: { errors, isValid } } = useForm<UpdateLecturerData>({
    defaultValues: getDefaults(),
    mode: 'onChange',
  });

  const experienceAreas  = useWatch({ control, name: 'experienceAreas' })  || [''];
  const awards           = useWatch({ control, name: 'awards' })           || [''];
  const methodologies    = useWatch({ control, name: 'createdMethodologies' }) || [''];

  const { fields: academicFields,     append: appendAcademic,     remove: removeAcademic }     = useFieldArray({ control, name: 'academicFormations' });
  const { fields: publicationFields,  append: appendPublication,  remove: removePublication }   = useFieldArray({ control, name: 'publications' });

  const updateStringArray = (field: keyof UpdateLecturerData, arr: string[], i: number, v: string) => {
    const next = [...arr]; next[i] = v;
    setValue(field, next, { shouldDirty: true });
  };
  const removeFromStringArray = (field: keyof UpdateLecturerData, arr: string[], i: number) => {
    if (arr.length > 1) setValue(field, arr.filter((_, j) => j !== i), { shouldDirty: true });
  };

  React.useEffect(() => {
    if (lecturer && isOpen) reset(getDefaults());
  }, [lecturer, isOpen]);

  const onSubmit = async (data: UpdateLecturerData) => {
    setIsLoading(true);
    try { await onSave(data); } finally { setIsLoading(false); }
  };

  const handleClose = () => { reset(); onClose(); };

  const watchedImage     = watch('image');
  const watchedFirstName = watch('firstName');
  const watchedLastName  = watch('lastName');

  if (!isOpen) return null;

  return (
    <ModalShell onClose={handleClose} maxWidth={720}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', margin: 0 }}>
            Editar conferencista
          </h3>
          <button onClick={handleClose} style={{ background: 'none', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', color: MUTE, fontSize: 14 }}>✕</button>
        </div>

        {/* Preview imagen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
          <img
            src={watchedImage || '/placeholder-avatar.png'}
            alt={`${watchedFirstName} ${watchedLastName}`}
            style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: `2px solid ${LINE2}` }}
            onError={e => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
          />
          <div>
            <div style={{ fontFamily: 'Oxanium, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>
              {watchedFirstName} {watchedLastName}
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: MUTE }}>
              Vista previa · se actualiza al cambiar la URL
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Información básica ── */}
          <SectionTitle title="Información básica" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Nombre *" error={errors.firstName?.message}>
              <Controller name="firstName" control={control} rules={{ required: 'Requerido' }}
                render={({ field }) => <input {...field} style={{ ...iS, borderColor: errors.firstName ? '#ff6b6b' : LINE2 }} />} />
            </Field>
            <Field label="Apellido">
              <Controller name="lastName" control={control} render={({ field }) => <input {...field} style={iS} />} />
            </Field>
            <Field label="Slug (alt) *" error={errors.alt?.message}>
              <Controller name="alt" control={control} rules={{ required: 'Requerido' }}
                render={({ field }) => <input {...field} style={{ ...iS, borderColor: errors.alt ? '#ff6b6b' : LINE2 }} />} />
            </Field>
            <Field label="País *" error={errors.country?.message}>
              <Controller name="country" control={control} rules={{ required: 'Requerido' }}
                render={({ field }) => <input {...field} style={{ ...iS, borderColor: errors.country ? '#ff6b6b' : LINE2 }} />} />
            </Field>
            <Field label="Tipo *">
              <Controller name="type" control={control}
                render={({ field }) => (
                  <select {...field} style={{ ...iS, cursor: 'pointer' }}>
                    <option value="INTERNATIONAL">Internacional</option>
                    <option value="NATIONAL">Nacional</option>
                  </select>
                )} />
            </Field>
            <Field label="URL de imagen *" error={errors.image?.message}>
              <Controller name="image" control={control} rules={{ required: 'Requerido', pattern: { value: /^https?:\/\/.+/, message: 'URL inválida' } }}
                render={({ field }) => <input {...field} type="url" style={{ ...iS, borderColor: errors.image ? '#ff6b6b' : LINE2 }} />} />
            </Field>
          </div>

          {/* ── Info adicional ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Título de conferencia">
              <Controller name="title" control={control} render={({ field }) => <input {...field} style={iS} placeholder="Tema de su charla" />} />
            </Field>
            <Field label="Cargo / Posición">
              <Controller name="position" control={control} render={({ field }) => <input {...field} style={iS} />} />
            </Field>
            <Field label="Apodo">
              <Controller name="nickname" control={control} render={({ field }) => <input {...field} style={iS} />} />
            </Field>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Controller name="show" control={control}
                render={({ field }) => (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff' }}>
                    <input type="checkbox" checked={field.value} onChange={field.onChange} style={{ accentColor: NEON, width: 16, height: 16 }} />
                    Mostrar en público
                  </label>
                )} />
            </div>
          </div>

          {/* ── Biografía ── */}
          <Field label="Biografía">
            <Controller name="biography" control={control}
              render={({ field }) => <textarea {...field} style={{ ...iS, minHeight: 90, resize: 'vertical' } as React.CSSProperties} />} />
          </Field>

          {/* ── Redes sociales ── */}
          <SectionTitle title="Redes sociales" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Instagram">
              <Controller name="socialMedia.instagram" control={control} render={({ field }) => <input {...field} type="url" style={iS} placeholder="https://instagram.com/…" />} />
            </Field>
            <Field label="Facebook">
              <Controller name="socialMedia.facebook" control={control} render={({ field }) => <input {...field} type="url" style={iS} placeholder="https://facebook.com/…" />} />
            </Field>
            <Field label="X (Twitter)">
              <Controller name="socialMedia.x" control={control} render={({ field }) => <input {...field} type="url" style={iS} placeholder="https://x.com/…" />} />
            </Field>
            <Field label="YouTube">
              <Controller name="socialMedia.youtube" control={control} render={({ field }) => <input {...field} type="url" style={iS} placeholder="https://youtube.com/…" />} />
            </Field>
          </div>

          {/* ── Áreas de experiencia ── */}
          <SectionTitle title="Áreas de experiencia" onAdd={() => setValue('experienceAreas', [...experienceAreas, ''])} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {experienceAreas.map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <Controller name={`experienceAreas.${i}`} control={control}
                  render={({ field }) => <input {...field} style={{ ...iS, flex: 1 }} placeholder="Área de experiencia" />} />
                {experienceAreas.length > 1 && (
                  <button type="button" onClick={() => removeFromStringArray('experienceAreas', experienceAreas, i)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 10px', flexShrink: 0 }}>✕</button>
                )}
              </div>
            ))}
          </div>

          {/* ── Premios ── */}
          <SectionTitle title="Premios y reconocimientos" onAdd={() => setValue('awards', [...awards, ''])} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {awards.map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <Controller name={`awards.${i}`} control={control}
                  render={({ field }) => <input {...field} style={{ ...iS, flex: 1 }} placeholder="Premio o reconocimiento" />} />
                {awards.length > 1 && (
                  <button type="button" onClick={() => removeFromStringArray('awards', awards, i)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 10px', flexShrink: 0 }}>✕</button>
                )}
              </div>
            ))}
          </div>

          {/* ── Metodologías ── */}
          <SectionTitle title="Metodologías creadas" onAdd={() => setValue('createdMethodologies', [...methodologies, ''])} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {methodologies.map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <Controller name={`createdMethodologies.${i}`} control={control}
                  render={({ field }) => <input {...field} style={{ ...iS, flex: 1 }} placeholder="Metodología creada" />} />
                {methodologies.length > 1 && (
                  <button type="button" onClick={() => removeFromStringArray('createdMethodologies', methodologies, i)} className="adm-btn danger" style={{ fontSize: 11, padding: '6px 10px', flexShrink: 0 }}>✕</button>
                )}
              </div>
            ))}
          </div>

          {/* ── Formación académica ── */}
          <SectionTitle title="Formación académica" onAdd={() => appendAcademic({ title: '', institution: '', year: undefined, place: '' })} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {academicFields.map((f, i) => (
              <div key={f.id} style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Controller name={`academicFormations.${i}.title`} control={control}
                      render={({ field }) => <input {...field} style={iS} placeholder="Título académico" />} />
                  </div>
                  <Controller name={`academicFormations.${i}.institution`} control={control}
                    render={({ field }) => <input {...field} style={iS} placeholder="Institución" />} />
                  <Controller name={`academicFormations.${i}.year`} control={control}
                    render={({ field }) => <input {...field} type="number" style={iS} placeholder="Año" onChange={e => field.onChange(parseInt(e.target.value) || undefined)} />} />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Controller name={`academicFormations.${i}.place`} control={control}
                      render={({ field }) => <input {...field} style={iS} placeholder="Lugar" />} />
                  </div>
                </div>
                {academicFields.length > 1 && (
                  <button type="button" onClick={() => removeAcademic(i)} className="adm-btn danger" style={{ fontSize: 11, padding: '5px 10px', alignSelf: 'flex-start' }}>
                    Eliminar formación
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ── Publicaciones ── */}
          <SectionTitle title="Publicaciones" onAdd={() => appendPublication({ title: '', editorial: '', year: undefined, role: '', description: '' })} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {publicationFields.map((f, i) => (
              <div key={f.id} style={{ background: PANEL2, border: `1px solid ${LINE}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Controller name={`publications.${i}.title`} control={control}
                      render={({ field }) => <input {...field} style={iS} placeholder="Título de la publicación" />} />
                  </div>
                  <Controller name={`publications.${i}.editorial`} control={control}
                    render={({ field }) => <input {...field} style={iS} placeholder="Editorial" />} />
                  <Controller name={`publications.${i}.year`} control={control}
                    render={({ field }) => <input {...field} type="number" style={iS} placeholder="Año" onChange={e => field.onChange(parseInt(e.target.value) || undefined)} />} />
                  <Controller name={`publications.${i}.role`} control={control}
                    render={({ field }) => <input {...field} style={iS} placeholder="Rol (Autor, Co-autor…)" />} />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Controller name={`publications.${i}.description`} control={control}
                      render={({ field }) => <textarea {...field} style={{ ...iS, minHeight: 60, resize: 'vertical' } as React.CSSProperties} placeholder="Descripción" />} />
                  </div>
                </div>
                {publicationFields.length > 1 && (
                  <button type="button" onClick={() => removePublication(i)} className="adm-btn danger" style={{ fontSize: 11, padding: '5px 10px', alignSelf: 'flex-start' }}>
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
            <button type="submit" disabled={isLoading || !isValid} style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: NEON, color: INK, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, opacity: isLoading || !isValid ? .5 : 1 }}>
              {isLoading ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
    </ModalShell>
  );
};

export default EditLecturerModal;
