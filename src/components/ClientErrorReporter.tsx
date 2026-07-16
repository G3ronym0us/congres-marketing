'use client';

import { useEffect } from 'react';
import { reportClientError } from '@/utils/reportClientError';

/**
 * Reporta al backend los errores JS no atrapados (window.error y promesas
 * rechazadas). Complementa a global-error.tsx, que cubre los crashes de render
 * de React. No renderiza nada.
 */
export default function ClientErrorReporter() {
  useEffect(() => {
    const onError = (e: ErrorEvent) =>
      reportClientError({
        message: e.message,
        stack: e.error?.stack,
        source: 'window.error',
      });

    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason as { message?: string; stack?: string } | string;
      reportClientError({
        message:
          typeof reason === 'string' ? reason : reason?.message ?? 'rejection',
        stack: typeof reason === 'object' ? reason?.stack : undefined,
        source: 'unhandledrejection',
      });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
