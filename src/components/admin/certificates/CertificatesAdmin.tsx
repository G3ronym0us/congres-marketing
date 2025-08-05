'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCertificate,
  faToggleOn,
  faToggleOff,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faDownload,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { getCertificateStatus, toggleCertificates } from '@/services/tickets';

export default function CertificatesAdmin() {
  const [certificatesEnabled, setCertificatesEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadCertificateStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCertificateStatus();
      setCertificatesEnabled(response.enabled);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error loading certificate status:', err);
      setError('Error al cargar el estado de los certificados');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCertificates = async () => {
    try {
      setToggling(true);
      setError(null);
      const newStatus = !certificatesEnabled;
      const response = await toggleCertificates(newStatus);
      setCertificatesEnabled(response.enabled);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error toggling certificates:', err);
      setError('Error al cambiar el estado de los certificados');
    } finally {
      setToggling(false);
    }
  };

  useEffect(() => {
    loadCertificateStatus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faCertificate} className="mr-3 text-blue-600" />
            Gestión de Certificados
          </h2>
          <p className="text-gray-600 mt-1">
            Controla la disponibilidad de certificados de asistencia para los usuarios
          </p>
        </div>
        <button
          onClick={loadCertificateStatus}
          disabled={loading || toggling}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faRefresh} className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-blue-600 mr-3" />
              <span className="text-gray-600">Cargando estado de certificados...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Display */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    certificatesEnabled ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <FontAwesomeIcon 
                      icon={certificatesEnabled ? faCheckCircle : faCertificate} 
                      className={`text-xl ${certificatesEnabled ? 'text-green-600' : 'text-gray-400'}`}
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Estado de Certificados
                    </h3>
                    <p className={`text-sm ${certificatesEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                      {certificatesEnabled ? 'Habilitados' : 'Deshabilitados'}
                    </p>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={handleToggleCertificates}
                  disabled={toggling}
                  className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                    certificatesEnabled
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } ${toggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {toggling ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon 
                        icon={certificatesEnabled ? faToggleOff : faToggleOn} 
                        className="mr-2" 
                      />
                      {certificatesEnabled ? 'Deshabilitar' : 'Habilitar'}
                    </>
                  )}
                </button>
              </div>

              {/* Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Cuando están habilitados:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Los usuarios pueden descargar sus certificados</li>
                    <li>• Los certificados aparecen en la consulta de tickets</li>
                    <li>• Se generan automáticamente para tickets pagados</li>
                  </ul>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Cuando están deshabilitados:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Los certificados no son visibles para usuarios</li>
                    <li>• No se puede descargar certificados</li>
                    <li>• Los certificados existentes se mantienen</li>
                  </ul>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-800 mb-4">Acciones Adicionales</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    disabled={!certificatesEnabled}
                    className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Generar Certificados Masivos
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Nota: Los certificados masivos solo están disponibles cuando los certificados están habilitados
                </p>
              </div>

              {/* Last Updated */}
              {lastUpdated && (
                <div className="text-xs text-gray-500 text-center pt-4 border-t">
                  Última actualización: {lastUpdated.toLocaleString('es-ES')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}