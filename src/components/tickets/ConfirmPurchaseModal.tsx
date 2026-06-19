'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket,
  faLocationDot,
  faCalendarDay,
  faCreditCard,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { Edition } from '@/types/edition';
import { formatEditionWhere, formatEditionWhen } from '@/utils/editionFormat';
import { useLanguage } from '@/context/LanguageContext';

interface ConfirmPurchaseModalProps {
  open: boolean;
  edition: Edition | null;
  /** Líneas del resumen: cantidad por tipo de localidad. */
  items: { name: string; qty: number }[];
  totalLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  /** Volver a la boletería para cambiar de edición. */
  onChangeEdition: () => void;
}

/**
 * Confirmación explícita de la edición antes de iniciar el pago.
 * Evita que un usuario complete una compra para la ciudad/edición equivocada.
 */
export default function ConfirmPurchaseModal({
  open,
  edition,
  items,
  totalLabel,
  loading = false,
  onConfirm,
  onClose,
  onChangeEdition,
}: ConfirmPurchaseModalProps) {
  const { t, lang } = useLanguage();
  if (!open) return null;

  const where = formatEditionWhere(edition);
  const when = formatEditionWhen(edition, lang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />

      <div className="relative w-full max-w-md bg-gradient-to-b from-[#141a2e] to-[#1a0a12] border border-white/10 rounded-2xl shadow-2xl p-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-40"
          aria-label={t('forms.confirm.close')}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">{t('forms.confirm.title')}</h3>
        <p className="text-sm text-gray-400 mb-5">
          {t('forms.confirm.subtitle')}
        </p>

        {/* Edición */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faTicket} className="text-blue-300" />
            <span className="text-white font-semibold">
              {edition?.name ?? t('forms.confirm.editionFallback')}
            </span>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            {where && (
              <p>
                <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-blue-300/80 w-4" />
                {where}
              </p>
            )}
            {when && (
              <p>
                <FontAwesomeIcon icon={faCalendarDay} className="mr-2 text-blue-300/80 w-4" />
                {when}
              </p>
            )}
          </div>
        </div>

        {/* Resumen de entradas */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            {t('forms.confirm.tickets')}
          </p>
          <ul className="space-y-1">
            {items.map((it, i) => (
              <li key={i} className="flex justify-between text-sm text-gray-200">
                <span>
                  {it.qty} × {it.name}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-white/10 mt-3 pt-3">
            <span className="text-white font-semibold">{t('forms.confirm.total')}</span>
            <span className="text-blue-300 font-bold">{totalLabel}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-[#1C2C67] to-[#4B0012] text-white font-semibold py-3 px-6 rounded-lg transition-opacity flex items-center justify-center ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {loading ? (
              t('forms.confirm.processing')
            ) : (
              <>
                <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                {t('forms.confirm.confirm')}
              </>
            )}
          </button>
          <button
            onClick={onChangeEdition}
            disabled={loading}
            className="w-full text-sm text-gray-300 hover:text-white py-2 transition-colors disabled:opacity-40"
          >
            {t('forms.confirm.changeEdition')}
          </button>
        </div>
      </div>
    </div>
  );
}
