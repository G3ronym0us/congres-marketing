import type { Edition } from '@/types/edition';

/* Remitente de los correos masivos. Se deriva de la edición elegida
   ("Equipo Organizador CNMP Colombia 2026") en vez de quemar el año, para que
   el correo nunca salga firmado con una edición vieja. Sin edición ("Todas las
   ediciones") queda el nombre genérico, que no envejece. */
export const SENDER_PREFIX  = 'Equipo Organizador';
export const DEFAULT_SENDER = `${SENDER_PREFIX} CNMP`;

export const senderFor = (editions: Edition[], editionId?: number): string => {
  const name = editions.find(e => e.id === editionId)?.name;
  return name ? `${SENDER_PREFIX} ${name}` : DEFAULT_SENDER;
};
