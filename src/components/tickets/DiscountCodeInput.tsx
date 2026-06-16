'use client';

import React, { useState } from 'react';
import { discountCodeService } from '@/services/discountCode';
import { ValidateDiscountCodeResponse } from '@/types/discountCode';

interface DiscountCodeInputProps {
  onDiscountApplied: (discount: { code: string; percentage: number }) => void;
  onDiscountRemoved: () => void;
  appliedDiscount?: { code: string; percentage: number } | null;
  disabled?: boolean;
  editionId?: number;
}

export default function DiscountCodeInput({
  onDiscountApplied,
  onDiscountRemoved,
  appliedDiscount,
  disabled = false,
  editionId,
}: DiscountCodeInputProps) {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string>('');

  const validateCode = async () => {
    if (!code.trim()) {
      setError('Ingresa un código de descuento');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const response: ValidateDiscountCodeResponse = await discountCodeService.validateCode({
        code: code.trim(),
        edition: editionId,
      });

      if (response.isValid && response.discountPercentage) {
        onDiscountApplied({
          code: code.trim().toUpperCase(),
          percentage: parseFloat(response.discountPercentage),
        });
        setCode('');
      } else {
        setError(response.message || 'Código de descuento no válido');
      }
    } catch (error: any) {
      console.error('Error validating discount code:', error);
      setError('Error al validar el código. Intenta nuevamente.');
    } finally {
      setIsValidating(false);
    }
  };

  const removeDiscount = () => {
    onDiscountRemoved();
    setCode('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateCode();
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-xl mb-4">
      <h4 className="text-white font-semibold mb-4">Código de Descuento</h4>
      
      {appliedDiscount ? (
        <div className="flex items-center justify-between bg-green-600/20 border border-green-500/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Código aplicado: {appliedDiscount.code}</p>
              <p className="text-green-400 text-sm">Descuento del {appliedDiscount.percentage}%</p>
            </div>
          </div>
          <button
            onClick={removeDiscount}
            disabled={disabled}
            className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remover descuento"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex space-x-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Ingresa tu código"
              disabled={disabled || isValidating}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={validateCode}
              disabled={disabled || isValidating || !code.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors min-w-[100px] flex items-center justify-center"
            >
              {isValidating ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Aplicar'
              )}
            </button>
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}