'use client';

import { formatoPrecio } from '@/data/ticketsData';

interface MemoriesDetailsProps {
  price: number;
}

export default function MemoriesDetails({ price }: MemoriesDetailsProps) {
  return (
    <div className="bg-gradient-to-br from-[#0f4c81]/50 to-[#81640f]/50 border-2 border-yellow-300 p-6 rounded-xl mb-8">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
          <span className="text-xl">📀</span>
        </div>
        <h3 className="text-2xl font-bold text-white">Memorias del Evento</h3>
      </div>

      <p className="text-xl font-bold text-white mb-4">
        {formatoPrecio(price)}
      </p>

      <h4 className="text-white font-semibold mb-2">Incluye:</h4>
      <ul className="text-gray-300 list-disc pl-5 space-y-1 mb-4">
        <li>Grabación completa de todas las conferencias del evento</li>
        <li>Acceso a las presentaciones de los conferencistas</li>
        <li>Material adicional exclusivo</li>
        <li>Acceso digital permanente</li>
      </ul>
      
      <div className="bg-yellow-500/20 p-3 rounded-lg">
        <p className="text-yellow-300 text-sm">
          Nota: Las memorias solo pueden ser adquiridas por asistentes al evento o como complemento a alguna de las localidades.
        </p>
      </div>
    </div>
  );
}