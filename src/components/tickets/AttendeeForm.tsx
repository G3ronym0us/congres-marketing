'use client';

import React from 'react';
import { AttendeeData } from '@/types/tickets';
import { useLanguage } from '@/context/LanguageContext';

interface AttendeeFormProps {
  ticketId: string;
  attendee: AttendeeData;
  ticketIndex: number;
  localidadNombre: string;
  onChange: (ticketId: string, attendee: AttendeeData) => void;
}

export default function AttendeeForm({
  ticketId,
  attendee,
  ticketIndex,
  localidadNombre,
  onChange,
}: AttendeeFormProps) {
  const { t } = useLanguage();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Limitar a 10 caracteres para nombre, apellido y documento
    let limitedValue = value;
    if (name === 'name' || name === 'lastname' || name === 'document') {
      limitedValue = value.slice(0, 10);
    }

    // Limitar a 15 caracteres para teléfono y asegurar que sean solo números
    if (name === 'phone') {
      // Filtrar solo dígitos
      limitedValue = value.replace(/\D/g, '').slice(0, 15);
    }

    const updatedAttendee: AttendeeData = {
      ...attendee,
      [name]: limitedValue,
    };

    onChange(ticketId, updatedAttendee);
  };

  return (
    <div className="cart-form">
      <h4 className="cart-form-title">
        {localidadNombre} - {t('forms.attendee.ticketLabel', { n: ticketIndex + 1 })}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="cart-field">
          <label htmlFor={`nombre-${ticketId}`}>
            {t('forms.attendee.name')} <span className="req">*</span>{' '}
            <span className="hint">{t('forms.attendee.maxChars')}</span>
          </label>
          <input
            type="text"
            id={`nombre-${ticketId}`}
            name="name"
            value={attendee.name}
            onChange={handleInputChange}
            maxLength={10}
            required
          />
          <div className="ct">{attendee.name ? attendee.name.length : 0}/10</div>
        </div>

        <div className="cart-field">
          <label htmlFor={`apellido-${ticketId}`}>
            {t('forms.attendee.lastname')} <span className="req">*</span>{' '}
            <span className="hint">{t('forms.attendee.maxChars')}</span>
          </label>
          <input
            type="text"
            id={`apellido-${ticketId}`}
            name="lastname"
            value={attendee.lastname}
            onChange={handleInputChange}
            maxLength={10}
            required
          />
          <div className="ct">{attendee.lastname ? attendee.lastname.length : 0}/10</div>
        </div>

        <div className="cart-field">
          <label htmlFor={`identificacion-${ticketId}`}>
            {t('forms.attendee.document')} <span className="req">*</span>{' '}
            <span className="hint">{t('forms.attendee.maxChars')}</span>
          </label>
          <input
            type="text"
            id={`identificacion-${ticketId}`}
            name="document"
            value={attendee.document}
            onChange={handleInputChange}
            maxLength={10}
            required
          />
          <div className="ct">{attendee.document ? attendee.document.length : 0}/10</div>
        </div>

        <div className="cart-field">
          <label htmlFor={`telefono-${ticketId}`}>
            {t('forms.attendee.phone')} <span className="req">*</span>{' '}
            <span className="hint">{t('forms.attendee.phoneHint')}</span>
          </label>
          <input
            type="tel"
            id={`telefono-${ticketId}`}
            name="phone"
            value={attendee.phone || ''}
            onChange={handleInputChange}
            maxLength={15}
            required
            pattern="[0-9]*"
          />
          <div className="ct">{attendee.phone ? attendee.phone.length : 0}/15</div>
        </div>

        <div className="cart-field md:col-span-2">
          <label htmlFor={`email-${ticketId}`}>
            {t('forms.attendee.email')} <span className="req">*</span>
          </label>
          <input
            type="email"
            id={`email-${ticketId}`}
            name="email"
            value={attendee.email}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
}
