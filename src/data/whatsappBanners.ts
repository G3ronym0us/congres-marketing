// @/data/whatsappBanners.ts
//
// Banners de "compra asistida por WhatsApp" de la landing.
//
//   A · barra fija arriba, visible en toda la página (se puede cerrar).
//   B · bloque ancho: en "Entradas" de la landing y dentro del panel del carrito.
//   C · bloque compacto encima del botón de pago del carrito (rescate cuando
//       Wompi rechaza el pago o el monto supera el límite).
//
// Las piezas viven en el bucket del proyecto, bajo banners/whatsapp/. De cada
// una hay .webp (la que sirve el navegador) y .jpg (respaldo).
import { WHATSAPP_URL } from '@/data/contactData';

const S3 = 'https://congress-marketing.s3.us-east-2.amazonaws.com/banners/whatsapp';

export interface BannerSource {
  webp: string;
  jpg: string;
}

export interface BannerArt {
  /** false mientras diseño no entregue la pieza: el bloque no se pinta. */
  ready: boolean;
  /** Pieza para escritorio (>900px), y única cuando no hay corte móvil. */
  desktop: BannerSource;
  /** Pieza para móvil (<=900px). Se omite si la misma sirve para ambos. */
  mobile?: BannerSource;
  /** Medidas reales, para el marcador que se ve en desarrollo. */
  specDesktop: string;
  specMobile: string;
}

const art = (name: string): BannerSource => ({
  webp: `${S3}/${name}.webp`,
  jpg: `${S3}/${name}.jpg`,
});

/** Alto de la barra A. Debe coincidir con --wa-h en landing.css. */
export const WA_BAR_HEIGHT = { desktop: 80, mobile: 104 };

export const WA_BAR: BannerArt = {
  ready: true,
  desktop: art('wa-bar-desktop'), // 2880 × 160 px (@2x de 1440 × 80)
  mobile: art('wa-bar-mobile'),   //  780 × 208 px (@2x de  390 × 104)
  specDesktop: '2880 × 160 px',
  specMobile: '780 × 208 px',
};

export const WA_CARD: BannerArt = {
  ready: true,
  desktop: art('wa-card-desktop'), // 1960 × 490 px (@2x de 980 × 245)
  mobile: art('wa-card-mobile'),   //  720 × 450 px (@2x de 358 × 224)
  specDesktop: '1960 × 490 px',
  specMobile: '720 × 450 px',
};

// Pieza propia del carrito: texto muy corto, misma imagen en móvil y escritorio.
// Todavía no entregada — hasta que exista, el bloque no se pinta en producción.
export const WA_PAY: BannerArt = {
  // Pendiente de entrega. Poner en true cuando wa-pay.{webp,jpg} esté en S3.
  ready: false,
  desktop: art('wa-pay'), // 720 × 240 px
  specDesktop: '720 × 240 px',
  specMobile: '720 × 240 px',
};

/** Enlace de WhatsApp con el mensaje ya escrito. */
export const waLink = (message: string) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
