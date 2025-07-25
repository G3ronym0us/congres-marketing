'use client';

import React, { useState, useEffect } from 'react';
import { adminDiscountCodeService, discountUtils } from '@/services/discountCode';
import { DiscountCode } from '@/types/discountCode';
import CreateDiscountCodeModal from './CreateDiscountCodeModal';
import EditDiscountCodeModal from './EditDiscountCodeModal';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DiscountCodesAdmin() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);

  const fetchDiscountCodes = async () => {
    try {
      setLoading(true);
      const codes = await adminDiscountCodeService.getAllCodes();
      setDiscountCodes(codes);
      setError('');
    } catch (error) {
      console.error('Error fetching discount codes:', error);
      setError('Error al cargar los códigos de descuento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este código de descuento?')) {
      return;
    }

    try {
      await adminDiscountCodeService.deleteCode(id);
      await fetchDiscountCodes();
    } catch (error) {
      console.error('Error deleting discount code:', error);
      setError('Error al eliminar el código de descuento');
    }
  };

  const handleToggleActive = async (code: DiscountCode) => {
    try {
      await adminDiscountCodeService.updateCode(code.id, {
        isActive: !code.isActive,
      });
      await fetchDiscountCodes();
    } catch (error) {
      console.error('Error updating discount code:', error);
      setError('Error al actualizar el código de descuento');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (code: DiscountCode) => {
    if (!code.isActive) {
      return <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full">Inactivo</span>;
    }
    
    if (discountUtils.isCodeExpired(code.expiresAt)) {
      return <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Expirado</span>;
    }
    
    if (code.currentUses >= code.maxUses) {
      return <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">Agotado</span>;
    }
    
    return <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Activo</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Códigos de Descuento</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Crear Código
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expira
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discountCodes.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{code.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{discountUtils.formatPercentage(code.discountPercentage)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {code.currentUses} / {code.maxUses}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.max(0, code.maxUses - code.currentUses)} disponibles
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(code)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(code.expiresAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(code.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleToggleActive(code)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          code.isActive
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {code.isActive ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => setEditingCode(code)}
                        className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(code.id)}
                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded text-xs font-medium hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {discountCodes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No hay códigos de descuento</div>
            <div className="text-gray-400">Crea tu primer código de descuento</div>
          </div>
        )}
      </div>

      {/* Modales */}
      {showCreateModal && (
        <CreateDiscountCodeModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchDiscountCodes();
          }}
        />
      )}

      {editingCode && (
        <EditDiscountCodeModal
          discountCode={editingCode}
          onClose={() => setEditingCode(null)}
          onSuccess={() => {
            setEditingCode(null);
            fetchDiscountCodes();
          }}
        />
      )}
    </div>
  );
}