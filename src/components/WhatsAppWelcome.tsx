'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { waLink } from '@/data/whatsappBanners';

const SESSION_KEY = 'cnmp:wa-welcome-seen';
const DELAY_MS = 900;

/** Icono de WhatsApp, compartido con el botón flotante. */
export function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.738-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
    </svg>
  );
}

/** Aviso que aparece al entrar a la landing ofreciendo comprar por WhatsApp.
 *  Se muestra una vez por sesión: si el visitante ya lo cerró, no vuelve. */
export default function WhatsAppWelcome() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') return;
    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage bloqueado (incógnito): solo no se recuerda entre recargas */
    }
  }, []);

  // Mientras el aviso está abierto: sin scroll de fondo, foco dentro y Escape
  // para salir. Al cerrar se devuelve el foco a donde estaba.
  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      restoreFocus.current?.focus?.();
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="wa-ov"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waWelcomeTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="wa-sheet" ref={sheetRef} tabIndex={-1}>
        <span className="glow" />
        <button className="x" onClick={close} aria-label={t('waBanner.close')}>
          ✕
        </button>

        <span className="wa-eyebrow">
          <span className="pulse" />
          {t('waBanner.welcome.eyebrow')}
        </span>

        <h3 id="waWelcomeTitle">
          {t('waBanner.welcome.titleA')} <em>{t('waBanner.welcome.titleEm')}</em>
          {t('waBanner.welcome.titleB')}
        </h3>

        <p>{t('waBanner.welcome.lead')}</p>

        <ul className="wa-steps">
          <li>{t('waBanner.welcome.step1')}</li>
          <li>{t('waBanner.welcome.step2')}</li>
          <li>{t('waBanner.welcome.step3')}</li>
        </ul>

        <a
          className="wa-go"
          href={waLink(t('waBanner.buyMessage'))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          <WhatsAppGlyph />
          <span>{t('waBanner.welcome.cta')}</span>
        </a>

        <a
          className="wa-alt"
          href="#entradas"
          onClick={close}
        >
          {t('waBanner.welcome.alt')}
        </a>
      </div>
    </div>
  );
}
