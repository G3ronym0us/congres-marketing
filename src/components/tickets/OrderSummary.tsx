'use client';

import { formatoPrecio, PRECIO_MEMORIAS } from '@/data/ticketsData';

interface OrderSummaryProps {
  ticketPrice: number;
  quantity: number;
  includeMemories: boolean;
  memoriesAlreadyIncluded: boolean;
  isOnlyMemories?: boolean;
}

export default function OrderSummary({ 
  ticketPrice, 
  quantity, 
  includeMemories, 
  memoriesAlreadyIncluded,
  isOnlyMemories = false
}: OrderSummaryProps) {
  // Calcular el total
  const basePrice = isOnlyMemories ? 0 : ticketPrice;
  const memoriesPrice = (includeMemories && !memoriesAlreadyIncluded) || isOnlyMemories ? PRECIO_MEMORIAS : 0;
  const total = (basePrice + memoriesPrice) * quantity;
  
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
      
      <div className="border-t border-white/20 my-4"></div>
      
      <div className="flex justify-between text-xl font-bold">
        <span className="text-white">Total:</span>
        <span className="text-blue-300">{formatoPrecio(total)}</span>
      </div>
    </div>
  );
}