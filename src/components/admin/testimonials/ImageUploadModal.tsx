'use client';

import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUpload,
  faTrash,
  faImage,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Testimonial } from '@/types/testimonials';
import { uploadTestimonialImage, deleteTestimonialImage } from '@/services/testimonials';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: Testimonial;
  onSuccess: () => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  testimonial,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato no válido',
        text: 'Solo se permiten archivos JPEG, JPG, PNG y WEBP',
      });
      return;
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'El archivo no puede exceder 5MB',
      });
      return;
    }

    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      await uploadTestimonialImage(testimonial.id, selectedFile);
      
      Swal.fire({
        icon: 'success',
        title: 'Imagen subida',
        text: 'La imagen se ha subido correctamente',
        timer: 1500,
        showConfirmButton: false,
      });
      
      setSelectedFile(null);
      setPreviewUrl(null);
      onSuccess();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo subir la imagen',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar imagen?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        setDeleting(true);
        await deleteTestimonialImage(testimonial.id);
        
        Swal.fire({
          icon: 'success',
          title: 'Imagen eliminada',
          text: 'La imagen se ha eliminado correctamente',
          timer: 1500,
          showConfirmButton: false,
        });
        
        onSuccess();
      } catch (error: any) {
        console.error('Error deleting image:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo eliminar la imagen',
        });
      } finally {
        setDeleting(false);
      }
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
            Gestionar Imagen
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Imagen actual */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Imagen actual</h4>
            <div className="flex justify-center">
              {testimonial.image ? (
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={`${testimonial.firstName} ${testimonial.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                  <button
                    onClick={handleDeleteImage}
                    disabled={deleting}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    title="Eliminar imagen"
                  >
                    {deleting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    ) : (
                      <FontAwesomeIcon icon={faTrash} size="sm" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <FontAwesomeIcon icon={faImage} className="text-gray-400 text-2xl" />
                </div>
              )}
            </div>
          </div>

          {/* Subir nueva imagen */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              {testimonial.image ? 'Cambiar imagen' : 'Subir imagen'}
            </h4>
            
            {/* Vista previa del archivo seleccionado */}
            {previewUrl && (
              <div className="mb-4">
                <div className="flex justify-center mb-2">
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                  />
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faUpload} />
                        Confirmar
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearSelection}
                    disabled={uploading}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Selector de archivo */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FontAwesomeIcon icon={faUpload} className="text-gray-400 text-3xl mb-2" />
                <span className="text-gray-600 font-medium">
                  Haz clic para seleccionar
                </span>
                <span className="text-gray-500 text-sm mt-1">
                  JPEG, JPG, PNG, WEBP (máx. 5MB)
                </span>
              </label>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-blue-500 mt-0.5 mr-2"
              />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Recomendaciones:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Usa imágenes cuadradas para mejor resultado</li>
                  <li>Resolución mínima recomendada: 300x300px</li>
                  <li>Al subir una nueva imagen, la anterior se eliminará automáticamente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;