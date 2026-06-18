'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faLocationDot, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { Edition } from '@/types/edition';
import { formatEditionWhere, formatEditionWhen } from '@/utils/editionFormat';

interface EditionBannerProps {
  edition: Edition | null;
  /** Acción opcional al pulsar "Cambiar" (p. ej. volver a la boletería). */
  onChange?: () => void;
}

/**
 * Banner fijo que recuerda, en todo momento, para qué edición se está comprando.
 * Pensado para las pantallas de compra (carrito) y así evitar confusiones cuando
 * hay varias ediciones/ciudades abiertas a la vez.
 */
export default function EditionBanner({ edition, onChange }: EditionBannerProps) {
  if (!edition) return null;

  const where = formatEditionWhere(edition);
  const when = formatEditionWhen(edition);

  return (
    <div className="sticky top-0 z-30 bg-gradient-to-r from-[#1C2C67] to-[#4B0012] border-b border-white/10 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
            <FontAwesomeIcon icon={faTicket} className="text-white" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-blue-200/80 leading-none mb-1">
              Estás comprando entradas para
            </p>
            <p className="text-white font-semibold leading-tight truncate">
              {edition.name}
            </p>
            <p className="text-xs text-gray-300 truncate flex flex-wrap items-center gap-x-3 gap-y-0.5">
              {where && (
                <span>
                  <FontAwesomeIcon icon={faLocationDot} className="mr-1 text-blue-300" />
                  {where}
                </span>
              )}
              {when && (
                <span>
                  <FontAwesomeIcon icon={faCalendarDay} className="mr-1 text-blue-300" />
                  {when}
                </span>
              )}
            </p>
          </div>
        </div>

        {onChange && (
          <button
            onClick={onChange}
            className="flex-shrink-0 text-xs text-blue-200 hover:text-white border border-white/20 hover:border-white/40 rounded-full px-3 py-1.5 transition-colors"
          >
            Cambiar
          </button>
        )}
      </div>
    </div>
  );
}
