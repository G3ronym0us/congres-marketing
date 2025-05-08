'use client';

import { TicketType } from '@/types/tickets';
import { localidadesData, formatoPrecio } from '@/data/ticketsData';

interface TicketSelectorProps {
  selectedTicket: TicketType;
  onTicketSelect: (type: TicketType) => void;
}

export default function TicketSelector({ selectedTicket, onTicketSelect }: TicketSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {Object.entries(localidadesData).map(([key, datos]) => {
        // Omitir la opción de "solo memorias" en el selector
        if (key === 'memorias') return null;
        
        return (
          <div 
            key={key}
            className={`${
              selectedTicket === key 
                ? `${datos.color} ${datos.border} border-2 transform scale-105 shadow-lg` 
                : 'bg-white/10 border border-white/20'
            } p-4 rounded-lg transition-all duration-300 cursor-pointer relative`}
            onClick={() => onTicketSelect(key as TicketType)}
          >
            {key === TicketType.DIAMOND && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                PREMIUM
              </div>
            )}
            {key === TicketType.VIP && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                RECOMENDADO
              </div>
            )}
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <span>{datos.icon}</span>
              </div>
              <div>
                <h3 className="text-white font-bold">{datos.name.replace('Localidad ', '')}</h3>
                <p className="text-blue-300 text-sm font-semibold">{formatoPrecio(datos.price)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}