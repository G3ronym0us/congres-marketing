'use client';

import { formatoPrecio, PRECIO_MEMORIAS } from '@/data/ticketsData';
import { discountUtils } from '@/services/discountCode';

interface OrderSummaryProps {
  ticketPrice: number;
  quantity: number;
  includeMemories: boolean;
  memoriesAlreadyIncluded: boolean;
  isOnlyMemories?: boolean;
  appliedDiscount?: { code: string; percentage: number } | null;
}

export default function OrderSummary({ 
  ticketPrice, 
  quantity, 
  includeMemories, 
  memoriesAlreadyIncluded,
  isOnlyMemories = false,
  appliedDiscount
}: OrderSummaryProps) {
  // Calcular el total base
  const basePrice = isOnlyMemories ? 0 : ticketPrice;
  const memoriesPrice = (includeMemories && !memoriesAlreadyIncluded) || isOnlyMemories ? PRECIO_MEMORIAS : 0;
  const subtotal = (basePrice + memoriesPrice) * quantity;
  
  // Calcular descuento si está aplicado
  const discountAmount = appliedDiscount 
    ? discountUtils.getDiscountAmount(subtotal, appliedDiscount.percentage)
    : 0;
  
  const total = subtotal - discountAmount;
  
  return (
    <div className="bg-white/5 p-6 rounded-xl mb-8">
      <h4 className="text-white font-semibold mb-4">Resumen</h4>
      
      {!isOnlyMemories && (
        <div className="flex justify-between mb-2">
          <span className="text-gray-300">Entrada:</span>
          <span className="text-white">{formatoPrecio(basePrice)}</span>
        </div>
      )}
      
      {((includeMemories && !memoriesAlreadyIncluded) || isOnlyMemories) && (
        <div className="flex justify-between mb-2">
          <span className="text-gray-300">Memorias:</span>
          <span className="text-white">{formatoPrecio(PRECIO_MEMORIAS)}</span>
        </div>
      )}
      
      <div className="flex justify-between mb-2">
        <span className="text-gray-300">Cantidad:</span>
        <span className="text-white">{quantity}</span>
      </div>
      
      {appliedDiscount && (
        <>
          <div className="border-t border-white/20 my-3"></div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-300">Subtotal:</span>
            <span className="text-white">{formatoPrecio(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-green-400">Descuento ({appliedDiscount.code} - {appliedDiscount.percentage}%):</span>
            <span className="text-green-400">-{formatoPrecio(discountAmount)}</span>
          </div>
        </>
      )}
      
      <div className="border-t border-white/20 my-4"></div>
      
      <div className="flex justify-between text-xl font-bold">
        <span className="text-white">Total:</span>
        <span className="text-blue-300">{formatoPrecio(total)}</span>
      </div>
    </div>
  );
}