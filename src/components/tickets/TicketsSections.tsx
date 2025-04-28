'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export default function TicketsSection() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Mensaje para los tooltips de compra
  const mensajeCompra =
    'Para realizar la compra, comunícate directamente con los administradores al WhatsApp: +57 318 120 0000';

  const handleTooltipShow = (id: string) => {
    setActiveTooltip(id);
  };

  const handleTooltipHide = () => {
    setActiveTooltip(null);
  };

  return (
    <section
      id="entradas"
      className="py-16 bg-gradient-to-r from-[#0f1424] to-[#1a0a12]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* General */}
          <div className="bg-white/10 backdrop-filter backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div className="w-16 h-16 rounded-full bg-blue-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔵</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              General
            </h3>
            <p className="text-gray-300 text-center mb-6">
              Acceso completo a conferencias + gala exclusiva.
            </p>
            <div className="relative">
              <button
                className="w-full bg-white text-[#1C2C67] font-semibold py-3 px-6 rounded-lg opacity-75 cursor-not-allowed"
                onMouseEnter={() => handleTooltipShow('general')}
                onMouseLeave={handleTooltipHide}
                onClick={(e) => e.preventDefault()}
                title={mensajeCompra}
              >
                Comprar Ahora
              </button>
              {activeTooltip === 'general' && (
                <div className="absolute z-50 w-72 px-4 py-2 mt-2 text-white bg-gray-900 rounded-lg shadow-lg left-1/2 transform -translate-x-1/2">
                  <p className="text-sm">{mensajeCompra}</p>
                </div>
              )}
            </div>
          </div>

          {/* VIP */}
          <div className="bg-gradient-to-br from-[#1C2C67]/50 to-[#4B0012]/50 backdrop-filter backdrop-blur-sm p-8 rounded-xl border-2 border-purple-500 transform scale-105 shadow-xl relative z-10">
            <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
              RECOMENDADO
            </div>
            <div className="w-16 h-16 rounded-full bg-purple-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🟣</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              VIP Estratégico
            </h3>
            <p className="text-gray-300 text-center mb-6">
              Acceso prioritario + Mejor ubicación en auditorio + gala
              exclusiva + memorias del evento.
            </p>
            <div className="relative">
              <button
                className="w-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold py-3 px-6 rounded-lg opacity-75 cursor-not-allowed"
                onMouseEnter={() => handleTooltipShow('vip')}
                onMouseLeave={handleTooltipHide}
                onClick={(e) => e.preventDefault()}
                title={mensajeCompra}
              >
                Reservar Plaza
              </button>
              {activeTooltip === 'vip' && (
                <div className="absolute z-50 w-72 px-4 py-2 mt-2 text-white bg-gray-900 rounded-lg shadow-lg left-1/2 transform -translate-x-1/2">
                  <p className="text-sm">{mensajeCompra}</p>
                </div>
              )}
            </div>
          </div>

          {/* Estudiantes */}
          <div className="bg-white/10 backdrop-filter backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🟢</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              Estudiantes
            </h3>
            <p className="text-gray-300 text-center mb-6">
              Tarifa preferencial (cupos limitados – con carnet vigente).
            </p>
            <div className="relative">
              <button
                className="w-full bg-white text-[#1C2C67] font-semibold py-3 px-6 rounded-lg opacity-75 cursor-not-allowed"
                onMouseEnter={() => handleTooltipShow('estudiantes')}
                onMouseLeave={handleTooltipHide}
                onClick={(e) => e.preventDefault()}
                title={mensajeCompra}
              >
                Comprar Ahora
              </button>
              {activeTooltip === 'estudiantes' && (
                <div className="absolute z-50 w-72 px-4 py-2 mt-2 text-white bg-gray-900 rounded-lg shadow-lg left-1/2 transform -translate-x-1/2">
                  <p className="text-sm">{mensajeCompra}</p>
                </div>
              )}
            </div>
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