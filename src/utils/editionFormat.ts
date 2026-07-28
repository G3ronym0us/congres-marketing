import { Edition } from '@/types/edition';

export type Lang = 'es' | 'en';

const MONTHS: Record<Lang, string[]> = {
  es: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
};
const MONTHS_ABBR: Record<Lang, string[]> = {
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

interface DateParts { y: number; m: number; d: number; hh: number; mm: number }

// Parsea "YYYY-MM-DD[THH:mm]" como fecha de calendario local (ignora la zona
// horaria a propósito: solo importan día/mes/año y, si está, la hora; así se
// evita el drift de convertir a UTC).
function parseParts(s?: string | null): DateParts | null {
  if (!s) return null;
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
  if (!m) return null;
  return { y: +m[1], m: +m[2], d: +m[3], hh: m[4] ? +m[4] : 0, mm: m[5] ? +m[5] : 0 };
}

const dayIndex = (p: DateParts) => Math.round(Date.UTC(p.y, p.m - 1, p.d) / 86400000);

// Fecha/hora de inicio: display.iso (naive, sin drift) o eventStartDate.
function startParts(edition: Edition | null | undefined): DateParts | null {
  if (!edition) return null;
  return parseParts(edition.display?.iso ?? edition.eventStartDate);
}
function endParts(edition: Edition | null | undefined): DateParts | null {
  if (!edition) return null;
  return parseParts(edition.eventEndDate);
}

function formatTime(hh: number, mm: number, lang: Lang): string {
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  const time = `${h12}:${String(mm).padStart(2, '0')}`;
  if (lang === 'en') {
    return `${time} ${hh < 12 ? 'AM' : 'PM'}`;
  }
  return `${time} ${hh < 12 ? 'a. m.' : 'p. m.'}`;
}

/**
 * Texto largo del rango de fechas (derivado de inicio/fin). Ejemplos:
 *   ES: "28 de Agosto, 2026" · "28 y 29 de Agosto, 2026" · "del 28 al 31 de Agosto, 2026"
 *   EN: "August 28, 2026" · "August 28 & 29, 2026" · "August 28–31, 2026"
 */
function rangeLong(start: DateParts | null, end: DateParts | null, lang: Lang): string {
  if (!start) return '';
  const months = MONTHS[lang];
  const sMonth = months[start.m - 1];
  const en = lang === 'en';

  // Un solo día (sin fin, o fin igual/anterior al inicio)
  if (!end || dayIndex(end) <= dayIndex(start)) {
    return en
      ? `${sMonth} ${start.d}, ${start.y}`
      : `${start.d} de ${sMonth}, ${start.y}`;
  }

  const count = dayIndex(end) - dayIndex(start) + 1;
  const eMonth = months[end.m - 1];

  // Mismo mes y año
  if (start.m === end.m && start.y === end.y) {
    if (en) {
      return count === 2
        ? `${sMonth} ${start.d} & ${end.d}, ${start.y}`
        : `${sMonth} ${start.d}–${end.d}, ${start.y}`;
    }
    return count === 2
      ? `${start.d} y ${end.d} de ${sMonth}, ${start.y}`
      : `del ${start.d} al ${end.d} de ${sMonth}, ${start.y}`;
  }

  // Cruza mes (mismo año): el año va una sola vez al final
  if (start.y === end.y) {
    if (en) {
      const a = `${sMonth} ${start.d}`;
      const b = `${eMonth} ${end.d}, ${start.y}`;
      return count === 2 ? `${a} & ${b}` : `${a} – ${b}`;
    }
    const a = `${start.d} de ${sMonth}`;
    const b = `${end.d} de ${eMonth}, ${start.y}`;
    return count === 2 ? `${a} y ${b}` : `del ${a} al ${b}`;
  }

  // Cruza año: el año va en cada extremo
  if (en) {
    const a = `${sMonth} ${start.d}, ${start.y}`;
    const b = `${eMonth} ${end.d}, ${end.y}`;
    return count === 2 ? `${a} & ${b}` : `${a} – ${b}`;
  }
  const a = `${start.d} de ${sMonth} de ${start.y}`;
  const b = `${end.d} de ${eMonth} de ${end.y}`;
  return count === 2 ? `${a} y ${b}` : `del ${a} al ${b}`;
}

/** Texto corto del rango (para pestañas/ticker): "28 Ago", "28–29 Ago", "28 Ago–2 Sep". */
function rangeShort(start: DateParts | null, end: DateParts | null, lang: Lang): string {
  if (!start) return '';
  const abbr = MONTHS_ABBR[lang];
  const sMonth = abbr[start.m - 1];
  const en = lang === 'en';

  if (!end || dayIndex(end) <= dayIndex(start)) {
    return en ? `${sMonth} ${start.d}` : `${start.d} ${sMonth}`;
  }
  if (start.m === end.m && start.y === end.y) {
    return en ? `${sMonth} ${start.d}–${end.d}` : `${start.d}–${end.d} ${sMonth}`;
  }
  const eMonth = abbr[end.m - 1];
  return en
    ? `${sMonth} ${start.d} – ${eMonth} ${end.d}`
    : `${start.d} ${sMonth}–${end.d} ${eMonth}`;
}

/** La edición ya terminó (pasó el último día completo del evento). */
export function editionHasEnded(edition: Edition | null | undefined): boolean {
  const p = endParts(edition) ?? startParts(edition);
  // Sin fechas (caso real: la edición 2025) se cae al año, igual que el
  // backend: la edición cuenta como pasada al terminar su año.
  if (!p) {
    if (!edition?.year) return false;
    return new Date(edition.year, 11, 31, 23, 59, 59, 999).getTime() < Date.now();
  }
  // Fin del día de cierre: durante el evento todavía no cuenta como pasado.
  return new Date(p.y, p.m - 1, p.d, 23, 59, 59, 999).getTime() < Date.now();
}

/**
 * Misma regla que aplica el backend para entregar certificados: la edición ya
 * terminó, o el panel los liberó anticipadamente.
 */
export function editionCertificatesAvailable(
  edition: Edition | null | undefined,
): boolean {
  if (!edition) return false;
  return edition.certificatesEnabled || editionHasEnded(edition);
}

/** Lugar legible: "Bogotá, Colombia" (o solo el país si no hay ciudad). */
export function formatEditionWhere(edition: Edition | null | undefined): string {
  if (!edition) return '';
  return [edition.city, edition.country].filter(Boolean).join(', ');
}

/** Texto largo del rango de fechas del evento. */
export function formatEditionDateLong(
  edition: Edition | null | undefined,
  lang: Lang = 'es',
): string {
  return rangeLong(startParts(edition), endParts(edition), lang);
}

/** Texto corto del rango de fechas del evento. */
export function formatEditionDateShort(
  edition: Edition | null | undefined,
  lang: Lang = 'es',
): string {
  return rangeShort(startParts(edition), endParts(edition), lang);
}

/**
 * Fecha (rango) + hora de inicio, para los flujos de compra.
 * Ej: "28 y 29 de Agosto, 2026 · 9:00 a. m." / "August 28 & 29, 2026 · 9:00 AM"
 */
export function formatEditionWhen(
  edition: Edition | null | undefined,
  lang: Lang = 'es',
): string {
  const s = startParts(edition);
  // Sin fecha parseable no se muestra nada: el texto legacy display.dateLong
  // está congelado en la BD y mostraría la fecha vieja.
  if (!s) return '';
  const base = rangeLong(s, endParts(edition), lang);
  const tieneHora = s.hh !== 0 || s.mm !== 0;
  return tieneHora ? `${base} · ${formatTime(s.hh, s.mm, lang)}` : base;
}

/** Resumen "edición · lugar · fecha" para encabezados y banners. */
export function formatEditionSummary(
  edition: Edition | null | undefined,
  lang: Lang = 'es',
): string {
  if (!edition) return '';
  return [edition.name, formatEditionWhere(edition), formatEditionWhen(edition, lang)]
    .filter(Boolean)
    .join(' · ');
}
