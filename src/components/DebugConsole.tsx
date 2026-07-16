'use client';

import { useEffect } from 'react';

/**
 * Consola de depuración en pantalla (eruda), útil para ver errores reales en
 * móviles donde no hay DevTools. Solo se activa con ?debug=1 en la URL, así
 * que no afecta a los usuarios normales ni pesa en el bundle (carga diferida).
 *
 * Además captura errores muy temprano en un buffer: si el crash ocurre antes
 * de que eruda termine de inicializar, igual lo mostramos al abrir la consola.
 */
export default function DebugConsole() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') !== '1') return;

    // Buffer de errores previos a la carga de eruda (evita perder el crash)
    const early: string[] = [];
    const onError = (e: ErrorEvent) => {
      early.push(
        `[window.error] ${e.message}\n${e.error?.stack ?? ''} @ ${e.filename}:${e.lineno}:${e.colno}`,
      );
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason;
      early.push(
        `[unhandledrejection] ${r?.message ?? r}\n${r?.stack ?? ''}`,
      );
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    let cancelled = false;
    const w = window as unknown as { __erudaInit?: boolean };
    import('eruda')
      .then((mod) => {
        if (cancelled) return;
        const eruda = mod.default;
        if (!w.__erudaInit) {
          eruda.init();
          w.__erudaInit = true;
        }
        // Vuelca al panel de eruda los errores capturados antes de cargar
        early.forEach((msg) => console.error(msg));
        if (early.length === 0) {
          console.info('[DebugConsole] eruda activo. Sin errores previos.');
        }
      })
      .catch(() => {
        // Si eruda no carga, al menos mostramos el primer error en pantalla
        if (early.length) alert(early[0]);
      });

    return () => {
      cancelled = true;
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
