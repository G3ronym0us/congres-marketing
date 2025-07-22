'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEnvelope, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { EmailBroadcast } from '../../../types/emailBroadcast';
import { emailBroadcastService } from '../../../services/emailBroadcast';
import Swal from 'sweetalert2';

interface BroadcastDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast: EmailBroadcast;
  onResend: () => void;
  onUpdate: () => void;
}

export default function BroadcastDetailModal({
  isOpen,
  onClose,
  broadcast,
  onResend,
  onUpdate
}: BroadcastDetailModalProps) {
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      SENDING: { color: 'bg-blue-100 text-blue-800', text: 'Enviando' },
      COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Completado' },
      FAILED: { color: 'bg-red-100 text-red-800', text: 'Fallido' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = () => {
    if (broadcast.total_recipients === 0) return 0;
    return Math.round((broadcast.sent_count / broadcast.total_recipients) * 100);
  };

  const handleCustomResend = async () => {
    setResending(true);
    try {
      await emailBroadcastService.resendBroadcast(broadcast.id, resendEmail || undefined);
      setResendEmail('');
      
      Swal.fire({
        icon: 'success',
        title: 'Reenviado',
        text: 'El broadcast se ha reenviado correctamente',
        timer: 1500,
        showConfirmButton: false,
      });
      
      onUpdate();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo reenviar el broadcast',
      });
    } finally {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Detalle del Broadcast</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{broadcast.title}</h3>
                <p className="text-gray-600">Por: {broadcast.sender_name}</p>
              </div>
              {getStatusBadge(broadcast.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Tipo:</span>
                <p className="text-gray-900">
                  {broadcast.type === 'ALL_USERS' ? 'Todos los usuarios' : 'Email específico'}
                  {broadcast.specific_email && (
                    <span className="block text-sm text-gray-600">{broadcast.specific_email}</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Fecha de creación:</span>
                <p className="text-gray-900 flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  {formatDate(broadcast.createdAt)}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progreso de envío</span>
                <span>{broadcast.sent_count}/{broadcast.total_recipients} ({getProgressPercentage()}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              {broadcast.failed_count > 0 && (
                <p className="text-sm text-red-600 mt-1">
                  {broadcast.failed_count} emails fallaron en el envío
                </p>
              )}
            </div>

            {broadcast.error_message && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <span className="text-sm font-medium text-red-800">Error:</span>
                <p className="text-sm text-red-700 mt-1">{broadcast.error_message}</p>
              </div>
            )}
          </div>

          {/* Contenido del email */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contenido del Email</h4>
            <div className="bg-white p-4 rounded-lg border">
              <div className="whitespace-pre-wrap text-gray-900">{broadcast.content}</div>
            </div>
          </div>

          {/* Archivos adjuntos */}
          {broadcast.attachments && broadcast.attachments.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Archivos Adjuntos</h4>
              <div className="space-y-2">
                {broadcast.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600 bg-white p-2 rounded border">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {attachment.split('/').pop()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reenvío */}
          {broadcast.status === 'COMPLETED' && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Reenviar Broadcast
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email específico (opcional)
                  </label>
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dejar vacío para reenviar a todos los destinatarios originales"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCustomResend}
                    disabled={resending}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                    {resending ? 'Reenviando...' : 'Reenviar Broadcast'}
                  </button>
                  <button
                    onClick={onResend}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Reenviar a Todos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}