'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AdminCreateTicketInput, TicketType } from '@/types/tickets';
import { useLocalidades } from '@/hooks/useLocalidades';
import { generateReference } from '@/utils/utils';
import { DarkModal, DarkField, DarkInput, DarkSelect, MemoriesToggle } from './ModalParts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: AdminCreateTicketInput) => void;
}

const TicketModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const { localidades } = useLocalidades();
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<AdminCreateTicketInput>({
    defaultValues: { reference: '', name: '', lastname: '', email: '', document: '', phone: '', type: 'General' as TicketType, withMemories: false },
    mode: 'onChange',
  });

  const selectedType = watch('type');

  useEffect(() => { setValue('reference', generateReference()); }, []);

  useEffect(() => {
    if (selectedType && localidades[selectedType]) {
      setValue('withMemories', localidades[selectedType].withMemories || false);
    }
  }, [selectedType, setValue]);

  const toggleMemories = () => {
    const t = watch('type');
    if (t && localidades[t]?.price === 0) return;
    setValue('withMemories', !watch('withMemories'), { shouldValidate: true });
  };

  if (!isOpen) return null;

  return (
    <DarkModal title="Nuevo ticket" onClose={onClose}>
      <form onSubmit={handleSubmit(onSave)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <DarkField label="Nombres *" error={errors.name?.message}>
          <Controller name="name" control={control}
            rules={{ required: 'Requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' } }}
            render={({ field }) => <DarkInput {...field} placeholder="Nombres" hasError={!!errors.name} />}
          />
        </DarkField>

        <DarkField label="Apellidos *" error={errors.lastname?.message}>
          <Controller name="lastname" control={control}
            rules={{ required: 'Requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' } }}
            render={({ field }) => <DarkInput {...field} placeholder="Apellidos" hasError={!!errors.lastname} />}
          />
        </DarkField>

        <DarkField label="Correo electrónico *" error={errors.email?.message}>
          <Controller name="email" control={control}
            rules={{ required: 'Requerido', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato inválido' } }}
            render={({ field }) => <DarkInput {...field} type="email" placeholder="ejemplo@correo.com" hasError={!!errors.email} />}
          />
        </DarkField>

        <DarkField label="Documento *" error={errors.document?.message}>
          <Controller name="document" control={control}
            rules={{ required: 'Requerido' }}
            render={({ field }) => <DarkInput {...field} placeholder="Número de documento" hasError={!!errors.document} />}
          />
        </DarkField>

        <DarkField label="Teléfono" error={errors.phone?.message}>
          <Controller name="phone" control={control}
            rules={{ pattern: { value: /^\+?[1-9]\d{1,14}$/, message: 'Formato inválido (+57123456789)' } }}
            render={({ field }) => <DarkInput {...field} type="tel" placeholder="+57123456789" hasError={!!errors.phone} />}
          />
        </DarkField>

        <DarkField label="Tipo de localidad">
          <Controller name="type" control={control}
            render={({ field }) => (
              <DarkSelect {...field}>
                {Object.values(TicketType).map(t => (
                  <option key={t} value={t}>
                    {localidades[t]?.name || t} — ${(localidades[t]?.price || 0).toLocaleString('es-CO')}
                  </option>
                ))}
              </DarkSelect>
            )}
          />
        </DarkField>

        <Controller name="withMemories" control={control}
          render={({ field: { value } }) => {
            const t = watch('type');
            const disabled = !!(t && localidades[t]?.price === 0);
            return <MemoriesToggle checked={value} disabled={disabled} onToggle={toggleMemories} />;
          }}
        />

        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <button type="button" onClick={onClose}
            style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 600, fontSize: 13 }}>
            Cancelar
          </button>
          <button type="submit"
            style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: '#04EE62', color: '#1A1418', cursor: 'pointer', fontFamily: 'Oxanium, sans-serif', fontWeight: 800, fontSize: 13, letterSpacing: '.04em' }}>
            Agregar ticket
          </button>
        </div>
      </form>
    </DarkModal>
  );
};

export default TicketModal;
