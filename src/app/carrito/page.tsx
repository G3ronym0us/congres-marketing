'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faShoppingCart,
  faTrash,
  faCreditCard,
  faUser,
  faChevronDown,
  faChevronUp,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/context/CartContext';
import {
  formatoPrecio,
  localidadesData,
  PRECIO_MEMORIAS,
} from '@/data/ticketsData';
import AttendeeForm from '@/components/tickets/AttendeeForm';
import { AttendeeData, TicketType } from '@/types/tickets';
import Script from 'next/script';
import axios from 'axios';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
export default function Carrito() {
  const router = useRouter();
  const {
    state,
    removeItem,
    removeTicket,
    toggleMemorias,
    updateAttendee,
    clearCart,
  } = useCart();
  const [total, setTotal] = useState(0);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [isAllDataComplete, setIsAllDataComplete] = useState(false);

  // Estados adicionales para Wompi
  const [wompiReady, setWompiReady] = useState(false);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  // Generar referencia única
  useEffect(() => {
    const generateReference = () => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 10);
      return `CNP-${timestamp}-${randomStr}`;
    };

    setReference(generateReference());
    console.log('Referencia generada:', reference);
  }, []);

  // Verificar inicialmente si Wompi ya está disponible
  useEffect(() => {
    console.log('[INIT] Verificando disponibilidad inicial de Wompi');
    console.log('[INIT] Window definido:', typeof window !== 'undefined');

    if (typeof window !== 'undefined') {
      console.log(
        '[INIT] WidgetCheckout inicialmente disponible:',
        !!(window as any).WidgetCheckout,
      );
      if ((window as any).WidgetCheckout) {
        console.log(
          '[INIT] WidgetCheckout ya está disponible, estableciendo wompiReady = true',
        );
        setWompiReady(true);
      }
    }

    // Revisar variables de entorno
    console.log(
      '[INIT] NEXT_PUBLIC_API_URL definido:',
      !!process.env.NEXT_PUBLIC_API_URL,
    );
    console.log(
      '[INIT] NEXT_PUBLIC_WOMPI_PUBLIC_KEY definido:',
      !!process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
    );
    console.log('[INIT] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    // No mostramos la clave pública completa por seguridad
    if (process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY) {
      const maskedKey =
        process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY.substring(0, 5) +
        '...' +
        process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY.substring(
          process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY.length - 4,
        );
      console.log('[INIT] NEXT_PUBLIC_WOMPI_PUBLIC_KEY (parcial):', maskedKey);
    }
  }, []);

  // Inicializar el widget de Wompi cuando el script esté cargado
  const handleWompiLoad = () => {
    setWompiReady(true);
    console.log('Script de Wompi cargado correctamente');
  };

  // Verificar si todos los datos de asistentes están completos
  useEffect(() => {
    // Verificar si todos los tickets tienen datos de asistentes completos
    const allComplete = state.items.every((item) =>
      item.tickets.every(
        (ticket) =>
          ticket.attendee.name &&
          ticket.attendee.lastname &&
          ticket.attendee.document &&
          ticket.attendee.email,
      ),
    );

    setIsAllDataComplete(allComplete);
  }, [state.items]);

  // Actualizar total cuando cambia el estado del carrito
  useEffect(() => {
    setTotal(state.total);
  }, [state]);

  const handleVolver = () => {
    router.push('/quantity-select');
  };

  const handleContinuarComprando = () => {
    router.push('/quantity-select');
  };

  const handleEliminarItem = (localidad: TicketType) => {
    removeItem(localidad);
  };

  const handleEliminarTicket = (ticketId: string) => {
    removeTicket(ticketId);
  };

  const handleToggleMemorias = (ticketId: string, incluirMemorias: boolean) => {
    toggleMemorias(ticketId, !incluirMemorias);
  };

  const handleToggleSection = (localidad: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [localidad]: !prev[localidad],
    }));
  };

  const handleUpdateAsistente = (ticketId: string, attendee: AttendeeData) => {
    updateAttendee(ticketId, attendee);
  };

  // Obtener detalles de un tipo de localidad
  const getLocalidadDetails = (localidad: string) => {
    return (
      localidadesData[localidad] || {
        nombre: 'Entrada',
        precio: 0,
        icono: '🎫',
        incluyeMemorias: false,
        noPermiteMemorias: false,
      }
    );
  };

  // Nueva función para iniciar el proceso de pago con Wompi
  const handleProcederPago = async () => {
    if (!isAllDataComplete) return;

    setLoading(true);
    console.log('Iniciando proceso de pago');

    try {
      // Calcular total con IVA
      const totalConIVA = Math.round(total * 1.19);
      const amountInCents = totalConIVA * 100;
      console.log('Total con IVA:', totalConIVA);
      console.log('Monto en centavos:', amountInCents);

      // Obtener los datos del primer asistente para usarlos como datos del pagador
      const primerTicket = state.items[0]?.tickets[0];
      if (!primerTicket) {
        throw new Error('No hay tickets en el carrito');
      }

      const nombrePagador = primerTicket.attendee.name;
      const apellidoPagador = primerTicket.attendee.lastname;
      const emailPagador = primerTicket.attendee.email;
      const documentoPagador = primerTicket.attendee.document;

      // 1. Crear tickets en el backend y obtener la firma de integridad
      console.log('Enviando solicitud al backend para crear tickets');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}payments`,
        {
          reference: reference,
          amountInCents: amountInCents,
          tickets: state.items.flatMap((item) =>
            item.tickets.map((ticket) => ({
              type: item.localidad,
              includesMemories: ticket.withMemories,
              priceInCents: ticket.price * 100,
              memoriesPriceInCents: ticket.withMemories
                ? ticket.priceMemories * 100
                : 0,
              attendeeData: {
                name: ticket.attendee.name,
                lastname: ticket.attendee.lastname,
                email: ticket.attendee.email,
                document: ticket.attendee.document,
              },
            })),
          ),
        },
      );

      console.log('Respuesta del backend:', response.data);
      const { signature, transaction } = response.data;

      // 2. Iniciar el proceso de pago con Wompi
      if (wompiReady && (window as any).WidgetCheckout) {
        try {
          console.log('Inicializando Widget de Wompi');

          // Crear configuración para el Widget
          const checkout = new (window as any).WidgetCheckout({
            currency: 'COP',
            amountInCents: amountInCents,
            reference: reference,
            publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
            redirectUrl: `${window.location.origin}/confirmation?ref=${reference}`,
            signature: {
              integrity: signature,
            },
          });

          checkout.open(function (result: any) {
            console.log('Transacción completada:', result);
            console.log(
              'Estado de la transacción:',
              result?.transaction?.status,
            );

            // Verificar el estado de la transacción
            if (
              result.transaction &&
              result.transaction.status === 'APPROVED'
            ) {
              console.log('Transacción aprobada');
              // Limpiar el carrito y mostrar confirmación
              clearCart();
              setEnviado(true);
              setErrorMessage(undefined); // Limpiar cualquier mensaje de error previo
            } else if (result.transaction) {
              // Manejar otros estados de transacción
              switch (result.transaction.status) {
                case 'DECLINED':
                  setErrorMessage(
                    'El pago fue rechazado por la entidad financiera. Por favor, intenta con otro método de pago.',
                  );
                  break;
                case 'VOIDED':
                  setErrorMessage(
                    'La transacción fue anulada. Por favor, intenta nuevamente.',
                  );
                  break;
                case 'ERROR':
                  setErrorMessage(
                    'Ocurrió un error durante el procesamiento del pago. Por favor, intenta nuevamente.',
                  );
                  break;
                case 'PENDING':
                  setErrorMessage(
                    'El pago está en proceso de verificación. Te notificaremos cuando se complete.',
                  );
                  break;
                default:
                  setErrorMessage(
                    'El estado de la transacción es: ' +
                      result.transaction.status +
                      '. Por favor, intenta nuevamente.',
                  );
                  break;
              }
              // Verificar el estado real en el backend
              verifyTransaction(reference);
            } else if (result.error) {
              // Manejar error del widget
              console.error('Error del widget:', result.error);
              setErrorMessage(
                'Error al procesar el pago: ' + result.error.message,
              );
            } else {
              // Caso donde el usuario cierra el widget sin completar la transacción
              setErrorMessage(
                'El proceso de pago fue cancelado. Puedes intentarlo nuevamente cuando estés listo.',
              );
            }

            setLoading(false);
          });
        } catch (error) {
          console.error('Error al inicializar Wompi:', error);
          setLoading(false);
          alert('Error al inicializar el pago. Por favor, intenta de nuevo.');
        }
      } else {
        console.warn('Wompi no está disponible, usando flujo alternativo');
        setLoading(false);
        alert('Error al procesar la transacción. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al iniciar el proceso de pago:', error);
      setLoading(false);
      alert('Error al procesar la transacción. Por favor, intenta de nuevo.');
    }
  };

  // Verificar el estado de una transacción
  const verifyTransaction = async (reference: string) => {
    console.log('Verificando transacción:', reference);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}payments/verify/${reference}`,
      );
      console.log('Respuesta de verificación:', response.data);
      const transaction = response.data;

      // Manejar diferentes estados
      switch (transaction.status) {
        case 'APPROVED':
          console.log('Transacción verificada como aprobada');
          clearCart();
          setEnviado(true);
          setErrorMessage(undefined);
          break;
        case 'DECLINED':
          setErrorMessage(
            'El pago fue rechazado por la entidad financiera. Por favor, intenta con otro método de pago.',
          );
          break;
        case 'VOIDED':
          setErrorMessage(
            'La transacción fue anulada. Por favor, intenta nuevamente.',
          );
          break;
        case 'ERROR':
          setErrorMessage(
            'Ocurrió un error durante el procesamiento del pago. Por favor, intenta nuevamente.',
          );
          break;
        case 'PENDING':
          setErrorMessage(
            'El pago está en proceso de verificación. Te notificaremos cuando se complete.',
          );
          break;
        default:
          setErrorMessage(
            'El estado de la transacción es: ' +
              transaction.status +
              '. Por favor, intenta nuevamente.',
          );
          break;
      }
    } catch (error) {
      console.error('Error al verificar la transacción:', error);
      setErrorMessage(
        'No pudimos verificar el estado de tu pago. Por favor, contacta a soporte con la referencia: ' +
          reference,
      );
    }
  };

  return (
    <>
      {/* Cargar el script de Wompi */}
      <Script
        src="https://checkout.wompi.co/widget.js"
        onLoad={handleWompiLoad}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-gradient-to-r from-[#0f1424] to-[#1a0a12] py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={handleVolver}
            className="flex items-center text-blue-300 hover:text-blue-400 transition mb-8"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver a entradas
          </button>

          {enviado ? (
            // Confirmación de compra
            <div className="bg-black/20 backdrop-filter backdrop-blur-sm p-8 rounded-xl text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-3xl text-green-400"
                />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">
                ¡Compra realizada con éxito!
              </h2>

              <p className="text-gray-300 text-lg mb-8">
                Hemos enviado un correo con los detalles de tu compra y las
                instrucciones para acceder al evento.
              </p>

              <p className="text-gray-300 mb-6">
                Número de referencia:{' '}
                <span className="text-white font-medium">{reference}</span>
              </p>

              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                Volver al inicio
              </button>
            </div>
          ) : (
            <div className="bg-black/20 backdrop-filter backdrop-blur-sm p-8 rounded-xl">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="mr-3 text-blue-300"
                />
                Tu carrito de compra
              </h2>

              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-300 text-xl mb-6">
                    Tu carrito está vacío
                  </p>
                  <button
                    onClick={handleContinuarComprando}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Ver entradas disponibles
                  </button>
                </div>
              ) : (
                <>
                  {/* Items del carrito - mantener tu código original */}
                  <div className="space-y-6 mb-8">
                    {state.items.map((item) => {
                      const localidadDetails = getLocalidadDetails(
                        item.localidad,
                      );
                      const isExpanded =
                        expandedSections[item.localidad] || false;

                      return (
                        <div
                          key={item.localidad}
                          className="bg-white/5 rounded-lg p-4"
                        >
                          {/* Header del item */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            {/* Información del producto */}
                            <div className="flex items-center mb-4 md:mb-0">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                                <span>{localidadDetails.icon}</span>
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">
                                  {localidadDetails.name}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                  {item.tickets.length}{' '}
                                  {item.tickets.length === 1
                                    ? 'entrada'
                                    : 'entradas'}
                                </p>
                              </div>
                            </div>

                            {/* Control de tickets */}
                            <div className="flex items-center space-x-4">
                              {/* Precio total por item */}
                              <div className="text-white font-medium w-24 text-right">
                                {formatoPrecio(
                                  item.tickets.reduce((total, ticket) => {
                                    return (
                                      total +
                                      ticket.price +
                                      (ticket.withMemories
                                        ? ticket.priceMemories
                                        : 0)
                                    );
                                  }, 0),
                                )}
                              </div>

                              {/* Botón eliminar todo el tipo de tickets */}
                              <button
                                onClick={() =>
                                  handleEliminarItem(item.localidad)
                                }
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Eliminar todas las entradas de este tipo"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>

                          {/* Botón para mostrar/ocultar formularios de asistentes */}
                          <button
                            onClick={() => handleToggleSection(item.localidad)}
                            className="flex items-center justify-between w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors mb-4"
                          >
                            <span className="flex items-center text-white">
                              <FontAwesomeIcon icon={faUser} className="mr-2" />
                              Datos de Asistentes
                              {!item.tickets.every(
                                (t) =>
                                  t.attendee.name &&
                                  t.attendee.lastname &&
                                  t.attendee.document &&
                                  t.attendee.email,
                              ) && (
                                <span className="ml-2 text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">
                                  Requiere atención
                                </span>
                              )}
                            </span>
                            <FontAwesomeIcon
                              icon={isExpanded ? faChevronUp : faChevronDown}
                              className="text-gray-400"
                            />
                          </button>

                          {/* Formularios de asistentes - uno por cada ticket individual */}
                          {isExpanded && (
                            <div className="mt-2">
                              <p className="text-gray-300 mb-4">
                                Por favor, completa los datos de cada asistente:
                              </p>

                              {item.tickets.map((ticket, index) => (
                                <div key={ticket.id} className="mb-6 relative">
                                  <AttendeeForm
                                    ticketId={ticket.id}
                                    attendee={ticket.attendee}
                                    ticketIndex={index}
                                    localidadNombre={localidadDetails.name}
                                    onChange={handleUpdateAsistente}
                                  />

                                  {/* Opciones del ticket individual */}
                                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    {!localidadDetails.withMemories &&
                                      !localidadDetails.noPermiteMemorias && (
                                        <div className="flex items-center">
                                          <input
                                            type="checkbox"
                                            id={`memorias-${ticket.id}`}
                                            checked={ticket.withMemories}
                                            onChange={() =>
                                              handleToggleMemorias(
                                                ticket.id,
                                                ticket.withMemories,
                                              )
                                            }
                                            className="mr-2"
                                          />
                                          <label
                                            htmlFor={`memorias-${ticket.id}`}
                                            className="text-gray-300 text-sm cursor-pointer"
                                          >
                                            Incluir memorias (+
                                            {formatoPrecio(PRECIO_MEMORIAS)})
                                          </label>
                                        </div>
                                      )}

                                    {localidadDetails.withMemories && (
                                      <div className="text-green-400 text-sm">
                                        Memorias incluidas
                                      </div>
                                    )}

                                    <div className="flex items-center">
                                      <span className="text-white mr-4">
                                        {formatoPrecio(
                                          ticket.price +
                                            (ticket.withMemories
                                              ? ticket.priceMemories
                                              : 0),
                                        )}
                                      </span>

                                      {/* Solo permitir eliminar si hay más de un ticket */}
                                      {item.tickets.length > 1 && (
                                        <button
                                          onClick={() =>
                                            handleEliminarTicket(ticket.id)
                                          }
                                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                                          title="Eliminar este boleto"
                                        >
                                          <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Resumen */}
                  <div className="bg-white/5 p-6 rounded-xl mb-8">
                    <h4 className="text-white font-semibold mb-4">
                      Resumen de compra
                    </h4>

                    <div className="space-y-2 mb-4">
                      {state.items.map((item) => {
                        const localidadDetails = getLocalidadDetails(
                          item.localidad,
                        );

                        // Calcular precios con y sin memorias
                        const ticketsConMemorias = item.tickets.filter(
                          (t) => t.withMemories,
                        );
                        const ticketsSinMemorias = item.tickets.filter(
                          (t) => !t.withMemories,
                        );

                        return (
                          <div key={`summary-${item.localidad}`}>
                            {ticketsSinMemorias.length > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">
                                  {ticketsSinMemorias.length} x{' '}
                                  {localidadDetails.name}
                                </span>
                                <span className="text-white">
                                  {formatoPrecio(
                                    ticketsSinMemorias.reduce(
                                      (sum, t) => sum + t.price,
                                      0,
                                    ),
                                  )}
                                </span>
                              </div>
                            )}

                            {ticketsConMemorias.length > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">
                                  {ticketsConMemorias.length} x{' '}
                                  {localidadDetails.name} + Memorias
                                </span>
                                <span className="text-white">
                                  {formatoPrecio(
                                    ticketsConMemorias.reduce(
                                      (sum, t) =>
                                        sum + t.price + t.priceMemories,
                                      0,
                                    ),
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-white/20 my-4"></div>

                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-blue-300">
                        {formatoPrecio(total)}
                      </span>
                    </div>

                    {/* Agregar aquí el total con IVA */}
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-300">
                        Total con IVA (19%):
                      </span>
                      <span className="text-gray-300">
                        {formatoPrecio(total * 1.19)}
                      </span>
                    </div>
                  </div>

                  {/* Aviso de datos faltantes */}
                  {!isAllDataComplete && (
                    <div className="bg-yellow-900/50 border border-yellow-600 text-yellow-200 p-4 rounded-lg mb-6">
                      <p className="flex items-start">
                        <FontAwesomeIcon icon={faUser} className="mr-2 mt-1" />
                        <span>
                          <strong>Datos incompletos:</strong> Por favor,
                          completa los datos de todos los asistentes antes de
                          continuar con el pago.
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Mensaje de error */}
                  {errorMessage && (
                    <div className="bg-red-900/50 border border-red-600 text-red-200 p-4 rounded-lg mb-6">
                      <p className="flex items-start">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="mr-2 mt-1"
                        />
                        <span>
                          <strong>Error en el pago:</strong> {errorMessage}
                        </span>
                      </p>
                      <div className="mt-3 text-center">
                        <button
                          onClick={() => handleProcederPago()}
                          className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Reintentar pago
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <button
                      onClick={handleContinuarComprando}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Continuar comprando
                    </button>

                    <button
                      onClick={handleProcederPago}
                      disabled={!isAllDataComplete || loading}
                      className={`bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold py-3 px-6 rounded-lg transition-opacity ${!isAllDataComplete || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                      {loading ? (
                        <span>Procesando...</span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faCreditCard}
                            className="mr-2"
                          />
                          Pagar Ahora con Wompi
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
