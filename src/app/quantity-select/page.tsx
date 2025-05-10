'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { TicketType } from '@/types/tickets';
import { localidadesData, formatoPrecio, PRECIO_MEMORIAS } from '@/data/ticketsData';
import { useCart } from '@/context/CartContext';

// Componentes
import TicketSelector from '@/components/tickets/TicketSelector';
import TicketDetails from '@/components/tickets/TicketsDetails';
import QuantitySelector from '@/components/tickets/QuantitySelector';
import MemoriesOption from '@/components/tickets/MemoriesOption';
import OrderSummary from '@/components/tickets/OrderSummary';

export default function SeleccionCantidad() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  
  const [localidad, setLocalidad] = useState<TicketType>(TicketType.DIAMOND);
  const [cantidad, setCantidad] = useState(1);
  const [incluirMemorias, setIncluirMemorias] = useState(false);
  const [detallesEntrada, setDetallesEntrada] = useState(localidadesData[TicketType.DIAMOND]);
  
  useEffect(() => {
    // Obtener la localidad de la URL
    const localidadParam = searchParams ? searchParams.get('localidad') : null;
    if (localidadParam && Object.values(TicketType).includes(localidadParam as TicketType)) {
      setLocalidad(localidadParam as TicketType);
    }
  }, [searchParams]);

  // Actualizar detalles cuando cambia la localidad
  useEffect(() => {
    setDetallesEntrada(localidadesData[localidad]);
    
    // Reset el checkbox de memorias si cambia la localidad a una que ya las incluye
    if (localidadesData[localidad] && localidadesData[localidad].withMemories) {
      setIncluirMemorias(true);
    }
  }, [localidad]);

  const handleLocalidadSelect = (tipo: TicketType) => {
    setLocalidad(tipo);
  };

  const incrementarCantidad = () => {
    setCantidad(prev => Math.min(prev + 1, 10)); // Máximo 10 entradas
  };

  const decrementarCantidad = () => {
    setCantidad(prev => Math.max(prev - 1, 1)); // Mínimo 1 entrada
  };

  const toggleMemorias = () => {
    setIncluirMemorias(prev => !prev);
  };

  const handleVolver = () => {
    router.push('/#entradas');
  };

  const handleAgregar = () => {
    // Añadir tickets individuales al carrito
    addItem(
      localidad,
      cantidad,
      incluirMemorias,
      detallesEntrada.price,
      PRECIO_MEMORIAS
    );

    // Redirigir al carrito
    router.push('/carrito');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f1424] to-[#1a0a12] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={handleVolver}
          className="flex items-center text-blue-300 hover:text-blue-400 transition mb-8"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Volver a entradas
        </button>

        <div className="bg-black/20 backdrop-filter backdrop-blur-sm p-8 rounded-xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <FontAwesomeIcon icon={faTicketAlt} className="mr-3 text-blue-300" />
            Selecciona tu entrada
          </h2>

          {/* Selector de tipos de entrada */}
          <TicketSelector 
            selectedTicket={localidad} 
            onTicketSelect={handleLocalidadSelect} 
          />

          {/* Detalles de la entrada seleccionada */}
          <TicketDetails details={detallesEntrada} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {/* Selector de cantidad */}
              <QuantitySelector 
                quantity={cantidad}
                onIncrease={incrementarCantidad}
                onDecrease={decrementarCantidad}
              />

              {/* Opción de memorias (solo para entradas que no las incluyen) */}
              <MemoriesOption 
                includeMemories={incluirMemorias}
                onToggle={toggleMemorias}
                disabled={detallesEntrada?.noPermiteMemorias}
                alreadyIncluded={detallesEntrada?.withMemories}
              />
            </div>

            <div>
              {/* Resumen de compra */}
              <OrderSummary 
                ticketPrice={detallesEntrada.price}
                quantity={cantidad}
                includeMemories={incluirMemorias}
                memoriesAlreadyIncluded={detallesEntrada.withMemories}
                isOnlyMemories={false}
              />

              {/* Botón de agregar al carrito */}
              <button
                onClick={handleAgregar}
                className="w-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity text-lg"
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}