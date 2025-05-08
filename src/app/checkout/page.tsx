'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCreditCard,
  faUser,
  faEnvelope,
  faPhone,
  faIdCard,
  faMapMarkerAlt,
  faCheck,
  faTicketAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/context/CartContext';
import { formatoPrecio, localidadesData } from '@/data/ticketsData';
import Script from 'next/script';
import axios from 'axios';

interface FormData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  documento: string;
  direccion: string;
  ciudad: string;
  metodoPago: 'tarjeta' | 'pse' | 'transferencia' | 'nequi' | 'efecty';
}

export default function Checkout() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    documento: '',
    direccion: '',
    ciudad: '',
    metodoPago: 'tarjeta',
  });
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [wompiReady, setWompiReady] = useState(false);
  const [reference, setReference] = useState('');
  // Agregamos un estado para la firma
  const [signature, setSignature] = useState('');

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

  useEffect(() => {
    // Generar una referencia única para el pago
    const generateReference = () => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 10);
      return `CNP-${timestamp}-${randomStr}`;
    };

    const newReference = generateReference();
    console.log('[REF] Referencia generada:', newReference);
    setReference(newReference);
  }, []);

  useEffect(() => {
    // Calcular el total del carrito
    let subtotal = 0;

    state.items.forEach((item) => {
      item.tickets.forEach((ticket) => {
        subtotal +=
          ticket.price + (ticket.withMemories ? ticket.priceMemories : 0);
      });
    });

    console.log('[CART] Total calculado:', subtotal);
    setTotal(subtotal);

    // Si no hay items en el carrito, redirigir al carrito
    if (state.items.length === 0 && !enviado) {
      console.log('[CART] Carrito vacío, redirigiendo a /carrito');
      router.push('/carrito');
    }
  }, [state, router, enviado]);

  // Inicializar el widget de Wompi cuando el script esté cargado
  const handleWompiLoad = () => {
    console.log('[SCRIPT] Evento onLoad del script de Wompi activado');
    console.log('[SCRIPT] Tipo de window:', typeof window);

    if (typeof window !== 'undefined') {
      console.log(
        '[SCRIPT] WidgetCheckout existe después de cargar:',
        !!(window as any).WidgetCheckout,
      );

      if ((window as any).WidgetCheckout) {
        console.log(
          '[SCRIPT] WidgetCheckout encontrado, estableciendo wompiReady = true',
        );
        setWompiReady(true);
      } else {
        console.error(
          '[SCRIPT] ¡ERROR! WidgetCheckout no está disponible después de cargar el script',
        );

        // Intentar de nuevo después de un breve retraso
        setTimeout(() => {
          console.log('[SCRIPT] Verificando de nuevo después de timeout (1s)');
          if ((window as any).WidgetCheckout) {
            console.log(
              '[SCRIPT] WidgetCheckout encontrado después de timeout',
            );
            setWompiReady(true);
          } else {
            console.error(
              '[SCRIPT] WidgetCheckout sigue sin estar disponible después de timeout',
            );

            // Intentar cargar el script manualmente como último recurso
            const loadWompiManually = () => {
              console.log(
                '[SCRIPT] Intentando cargar script de Wompi manualmente',
              );
              const script = document.createElement('script');
              script.src = 'https://checkout.wompi.co/widget.js';
              script.async = true;
              script.onload = () => {
                console.log('[SCRIPT] Script de Wompi cargado manualmente');
                console.log(
                  '[SCRIPT] WidgetCheckout disponible después de carga manual:',
                  !!(window as any).WidgetCheckout,
                );
                if ((window as any).WidgetCheckout) {
                  setWompiReady(true);
                }
              };
              script.onerror = (e) => {
                console.error(
                  '[SCRIPT] Error al cargar script manualmente:',
                  e,
                );
              };
              document.body.appendChild(script);
            };

            loadWompiManually();
          }
        }, 1000);
      }
    }
  };

  const handleScriptError = (e: any) => {
    console.error('[SCRIPT] Error al cargar el script de Wompi:', e);
  };

  const handleVolver = () => {
    router.push('/carrito');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetodoPago = (metodo: FormData['metodoPago']) => {
    setFormData((prev) => ({ ...prev, metodoPago: metodo }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log('[SUBMIT] Iniciando proceso de pago');
    console.log('[SUBMIT] Estado de wompiReady:', wompiReady);
    console.log(
      '[SUBMIT] WidgetCheckout disponible:',
      !!(window as any).WidgetCheckout,
    );

    try {
      // Preparar los datos para Wompi
      const totalConIVA = Math.round(total * 1.19);
      const amountInCents = totalConIVA * 100;
      console.log('[SUBMIT] Total con IVA:', totalConIVA);
      console.log('[SUBMIT] Monto en centavos:', amountInCents);

      // 1. Crear tickets en el backend y obtener la firma de integridad
      console.log(
        '[SUBMIT] Enviando solicitud al backend:',
        `${process.env.NEXT_PUBLIC_API_URL}payments`,
      );
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}payments`,
        {
          reference: reference,
          amountInCents: amountInCents,
          customerEmail: formData.email,
          customerName: `${formData.nombre} ${formData.apellidos}`,
          // Convertir items del carrito al formato que espera el backend
          tickets: state.items.flatMap((item) =>
            item.tickets.map((ticket) => ({
              type: item.localidad,
              includesMemories: ticket.withMemories,
              priceInCents: ticket.price * 100,
              memoriesPriceInCents: ticket.withMemories
                ? ticket.priceMemories * 100
                : 0,
              attendeeData: {
                firstName: ticket.attendee.name,
                lastName: ticket.attendee.lastname,
                email: ticket.attendee.email,
                documentId: ticket.attendee.document,
                phone: formData.telefono,
              },
            })),
          ),
        },
      );

      console.log('[SUBMIT] Respuesta del backend:', response.data);
      const { signature: newSignature, transaction } = response.data;
      setSignature(newSignature);
      console.log('[SUBMIT] Firma recibida:', newSignature);
      console.log('[SUBMIT] ID de transacción:', transaction.id);

      // 2. Iniciar el proceso de pago con Wompi
      console.log(
        '[SUBMIT] Verificando disponibilidad de Wompi para iniciar pago',
      );
      if (wompiReady && (window as any).WidgetCheckout) {
        try {
          console.log(
            '[WOMPI] Inicializando Widget de Wompi con los siguientes datos:',
          );
          console.log('[WOMPI] - Moneda: COP');
          console.log('[WOMPI] - Monto en centavos:', amountInCents);
          console.log('[WOMPI] - Referencia:', reference);
          console.log(
            '[WOMPI] - URL de redirección:',
            `${window.location.origin}/confirmation?ref=${reference}`,
          );
          console.log(
            '[WOMPI] - Firma de integridad disponible:',
            !!newSignature,
          );

          // Crear configuración para el Widget
          const checkout = new (window as any).WidgetCheckout({
            currency: 'COP',
            amountInCents: amountInCents,
            reference: reference,
            publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
            redirectUrl: `${window.location.origin}/confirmation?ref=${reference}`,
            signature: {
              integrity: newSignature,
            },
            // Impuestos
            taxInCents: {
              vat: Math.round(total * 0.19 * 100), // IVA del 19%
            },
            // Datos del cliente
            customerData: {
              email: formData.email,
              fullName: `${formData.nombre} ${formData.apellidos}`,
              phoneNumber: formData.telefono.replace(/\D/g, ''),
              phoneNumberPrefix: '+57',
              legalId: formData.documento,
              legalIdType: 'CC',
            },
          });

          console.log(
            '[WOMPI] Widget de Wompi configurado correctamente, abriendo...',
          );

          // Abrir el widget y manejar la respuesta
          checkout.open(function (result: any) {
            console.log('[WOMPI] Transacción completada:', result);

            // Verificar el estado de la transacción
            if (
              result.transaction &&
              result.transaction.status === 'APPROVED'
            ) {
              console.log('[WOMPI] Transacción aprobada');
              // Limpiar el carrito y mostrar confirmación
              clearCart();
              setEnviado(true);
            } else {
              console.log(
                '[WOMPI] Transacción no aprobada, verificando estado con el backend',
              );
              // Verificar el estado real en el backend
              verifyTransaction(reference);
            }

            setLoading(false);
          });
        } catch (error) {
          console.error('[WOMPI] Error al inicializar Wompi:', error);

          // Intentar mostrar más detalles del error
          if (error instanceof Error) {
            console.error('[WOMPI] Mensaje de error:', error.message);
            console.error('[WOMPI] Stack de error:', error.stack);
          }

          setLoading(false);

          // Intentar usar Web Checkout como alternativa
          usarWebCheckoutComoAlternativa(newSignature, amountInCents);
        }
      } else {
        console.warn(
          '[SUBMIT] Wompi no está disponible, usando flujo alternativo',
        );
        console.log('[SUBMIT] wompiReady:', wompiReady);
        console.log(
          '[SUBMIT] WidgetCheckout disponible:',
          !!(window as any).WidgetCheckout,
        );

        setLoading(false);
        alert('Error: No se pudo cargar el widget de Wompi');

        // Intentar usar Web Checkout como alternativa
        usarWebCheckoutComoAlternativa(newSignature, amountInCents);
      }
    } catch (error) {
      console.error('[SUBMIT] Error al crear la transacción:', error);

      // Intentar mostrar más detalles del error
      if (error instanceof Error) {
        console.error('[SUBMIT] Mensaje de error:', error.message);
        console.error('[SUBMIT] Stack de error:', error.stack);
      }

      // Si es un error de Axios, mostrar la respuesta
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          '[SUBMIT] Respuesta de error del servidor:',
          error.response.data,
        );
        console.error('[SUBMIT] Código de estado:', error.response.status);
      }

      setLoading(false);
      alert('Error al procesar la transacción. Por favor, intenta de nuevo.');
    }
  };

  // Nueva función para usar Web Checkout como alternativa
  const usarWebCheckoutComoAlternativa = (
    firma: string,
    montoEnCentavos: number,
  ) => {
    console.log('[WEBCHECKOUT] Iniciando flujo alternativo con Web Checkout');
    console.log('[WEBCHECKOUT] Firma:', firma);
    console.log('[WEBCHECKOUT] Monto en centavos:', montoEnCentavos);

    try {
      // Crear formulario para Web Checkout
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = 'https://checkout.wompi.co/p/';

      // Campos requeridos
      const campos = {
        'public-key': process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
        currency: 'COP',
        'amount-in-cents': montoEnCentavos,
        reference: reference,
        'signature:integrity': firma,
        'redirect-url': `${window.location.origin}/confirmation?ref=${reference}`,
        'customer-data:email': formData.email,
        'customer-data:full-name': `${formData.nombre} ${formData.apellidos}`,
        'customer-data:phone-number': formData.telefono.replace(/\D/g, ''),
        'customer-data:legal-id': formData.documento,
        'customer-data:legal-id-type': 'CC',
        'tax-in-cents:vat': Math.round(total * 0.19 * 100),
      };

      console.log('[WEBCHECKOUT] Campos del formulario:', campos);

      // Agregar campos al formulario
      Object.entries(campos).forEach(([nombre, valor]) => {
        if (valor) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = nombre;
          input.value = String(valor);
          form.appendChild(input);
          console.log(
            `[WEBCHECKOUT] Campo agregado: ${nombre}=${String(valor).substring(0, 20)}${String(valor).length > 20 ? '...' : ''}`,
          );
        } else {
          console.warn(`[WEBCHECKOUT] Campo ${nombre} no tiene valor`);
        }
      });

      // Agregar el formulario al documento y enviarlo
      document.body.appendChild(form);
      console.log(
        '[WEBCHECKOUT] Formulario creado y agregado al documento, enviando...',
      );
      form.submit();
    } catch (error) {
      console.error(
        '[WEBCHECKOUT] Error al crear el formulario de Web Checkout:',
        error,
      );
      if (error instanceof Error) {
        console.error('[WEBCHECKOUT] Mensaje de error:', error.message);
        console.error('[WEBCHECKOUT] Stack de error:', error.stack);
      }
      alert(
        'Error al intentar redireccionar a la página de pagos. Por favor, intenta de nuevo.',
      );
    }
  };

  // Verificar el estado de una transacción
  const verifyTransaction = async (reference: string) => {
    console.log('[VERIFY] Verificando transacción:', reference);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}payments/verify/${reference}`,
      );
      console.log('[VERIFY] Respuesta del backend:', response.data);
      const transaction = response.data;

      if (transaction.status === 'APPROVED') {
        console.log('[VERIFY] Transacción aprobada');
        clearCart();
        setEnviado(true);
      } else {
        console.log(
          '[VERIFY] Transacción no aprobada, estado:',
          transaction.status,
        );
      }
    } catch (error) {
      console.error('[VERIFY] Error al verificar la transacción:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          '[VERIFY] Respuesta de error del servidor:',
          error.response.data,
        );
        console.error('[VERIFY] Código de estado:', error.response.status);
      }
    }
  };

  // Agrupar tickets por tipo para mostrar en el resumen
  const getTicketsAgrupados = () => {
    const ticketsAgrupados: Record<
      string,
      {
        conMemorias: number;
        sinMemorias: number;
        totalConMemorias: number;
        totalSinMemorias: number;
      }
    > = {};

    state.items.forEach((item) => {
      const localidad = item.localidad;

      if (!ticketsAgrupados[localidad]) {
        ticketsAgrupados[localidad] = {
          conMemorias: 0,
          sinMemorias: 0,
          totalConMemorias: 0,
          totalSinMemorias: 0,
        };
      }

      item.tickets.forEach((ticket) => {
        if (ticket.withMemories) {
          ticketsAgrupados[localidad].conMemorias++;
          ticketsAgrupados[localidad].totalConMemorias +=
            ticket.price + ticket.priceMemories;
        } else {
          ticketsAgrupados[localidad].sinMemorias++;
          ticketsAgrupados[localidad].totalSinMemorias += ticket.price;
        }
      });
    });

    return ticketsAgrupados;
  };

  // Obtener número total de tickets
  const getNumeroTotalTickets = () => {
    return state.items.reduce((total, item) => total + item.tickets.length, 0);
  };

  // Obtener detalles de un tipo de localidad
  const getLocalidadDetails = (localidad: string) => {
    return localidadesData[localidad];
  };

  // El resto de tu componente permanece igual...
  return (
    <>
      {/* Cargar el script de Wompi */}
      <Script
        src="https://checkout.wompi.co/widget.js"
        onLoad={handleWompiLoad}
        onError={handleScriptError}
        strategy="afterInteractive"
      />
    
      <div className="min-h-screen bg-gradient-to-r from-[#0f1424] to-[#1a0a12] py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {!enviado && (
            <button
              onClick={handleVolver}
              className="flex items-center text-blue-300 hover:text-blue-400 transition mb-8"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Volver al carrito
            </button>
          )}

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
                Hemos enviado un correo a{' '}
                <span className="text-blue-300">{formData.email}</span> con los
                detalles de tu compra y las instrucciones para acceder al
                evento.
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulario de datos personales */}
              <div className="bg-black/20 backdrop-filter backdrop-blur-sm p-8 rounded-xl">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-3 text-blue-300"
                  />
                  Información personal
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-white mb-2">
                        Nombre
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="text-gray-500"
                          />
                        </div>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          className="w-full pl-10 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="apellidos"
                        className="block text-white mb-2"
                      >
                        Apellidos
                      </label>
                      <input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        className="w-full py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white mb-2">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="text-gray-500"
                        />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="telefono"
                        className="block text-white mb-2"
                      >
                        Teléfono
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FontAwesomeIcon
                            icon={faPhone}
                            className="text-gray-500"
                          />
                        </div>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className="w-full pl-10 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="documento"
                        className="block text-white mb-2"
                      >
                        Número de documento
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FontAwesomeIcon
                            icon={faIdCard}
                            className="text-gray-500"
                          />
                        </div>
                        <input
                          type="text"
                          id="documento"
                          name="documento"
                          value={formData.documento}
                          onChange={handleInputChange}
                          className="w-full pl-10 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="direccion"
                      className="block text-white mb-2"
                    >
                      Dirección
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="text-gray-500"
                        />
                      </div>
                      <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        className="w-full pl-10 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ciudad" className="block text-white mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      className="w-full py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl">
                    <h4 className="text-white font-semibold mb-4">
                      Método de pago preferido
                    </h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Selecciona tu método de pago preferido. Todos los métodos
                      están disponibles en Wompi.
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                      <div
                        className={`p-4 rounded-lg text-center cursor-pointer transition-colors ${formData.metodoPago === 'tarjeta' ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/10 border border-gray-700'}`}
                        onClick={() => handleMetodoPago('tarjeta')}
                      >
                        <FontAwesomeIcon
                          icon={faCreditCard}
                          className="text-xl mb-2 text-gray-300"
                        />
                        <p className="text-white text-sm">Tarjeta</p>
                      </div>

                      <div
                        className={`p-4 rounded-lg text-center cursor-pointer transition-colors ${formData.metodoPago === 'pse' ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/10 border border-gray-700'}`}
                        onClick={() => handleMetodoPago('pse')}
                      >
                        <span className="text-xl mb-2 block font-bold text-gray-300">
                          PSE
                        </span>
                        <p className="text-white text-sm">Transferencia</p>
                      </div>

                      <div
                        className={`p-4 rounded-lg text-center cursor-pointer transition-colors ${formData.metodoPago === 'nequi' ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/10 border border-gray-700'}`}
                        onClick={() => handleMetodoPago('nequi')}
                      >
                        <span className="text-xl mb-2 block font-bold text-pink-400">
                          N
                        </span>
                        <p className="text-white text-sm">Nequi</p>
                      </div>

                      <div
                        className={`p-4 rounded-lg text-center cursor-pointer transition-colors ${formData.metodoPago === 'transferencia' ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/10 border border-gray-700'}`}
                        onClick={() => handleMetodoPago('transferencia')}
                      >
                        <span className="text-xl mb-2 block font-bold text-yellow-300">
                          $
                        </span>
                        <p className="text-white text-sm">Bancolombia</p>
                      </div>

                      <div
                        className={`p-4 rounded-lg text-center cursor-pointer transition-colors ${formData.metodoPago === 'efecty' ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/10 border border-gray-700'}`}
                        onClick={() => handleMetodoPago('efecty')}
                      >
                        <span className="text-xl mb-2 block font-bold text-green-400">
                          E
                        </span>
                        <p className="text-white text-sm">Efecty</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold py-4 px-6 rounded-lg transition-opacity ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                      {loading ? (
                        <span>Procesando...</span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faCreditCard}
                            className="mr-2"
                          />
                          Proceder al Pago con Wompi
                        </span>
                      )}
                    </button>

                    {/* Logos de métodos de pago */}
                    <div className="mt-4 flex justify-center items-center">
                      <img
                        src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/credit_cards.png"
                        alt="Métodos de pago"
                        className="h-8"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Resumen del pedido */}
              <div className="bg-black/20 backdrop-filter backdrop-blur-sm p-8 rounded-xl">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="mr-3 text-blue-300"
                  />
                  Resumen del pedido
                </h2>

                <div className="bg-white/5 p-4 rounded-lg mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faTicketAlt}
                      className="text-blue-300 mr-3"
                    />
                    <span className="text-white font-semibold">
                      Total de entradas:
                    </span>
                  </div>
                  <span className="text-white font-bold">
                    {getNumeroTotalTickets()}
                  </span>
                </div>

                {/* Productos agrupados por tipo */}
                <div className="space-y-4 mb-8">
                  {Object.entries(getTicketsAgrupados()).map(
                    ([localidad, datos]) => {
                      const localidadDetails = getLocalidadDetails(localidad);

                      return (
                        <div
                          key={`checkout-${localidad}`}
                          className="py-3 border-b border-white/10"
                        >
                          <div className="flex items-center mb-2">
                            <span className="mr-2">
                              {localidadDetails.icon}
                            </span>
                            <span className="text-white font-semibold">
                              {localidadDetails.name}
                            </span>
                          </div>

                          {/* Tickets sin memorias */}
                          {datos.sinMemorias > 0 && (
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">
                                {datos.sinMemorias}{' '}
                                {datos.sinMemorias > 1 ? 'entradas' : 'entrada'}{' '}
                                básicas
                              </span>
                              <span className="text-white">
                                {formatoPrecio(datos.totalSinMemorias)}
                              </span>
                            </div>
                          )}

                          {/* Tickets con memorias */}
                          {datos.conMemorias > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">
                                {datos.conMemorias}{' '}
                                {datos.conMemorias > 1 ? 'entradas' : 'entrada'}{' '}
                                + Memorias
                              </span>
                              <span className="text-white">
                                {formatoPrecio(datos.totalConMemorias)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>

                {/* Detalles de costos */}
                <div className="bg-white/5 p-6 rounded-xl mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white">{formatoPrecio(total)}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">IVA (19%):</span>
                    <span className="text-white">
                      {formatoPrecio(total * 0.19)}
                    </span>
                  </div>

                  <div className="border-t border-white/20 my-4"></div>

                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-blue-300">
                      {formatoPrecio(total * 1.19)}
                    </span>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="text-gray-300 text-sm space-y-2">
                  <p className="flex items-center text-green-400">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Transacción segura con Wompi
                  </p>
                  <p>
                    Al realizar la compra aceptas nuestros términos y
                    condiciones y políticas de privacidad.
                  </p>
                  <p>
                    Los boletos serán enviados a tu correo electrónico después
                    de confirmar el pago.
                  </p>
                </div>

                {/* Logo de Wompi */}
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-xs mb-2">Procesado por</p>
                  <img
                    src="https://files.readme.io/8c26717-small-powered_by_wompi_5.png"
                    alt="Powered by Wompi"
                    className="h-6 mx-auto"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
