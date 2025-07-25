'use client';

import React, { useState } from 'react';
import { adminDiscountCodeService } from '@/services/discountCode';
import { DiscountCode, UpdateDiscountCodeInput } from '@/types/discountCode';

interface EditDiscountCodeModalProps {
  discountCode: DiscountCode;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditDiscountCodeModal({ 
  discountCode, 
  onClose, 
  onSuccess 
}: EditDiscountCodeModalProps) {
  const [formData, setFormData] = useState<UpdateDiscountCodeInput>({
    discountPercentage: parseFloat(discountCode.discountPercentage),
    maxUses: discountCode.maxUses,
    isActive: discountCode.isActive,
    expiresAt: discountCode.expiresAt.slice(0, 16), // Para datetime-local format
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminDiscountCodeService.updateCode(discountCode.id, formData);
      onSuccess();
    } catch (error: any) {
      console.error('Error updating discount code:', error);
      
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          setError(error.response.data.message.join(', '));
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError('Error al actualizar el código de descuento');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : type === 'number' 
          ? parseFloat(value) || 0
          : value
    }));
  };

  // Generar fecha mínima (hoy)
  const today = new Date().toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Editar Código: {discountCode.code}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-600">
              <strong>Código:</strong> {discountCode.code}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Usos actuales:</strong> {discountCode.currentUses}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Creado:</strong> {new Date(discountCode.createdAt).toLocaleString('es-CO')}
            </div>
          </div>

          <div>
            <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-1">
              Porcentaje de Descuento * (%)
            </label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              required
              min="0.01"
              max="100"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Entre 0.01% y 100%</p>
          </div>

          <div>
            <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 mb-1">
              Usos Máximos *
            </label>
            <input
              type="number"
              id="maxUses"
              name="maxUses"
              value={formData.maxUses}
              onChange={handleChange}
              required
              min={discountCode.currentUses} // No puede ser menor a los usos actuales
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo: {discountCode.currentUses} (usos actuales)
            </p>
          </div>

          <div>
            <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Expiración *
            </label>
            <input
              type="datetime-local"
              id="expiresAt"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              required
              min={today}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Código activo
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 min-w-[80px] flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}