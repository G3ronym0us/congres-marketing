'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
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
import { formatoPrecio } from '@/data/ticketsData';
import { useLocalidades } from '@/hooks/useLocalidades';
import AttendeeForm from '@/components/tickets/AttendeeForm';
import { AttendeeData, TicketType } from '@/types/tickets';
import { discountUtils } from '@/services/discountCode';
import { AppliedDiscount } from '@/types/discountCode';
import { Edition } from '@/types/edition';
import { getEditionBySlug } from '@/services/editions';
import DiscountCodeInput from '@/components/tickets/DiscountCodeInput';
import EditionBanner from '@/components/tickets/EditionBanner';
import ConfirmPurchaseModal from '@/components/tickets/ConfirmPurchaseModal';
import Script from 'next/script';
import axios from 'axios';
import Cookies from 'js-cookie';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { generateReference } from '@/utils/utils';
import { useLanguage } from '@/context/LanguageContext';
import {
  WhatsAppTopBar,
  WhatsAppWideCard,
  WhatsAppPayCard,
} from '@/components/WhatsAppBanners';
import '../landing.css';

// Estructura para las etapas de descuento
interface DiscountStageView {
  startDate: Date;
  endDate: Date;
  percentage: number;
  label: string;
}

export default function Carrito() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const {
    state,
    isHydrated,
    removeItem,
    removeTicket,
    toggleAddOn,
    updateAttendee,
    clearCart,
    applyDiscount,
    removeDiscount,
    clearReferralPrefill,
  } = useCart();
  const { localidades } = useLocalidades(state.editionId ?? undefined);
  const [edition, setEditionData] = useState<Edition | null>(null);
  const [total, setTotal] = useState(0);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [isAllDataComplete, setIsAllDataComplete] = useState(false);
  // Modal de confirmación de edición antes de iniciar el pago
  const [showConfirm, setShowConfirm] = useState(false);
  // Nombre de la edición comprada (para la pantalla de éxito, donde el carrito
  // ya se limpió y el objeto `edition` queda en null)
  const [purchasedEditionName, setPurchasedEditionName] = useState<string | null>(null);

  // Estados adicionales para Wompi
  const [wompiReady, setWompiReady] = useState(false);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  // La barra de WhatsApp es fixed: mientras esté visible el contenido se baja
  // con --wa-h (ver .cnmp-root.has-wa-bar en landing.css).
  const [waBarVisible, setWaBarVisible] = useState(true);
  const hideWaBar = useCallback(() => setWaBarVisible(false), []);

  // Estados para descuentos
  const [activeStage, setActiveStage] = useState<DiscountStageView | null>(
    null,
  );
  const [totalConDescuento, setTotalConDescuento] = useState(0);
  const [montoDescuento, setMontoDescuento] = useState(0);

  // Etapas de descuento por fecha: definidas en la edición desde el admin.
  // Si la edición no tiene ninguna configurada, no hay descuento por fecha.
  // Se ignoran etapas con fechas inválidas para no romper el render.
  const discountStages: DiscountStageView[] = (edition?.discountStages ?? [])
    .map((e) => ({
      startDate: new Date(e.startDate),
      endDate: new Date(e.endDate),
      percentage: e.percentage,
      label: e.label,
    }))
    .filter(
      (e) =>
        !isNaN(e.startDate.getTime()) && !isNaN(e.endDate.getTime()),
    );

  // Cargar la edición del carrito (para etapas de descuento y validaciones)
  useEffect(() => {
    if (!state.editionSlug) { setEditionData(null); return; }
    let cancelled = false;
    getEditionBySlug(state.editionSlug).then((ed) => {
      if (!cancelled) setEditionData(ed);
    });
    return () => { cancelled = true; };
  }, [state.editionSlug]);

  // Determinar el descuento aplicable según la fecha actual
  useEffect(() => {
    const hoy = new Date();
    const descuentoEncontrado = discountStages.find(
      (etapa) => hoy >= etapa.startDate && hoy <= etapa.endDate,
    );
    setActiveStage(descuentoEncontrado || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edition]);

  // Calcular total con descuentos cuando cambia el total o los descuentos
  useEffect(() => {
    // El total del context ya incluye el descuento por código
    let totalFinal = total;
    
    // Aplicar descuento por fecha sobre el total ya con descuento de código
    if (activeStage && activeStage.percentage > 0) {
      const stageDiscount = totalFinal * (activeStage.percentage / 100);
      setMontoDescuento(stageDiscount);
      setTotalConDescuento(totalFinal - stageDiscount);
    } else {
      setTotalConDescuento(totalFinal);
      setMontoDescuento(0);
    }
  }, [total, activeStage]);

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
        setPurchasedEditionName(edition?.name ?? null);
        clearCart();
        setEnviado(true);
        setErrorMessage(undefined);
        break;
      case 'DECLINED':
        setErrorMessage(
          t('carrito.status.declined'),
        );
        break;
      case 'VOIDED':
        setErrorMessage(
          t('carrito.status.voided'),
        );
        break;
      case 'ERROR':
        setErrorMessage(
          t('carrito.status.error'),
        );
        break;
      case 'PENDING':
        setErrorMessage(
          t('carrito.status.pending'),
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

  // Al entrar (una vez hidratado), desplegar automáticamente los formularios de
  // las localidades cuyos asistentes tengan datos incompletos.
  const didInitExpand = useRef(false);
  useEffect(() => {
    if (!isHydrated || didInitExpand.current || state.items.length === 0) return;
    didInitExpand.current = true;
    const initial: Record<string, boolean> = {};
    state.items.forEach((item) => {
      const incompleto = item.tickets.some(
        (t) =>
          !(
            t.attendee.name &&
            t.attendee.lastname &&
            t.attendee.document &&
            t.attendee.email
          ),
      );
      if (incompleto) initial[item.localidad] = true;
    });
    if (Object.keys(initial).length > 0) {
      setExpandedSections((prev) => ({ ...initial, ...prev }));
    }
  }, [isHydrated, state.items]);

  // Prellenar el primer asistente con los datos del lead del asociado, solo
  // si el formulario está intacto; luego se consume el prefill para no pisar
  // ediciones del usuario (leadUuid y código se conservan para la atribución).
  useEffect(() => {
    if (!isHydrated || !state.referral?.prefill || state.items.length === 0)
      return;
    const firstTicket = state.items[0]?.tickets[0];
    if (!firstTicket) return;
    if (firstTicket.attendee.name === '' && firstTicket.attendee.email === '') {
      const p = state.referral.prefill;
      updateAttendee(firstTicket.id, {
        name: p.name ?? '',
        lastname: p.lastname ?? '',
        document: p.document ?? '',
        email: p.email ?? '',
        phone: p.phone ?? '',
      });
    }
    clearReferralPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, state.referral?.prefill, state.items.length]);

  // Actualizar total cuando cambia el estado del carrito
  useEffect(() => {
    setTotal(state.total);
  }, [state.total]);

  const handleVolver = () => {
    router.push('/boleteria');
  };

  const handleContinuarComprando = () => {
    router.push('/boleteria');
  };

  const handleEliminarItem = (localidad: TicketType) => {
    removeItem(localidad);
  };

  const handleEliminarTicket = (ticketId: string) => {
    removeTicket(ticketId);
  };

  const handleToggleAddOn = (
    ticketId: string,
    addOn: { id: number; slug: string; name: string; price: number },
    on: boolean,
  ) => {
    toggleAddOn(ticketId, addOn, on);
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

  const handleDiscountApplied = (discount: { code: string; percentage: number }) => {
    const appliedDiscount: AppliedDiscount = {
      code: discount.code,
      discountPercentage: discount.percentage,
      discountAmount: 0, // Se calculará en el context
      originalAmount: 0, // Se calculará en el context
      finalAmount: 0, // Se calculará en el context
    };
    
    applyDiscount(appliedDiscount);
  };

  const handleDiscountRemoved = () => {
    removeDiscount();
  };

  // Obtener detalles de un tipo de localidad
  const getLocalidadDetails = (localidad: string) => {
    return (
      localidades[localidad] || {
        name: 'Entrada',
        price: 0,
        icon: '🎫',
        withMemories: false,
        noPermiteMemorias: false,
        addOns: [],
      }
    );
  };

  // Calcular subtotal sin descuento de códigos para mostrar el desglose
  const getSubtotalSinDescuentoCodigo = () => {
    let subtotal = 0;
    state.items.forEach((item) => {
      item.tickets.forEach((ticket) => {
        subtotal +=
          ticket.price + ticket.addOns.reduce((s, a) => s + a.price, 0);
      });
    });
    return subtotal;
  };

  // Abre el modal de confirmación de edición antes de iniciar el pago
  const handleSolicitarPago = () => {
    if (!isAllDataComplete || loading) return;
    setShowConfirm(true);
  };

  // Confirmada la edición, se procede con el pago real
  const handleConfirmarPago = () => {
    setShowConfirm(false);
    handleProcederPago();
  };

  // Nueva función para iniciar el proceso de pago con Wompi
  const handleProcederPago = async () => {
    if (!isAllDataComplete) return;

    if (!state.editionId) {
      alert(t('carrito.alert.noEdition'));
      return;
    }

    setLoading(true);

    try {
      const amountInCents = totalConDescuento * 100;

      // Obtener los datos del primer asistente para usarlos como datos del pagador
      if (state.items.length === 0) {
        throw new Error('No hay tickets en el carrito');
      }

      // 1. Crear tickets en el backend y obtener la firma de integridad
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}payments`,
        {
          reference: reference,
          editionId: state.editionId,
          amountInCents: amountInCents,
          discountCode: state.appliedDiscount?.code || null,
          // Atribución de asociado (link congreso.com/CODIGO); el backend la
          // registra y marca el lead como convertido al aprobarse el pago.
          referralCode: state.referral?.code || null,
          leadUuid: state.referral?.leadUuid || null,
          // Idioma del comprador: el backend lo persiste en el ticket para
          // generar el correo/PDF del boleto en el idioma correcto.
          language: Cookies.get('lang') || 'es',
          tickets: state.items.flatMap((item) => {
            return item.tickets.map((ticket) => ({
              type: ticket.type,
              withMemories: false,
              price: ticket.price,
              priceMemories: 0,
              // Solo los add-ons opcionales (precio > 0); los incluidos los aplica el backend
              addOns: ticket.addOns.filter((a) => a.price > 0).map((a) => a.id),
              attendee: ticket.attendee,
            }));
          }),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': Cookies.get('lang') || 'es',
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
              setPurchasedEditionName(edition?.name ?? null);
              clearCart();
              setEnviado(true);
              setErrorMessage(undefined); // Limpiar cualquier mensaje de error previo
            } else if (result.transaction) {
              // Manejar otros estados de transacción
              switch (result.transaction.status) {
                case 'DECLINED':
                  setErrorMessage(
                    t('carrito.status.declined'),
                  );
                  break;
                case 'VOIDED':
                  setErrorMessage(
                    t('carrito.status.voided'),
                  );
                  break;
                case 'ERROR':
                  setErrorMessage(
                    t('carrito.status.error'),
                  );
                  break;
                case 'PENDING':
                  setErrorMessage(
                    t('carrito.status.pending'),
                  );
                  break;
                default:
                  setErrorMessage(
                    t('carrito.status.unknownPrefix') +
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
                t('carrito.status.payErrorPrefix') + result.error.message,
              );
            } else {
              // Caso donde el usuario cierra el widget sin completar la transacción
              setErrorMessage(
                t('carrito.status.cancelled'),
              );
            }

            setLoading(false);
          });
        } catch (error) {
          setLoading(false);
          alert(t('carrito.alert.initError'));
        }
      } else {
        setLoading(false);
        alert(t('carrito.alert.processError'));
      }
    } catch (error) {
      setLoading(false);
      alert(t('carrito.alert.processError'));
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
          setPurchasedEditionName(transaction.editionName ?? edition?.name ?? null);
          clearCart();
          setEnviado(true);
          setErrorMessage(undefined);
          break;
        case 'DECLINED':
          setErrorMessage(
            t('carrito.status.declined'),
          );
          break;
        case 'VOIDED':
          setErrorMessage(
            t('carrito.status.voided'),
          );
          break;
        case 'ERROR':
          setErrorMessage(
            t('carrito.status.error'),
          );
          break;
        case 'PENDING':
          setErrorMessage(
            t('carrito.status.pending'),
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
    <div className={`cnmp-root${waBarVisible ? ' has-wa-bar' : ''}`}>
      <div className="bg-field" />

      {/* A · BANNER WHATSAPP — barra fija, la misma de la landing */}
      <WhatsAppTopBar onHide={hideWaBar} />

      {/* Cargar el script de Wompi */}
      <Script
        src="https://checkout.wompi.co/widget.js"
        onLoad={handleWompiLoad}
        strategy="afterInteractive"
      />

      {/* Recordatorio persistente de la edición que se está comprando */}
      {!enviado && (!isHydrated || state.items.length > 0) && (
        <EditionBanner edition={edition} onChange={handleVolver} />
      )}

      <main className="page">
        <section className="band">
          <div className="wrap" style={{ maxWidth: 880 }}>
            <button onClick={handleVolver} className="cart-back">
              <FontAwesomeIcon icon={faArrowLeft} />
              {t('carrito.backToTickets')}
            </button>

            {enviado ? (
              // Confirmación de compra
              <div className="qs-panel cart-success">
                <div className="cart-success-icon">
                  <FontAwesomeIcon icon={faCheck} />
                </div>

                <h2 className="cart-success-title">{t('carrito.successTitle')}</h2>

                <p className="cart-success-text">{t('carrito.successText')}</p>

                {purchasedEditionName && (
                  <p className="cart-success-meta">
                    {t('carrito.edition')} <strong>{purchasedEditionName}</strong>
                  </p>
                )}

                <p className="cart-success-meta" style={{ marginBottom: 28 }}>
                  {t('carrito.referenceNumber')} <strong>{reference}</strong>
                </p>

                <button onClick={() => router.push('/')} className="btn btn-neon">
                  {t('carrito.backHome')}
                </button>
              </div>
            ) : (
              <div className="qs-panel cart-panel">
                <h2 className="cart-title">
                  <FontAwesomeIcon icon={faShoppingCart} className="ic" />
                  {t('carrito.title')}
                </h2>

                {/* Banner de descuento si hay un descuento actual */}
                {activeStage && activeStage.percentage > 0 && (
                  <div className="cart-promo-banner">
                    <FontAwesomeIcon icon={faTags} />
                    <span>{activeStage.label}:</span>
                    <span className="pct">{activeStage.percentage}% OFF</span>
                  </div>
                )}

                {/* B · BANNER WHATSAPP — encima de la lista de entradas */}
                <WhatsAppWideCard />

                {!isHydrated ? (
                  <div className="cart-list" aria-hidden="true">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="cart-item">
                        <div className="cart-item-head">
                          <div className="cart-item-info">
                            <span className="sk-line" style={{ width: 44, height: 44, borderRadius: '50%' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <span className="sk-line" style={{ width: 140, height: 16 }} />
                              <span className="sk-line" style={{ width: 90, height: 12 }} />
                            </div>
                          </div>
                          <span className="sk-line" style={{ width: 80, height: 18 }} />
                        </div>
                        <span className="sk-line" style={{ width: '100%', height: 40, borderRadius: 10 }} />
                      </div>
                    ))}
                  </div>
                ) : state.items.length === 0 ? (
                  <div className="cart-empty">
                    <p>{t('carrito.empty')}</p>
                    <button onClick={handleContinuarComprando} className="btn btn-neon">
                      {t('carrito.seeTickets')}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Items del carrito */}
                    <div className="cart-list">
                      {state.items.map((item) => {
                        const localidadDetails = getLocalidadDetails(
                          item.localidad,
                        );
                        const isExpanded =
                          expandedSections[item.localidad] || false;

                        return (
                          <div key={item.localidad} className="cart-item">
                            {/* Header del item */}
                            <div className="cart-item-head">
                              {/* Información del producto */}
                              <div className="cart-item-info">
                                <div className="cart-item-icon">
                                  <span>{localidadDetails.icon}</span>
                                </div>
                                <div>
                                  <h3 className="cart-item-name">
                                    {localidadDetails.name}
                                  </h3>
                                  <p className="cart-item-qty">
                                    {item.tickets.length}{' '}
                                    {item.tickets.length === 1
                                      ? t('carrito.ticketSingular')
                                      : t('carrito.ticketPlural')}
                                  </p>
                                </div>
                              </div>

                              {/* Control de tickets */}
                              <div className="cart-item-controls">
                                {/* Precio total por item */}
                                <div className="cart-item-price">
                                  {formatoPrecio(
                                    item.tickets.reduce((total, ticket) => {
                                      return (
                                        total +
                                        ticket.price +
                                        ticket.addOns.reduce(
                                          (s, a) => s + a.price,
                                          0,
                                        )
                                      );
                                    }, 0),
                                  )}
                                </div>

                                {/* Botón eliminar todo el tipo de tickets */}
                                <button
                                  onClick={() =>
                                    handleEliminarItem(item.localidad)
                                  }
                                  className="cart-item-remove"
                                  title={t('carrito.removeAllTitle')}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>

                            {/* Botón para mostrar/ocultar formularios de asistentes */}
                            <button
                              onClick={() => handleToggleSection(item.localidad)}
                              className="cart-toggle"
                            >
                              <span className="lbl">
                                <FontAwesomeIcon icon={faUser} style={{ marginRight: 8 }} />
                                {t('carrito.attendeeData')}
                                {!item.tickets.every(
                                  (t) =>
                                    t.attendee.name &&
                                    t.attendee.lastname &&
                                    t.attendee.document &&
                                    t.attendee.email,
                                ) && (
                                  <span className="needs-attn">
                                    {t('carrito.needsAttention')}
                                  </span>
                                )}
                              </span>
                              <FontAwesomeIcon
                                icon={isExpanded ? faChevronUp : faChevronDown}
                              />
                            </button>

                            {/* Formularios de asistentes - uno por cada ticket individual */}
                            {isExpanded && (
                              <div style={{ marginTop: 14 }}>
                                <p style={{ color: 'var(--mute)', fontSize: 14, marginBottom: 14 }}>
                                  {t('carrito.completeEach')}
                                </p>

                                {item.tickets.map((ticket, index) => (
                                  <div key={ticket.id} style={{ marginBottom: 18 }}>
                                    <AttendeeForm
                                      ticketId={ticket.id}
                                      attendee={ticket.attendee}
                                      ticketIndex={index}
                                      localidadNombre={localidadDetails.name}
                                      onChange={handleUpdateAsistente}
                                    />

                                    {/* Opciones del ticket individual */}
                                    <div className="cart-ticket-row">
                                      <div className="cart-addon-opts">
                                        {(localidadDetails.addOns ?? [])
                                          .filter((a) => !a.included)
                                          .map((a) => {
                                            const on = ticket.addOns.some(
                                              (x) => x.id === a.id,
                                            );
                                            return (
                                              <div key={a.id} className="cart-addon-opt">
                                                <input
                                                  type="checkbox"
                                                  id={`addon-${a.id}-${ticket.id}`}
                                                  checked={on}
                                                  onChange={() =>
                                                    handleToggleAddOn(
                                                      ticket.id,
                                                      { id: a.id, slug: a.slug, name: a.name, price: a.price },
                                                      !on,
                                                    )
                                                  }
                                                />
                                                <label
                                                  htmlFor={`addon-${a.id}-${ticket.id}`}
                                                  style={{ cursor: 'pointer' }}
                                                >
                                                  {a.icon ?? '➕'} {a.name} (+
                                                  {formatoPrecio(a.price)})
                                                </label>
                                              </div>
                                            );
                                          })}
                                        {(localidadDetails.addOns ?? [])
                                          .filter((a) => a.included)
                                          .map((a) => (
                                            <div key={a.id} className="cart-addon-included">
                                              {t('carrito.addonIncluded', { name: a.name })}
                                            </div>
                                          ))}
                                      </div>

                                      <div className="cart-ticket-total">
                                        <span className="amt">
                                          {formatoPrecio(
                                            ticket.price +
                                              ticket.addOns.reduce(
                                                (s, a) => s + a.price,
                                                0,
                                              ),
                                          )}
                                        </span>

                                        {/* Solo permitir eliminar si hay más de un ticket */}
                                        {item.tickets.length > 1 && (
                                          <button
                                            onClick={() =>
                                              handleEliminarTicket(ticket.id)
                                            }
                                            className="cart-item-remove"
                                            title={t('carrito.removeTicketTitle')}
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
                    <div className="cart-summary">
                      <h4 className="cart-summary-title">
                        {t('carrito.summaryTitle')}
                      </h4>

                      <div className="cart-summary-lines">
                        {state.items.map((item) => {
                          const localidadDetails = getLocalidadDetails(
                            item.localidad,
                          );

                          // Total de add-ons (de pago) de este grupo de tickets
                          const addOnsTotal = item.tickets.reduce(
                            (sum, t) =>
                              sum + t.addOns.reduce((s, a) => s + a.price, 0),
                            0,
                          );

                          return (
                            <div key={`summary-${item.localidad}`}>
                              <div className="cart-summary-line">
                                <span className="lbl">
                                  {item.tickets.length} x {localidadDetails.name}
                                </span>
                                <span className="val">
                                  {formatoPrecio(
                                    item.tickets.reduce(
                                      (sum, t) => sum + t.price,
                                      0,
                                    ),
                                  )}
                                </span>
                              </div>
                              {addOnsTotal > 0 && (
                                <div className="cart-summary-sub">
                                  <span>{t('carrito.addOns')}</span>
                                  <span>{formatoPrecio(addOnsTotal)}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="qs-summary">
                        <div className="row">
                          <span>{t('carrito.subtotal')}</span>
                          <span className="v">{formatoPrecio(state.appliedDiscount || (state.referral?.percentage) ? getSubtotalSinDescuentoCodigo() : total)}</span>
                        </div>

                        {/* Mostrar descuento de código si aplica */}
                        {state.appliedDiscount && (
                          <div className="row" style={{ color: 'var(--neon)' }}>
                            <span>
                              <FontAwesomeIcon icon={faPercentage} style={{ marginRight: 6 }} />
                              {t('carrito.discountCode', { code: state.appliedDiscount.code, percentage: state.appliedDiscount.percentage })}
                            </span>
                            <span className="v" style={{ color: 'var(--neon)' }}>-{formatoPrecio(discountUtils.getDiscountAmount(getSubtotalSinDescuentoCodigo(), state.appliedDiscount.percentage))}</span>
                          </div>
                        )}

                        {/* Descuento del código de asociado (solo si no hay
                            discount code manual, que tiene prioridad) */}
                        {!state.appliedDiscount && state.referral?.percentage ? (
                          <div className="row" style={{ color: 'var(--neon)' }}>
                            <span>
                              <FontAwesomeIcon icon={faPercentage} style={{ marginRight: 6 }} />
                              {t('carrito.referralDiscount', { code: state.referral.code, percentage: state.referral.percentage })}
                            </span>
                            <span className="v" style={{ color: 'var(--neon)' }}>-{formatoPrecio(discountUtils.getDiscountAmount(getSubtotalSinDescuentoCodigo(), state.referral.percentage))}</span>
                          </div>
                        ) : null}

                        {/* Mostrar descuento por fecha si aplica */}
                        {activeStage && activeStage.percentage > 0 && (
                          <div className="row" style={{ color: '#FFB020' }}>
                            <span>
                              <FontAwesomeIcon icon={faPercentage} style={{ marginRight: 6 }} />
                              {t('carrito.discountTemporal', { percentage: activeStage.percentage })}
                            </span>
                            <span className="v" style={{ color: '#FFB020' }}>-{formatoPrecio(montoDescuento)}</span>
                          </div>
                        )}

                        {/* Total con descuentos */}
                        <div className="total">
                          <span>{t('carrito.total')}</span>
                          <span className="v">{formatoPrecio(totalConDescuento)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Componente de código de descuento */}
                    <div style={{ marginBottom: 24 }}>
                      <DiscountCodeInput
                        onDiscountApplied={handleDiscountApplied}
                        onDiscountRemoved={handleDiscountRemoved}
                        appliedDiscount={state.appliedDiscount}
                        disabled={loading}
                        editionId={state.editionId ?? undefined}
                      />
                    </div>

                    {/* Compra referida por un asociado: siempre visible */}
                    {state.referral && (
                      <div
                        style={{
                          marginBottom: 24,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 14px',
                          borderRadius: 12,
                          border: '1px solid rgba(4,238,98,.35)',
                          background: 'rgba(4,238,98,.07)',
                          fontSize: 13,
                          color: '#fff',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>🤝</span>
                        <span>
                          {t('carrito.referralApplied', {
                            name: state.referral.asociadoName ?? state.referral.code,
                            code: state.referral.code,
                          })}
                          {!state.appliedDiscount && state.referral.percentage ? (
                            <strong style={{ color: 'var(--neon)' }}>
                              {' '}{t('boleteria.referralBannerDiscount', {
                                percentage: state.referral.percentage,
                              })}
                            </strong>
                          ) : null}
                        </span>
                      </div>
                    )}

                    {/* Aviso de datos faltantes */}
                    {!isAllDataComplete && (
                      <div className="cart-alert warn">
                        <FontAwesomeIcon icon={faUser} className="ic" />
                        <span className="cart-alert-body">
                          <strong>{t('carrito.incompleteTitle')}</strong> {t('carrito.incompleteText')}
                        </span>
                      </div>
                    )}

                    {/* Mensaje promocional sobre descuentos si aplica */}
                    {activeStage && activeStage.percentage > 0 && (
                      <div className="cart-alert ok">
                        <FontAwesomeIcon icon={faTags} className="ic" />
                        <span className="cart-alert-body">
                          <strong>{t('carrito.promoActiveTitle')}</strong> {t('carrito.promoActiveText', { percentage: activeStage.percentage })}
                          {activeStage.percentage < 35 && (
                            <span style={{ display: 'block', marginTop: 4, fontSize: 13 }}>
                              {t('carrito.promoHurry')}
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Mensaje de error */}
                    {errorMessage && (
                      <div className="cart-alert err">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="ic" />
                        <span className="cart-alert-body">
                          <strong>{t('carrito.errorTitle')}</strong> {errorMessage}
                          <div className="retry">
                            <button
                              onClick={() => handleProcederPago()}
                              className="btn btn-ghost"
                              style={{ padding: '8px 18px', fontSize: 13 }}
                            >
                              {t('carrito.retry')}
                            </button>
                          </div>
                        </span>
                      </div>
                    )}

                    {/* Etapas de descuento informativas */}
                    {discountStages.length > 0 && (
                    <div className="cart-stages">
                      <h4 className="cart-stages-title">
                        <FontAwesomeIcon icon={faTags} />
                        {t('carrito.stagesTitle')}
                      </h4>

                      <div className="cart-stage-grid">
                        {discountStages.map((etapa, index) => {
                          // Verificar si es la etapa actual
                          const fechaHoy = new Date();
                          const esEtapaActual =
                            fechaHoy >= etapa.startDate &&
                            fechaHoy <= etapa.endDate;

                          // Formato de fechas
                          const dateLocale = lang === 'en' ? 'en-US' : 'es-ES';
                          const startDate =
                            etapa.startDate.toLocaleDateString(dateLocale, {
                              day: 'numeric',
                              month: 'short',
                            });
                          const endDate = etapa.endDate.toLocaleDateString(
                            dateLocale,
                            { day: 'numeric', month: 'short' },
                          );

                          return (
                            <div
                              key={index}
                              className={`cart-stage${esEtapaActual ? ' active' : ''}`}
                            >
                              <div className="rng">
                                {startDate} - {endDate}
                              </div>
                              <div className="pct">
                                {etapa.percentage > 0
                                  ? `${etapa.percentage}% OFF`
                                  : t('carrito.priceFull')}
                              </div>
                              {esEtapaActual && (
                                <div className="now">
                                  {t('carrito.activeNow')}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    )}

                    {/* C · BANNER WHATSAPP — rescate encima del botón de pago */}
                    <WhatsAppPayCard />

                    {/* Botones de acción */}
                    <div className="cart-actions">
                      <button
                        onClick={handleContinuarComprando}
                        className="btn btn-ghost"
                      >
                        {t('carrito.continueShopping')}
                      </button>

                      <button
                        onClick={handleSolicitarPago}
                        disabled={!isAllDataComplete || loading}
                        className={`btn btn-neon cart-pay-cta${isAllDataComplete && !loading ? ' ready' : ''}`}
                        style={{ opacity: !isAllDataComplete || loading ? .5 : 1, cursor: !isAllDataComplete || loading ? 'not-allowed' : 'pointer' }}
                      >
                        {loading ? (
                          <span>{t('carrito.processing')}</span>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCreditCard} />
                            {activeStage && activeStage.percentage > 0
                              ? t('carrito.payWithDiscount', { percentage: activeStage.percentage })
                              : t('carrito.payNow')}
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <ConfirmPurchaseModal
        open={showConfirm}
        edition={edition}
        items={state.items.map((item) => ({
          name: getLocalidadDetails(item.localidad).name,
          qty: item.tickets.length,
        }))}
        totalLabel={formatoPrecio(totalConDescuento)}
        loading={loading}
        onConfirm={handleConfirmarPago}
        onClose={() => setShowConfirm(false)}
        onChangeEdition={handleVolver}
      />
    </div>
  );
}
