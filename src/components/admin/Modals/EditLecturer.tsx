'use client';

import React from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  UpdateLecturerData,
  CreatePublication,
  CreateAcademicFormation,
  CreateSocialMedia,
} from '@/types/lecturer';

interface EditLecturerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lecturer: UpdateLecturerData) => Promise<void>;
  lecturer: UpdateLecturerData;
}

const EditLecturerModal: React.FC<EditLecturerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lecturer,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  // Configurar valores por defecto
  const getDefaultValues = (): UpdateLecturerData => ({
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
    experienceAreas: lecturer.experienceAreas?.length
      ? lecturer.experienceAreas
      : [],
    awards: lecturer.awards?.length ? lecturer.awards : [],
    createdMethodologies: lecturer.createdMethodologies?.length
      ? lecturer.createdMethodologies
      : [],
    academicFormations: lecturer.academicFormations?.length
      ? lecturer.academicFormations
      : [],
    publications: lecturer.publications?.length
      ? lecturer.publications
      : [],
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<UpdateLecturerData>({
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  const experienceAreas = useWatch({ control, name: 'experienceAreas' }) || [
    '',
  ];
  const awards = useWatch({ control, name: 'awards' }) || [''];
  const methodologies = useWatch({ control, name: 'createdMethodologies' }) || [
    '',
  ];

  // Funciones helper
  const updateStringArray = (
    fieldName: keyof UpdateLecturerData,
    newArray: string[],
  ) => {
    setValue(fieldName, newArray, { shouldDirty: true, shouldValidate: true });
  };

  const addToStringArray = (
    fieldName: keyof UpdateLecturerData,
    currentArray: string[],
  ) => {
    updateStringArray(fieldName, [...currentArray, '']);
  };

  const removeFromStringArray = (
    fieldName: keyof UpdateLecturerData,
    currentArray: string[],
    index: number,
  ) => {
    if (currentArray.length > 1) {
      updateStringArray(
        fieldName,
        currentArray.filter((_, i) => i !== index),
      );
    }
  };

  const {
    fields: academicFields,
    append: appendAcademic,
    remove: removeAcademic,
  } = useFieldArray({
    control,
    name: 'academicFormations',
  });

  const {
    fields: publicationFields,
    append: appendPublication,
    remove: removePublication,
  } = useFieldArray({
    control,
    name: 'publications',
  });

  // Resetear form cuando cambie el lecturer
  React.useEffect(() => {
    if (lecturer && isOpen) {
      reset(getDefaultValues());
    }
  }, [lecturer, isOpen, reset]);

  const onSubmit = async (data: UpdateLecturerData) => {
    setIsLoading(true);
    try {
      console.log('Datos limpios a enviar:', data);
      await onSave(data);
    } catch (error) {
      console.error('Error updating lecturer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Observar imagen para preview
  const watchedImage = watch('image');
  const watchedFirstName = watch('firstName');
  const watchedLastName = watch('lastName');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Editar Conferencista: {lecturer.firstName} {lecturer.lastName}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Vista previa de imagen actual */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={watchedImage || '/placeholder-avatar.png'}
              alt={`${watchedFirstName} ${watchedLastName}`}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
              }}
            />
            <div>
              <h4 className="font-medium">Vista previa de imagen</h4>
              <p className="text-sm text-gray-600">
                Se actualiza automáticamente al cambiar la URL
              </p>
            </div>
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'El nombre es requerido' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (Alt) *
              </label>
              <Controller
                name="alt"
                control={control}
                rules={{ required: 'El slug es requerido' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.alt ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
              />
              {errors.alt && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.alt.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País *
              </label>
              <Controller
                name="country"
                control={control}
                rules={{ required: 'El país es requerido' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INTERNATIONAL">Internacional</option>
                    <option value="NATIONAL">Nacional</option>
                  </select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen *
              </label>
              <Controller
                name="image"
                control={control}
                rules={{
                  required: 'La imagen es requerida',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Debe ser una URL válida',
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.image ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título de Conferencia
              </label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo/Posición
              </label>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apodo
              </label>
              <Controller
                name="nickname"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div className="flex items-center">
              <Controller
                name="show"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Mostrar en público
                    </span>
                  </label>
                )}
              />
            </div>
          </div>

          {/* Biografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <Controller
              name="biography"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
          </div>

          {/* Redes Sociales */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              Redes Sociales
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <Controller
                  name="socialMedia.instagram"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="url"
                      placeholder="https://instagram.com/usuario"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <Controller
                  name="socialMedia.facebook"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="url"
                      placeholder="https://facebook.com/usuario"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X (Twitter)
                </label>
                <Controller
                  name="socialMedia.x"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="url"
                      placeholder="https://x.com/usuario"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <Controller
                  name="socialMedia.youtube"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="url"
                      placeholder="https://youtube.com/usuario"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Áreas de Experiencia */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900">
                Áreas de Experiencia
              </h4>
              <button
                type="button"
                onClick={() => addToStringArray('experienceAreas', experienceAreas)}
                className="text-blue-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {experienceAreas.map((field, index) => (
                <div key={index} className="flex gap-2">
                  <Controller
                    name={`experienceAreas.${index}`}
                    control={control}
                    render={({ field: inputField }) => (
                      <input
                        {...inputField}
                        type="text"
                        placeholder="Área de experiencia"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  />
                  {experienceAreas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFromStringArray('experienceAreas', experienceAreas, index)}
                      className="text-red-600 hover:text-red-700 px-3"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Premios */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900">
                Premios y Reconocimientos
              </h4>
              <button
                type="button"
                onClick={() => addToStringArray('awards', awards)}
                className="text-blue-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {awards.map((field, index) => (
                <div key={index} className="flex gap-2">
                  <Controller
                    name={`awards.${index}`}
                    control={control}
                    render={({ field: inputField }) => (
                      <input
                        {...inputField}
                        type="text"
                        placeholder="Premio o reconocimiento"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  />
                  {awards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFromStringArray('awards', awards, index)}
                      className="text-red-600 hover:text-red-700 px-3"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Metodologías Creadas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900">
                Metodologías Creadas
              </h4>
              <button
                type="button"
                onClick={() => addToStringArray('createdMethodologies', methodologies)}
                className="text-blue-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {methodologies.map((field, index) => (
                <div key={index} className="flex gap-2">
                  <Controller
                    name={`createdMethodologies.${index}`}
                    control={control}
                    render={({ field: inputField }) => (
                      <input
                        {...inputField}
                        type="text"
                        placeholder="Metodología creada"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  />
                  {methodologies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFromStringArray('createdMethodologies', methodologies, index)}
                      className="text-red-600 hover:text-red-700 px-3"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Formación Académica */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900">
                Formación Académica
              </h4>
              <button
                type="button"
                onClick={() =>
                  appendAcademic({
                    title: '',
                    institution: '',
                    year: undefined,
                    place: '',
                  })
                }
                className="text-blue-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Agregar
              </button>
            </div>
            <div className="space-y-4">
              {academicFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <Controller
                        name={`academicFormations.${index}.title`}
                        control={control}
                        render={({ field: inputField }) => (
                          <input
                            {...inputField}
                            type="text"
                            placeholder="Título académico"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      />
                    </div>
                  </div>
                  {publicationFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePublication(index)}
                      className="mt-2 text-red-600 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      Eliminar publicación
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Conferencista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLecturerModal;
