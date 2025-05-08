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

    const updatedAttendee: AttendeeData = {
      ...attendee,
      [name]: value,
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
            Nombre *
          </label>
          <input
            type="text"
            id={`nombre-${ticketId}`}
            name="name"
            value={attendee.name}
            onChange={handleInputChange}
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor={`apellido-${ticketId}`}
            className="block text-white text-sm mb-1"
          >
            Apellido *
          </label>
          <input
            type="text"
            id={`lastname-${ticketId}`}
            name="lastname"
            value={attendee.lastname}
            onChange={handleInputChange}
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor={`identificacion-${ticketId}`}
            className="block text-white text-sm mb-1"
          >
            Documento de Identidad *
          </label>
          <input
            type="text"
            id={`document-${ticketId}`}
            name="document"
            value={attendee.document}
            onChange={handleInputChange}
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
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
