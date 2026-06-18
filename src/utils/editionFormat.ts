import { Edition } from '@/types/edition';

/**
 * Lugar legible de una edición: "Bogotá, Colombia" (o solo el país si no hay ciudad).
 */
export function formatEditionWhere(edition: Edition | null | undefined): string {
  if (!edition) return '';
  return [edition.city, edition.country].filter(Boolean).join(', ');
}

/**
 * Fecha (y hora si la trae) del evento de una edición.
 * Prioriza eventStartDate (timestamp editable); si no existe, cae a los textos
 * de presentación (display.dateLong / dateShort) que alimentaban el countdown.
 */
export function formatEditionWhen(edition: Edition | null | undefined): string {
  if (!edition) return '';

  if (edition.eventStartDate) {
    const d = new Date(edition.eventStartDate);
    if (!Number.isNaN(d.getTime())) {
      const fecha = d.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const hora = d.toLocaleTimeString('es-CO', {
        hour: 'numeric',
        minute: '2-digit',
      });
      // Solo añade la hora si no es exactamente medianoche (fecha sin hora real)
      const tieneHora = d.getHours() !== 0 || d.getMinutes() !== 0;
      return tieneHora ? `${fecha} · ${hora}` : fecha;
    }
  }

  return edition.display?.dateLong ?? edition.display?.dateShort ?? '';
}

/**
 * Resumen "edición · lugar · fecha" para encabezados y banners.
 */
export function formatEditionSummary(edition: Edition | null | undefined): string {
  if (!edition) return '';
  return [edition.name, formatEditionWhere(edition), formatEditionWhen(edition)]
    .filter(Boolean)
    .join(' · ');
}
