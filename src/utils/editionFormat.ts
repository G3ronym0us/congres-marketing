import { Edition } from '@/types/edition';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MESES_ABBR = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

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

function formatTime(hh: number, mm: number): string {
  const period = hh < 12 ? 'a. m.' : 'p. m.';
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, '0')} ${period}`;
}

/**
 * Texto largo del rango de fechas (derivado de inicio/fin):
 *   1 día   → "28 de Agosto, 2026"
 *   2 días  → "28 y 29 de Agosto, 2026" (cruza mes/año si aplica)
 *   +2 días → "del 28 al 31 de Agosto, 2026" (cruza mes/año si aplica)
 */
function rangeLong(start: DateParts | null, end: DateParts | null): string {
  if (!start) return '';
  const sMonth = MESES[start.m - 1];

  // Un solo día (sin fin, o fin igual/anterior al inicio)
  if (!end || dayIndex(end) <= dayIndex(start)) {
    return `${start.d} de ${sMonth}, ${start.y}`;
  }

  const count = dayIndex(end) - dayIndex(start) + 1;
  const eMonth = MESES[end.m - 1];

  // Mismo mes y año
  if (start.m === end.m && start.y === end.y) {
    return count === 2
      ? `${start.d} y ${end.d} de ${sMonth}, ${start.y}`
      : `del ${start.d} al ${end.d} de ${sMonth}, ${start.y}`;
  }

  // Cruza mes (mismo año): el año va una sola vez al final
  if (start.y === end.y) {
    const a = `${start.d} de ${sMonth}`;
    const b = `${end.d} de ${eMonth}, ${start.y}`;
    return count === 2 ? `${a} y ${b}` : `del ${a} al ${b}`;
  }

  // Cruza año: el año va en cada extremo
  const a = `${start.d} de ${sMonth} de ${start.y}`;
  const b = `${end.d} de ${eMonth} de ${end.y}`;
  return count === 2 ? `${a} y ${b}` : `del ${a} al ${b}`;
}

/** Texto corto del rango (para pestañas/ticker): "28 Ago", "28–29 Ago", "28 Ago–2 Sep". */
function rangeShort(start: DateParts | null, end: DateParts | null): string {
  if (!start) return '';
  const sMonth = MESES_ABBR[start.m - 1];

  if (!end || dayIndex(end) <= dayIndex(start)) {
    return `${start.d} ${sMonth}`;
  }
  if (start.m === end.m && start.y === end.y) {
    return `${start.d}–${end.d} ${sMonth}`;
  }
  return `${start.d} ${sMonth}–${end.d} ${MESES_ABBR[end.m - 1]}`;
}

/** Lugar legible: "Bogotá, Colombia" (o solo el país si no hay ciudad). */
export function formatEditionWhere(edition: Edition | null | undefined): string {
  if (!edition) return '';
  return [edition.city, edition.country].filter(Boolean).join(', ');
}

/** Texto largo del rango de fechas del evento. */
export function formatEditionDateLong(edition: Edition | null | undefined): string {
  return rangeLong(startParts(edition), endParts(edition));
}

/** Texto corto del rango de fechas del evento. */
export function formatEditionDateShort(edition: Edition | null | undefined): string {
  return rangeShort(startParts(edition), endParts(edition));
}

/**
 * Fecha (rango) + hora de inicio, para los flujos de compra.
 * Ej: "28 y 29 de Agosto, 2026 · 9:00 a. m."
 */
export function formatEditionWhen(edition: Edition | null | undefined): string {
  const s = startParts(edition);
  if (!s) return edition?.display?.dateLong ?? '';
  const base = rangeLong(s, endParts(edition));
  const tieneHora = s.hh !== 0 || s.mm !== 0;
  return tieneHora ? `${base} · ${formatTime(s.hh, s.mm)}` : base;
}

/** Resumen "edición · lugar · fecha" para encabezados y banners. */
export function formatEditionSummary(edition: Edition | null | undefined): string {
  if (!edition) return '';
  return [edition.name, formatEditionWhere(edition), formatEditionWhen(edition)]
    .filter(Boolean)
    .join(' · ');
}
