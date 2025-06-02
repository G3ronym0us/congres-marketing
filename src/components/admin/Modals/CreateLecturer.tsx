'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  CreateLecturerData,
  CreateAcademicFormation,
  CreatePublication,
} from '@/types/lecturer';

interface CreateLecturerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lecturer: CreateLecturerData) => Promise<{ success: boolean; message: string }>;
}

const CreateLecturerModal: React.FC<CreateLecturerModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  // Estados básicos
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [alt, setAlt] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [type, setType] = React.useState<'INTERNATIONAL' | 'NATIONAL'>(
    'INTERNATIONAL',
  );
  const [position, setPosition] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [biography, setBiography] = React.useState('');
  const [image, setImage] = React.useState('');
  const [show, setShow] = React.useState(true);

  // Estados para redes sociales
  const [instagram, setInstagram] = React.useState('');
  const [facebook, setFacebook] = React.useState('');
  const [x, setX] = React.useState('');
  const [youtube, setYoutube] = React.useState('');

  // Estados para arrays
  const [experienceAreas, setExperienceAreas] = React.useState<string[]>(['']);
  const [awards, setAwards] = React.useState<string[]>(['']);
  const [createdMethodologies, setCreatedMethodologies] = React.useState<
    string[]
  >(['']);

  // Estados para formación académica
  const [academicFormations, setAcademicFormations] = React.useState<
    CreateAcademicFormation[]
  >([{ title: '', institution: '', year: undefined, place: '' }]);

  // Estados para publicaciones
  const [publications, setPublications] = React.useState<CreatePublication[]>([
    { title: '', editorial: '', year: undefined, role: '', description: '' },
  ]);

  const [isLoading, setIsLoading] = React.useState(false);

  // Generar alt automáticamente
  React.useEffect(() => {
    if (firstName && lastName) {
      const generatedAlt =
        `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
          .replace(/[^a-z0-9-]/g, '')
          .replace(/--+/g, '-');
      setAlt(generatedAlt);
    } else if (firstName) {
      const generatedAlt = firstName
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-');
      setAlt(generatedAlt);
    }
  }, [firstName, lastName]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setAlt('');
    setTitle('');
    setCountry('');
    setType('INTERNATIONAL');
    setPosition('');
    setNickname('');
    setBiography('');
    setImage('');
    setShow(true);
    setInstagram('');
    setFacebook('');
    setX('');
    setYoutube('');
    setExperienceAreas(['']);
    setAwards(['']);
    setCreatedMethodologies(['']);
    setAcademicFormations([
      { title: '', institution: '', year: undefined, place: '' },
    ]);
    setPublications([
      { title: '', editorial: '', year: undefined, role: '', description: '' },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const lecturerData: CreateLecturerData = {
        firstName,
        lastName: lastName || undefined,
        alt,
        title: title || undefined,
        country,
        type,
        position: position || undefined,
        nickname: nickname || undefined,
        biography: biography || undefined,
        image,
        show,
        socialMedia: {
          instagram: instagram || undefined,
          facebook: facebook || undefined,
          x: x || undefined,
          youtube: youtube || undefined,
        },
        experienceAreas: experienceAreas.filter((area) => area.trim() !== ''),
        awards: awards.filter((award) => award.trim() !== ''),
        createdMethodologies: createdMethodologies.filter(
          (method) => method.trim() !== '',
        ),
        academicFormations: academicFormations.filter(
          (formation) => formation.title.trim() !== '',
        ),
        publications: publications.filter((pub) => pub.title.trim() !== ''),
      };

      const response = await onSave(lecturerData);
      if (response.success) {
        resetForm();
      }
    } catch (error) {
      console.error('Error creating lecturer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Funciones para manejar arrays dinámicos
  const addExperienceArea = () => setExperienceAreas([...experienceAreas, '']);
  const removeExperienceArea = (index: number) => {
    if (experienceAreas.length > 1) {
      setExperienceAreas(experienceAreas.filter((_, i) => i !== index));
    }
  };
  const updateExperienceArea = (index: number, value: string) => {
    const updated = [...experienceAreas];
    updated[index] = value;
    setExperienceAreas(updated);
  };

  const addAward = () => setAwards([...awards, '']);
  const removeAward = (index: number) => {
    if (awards.length > 1) {
      setAwards(awards.filter((_, i) => i !== index));
    }
  };
  const updateAward = (index: number, value: string) => {
    const updated = [...awards];
    updated[index] = value;
    setAwards(updated);
  };

  const addMethodology = () =>
    setCreatedMethodologies([...createdMethodologies, '']);
  const removeMethodology = (index: number) => {
    if (createdMethodologies.length > 1) {
      setCreatedMethodologies(
        createdMethodologies.filter((_, i) => i !== index),
      );
    }
  };
  const updateMethodology = (index: number, value: string) => {
    const updated = [...createdMethodologies];
    updated[index] = value;
    setCreatedMethodologies(updated);
  };

  const addAcademicFormation = () => {
    setAcademicFormations([
      ...academicFormations,
      { title: '', institution: '', year: undefined, place: '' },
    ]);
  };
  const removeAcademicFormation = (index: number) => {
    if (academicFormations.length > 1) {
      setAcademicFormations(academicFormations.filter((_, i) => i !== index));
    }
  };
  const updateAcademicFormation = (
    index: number,
    field: keyof CreateAcademicFormation,
    value: string | number,
  ) => {
    const updated = [...academicFormations];
    updated[index] = { ...updated[index], [field]: value };
    setAcademicFormations(updated);
  };

  const addPublication = () => {
    setPublications([
      ...publications,
      { title: '', editorial: '', year: undefined, role: '', description: '' },
    ]);
  };
  const removePublication = (index: number) => {
    if (publications.length > 1) {
      setPublications(publications.filter((_, i) => i !== index));
    }
  };
  const updatePublication = (
    index: number,
    field: keyof CreatePublication,
    value: string | number,
  ) => {
    const updated = [...publications];
    updated[index] = { ...updated[index], [field]: value };
    setPublications(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Crear Nuevo Conferencista
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (Alt) *
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                required
                placeholder="se-genera-automaticamente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País *
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as 'INTERNATIONAL' | 'NATIONAL')
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INTERNATIONAL">Internacional</option>
                <option value="NATIONAL">Nacional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen *
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título de Conferencia
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo/Posición
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apodo
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={show}
                  onChange={(e) => setShow(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Mostrar en público
                </span>
              </label>
            </div>
          </div>

          {/* Biografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <textarea
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/usuario"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/usuario"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X (Twitter)
                </label>
                <input
                  type="url"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  placeholder="https://x.com/usuario"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/usuario"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onClick={addExperienceArea}
                className="text-blue-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {experienceAreas.map((area, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) =>
                      updateExperienceArea(index, e.target.value)
                    }
                    placeholder="Área de experiencia"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {experienceAreas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperienceArea(index)}
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
                onClick={addAward}
                className="text-blue-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {awards.map((award, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={award}
                    onChange={(e) => updateAward(index, e.target.value)}
                    placeholder="Premio o reconocimiento"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {awards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAward(index)}
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
                onClick={addMethodology}
                className="text-blue-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {createdMethodologies.map((methodology, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={methodology}
                    onChange={(e) => updateMethodology(index, e.target.value)}
                    placeholder="Metodología creada"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {createdMethodologies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMethodology(index)}
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
                onClick={addAcademicFormation}
                className="text-blue-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Agregar
              </button>
            </div>
            <div className="space-y-4">
              {academicFormations.map((formation, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={formation.title}
                        onChange={(e) =>
                          updateAcademicFormation(
                            index,
                            'title',
                            e.target.value,
                          )
                        }
                        placeholder="Título académico"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      value={formation.institution || ''}
                      onChange={(e) =>
                        updateAcademicFormation(
                          index,
                          'institution',
                          e.target.value,
                        )
                      }
                      placeholder="Institución"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={formation.year || ''}
                      onChange={(e) =>
                        updateAcademicFormation(
                          index,
                          'year',
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="Año"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={formation.place || ''}
                        onChange={(e) =>
                          updateAcademicFormation(
                            index,
                            'place',
                            e.target.value,
                          )
                        }
                        placeholder="Lugar"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  {academicFormations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAcademicFormation(index)}
                      className="mt-2 text-red-600 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      Eliminar formación
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Publicaciones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900">
                Publicaciones
              </h4>
              <button
                type="button"
                onClick={addPublication}
                className="text-blue-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Agregar
              </button>
            </div>
            <div className="space-y-4">
              {publications.map((publication, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={publication.title}
                        onChange={(e) =>
                          updatePublication(index, 'title', e.target.value)
                        }
                        placeholder="Título de la publicación"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      value={publication.editorial || ''}
                      onChange={(e) =>
                        updatePublication(index, 'editorial', e.target.value)
                      }
                      placeholder="Editorial"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={publication.year || ''}
                      onChange={(e) =>
                        updatePublication(
                          index,
                          'year',
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="Año"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={publication.role || ''}
                      onChange={(e) =>
                        updatePublication(index, 'role', e.target.value)
                      }
                      placeholder="Rol (Autor, Co-autor, etc.)"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="md:col-span-2">
                      <textarea
                        value={publication.description || ''}
                        onChange={(e) =>
                          updatePublication(
                            index,
                            'description',
                            e.target.value,
                          )
                        }
                        placeholder="Descripción"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  {publications.length > 1 && (
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
              disabled={isLoading || !firstName || !country || !image}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creando...' : 'Crear Conferencista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLecturerModal;
