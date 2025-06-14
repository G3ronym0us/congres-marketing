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
  faPercentage,
  faTags,
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
import { generateReference } from '@/utils/utils';

// Estructura para las etapas de descuento
interface DescuentoEtapa {
  fechaInicio: Date;
  fechaFin: Date;
  porcentaje: number;
  etiqueta: string;
}

// Definir las etapas de descuento según la imagen
const etapasDescuento: DescuentoEtapa[] = [
  {
    fechaInicio: new Date('2025-04-27'),
    fechaFin: new Date('2025-05-04'),
    porcentaje: 35,
    etiqueta: 'Venta exclusiva asistentes 2024',
  },
  {
    fechaInicio: new Date('2025-05-04'),
    fechaFin: new Date('2025-05-11'),
    porcentaje: 30,
    etiqueta: 'Descuento especial',
  },
  {
    fechaInicio: new Date('2025-05-11'),
    fechaFin: new Date('2025-05-21'),
    porcentaje: 20,
    etiqueta: 'Descuento',
  },
  {
    fechaInicio: new Date('2025-05-21'),
    fechaFin: new Date('2025-06-01'),
    porcentaje: 10,
    etiqueta: 'Último descuento',
  },
  {
    fechaInicio: new Date('2025-06-01'),
    fechaFin: new Date('2025-08-04'), // Fecha del evento
    porcentaje: 0,
    etiqueta: 'Precio completo',
  },
];

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

  // Estados para descuentos
  const [descuentoActual, setDescuentoActual] = useState<DescuentoEtapa | null>(
    null,
  );
  const [totalConDescuento, setTotalConDescuento] = useState(0);
  const [montoDescuento, setMontoDescuento] = useState(0);

  // Determinar el descuento aplicable según la fecha actual
  useEffect(() => {
    const hoy = new Date();
    const descuentoEncontrado = etapasDescuento.find(
      (etapa) => hoy >= etapa.fechaInicio && hoy <= etapa.fechaFin,
    );
    setDescuentoActual(descuentoEncontrado || null);
  }, []);

  // Calcular total con descuento cuando cambia el total o el descuento
  useEffect(() => {
    if (descuentoActual) {
      const descuento = total * (descuentoActual.porcentaje / 100);
      const nuevoTotal = total - descuento;
      setMontoDescuento(descuento);
      setTotalConDescuento(nuevoTotal);
    } else {
      setTotalConDescuento(total);
      setMontoDescuento(0);
    }
  }, [total, descuentoActual]);

  // Generar referencia única
  useEffect(() => {
    const reference = generateReference();
    setReference(reference);
  }, []);

  // Verificar inicialmente si Wompi ya está disponible
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).WidgetCheckout) {
        setWompiReady(true);
      }
    }

    // No mostramos la clave pública completa por seguridad
    if (process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY) {
      const maskedKey =
        process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY.substring(0, 5) +
        '...' +
        process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY.substring(
          process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY.length - 4,
        );
    }
  }, []);

  useEffect(() => {
    // Función para verificar parámetros en la URL
    const checkUrlParams = () => {
      // Obtener parámetros de la URL
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const refParam = urlParams.get('ref');
        const statusParam = urlParams.get('status');

        // Si tenemos una referencia en la URL
        if (refParam) {
          setReference(refParam);

          // Si también tenemos un status, procesarlo directamente
          if (statusParam) {
            // Procesar el estado directamente
            handleTransactionStatus(refParam, statusParam);
          } else {
            // Si solo tenemos la referencia, verificarla en el backend
            verifyTransaction(refParam);
          }
        }
      }
    };

    // Ejecutar la verificación cuando se monta el componente
    checkUrlParams();
  }, []);

  // Función para manejar el estado de la transacción
  const handleTransactionStatus = (ref: string, status: string) => {
    setLoading(true);
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'APPROVED':
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
        // Verificar en el backend para estar seguros
        verifyTransaction(ref);
        break;
    }

    setLoading(false);
  };

  // Inicializar el widget de Wompi cuando el script esté cargado
  const handleWompiLoad = () => {
    setWompiReady(true);
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
          ticket.attendee.email &&
          ticket.attendee.phone,
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
        withMemories: false,
        noPermiteMemorias: false,
      }
    );
  };

  // Nueva función para iniciar el proceso de pago con Wompi
  const handleProcederPago = async () => {
    if (!isAllDataComplete) return;

    setLoading(true);

    try {
      const amountInCents = totalConDescuento * 100;

      // Obtener los datos del primer asistente para usarlos como datos del pagador
      if (state.items.length === 0) {
        throw new Error('No hay tickets en el carrito');
      }

      const ticketsData = [];

      state.items.forEach((item) => {
        item.tickets.forEach((ticket) => {
          ticketsData.push({
            type: ticket.type,
            withMemories: ticket.withMemories,
            price: ticket.price,
            priceMemories: ticket.priceMemories,
            attendee: ticket.attendee,
          });
        });
      });

      // 1. Crear tickets en el backend y obtener la firma de integridad
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}payments`,
        {
          reference: reference,
          amountInCents: amountInCents,
          tickets: state.items.flatMap((item) => {
            return item.tickets.map((ticket) => ({
              type: ticket.type,
              withMemories: ticket.withMemories,
              price: ticket.price,
              priceMemories: ticket.priceMemories,
              attendee: ticket.attendee,
            }));
          }),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const { signature, transaction } = response.data;

      // 2. Iniciar el proceso de pago con Wompi
      if (wompiReady && (window as any).WidgetCheckout) {
        try {
          // Crear configuración para el Widget
          const checkout = new (window as any).WidgetCheckout({
            currency: 'COP',
            amountInCents: amountInCents,
            reference: reference,
            publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
            redirectUrl: `${window.location.origin}/carrito?ref=${reference}`,
            signature: {
              integrity: signature,
            },
          });

          checkout.open(function (result: any) {
            // Verificar el estado de la transacción
            if (
              result.transaction &&
              result.transaction.status === 'APPROVED'
            ) {
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
          setLoading(false);
          alert('Error al inicializar el pago. Por favor, intenta de nuevo.');
        }
      } else {
        setLoading(false);
        alert('Error al procesar la transacción. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      setLoading(false);
      alert('Error al procesar la transacción. Por favor, intenta de nuevo.');
    }
  };

  // Verificar el estado de una transacción
  const verifyTransaction = async (reference: string) => {
    try {
      console.log('Verificando transacción:', reference);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}payments/verify/${reference}`,
      );
      console.log('Respuesta:', response.data);
      const transaction = response.data;

      // Manejar diferentes estados
      switch (transaction.status) {
        case 'APPROVED':
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

              {/* Banner de descuento si hay un descuento actual */}
              {descuentoActual && descuentoActual.porcentaje > 0 && (
                <div className="bg-amber-500/20 border border-amber-400 text-amber-100 p-4 rounded-lg mb-6">
                  <p className="flex items-center justify-center text-lg font-semibold">
                    <FontAwesomeIcon icon={faTags} className="mr-2" />
                    <span className="mr-2">{descuentoActual.etiqueta}:</span>
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full">
                      {descuentoActual.porcentaje}% OFF
                    </span>
                  </p>
                </div>
              )}

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
                                      (ticket.withMemories &&
                                      ticket.type !== TicketType.DIAMOND
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
                                            (ticket.withMemories &&
                                            ticket.type !== TicketType.DIAMOND
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
                                  {`${ticketsConMemorias.length} x ${localidadDetails.name} ${localidadDetails.withMemories ? '(Incluye memorias)' : '+ Memorias'}`}
                                </span>
                                <span className="text-white">
                                  {formatoPrecio(
                                    ticketsConMemorias.reduce(
                                      (sum, t) =>
                                        sum +
                                        t.price +
                                        (t.withMemories &&
                                        t.type !== TicketType.DIAMOND
                                          ? t.priceMemories
                                          : 0),
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

                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-white">{formatoPrecio(total)}</span>
                    </div>

                    {/* Mostrar descuento si aplica */}
                    {descuentoActual && descuentoActual.porcentaje > 0 && (
                      <div className="flex justify-between mt-2 text-amber-300">
                        <span className="flex items-center">
                          <FontAwesomeIcon
                            icon={faPercentage}
                            className="mr-1"
                          />
                          Descuento ({descuentoActual.porcentaje}%):
                        </span>
                        <span>-{formatoPrecio(montoDescuento)}</span>
                      </div>
                    )}

                    {/* Total con descuento */}
                    <div className="flex justify-between text-xl font-bold mt-2">
                      <span className="text-white">Total:</span>
                      <span className="text-blue-300">
                        {formatoPrecio(totalConDescuento)}
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

                  {/* Mensaje promocional sobre descuentos si aplica */}
                  {descuentoActual && descuentoActual.porcentaje > 0 && (
                    <div className="bg-green-900/50 border border-green-600 text-green-200 p-4 rounded-lg mb-6">
                      <p className="flex items-start">
                        <FontAwesomeIcon icon={faTags} className="mr-2 mt-1" />
                        <span>
                          <strong>¡Promoción activa!</strong> Estás aprovechando
                          un descuento del {descuentoActual.porcentaje}% en tu
                          compra.
                          {descuentoActual.porcentaje < 35 && (
                            <span className="block mt-1 text-sm">
                              Los precios aumentarán pronto. ¡No pierdas esta
                              oportunidad!
                            </span>
                          )}
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

                  {/* Etapas de descuento informativas */}
                  <div className="bg-black/30 border border-gray-700 rounded-lg p-4 mb-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon icon={faTags} className="mr-2" />
                      Etapas de descuento
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                      {etapasDescuento.map((etapa, index) => {
                        // Verificar si es la etapa actual
                        const fechaHoy = new Date();
                        const esEtapaActual =
                          fechaHoy >= etapa.fechaInicio &&
                          fechaHoy <= etapa.fechaFin;

                        // Formato de fechas
                        const fechaInicio =
                          etapa.fechaInicio.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                          });
                        const fechaFin = etapa.fechaFin.toLocaleDateString(
                          'es-ES',
                          { day: 'numeric', month: 'short' },
                        );

                        return (
                          <div
                            key={index}
                            className={`p-2 text-center rounded text-sm ${
                              esEtapaActual
                                ? 'bg-amber-500/50 border border-amber-400'
                                : 'bg-white/5'
                            }`}
                          >
                            <div className="text-xs text-gray-300 mb-1">
                              {fechaInicio} - {fechaFin}
                            </div>
                            <div
                              className={`font-semibold ${esEtapaActual ? 'text-white' : 'text-gray-400'}`}
                            >
                              {etapa.porcentaje > 0
                                ? `${etapa.porcentaje}% OFF`
                                : 'Precio full'}
                            </div>
                            {esEtapaActual && (
                              <div className="text-xs text-amber-200 mt-1">
                                Activo ahora
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

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
                          {descuentoActual && descuentoActual.porcentaje > 0
                            ? `Pagar con ${descuentoActual.porcentaje}% OFF`
                            : 'Pagar Ahora'}
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
