'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { TicketType } from '@/types/tickets';
import { useCart } from '@/context/CartContext';

export default function TicketsSection() {
  const router = useRouter();
  const { state } = useCart();

  const handleButtonClick = (localidadId: TicketType) => {
    // Redireccionar a la página de detalles de compra con la localidad seleccionada
    router.push(`/quantity-select?localidad=${localidadId}`);
  };

  const handleCartClick = () => {
    router.push('/carrito');
  };

  return (
    <section
      id="entradas"
      className="py-16 bg-gradient-to-r from-[#0f1424] to-[#1a0a12]"
    >
      <div className="container mx-auto px-4">
        {/* Header con título y carrito */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-grow mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tus próximas elecciones comienzan aquí
            </h2>
            <div className="flex justify-center items-center space-x-6 mb-6">
              <div className="flex items-center text-gray-300">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="mr-2 text-blue-300"
                />
                <span>1 y 2 de agosto, 2025</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="mr-2 text-blue-300"
                />
                <span>Cartagena, Colombia</span>
              </div>
            </div>
            <p className="text-xl text-blue-300 font-semibold mb-2">
              🎟️ Entradas disponibles: Preventa – Cupos limitados
            </p>
          </div>
          
          {/* Carrito de compras */}
          <div className="relative">
            <button 
              className="bg-blue-300 hover:bg-blue-400 text-[#1C2C67] p-3 rounded-full"
              onClick={handleCartClick}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {state.items.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Diamante */}
          <div className="bg-gradient-to-br from-[#1C2C67]/70 to-[#4B0012]/70 backdrop-filter backdrop-blur-sm p-8 rounded-xl border-2 border-blue-300 transform scale-105 shadow-xl relative z-10">
            <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
              PREMIUM
            </div>
            <div className="w-16 h-16 rounded-full bg-blue-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              Diamante
            </h3>
            <ul className="text-gray-300 text-sm mb-4 list-disc pl-5 space-y-1">
              <li>Acceso a todas las conferencias</li>
              <li>Localidad Diamante</li>
              <li>4 coffee breaks</li>
              <li>Cóctel oficial</li>
              <li>Memorias del evento</li>
              <li>Certificación digital</li>
            </ul>
            <p className="text-center text-xl font-bold text-white mb-4">
              $700.000
            </p>
            <button
              className="w-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => handleButtonClick(TicketType.DIAMOND)}
            >
              Comprar Ahora
            </button>
          </div>

          {/* VIP */}
          <div className="bg-gradient-to-br from-[#1C2C67]/50 to-[#4B0012]/50 backdrop-filter backdrop-blur-sm p-8 rounded-xl border-2 border-purple-500 relative">
            <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
              RECOMENDADO
            </div>
            <div className="w-16 h-16 rounded-full bg-purple-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🟣</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              V.I.P.
            </h3>
            <ul className="text-gray-300 text-sm mb-4 list-disc pl-5 space-y-1">
              <li>Acceso a todas las conferencias</li>
              <li>Localidad V.I.P.</li>
              <li>4 coffee breaks</li>
              <li>Cóctel oficial</li>
              <li>Certificación digital</li>
            </ul>
            <p className="text-center text-xl font-bold text-white mb-4">
              $600.000
            </p>
            <button
              className="w-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => handleButtonClick(TicketType.VIP)}
            >
              Comprar Ahora
            </button>
          </div>

          {/* General */}
          <div className="bg-white/10 backdrop-filter backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div className="w-16 h-16 rounded-full bg-blue-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔵</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              General
            </h3>
            <ul className="text-gray-300 text-sm mb-4 list-disc pl-5 space-y-1">
              <li>Acceso a todas las conferencias</li>
              <li>Localidad General</li>
              <li>4 coffee breaks</li>
              <li>Certificación digital</li>
            </ul>
            <p className="text-center text-xl font-bold text-white mb-4">
              $400.000
            </p>
            <button
              className="w-full bg-white text-[#1C2C67] font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => handleButtonClick(TicketType.GENERAL)}
            >
              Comprar Ahora
            </button>
          </div>

          {/* Streaming */}
          <div className="bg-white/10 backdrop-filter backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              Streaming
            </h3>
            <ul className="text-gray-300 text-sm mb-4 list-disc pl-5 space-y-1">
              <li>Acceso virtual a todas las jornadas</li>
              <li>Grupo cerrado de Facebook</li>
              <li>Certificación digital</li>
              <li className="text-yellow-300">No incluye memorias</li>
            </ul>
            <p className="text-center text-xl font-bold text-white mb-4">
              $300.000
            </p>
            <button
              className="w-full bg-white text-[#1C2C67] font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => handleButtonClick(TicketType.STREAMING)}
            >
              Comprar Ahora
            </button>
          </div>
        </div>

        {/* Memorias del evento */}
        <div className="mt-8 bg-white/5 p-6 rounded-xl max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-xl font-semibold text-white">
              Memorias del Evento
            </h4>
            <p className="text-gray-300 text-center">
              Las memorias incluyen la grabación del evento en video con las intervenciones 
              de todos los conferencistas. Solo disponible para asistentes presenciales.
              <br />
              <span className="text-yellow-300">Nota: Ya incluidas en la localidad Diamante.</span>
            </p>
            <p className="text-xl font-bold text-white">$250.000</p>
          </div>
        </div>

        <div className="mt-12 bg-white/5 p-6 rounded-xl max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-white mb-2">
                Medios de pago
              </h4>
              <p className="text-gray-400">
                PSE, tarjeta crédito/débito, transferencia
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-yellow-300 font-semibold">
                ⚠️ Este no es un evento masivo. Es una experiencia para
                mentes selectas.
              </p>
              <p className="text-white">
                Asegura tu cupo antes de que se agote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}