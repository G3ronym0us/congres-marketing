'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faToggleOn,
  faToggleOff,
  faImage,
  faEye,
  faEyeSlash,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Testimonial, TestimonialFilters } from '@/types/testimonials';
import {
  getTestimonials,
  deleteTestimonial,
  toggleTestimonialActive,
} from '@/services/testimonials';
import CreateTestimonialModal from '@/components/admin/testimonials/CreateTestimonialModal';
import EditTestimonialModal from '@/components/admin/testimonials/EditTestimonialModal';
import ImageUploadModal from '@/components/admin/testimonials/ImageUploadModal';

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [testimonials, searchTerm, showActiveOnly]);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los testimonios',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTestimonials = () => {
    let filtered = testimonials;

    if (showActiveOnly) {
      filtered = filtered.filter((t) => t.active);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.firstName.toLowerCase().includes(searchLower) ||
          t.lastName.toLowerCase().includes(searchLower) ||
          t.position.toLowerCase().includes(searchLower) ||
          t.content.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTestimonials(filtered);
    setCurrentPage(1);
  };

  const handleToggleActive = async (testimonial: Testimonial) => {
    try {
      await toggleTestimonialActive(testimonial.id);
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === testimonial.id ? { ...t, active: !t.active } : t
        )
      );
      Swal.fire({
        icon: 'success',
        title: 'Estado actualizado',
        text: `Testimonio ${testimonial.active ? 'desactivado' : 'activado'} correctamente`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error toggling testimonial:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estado del testimonio',
      });
    }
  };

  const handleDelete = async (testimonial: Testimonial) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el testimonio de ${testimonial.firstName} ${testimonial.lastName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteTestimonial(testimonial.id);
        setTestimonials((prev) => prev.filter((t) => t.id !== testimonial.id));
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Testimonio eliminado correctamente',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el testimonio',
        });
      }
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsEditModalOpen(true);
  };

  const handleImageUpload = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsImageModalOpen(true);
  };

  const handleTestimonialCreated = () => {
    loadTestimonials();
    setIsCreateModalOpen(false);
  };

  const handleTestimonialUpdated = () => {
    loadTestimonials();
    setIsEditModalOpen(false);
    setSelectedTestimonial(null);
  };

  const handleImageUpdated = () => {
    loadTestimonials();
    setIsImageModalOpen(false);
    setSelectedTestimonial(null);
  };

  // Paginación
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredTestimonials.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Testimonios
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              Nuevo Testimonio
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar testimonios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowActiveOnly(!showActiveOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showActiveOnly
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <FontAwesomeIcon icon={showActiveOnly ? faEye : faEyeSlash} />
                {showActiveOnly ? 'Solo activos' : 'Todos'}
              </button>
            </div>
          </div>
        </div>

        {/* Lista de testimonios */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-gray-400 text-4xl mb-4"
              />
              <p className="text-gray-500">No se encontraron testimonios</p>
            </div>
          ) : (
            <>
              {/* Vista desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Persona
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Cargo
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Testimonio
                      </th>
                      <th className="text-center p-4 font-medium text-gray-700">
                        Imagen
                      </th>
                      <th className="text-center p-4 font-medium text-gray-700">
                        Estado
                      </th>
                      <th className="text-center p-4 font-medium text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((testimonial) => (
                      <tr key={testimonial.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {testimonial.firstName} {testimonial.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {testimonial.id}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">
                          {testimonial.position}
                        </td>
                        <td className="p-4">
                          <div className="max-w-xs truncate text-gray-700">
                            {testimonial.content}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {testimonial.image ? (
                            <img
                              src={testimonial.image}
                              alt={`${testimonial.firstName} ${testimonial.lastName}`}
                              className="w-10 h-10 rounded-full object-cover mx-auto"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                              <FontAwesomeIcon icon={faImage} className="text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              testimonial.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {testimonial.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(testimonial)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Editar"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleImageUpload(testimonial)}
                              className="text-purple-600 hover:text-purple-800 p-1"
                              title="Subir imagen"
                            >
                              <FontAwesomeIcon icon={faImage} />
                            </button>
                            <button
                              onClick={() => handleToggleActive(testimonial)}
                              className={`p-1 ${
                                testimonial.active
                                  ? 'text-orange-600 hover:text-orange-800'
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                              title={testimonial.active ? 'Desactivar' : 'Activar'}
                            >
                              <FontAwesomeIcon
                                icon={testimonial.active ? faToggleOff : faToggleOn}
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(testimonial)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Eliminar"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista móvil */}
              <div className="md:hidden">
                {currentItems.map((testimonial) => (
                  <div key={testimonial.id} className="p-4 border-b">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {testimonial.firstName} {testimonial.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{testimonial.position}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          testimonial.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {testimonial.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {testimonial.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {testimonial.image && (
                          <img
                            src={testimonial.image}
                            alt={`${testimonial.firstName} ${testimonial.lastName}`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="text-blue-600 p-1"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleImageUpload(testimonial)}
                          className="text-purple-600 p-1"
                        >
                          <FontAwesomeIcon icon={faImage} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(testimonial)}
                          className={
                            testimonial.active ? 'text-orange-600' : 'text-green-600'
                          }
                        >
                          <FontAwesomeIcon
                            icon={testimonial.active ? faToggleOff : faToggleOn}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial)}
                          className="text-red-600 p-1"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="p-4 flex justify-center">
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <CreateTestimonialModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleTestimonialCreated}
      />

      {selectedTestimonial && (
        <>
          <EditTestimonialModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTestimonial(null);
            }}
            testimonial={selectedTestimonial}
            onSuccess={handleTestimonialUpdated}
          />

          <ImageUploadModal
            isOpen={isImageModalOpen}
            onClose={() => {
              setIsImageModalOpen(false);
              setSelectedTestimonial(null);
            }}
            testimonial={selectedTestimonial}
            onSuccess={handleImageUpdated}
          />
        </>
      )}
    </div>
  );
};

export default TestimonialsAdmin;