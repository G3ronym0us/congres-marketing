'use client';

import { LocalidadDetalle } from '@/types/tickets';
import { formatoPrecio } from '@/data/ticketsData';

interface TicketDetailsProps {
  details: LocalidadDetalle;
}

export default function TicketDetails({ details }: TicketDetailsProps) {
  return (
    <div className={`${details.color} border-2 ${details.border} p-6 rounded-xl mb-8`}>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
          <span className="text-xl">{details.icon}</span>
        </div>
        <h3 className="text-2xl font-bold text-white">{details.name}</h3>
      </div>

      <p className="text-xl font-bold text-white mb-4">
        {formatoPrecio(details.price)}
      </p>

      <h4 className="text-white font-semibold mb-2">Incluye:</h4>
      <ul className="text-gray-300 list-disc pl-5 space-y-1 mb-4">
        {details.features?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}