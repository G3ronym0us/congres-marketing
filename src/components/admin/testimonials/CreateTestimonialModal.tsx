'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faExclamationCircle,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { CreateTestimonialInput } from '@/types/testimonials';
import { createTestimonial } from '@/services/testimonials';

interface CreateTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTestimonialModal: React.FC<CreateTestimonialModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateTestimonialInput>({
    defaultValues: {
      firstName: '',
      lastName: '',
      position: '',
      content: '',
      active: true,
    },
  });

  const active = watch('active');

  const onSubmit = async (data: CreateTestimonialInput) => {
    try {
      await createTestimonial(data);
      Swal.fire({
        icon: 'success',
        title: 'Testimonio creado',
        text: 'El testimonio se ha creado correctamente',
        timer: 1500,
        showConfirmButton: false,
      });
      reset();
      onSuccess();
    } catch (error: any) {
      console.error('Error creating testimonial:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo crear el testimonio',
      });
    }
  };

  const toggleActive = () => {
    setValue('active', !active);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Nuevo Testimonio</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <Controller
                name="firstName"
                control={control}
                rules={{
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                  },
                  maxLength: {
                    value: 50,
                    message: 'El nombre no puede exceder 50 caracteres',
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`w-full border ${
                      errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Ingrese el nombre"
                  />
                )}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <Controller
                name="lastName"
                control={control}
                rules={{
                  required: 'El apellido es requerido',
                  minLength: {
                    value: 2,
                    message: 'El apellido debe tener al menos 2 caracteres',
                  },
                  maxLength: {
                    value: 50,
                    message: 'El apellido no puede exceder 50 caracteres',
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`w-full border ${
                      errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Ingrese el apellido"
                  />
                )}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo/Posición *
            </label>
            <Controller
              name="position"
              control={control}
              rules={{
                required: 'El cargo es requerido',
                minLength: {
                  value: 2,
                  message: 'El cargo debe tener al menos 2 caracteres',
                },
                maxLength: {
                  value: 100,
                  message: 'El cargo no puede exceder 100 caracteres',
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full border ${
                    errors.position ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ej: Director de Marketing"
                />
              )}
            />
            {errors.position && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                {errors.position.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido del Testimonio *
            </label>
            <Controller
              name="content"
              control={control}
              rules={{
                required: 'El contenido es requerido',
                minLength: {
                  value: 10,
                  message: 'El contenido debe tener al menos 10 caracteres',
                },
                maxLength: {
                  value: 1000,
                  message: 'El contenido no puede exceder 1000 caracteres',
                },
              }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className={`w-full border ${
                    errors.content ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical`}
                  placeholder="Escriba aquí el testimonio..."
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                {errors.content.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {watch('content')?.length || 0}/1000 caracteres
            </p>
          </div>

          <div>
            <Controller
              name="active"
              control={control}
              render={({ field: { value } }) => (
                <div
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    value
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={toggleActive}
                  role="checkbox"
                  aria-checked={value}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleActive();
                    }
                  }}
                >
                  <div className="flex items-center">
                    <span
                      className={`font-medium ${
                        value ? 'text-green-700' : 'text-gray-700'
                      }`}
                    >
                      Estado: {value ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={value ? faToggleOn : faToggleOff}
                    className={`text-xl ${
                      value ? 'text-green-500' : 'text-gray-400'
                    }`}
                  />
                </div>
              )}
            />
          </div>

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
              disabled={isSubmitting}
              className="py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex-grow"
            >
              {isSubmitting ? 'Creando...' : 'Crear Testimonio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTestimonialModal;