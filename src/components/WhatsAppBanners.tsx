'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BannerArt, WA_BAR, WA_CARD, WA_PAY, waLink } from '@/data/whatsappBanners';

const SESSION_KEY = 'cnmp:wa-bar-dismissed';
const isDev = process.env.NODE_ENV !== 'production';

/** Imagen responsive del banner. Devuelve null cuando el archivo no existe
 *  (en producción) para no dejar nunca una imagen rota a la vista. */
function BannerImage({
  art,
  alt,
  onMissing,
}: {
  art: BannerArt;
  alt: string;
  onMissing: () => void;
}) {
  const [broken, setBroken] = useState(!art.ready);
  const imgRef = useRef<HTMLImageElement>(null);

  // El HTML del servidor ya trae el <img>, así que el navegador la pide y
  // falla antes de que React hidrate: el onError de abajo se pierde. Al montar
  // preguntamos por el estado real de la imagen para no depender del evento.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setBroken(true);
      if (!isDev) onMissing();
    }
  }, [onMissing]);

  if (broken) {
    // En desarrollo dejamos el hueco marcado con las medidas, para poder ver
    // la maqueta antes de que diseño entregue la pieza.
    return isDev ? (
      <span className="wa-ph">
        <span className="wa-ph-desk">{art.specDesktop}</span>
        <span className="wa-ph-mob">{art.specMobile}</span>
      </span>
    ) : null;
  }

  return (
    <picture>
      {art.mobile && (
        <source media="(max-width: 900px)" type="image/webp" srcSet={art.mobile.webp} />
      )}
      {art.mobile && (
        <source media="(max-width: 900px)" type="image/jpeg" srcSet={art.mobile.jpg} />
      )}
      <source type="image/webp" srcSet={art.desktop.webp} />
      <img
        ref={imgRef}
        src={art.desktop.jpg}
        alt={alt}
        onError={() => {
          setBroken(true);
          if (!isDev) onMissing();
        }}
      />
    </picture>
  );
}

/** Enlace que envuelve cualquiera de los banners. */
function BannerLink({
  className,
  ariaKey,
  art,
  onMissing,
}: {
  className: string;
  ariaKey: string;
  art: BannerArt;
  onMissing?: () => void;
}) {
  const { t } = useLanguage();
  const [missing, setMissing] = useState(false);

  // Sin pieza no hay bloque: si dejáramos el <a>, su aspect-ratio reservaría
  // un hueco vacío. En desarrollo sí lo pintamos, con el marcador de medidas.
  if (missing || (!art.ready && !isDev)) return null;

  const label = t(ariaKey);
  return (
    <a
      className={className}
      href={waLink(t('waBanner.message'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <BannerImage
        art={art}
        alt={label}
        onMissing={() => {
          setMissing(true);
          onMissing?.();
        }}
      />
    </a>
  );
}

/** A · barra fija sobre el navbar, visible en toda la página. */
export function WhatsAppTopBar({
  onHide,
}: {
  /** Se llama cuando la barra deja de ocupar espacio (cerrada o sin imagen). */
  onHide: () => void;
}) {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setDismissed(true);
      onHide();
    }
  }, [onHide]);

  const close = () => {
    setDismissed(true);
    onHide();
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage bloqueado (incógnito): se cierra solo por esta vista */
    }
  };

  if (dismissed || missing) return null;

  return (
    <div className="wa-bar">
      <BannerLink
        className="wa-bar-slot"
        ariaKey="waBanner.barAria"
        art={WA_BAR}
        onMissing={() => {
          setMissing(true);
          onHide();
        }}
      />
      <button className="wa-bar-x" onClick={close} aria-label={t('waBanner.close')}>
        ✕
      </button>
    </div>
  );
}

/** B · bloque ancho: "Entradas" de la landing y panel del carrito.
 *  `reveal` solo en la landing: es la única pantalla con el observer que
 *  quita el opacity:0 de la animación de entrada. */
export function WhatsAppWideCard({ reveal = false }: { reveal?: boolean }) {
  return (
    <BannerLink
      className={`wa-card${reveal ? ' reveal' : ''}`}
      ariaKey="waBanner.cardAria"
      art={WA_CARD}
    />
  );
}

/** C · bloque compacto, encima del botón de pago del carrito. */
export function WhatsAppPayCard() {
  return <BannerLink className="wa-pay" ariaKey="waBanner.payAria" art={WA_PAY} />;
}
