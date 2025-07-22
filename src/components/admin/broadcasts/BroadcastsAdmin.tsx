'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faEye,
  faEdit,
  faEnvelope,
  faExclamationCircle,
  faCalendarAlt,
  faUsers,
  faAt,
} from '@fortawesome/free-solid-svg-icons';
import { EmailBroadcast } from '../../../types/emailBroadcast';
import { emailBroadcastService } from '../../../services/emailBroadcast';
import CreateBroadcastModal from './CreateBroadcastModal';
import BroadcastDetailModal from './BroadcastDetailModal';
import Swal from 'sweetalert2';

const BroadcastsAdmin = () => {
  const [broadcasts, setBroadcasts] = useState<EmailBroadcast[]>([]);
  const [filteredBroadcasts, setFilteredBroadcasts] = useState<EmailBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<EmailBroadcast | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    loadBroadcasts();
  }, []);

  useEffect(() => {
    filterBroadcasts();
  }, [broadcasts, searchTerm]);

  const loadBroadcasts = async () => {
    try {
      setLoading(true);
      const data = await emailBroadcastService.getAllBroadcasts();
      setBroadcasts(data);
    } catch (error) {
      console.error('Error loading broadcasts:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los broadcasts',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBroadcasts = () => {
    let filtered = broadcasts;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(searchLower) ||
          b.sender_name.toLowerCase().includes(searchLower) ||
          b.content.toLowerCase().includes(searchLower) ||
          (b.specific_email && b.specific_email.toLowerCase().includes(searchLower))
      );
    }

    setFilteredBroadcasts(filtered);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      SENDING: { color: 'bg-blue-100 text-blue-800', text: 'Enviando' },
      COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Completado' },
      FAILED: { color: 'bg-red-100 text-red-800', text: 'Fallido' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleResend = async (broadcast: EmailBroadcast) => {
    const result = await Swal.fire({
      title: '¿Reenviar broadcast?',
      text: `Se reenviará "${broadcast.title}" a todos los destinatarios originales`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, reenviar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await emailBroadcastService.resendBroadcast(broadcast.id);
        Swal.fire({
          icon: 'success',
          title: 'Reenviado',
          text: 'El broadcast se ha reenviado correctamente',
          timer: 1500,
          showConfirmButton: false,
        });
        loadBroadcasts();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo reenviar el broadcast',
        });
      }
    }
  };

  const handleViewDetails = (broadcast: EmailBroadcast) => {
    setSelectedBroadcast(broadcast);
    setIsDetailModalOpen(true);
  };

  const handleBroadcastCreated = () => {
    loadBroadcasts();
    setIsCreateModalOpen(false);
  };

  // Paginación
  const totalPages = Math.ceil(filteredBroadcasts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredBroadcasts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Email Broadcasts
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              Nuevo Broadcast
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
                  placeholder="Buscar broadcasts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de broadcasts */}
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
              <p className="text-gray-500">No se encontraron broadcasts</p>
            </div>
          ) : (
            <>
              {/* Vista desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Título
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Tipo
                      </th>
                      <th className="text-center p-4 font-medium text-gray-700">
                        Estado
                      </th>
                      <th className="text-center p-4 font-medium text-gray-700">
                        Enviados/Total
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Fecha
                      </th>
                      <th className="text-center p-4 font-medium text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((broadcast) => (
                      <tr key={broadcast.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {broadcast.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              Por: {broadcast.sender_name}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <FontAwesomeIcon 
                              icon={broadcast.type === 'ALL_USERS' ? faUsers : faAt} 
                              className="mr-2 text-gray-400" 
                            />
                            <span className="text-sm text-gray-900">
                              {broadcast.type === 'ALL_USERS' ? 'Todos los usuarios' : 'Email específico'}
                            </span>
                          </div>
                          {broadcast.specific_email && (
                            <div className="text-xs text-gray-500 ml-6">{broadcast.specific_email}</div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {getStatusBadge(broadcast.status)}
                        </td>
                        <td className="p-4 text-center">
                          <div className="text-sm text-gray-900">
                            {broadcast.sent_count}/{broadcast.total_recipients}
                          </div>
                          {broadcast.failed_count > 0 && (
                            <div className="text-xs text-red-500">
                              {broadcast.failed_count} fallidos
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                          {formatDate(broadcast.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(broadcast)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Ver detalles"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            {broadcast.status === 'COMPLETED' && (
                              <button
                                onClick={() => handleResend(broadcast)}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Reenviar"
                              >
                                <FontAwesomeIcon icon={faEnvelope} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista móvil */}
              <div className="md:hidden">
                {currentItems.map((broadcast) => (
                  <div key={broadcast.id} className="p-4 border-b">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {broadcast.title}
                        </h3>
                        <p className="text-sm text-gray-600">Por: {broadcast.sender_name}</p>
                      </div>
                      {getStatusBadge(broadcast.status)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FontAwesomeIcon 
                        icon={broadcast.type === 'ALL_USERS' ? faUsers : faAt} 
                        className="mr-2" 
                      />
                      {broadcast.type === 'ALL_USERS' ? 'Todos los usuarios' : 'Email específico'}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <div>{broadcast.sent_count}/{broadcast.total_recipients} enviados</div>
                        <div>{formatDate(broadcast.createdAt)}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(broadcast)}
                          className="text-blue-600 p-1"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        {broadcast.status === 'COMPLETED' && (
                          <button
                            onClick={() => handleResend(broadcast)}
                            className="text-green-600 p-1"
                          >
                            <FontAwesomeIcon icon={faEnvelope} />
                          </button>
                        )}
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
      <CreateBroadcastModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleBroadcastCreated}
      />

      {selectedBroadcast && (
        <BroadcastDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedBroadcast(null);
          }}
          broadcast={selectedBroadcast}
          onResend={() => handleResend(selectedBroadcast)}
          onUpdate={loadBroadcasts}
        />
      )}
    </div>
  );
};

export default BroadcastsAdmin;