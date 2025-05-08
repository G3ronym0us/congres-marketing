'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { formatoPrecio, PRECIO_MEMORIAS } from '@/data/ticketsData';

interface MemoriesOptionProps {
  includeMemories: boolean;
  onToggle: () => void;
  disabled?: boolean;
  alreadyIncluded?: boolean;
}

export default function MemoriesOption({ 
  includeMemories, 
  onToggle, 
  disabled = false,
  alreadyIncluded = false
}: MemoriesOptionProps) {
  if (disabled) return null;
  
  if (alreadyIncluded) {
    return (
      <div className="bg-white/10 p-6 rounded-xl mb-8">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded flex items-center justify-center mr-3 bg-green-500/50 border border-green-400">
            <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
          </div>
          <div className="flex-1">
            <label className="text-white font-semibold">
              Memorias del Evento Incluidas
            </label>
            <p className="text-gray-400 text-sm">
              Esta localidad ya incluye las memorias del evento
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 p-6 rounded-xl mb-8">
      <div className="flex items-center">
        <div 
          className={`w-6 h-6 rounded flex items-center justify-center mr-3 cursor-pointer border ${includeMemories ? 'bg-blue-500 border-blue-400' : 'bg-gray-800 border-gray-600'}`}
          onClick={onToggle}
        >
          {includeMemories && <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />}
        </div>
        <div className="flex-1">
          <label 
            className="text-white font-semibold cursor-pointer"
            onClick={onToggle}
          >
            Añadir Memorias del Evento
          </label>
          <p className="text-gray-400 text-sm">
            Grabación del evento con todas las intervenciones de los conferencistas
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-white font-semibold">{formatoPrecio(PRECIO_MEMORIAS)}</span>
        </div>
      </div>
    </div>
  );
}