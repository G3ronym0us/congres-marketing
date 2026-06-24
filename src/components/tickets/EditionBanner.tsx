'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faLocationDot, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { Edition } from '@/types/edition';
import { formatEditionWhere, formatEditionWhen } from '@/utils/editionFormat';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t, lang } = useLanguage();
  if (!edition) return null;

  const where = formatEditionWhere(edition);
  const when = formatEditionWhen(edition, lang);

  return (
    <div className="cart-edition-banner">
      <div className="wrap" style={{ padding: '12px var(--gut)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <span className="cart-edition-icon">
            <FontAwesomeIcon icon={faTicket} />
          </span>
          <div style={{ minWidth: 0 }}>
            <p className="cart-edition-kicker">{t('forms.banner.buyingForLabel')}</p>
            <p className="cart-edition-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {edition.name}
            </p>
            <p className="cart-edition-meta" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {where && (
                <span><FontAwesomeIcon icon={faLocationDot} className="ic" />{where}</span>
              )}
              {when && (
                <span><FontAwesomeIcon icon={faCalendarDay} className="ic" />{when}</span>
              )}
            </p>
          </div>
        </div>

        {onChange && (
          <button onClick={onChange} className="cart-edition-change">
            {t('forms.banner.change')}
          </button>
        )}
      </div>
    </div>
  );
}
