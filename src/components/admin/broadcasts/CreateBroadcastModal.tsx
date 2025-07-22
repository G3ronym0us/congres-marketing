'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import { CreateEmailBroadcastRequest, EmailBroadcastType } from '../../../types/emailBroadcast';
import { emailBroadcastService } from '../../../services/emailBroadcast';
import FileUploader from './FileUploader';
import Swal from 'sweetalert2';

interface CreateBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBroadcastModal({ isOpen, onClose, onSuccess }: CreateBroadcastModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<CreateEmailBroadcastRequest>({
    title: '',
    sender_name: 'Equipo Organizador CNMP 2025',
    content: '',
    type: 'ALL_USERS',
    specific_email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type: EmailBroadcastType) => {
    setFormData(prev => ({
      ...prev,
      type,
      specific_email: type === 'SPECIFIC_EMAIL' ? prev.specific_email : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.type === 'SPECIFIC_EMAIL' && !formData.specific_email) {
        throw new Error('El email específico es requerido');
      }

      if (selectedFiles.length > 0) {
        await emailBroadcastService.createBroadcastWithAttachments(
          {
            title: formData.title,
            sender_name: formData.sender_name,
            content: formData.content,
            type: formData.type,
            specific_email: formData.specific_email || undefined,
          },
          selectedFiles
        );
      } else {
        await emailBroadcastService.createBroadcast(formData);
      }

      Swal.fire({
        icon: 'success',
        title: 'Broadcast creado',
        text: 'El broadcast ha sido creado correctamente',
        timer: 1500,
        showConfirmButton: false,
      });

      // Reset form
      setFormData({
        title: '',
        sender_name: 'Equipo Organizador CNMP 2025',
        content: '',
        type: 'ALL_USERS',
        specific_email: '',
      });
      setSelectedFiles([]);
      
      onSuccess();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al crear el broadcast',
      });
    } finally {
      setLoading(false);
    }
  };

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Vista Previa del Email</h3>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="mb-4">
            <div className="text-sm text-gray-600">De: {formData.sender_name}</div>
            <div className="text-sm text-gray-600">
              Para: {formData.type === 'ALL_USERS' ? 'Todos los usuarios' : formData.specific_email}
            </div>
            <div className="text-lg font-semibold mt-2">{formData.title}</div>
          </div>
          
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{formData.content}</div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm font-medium text-gray-700 mb-2">Adjuntos:</div>
              {selectedFiles.map((file, index) => (
                <div key={index} className="text-sm text-gray-600">
                  📎 {file.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Nuevo Email Broadcast</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Email
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Información importante sobre el congreso"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Remitente
                </label>
                <input
                  type="text"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinatarios
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    checked={formData.type === 'ALL_USERS'}
                    onChange={() => handleTypeChange('ALL_USERS')}
                    className="mr-2"
                  />
                  <span>Todos los usuarios registrados</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    checked={formData.type === 'SPECIFIC_EMAIL'}
                    onChange={() => handleTypeChange('SPECIFIC_EMAIL')}
                    className="mr-2"
                  />
                  <span>Email específico</span>
                </label>
              </div>

              {formData.type === 'SPECIFIC_EMAIL' && (
                <div className="mt-3">
                  <input
                    type="email"
                    name="specific_email"
                    value={formData.specific_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="usuario@example.com"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escriba aquí el contenido del email..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivos Adjuntos (Opcional)
              </label>
              <FileUploader
                onFilesChange={setSelectedFiles}
                maxSizeMB={5}
                acceptedTypes={['pdf', 'doc', 'docx', 'jpg', 'png', 'webp']}
                maxFiles={3}
              />
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                disabled={!formData.title || !formData.content}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faEye} />
                Vista Previa
              </button>

              <div className="space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.title || !formData.content}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creando...' : 'Crear Broadcast'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showPreview && <PreviewModal />}
    </>
  );
}