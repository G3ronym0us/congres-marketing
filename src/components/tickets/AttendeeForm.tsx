'use client';

import React from 'react';
import { AttendeeData } from '@/types/tickets';

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
    <div className="bg-white/5 p-5 rounded-lg mb-4">
      <h4 className="text-white font-semibold mb-4 pb-2 border-b border-gray-700">
        {localidadNombre} - Boleto #{ticketIndex + 1}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`nombre-${ticketId}`}
            className="block text-white text-sm mb-1"
          >
            Nombre * <span className="text-xs text-gray-400">(máx. 10 caracteres)</span>
          </label>
          <input
            type="text"
            id={`nombre-${ticketId}`}
            name="name"
            value={attendee.name}
            onChange={handleInputChange}
            maxLength={10}
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <div className="mt-1 text-xs text-right text-gray-400">
            {attendee.name ? attendee.name.length : 0}/10
          </div>
        </div>

        <div>
          <label
            htmlFor={`apellido-${ticketId}`}
            className="block text-white text-sm mb-1"
          >
            Apellido * <span className="text-xs text-gray-400">(máx. 10 caracteres)</span>
          </label>
          <input
            type="text"
            id={`apellido-${ticketId}`}
            name="lastname"
            value={attendee.lastname}
            onChange={handleInputChange}
            maxLength={10}
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <div className="mt-1 text-xs text-right text-gray-400">
            {attendee.lastname ? attendee.lastname.length : 0}/10
          </div>
        </div>

        <div>
          <label
            htmlFor={`identificacion-${ticketId}`}
            className="block text-white text-sm mb-1"
          >
            Documento de Identidad * <span className="text-xs text-gray-400">(máx. 10 caracteres)</span>
          </label>
          <input
            type="text"
            id={`identificacion-${ticketId}`}
            name="document"
            value={attendee.document}
            onChange={handleInputChange}
            maxLength={10}
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <div className="mt-1 text-xs text-right text-gray-400">
            {attendee.document ? attendee.document.length : 0}/10
          </div>
        </div>

        <div>
          <label
            htmlFor={`telefono-${ticketId}`}
            className="block text-white text-sm mb-1"
          >
            Teléfono * <span className="text-xs text-gray-400">(solo números, máx. 15 dígitos)</span>
          </label>
          <input
            type="tel"
            id={`telefono-${ticketId}`}
            name="phone"
            value={attendee.phone || ''}
            onChange={handleInputChange}
            maxLength={15}
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
            pattern="[0-9]*"
          />
          <div className="mt-1 text-xs text-right text-gray-400">
            {attendee.phone ? attendee.phone.length : 0}/15
          </div>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor={`email-${ticketId}`}
            className="block text-white text-sm mb-1"
          >
            Correo Electrónico *
          </label>
          <input
            type="email"
            id={`email-${ticketId}`}
            name="email"
            value={attendee.email}
            onChange={handleInputChange}
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
}