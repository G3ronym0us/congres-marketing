'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  maxQuantity?: number;
  minQuantity?: number;
}

export default function QuantitySelector({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  maxQuantity = 10, 
  minQuantity = 1 
}: QuantitySelectorProps) {
  return (
    <div className="bg-white/5 p-6 rounded-xl mb-8">
      <h4 className="text-white font-semibold mb-4">Cantidad</h4>
      
      <div className="flex items-center justify-center mb-6">
        <button 
          onClick={onDecrease}
          className={`bg-gray-700 hover:bg-gray-600 text-white w-12 h-12 rounded-l-lg flex items-center justify-center transition-colors ${quantity <= minQuantity ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={quantity <= minQuantity}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        
        <div className="bg-gray-800 text-white text-2xl font-bold w-20 h-12 flex items-center justify-center">
          {quantity}
        </div>
        
        <button 
          onClick={onIncrease}
          className={`bg-gray-700 hover:bg-gray-600 text-white w-12 h-12 rounded-r-lg flex items-center justify-center transition-colors ${quantity >= maxQuantity ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={quantity >= maxQuantity}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      
      <p className="text-gray-300 text-center">
        Puedes seleccionar hasta {maxQuantity} unidades
      </p>
    </div>
  );
}