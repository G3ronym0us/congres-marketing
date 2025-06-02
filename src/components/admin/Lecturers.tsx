'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faFileDownload,
  faMailBulk,
  faTimes,
  faTrash,
  faSearch,
  faCheck,
  faExclamationCircle,
  faPlus,
  faEye,
  faEyeSlash,
  faImage,
  faGlobe,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import CreateLecturerModal from './Modals/CreateLecturer';
import EditLecturerModal from './Modals/EditLecturer';
import {
  CreateAcademicFormation,
  CreatePublication,
  CreateLecturerData,
  Lecturer,
  UpdateLecturerData,
} from '@/types/lecturer';
import {
  create,
  deleteLecturer as deleteLecturerService,
  getAll,
  toggleShow,
  update,
  uploadImage,
} from '@/services/user';

const LecturersTable = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [data, setData] = React.useState<Lecturer[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpenEdit, setIsOpenEdit] = React.useState(false);
  const [lecturerEdit, setLecturerEdit] = React.useState<Lecturer | null>(null);
  const [typeFilter, setTypeFilter] = React.useState<
    'all' | 'INTERNATIONAL' | 'NATIONAL'
  >('all');
  const [showFilter, setShowFilter] = React.useState<
    'all' | 'visible' | 'hidden'
  >('all');

  React.useEffect(() => {
    getLecturers();
  }, []);

  const getLecturers = async () => {
    setIsLoading(true);
    try {
      const lecturers = await getAll();
      setData(lecturers);
    } catch (error) {
      console.error('Error obteniendo conferencistas:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al cargar conferencistas',
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = data.filter((item: Lecturer) => {
    // Filtro de búsqueda
    const matchesSearch =
      !searchTerm ||
      item.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alt?.toLowerCase().includes(searchTerm.toLowerCase());
    // Filtro de tipo
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    console.log(`matchesType`, matchesType, typeFilter, item.type);
    // Filtro de visibilidad
    const matchesShow =
      showFilter === 'all' ||
      (showFilter === 'visible' && item.show) ||
      (showFilter === 'hidden' && !item.show);
    return matchesSearch && matchesType && matchesShow;
  });

  // Paginación
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleChangePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleVisibility = async (lecturer: Lecturer) => {
    try {
      await toggleShow(lecturer.id);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Conferencista ${lecturer.show ? 'ocultado' : 'mostrado'}`,
        showConfirmButton: false,
        timer: 1500,
      });
      getLecturers();
    } catch (error) {
      console.error('Error cambiando visibilidad:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al cambiar visibilidad',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const deleteLecturer = async (id: number, name: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará permanentemente a ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteLecturerService(id);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Conferencista eliminado',
          showConfirmButton: false,
          timer: 1500,
        });
        getLecturers();
      } catch (error) {
        console.error('Error eliminando conferencista:', error);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al eliminar conferencista',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const editLecturer = (lecturer: Lecturer) => {
    setIsOpenEdit(true);
    setLecturerEdit(lecturer);
  };

  const handleCreateLecturer = async (
    lecturer: CreateLecturerData,
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const response = await create(lecturer);
      if (response instanceof Error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.message,
        });
        return { success: false, message: response.message };
      }
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Conferencista creado',
        showConfirmButton: false,
        timer: 1500,
      });
      setIsOpen(false);
      getLecturers();
      return { success: true, message: 'Conferencista creado' };
    } catch (error) {
      console.error('Error al crear conferencista:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el conferencista',
      });
      return { success: false, message: 'No se pudo crear el conferencista' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLecturer = async (lecturer: UpdateLecturerData) => {
    if (!lecturerEdit) return;

    setIsLoading(true);
    try {
      const cleanData: UpdateLecturerData = {
        ...lecturer,
        academicFormations: lecturer.academicFormations?.map((formation) => ({
          title: formation.title,
          institution: formation.institution,
          year: formation.year,
          place: formation.place,
        })),
        publications: lecturer.publications?.map((publication) => ({
          title: publication.title,
          editorial: publication.editorial,
          year: publication.year,
          role: publication.role,
          description: publication.description,
        })),
      };
      await update(lecturerEdit.id, cleanData);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Conferencista actualizado',
        showConfirmButton: false,
        timer: 1500,
      });
      setIsOpenEdit(false);
      getLecturers();
    } catch (error) {
      console.error('Error al actualizar conferencista:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el conferencista',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (lecturer: Lecturer, file: File) => {
    try {
      await uploadImage(lecturer.id, file);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Imagen actualizada',
        showConfirmButton: false,
        timer: 1500,
      });
      getLecturers();
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al subir imagen',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Cabecera con búsqueda y filtros */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Lista de Conferencistas
            </h2>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors w-full sm:w-auto"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <span>Nuevo Conferencista</span>
            </button>
          </div>

          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar conferencista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value as 'all' | 'INTERNATIONAL' | 'NATIONAL',
                )
              }
              className="py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="INTERNATIONAL">Internacionales</option>
              <option value="NATIONAL">Nacionales</option>
            </select>

            <select
              value={showFilter}
              onChange={(e) =>
                setShowFilter(e.target.value as 'all' | 'visible' | 'hidden')
              }
              className="py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="visible">Visibles</option>
              <option value="hidden">Ocultos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de conferencistas - Versión escritorio */}
      <div className="hidden md:block overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-gray-400 text-4xl mb-2"
            />
            <p>No hay conferencistas disponibles</p>
          </div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm leading-normal">
                <th className="py-3 px-6 text-left">Imagen</th>
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-center">Tipo</th>
                <th className="py-3 px-6 text-center">País</th>
                <th className="py-3 px-6 text-center">Estado</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {currentItems.map((item: Lecturer) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-6">
                    <div className="relative w-12 h-12">
                      <img
                        src={item.image}
                        alt={`${item.firstName} ${item.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div>
                      <div className="font-medium">
                        {item.firstName} {item.lastName}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {item.position}
                      </div>
                      {item.title && (
                        <div className="text-blue-600 text-xs italic">
                          "{item.title}"
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                        item.type === 'INTERNATIONAL'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={item.type === 'INTERNATIONAL' ? faGlobe : faFlag}
                        className="mr-1"
                      />
                      {item.type === 'INTERNATIONAL'
                        ? 'Internacional'
                        : 'Nacional'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center text-gray-500">
                    {item.country}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                        item.show
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={item.show ? faEye : faEyeSlash}
                        className="mr-1"
                      />
                      {item.show ? 'Visible' : 'Oculto'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-4">
                      <button
                        onClick={() => toggleVisibility(item)}
                        className={`transform hover:scale-110 transition-all ${
                          item.show
                            ? 'hover:text-red-500'
                            : 'hover:text-green-500'
                        } text-gray-500`}
                        title={item.show ? 'Ocultar' : 'Mostrar'}
                      >
                        <FontAwesomeIcon
                          icon={item.show ? faEyeSlash : faEye}
                        />
                      </button>
                      <label
                        className="transform hover:scale-110 hover:text-blue-500 transition-all text-gray-500 cursor-pointer"
                        title="Cambiar imagen"
                      >
                        <FontAwesomeIcon icon={faImage} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(item, file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => editLecturer(item)}
                        className="transform hover:scale-110 hover:text-blue-500 transition-all text-gray-500"
                        title="Editar conferencista"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() =>
                          deleteLecturer(
                            item.id,
                            `${item.firstName} ${item.lastName}`,
                          )
                        }
                        className="transform hover:scale-110 hover:text-red-500 transition-all text-gray-500"
                        title="Eliminar conferencista"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Vista móvil de conferencistas - Tarjetas */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-gray-400 text-4xl mb-2"
            />
            <p>No hay conferencistas disponibles</p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {currentItems.map((item: Lecturer) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <img
                    src={item.image}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {item.firstName} {item.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{item.position}</p>
                    <p className="text-xs text-gray-400">{item.country}</p>
                    {item.title && (
                      <p className="text-xs text-blue-600 italic mt-1">
                        "{item.title}"
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-center ${
                        item.type === 'INTERNATIONAL'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.type === 'INTERNATIONAL' ? 'INT' : 'NAC'}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-center ${
                        item.show
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <FontAwesomeIcon icon={item.show ? faEye : faEyeSlash} />
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => toggleVisibility(item)}
                    className={`transform hover:scale-110 transition-all ${
                      item.show ? 'hover:text-red-500' : 'hover:text-green-500'
                    } text-gray-500`}
                    aria-label={item.show ? 'Ocultar' : 'Mostrar'}
                  >
                    <FontAwesomeIcon icon={item.show ? faEyeSlash : faEye} />
                  </button>
                  <label
                    className="transform hover:scale-110 hover:text-blue-500 transition-all text-gray-500 cursor-pointer"
                    aria-label="Cambiar imagen"
                  >
                    <FontAwesomeIcon icon={faImage} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(item, file);
                      }}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => editLecturer(item)}
                    className="transform hover:scale-110 hover:text-blue-500 transition-all text-gray-500"
                    aria-label="Editar conferencista"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() =>
                      deleteLecturer(
                        item.id,
                        `${item.firstName} ${item.lastName}`,
                      )
                    }
                    className="transform hover:scale-110 hover:text-red-500 transition-all text-gray-500"
                    aria-label="Eliminar conferencista"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {!isLoading && data.length > 0 && (
        <div className="p-4 flex items-center justify-center sm:justify-end">
          <div className="flex flex-wrap justify-center gap-1">
            {totalPages > 5 && currentPage > 3 && (
              <button
                onClick={() => handleChangePage(1)}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                1
              </button>
            )}

            {totalPages > 5 && currentPage > 3 && (
              <span className="px-2 py-1 text-gray-500">...</span>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 5) return true;
                return page >= currentPage - 1 && page <= currentPage + 1;
              })
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handleChangePage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 py-1 text-gray-500">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => handleChangePage(totalPages)}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {totalPages}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Total: {data.length}</span>
          <span>Visibles: {data.filter((l) => l.show).length}</span>
          <span>
            Internacionales:{' '}
            {data.filter((l) => l.type === 'INTERNATIONAL').length}
          </span>
          <span>
            Nacionales: {data.filter((l) => l.type === 'NATIONAL').length}
          </span>
        </div>
      </div>

      {/* Modales */}
      {isOpen && (
        <CreateLecturerModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={handleCreateLecturer}
        />
      )}
      {isOpenEdit && lecturerEdit && (
        <EditLecturerModal
          isOpen={isOpenEdit}
          onClose={() => setIsOpenEdit(false)}
          onSave={handleEditLecturer}
          lecturer={lecturerEdit}
        />
      )}
    </div>
  );
};

export default LecturersTable;
