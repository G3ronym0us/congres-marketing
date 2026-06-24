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
    <div className="cart-modal-overlay">
      <div className="cart-modal-scrim" onClick={loading ? undefined : onClose} />

      <div className="cart-modal">
        <button
          onClick={onClose}
          disabled={loading}
          className="cart-modal-close"
          aria-label={t('forms.confirm.close')}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h3 className="cart-modal-title">{t('forms.confirm.title')}</h3>
        <p className="cart-modal-sub">{t('forms.confirm.subtitle')}</p>

        {/* Edición */}
        <div className="cart-modal-edition">
          <div className="nm">
            <FontAwesomeIcon icon={faTicket} className="ic" />
            <span>{edition?.name ?? t('forms.confirm.editionFallback')}</span>
          </div>
          <div className="meta">
            {where && (
              <p><FontAwesomeIcon icon={faLocationDot} className="ic" />{where}</p>
            )}
            {when && (
              <p><FontAwesomeIcon icon={faCalendarDay} className="ic" />{when}</p>
            )}
          </div>
        </div>

        {/* Resumen de entradas */}
        <div>
          <p className="cart-modal-tickets-label">{t('forms.confirm.tickets')}</p>
          <ul className="cart-modal-tickets">
            {items.map((it, i) => (
              <li key={i}>
                <span>{it.qty} × {it.name}</span>
              </li>
            ))}
          </ul>
          <div className="cart-modal-total">
            <span className="lbl">{t('forms.confirm.total')}</span>
            <span className="val">{totalLabel}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="cart-modal-actions">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`btn btn-neon${loading ? ' btn-soon' : ''}`}
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? .6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              t('forms.confirm.processing')
            ) : (
              <>
                <FontAwesomeIcon icon={faCreditCard} />
                {t('forms.confirm.confirm')}
              </>
            )}
          </button>
          <button
            onClick={onChangeEdition}
            disabled={loading}
            className="cart-modal-secondary"
          >
            {t('forms.confirm.changeEdition')}
          </button>
        </div>
      </div>
    </div>
  );
}
