'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faMemory,
  faToggleOn,
  faToggleOff,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { AdminEditTicketInput, Ticket, TicketType } from '@/types/tickets';
import { localidadesData } from '@/data/ticketsData';
import { generateReference } from '@/utils/utils';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: AdminEditTicketInput) => void;
  ticket: Ticket;
}

const EditTicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  onSave,
  ticket,
}) => {
  // Configuración de React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AdminEditTicketInput>({
    defaultValues: {
      uuid: ticket.uuid || '',
      name: ticket.name || '',
      lastname: ticket.lastname || '',
      email: ticket.email || '',
      document: ticket.document || '',
      type: ticket.type || 'General' as TicketType,
      withMemories: ticket.withMemories || false,
    },
    mode: 'onChange',
  });

  // Observar el tipo de ticket seleccionado
  const selectedTicketType = watch('type');

  // Actualizar withMemories cuando cambia el tipo de ticket
  useEffect(() => {
    if (selectedTicketType && localidadesData[selectedTicketType]) {
      setValue(
        'withMemories',
        localidadesData[selectedTicketType].withMemories || false,
      );
    }
  }, [selectedTicketType, setValue]);

  // Función para manejar la presentación del formulario
  const onSubmit = (data: AdminEditTicketInput) => {
    onSave(data);
  };

  // Toggle para memorias
  const toggleMemories = () => {
    setValue('withMemories', !watch('withMemories'), { shouldValidate: true });
  };

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {'Editar Ticket'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombres*
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ingrese los nombres"
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos*
            </label>
            <Controller
              name="lastname"
              control={control}
              rules={{
                required: 'El apellido es requerido',
                minLength: {
                  value: 2,
                  message: 'El apellido debe tener al menos 2 caracteres',
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full border ${errors.lastname ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ingrese los apellidos"
                  aria-invalid={errors.lastname ? 'true' : 'false'}
                />
              )}
            />
            {errors.lastname && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                {errors.lastname.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico*
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'El formato de correo electrónico no es válido',
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className={`w-full border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="ejemplo@correo.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documento*
            </label>
            <Controller
              name="document"
              control={control}
              rules={{
                required: 'El documento es requerido',
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full border ${errors.document ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Número de documento"
                  aria-invalid={errors.document ? 'true' : 'false'}
                />
              )}
            />
            {errors.document && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                {errors.document.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Ticket*
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(TicketType).map(
                    (type: TicketType, index: number) => (
                      <option key={index} value={type}>
                        {localidadesData[type]?.name || type} - $
                        {localidadesData[type]?.price || '0'}
                      </option>
                    ),
                  )}
                </select>
              )}
            />
          </div>

          {/* Toggle de "Agregar Memorias" */}
          <Controller
            name="withMemories"
            control={control}
            render={({ field: { value } }) => (
              <div
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  value
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={toggleMemories}
                role="checkbox"
                aria-checked={value}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleMemories();
                  }
                }}
              >
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faMemory}
                    className={`mr-2 ${value ? 'text-blue-500' : 'text-gray-400'}`}
                  />
                  <span
                    className={`font-medium ${value ? 'text-blue-700' : 'text-gray-700'}`}
                  >
                    Agregar Memorias
                  </span>
                </div>
                <FontAwesomeIcon
                  icon={value ? faToggleOn : faToggleOff}
                  className={`text-xl ${value ? 'text-blue-500' : 'text-gray-400'}`}
                />
              </div>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex-grow"
            >
              {'Editar Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTicketModal;
