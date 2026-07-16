'use client';

import { useEffect, useState } from 'react';
import { reportClientError } from '@/utils/reportClientError';

/**
 * Boundary global de Next: reemplaza el genérico "Application error: a
 * client-side exception has occurred" por una pantalla amigable para el
 * usuario, y reporta el error real al backend (queda en los logs de PM2) para
 * detectarlo sin depender de que la persona avise. El detalle técnico solo se
 * muestra en pantalla con ?debug=1.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    console.error('[GlobalError]', error);
    reportClientError({
      message: error?.message,
      stack: error?.stack,
      digest: error?.digest,
      source: 'global-error',
    });
    try {
      setShowDetail(
        new URLSearchParams(window.location.search).get('debug') === '1',
      );
    } catch {
      /* noop */
    }
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#1A1418',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
          <h1 style={{ fontSize: 22, margin: '0 0 10px', fontWeight: 700 }}>
            Algo salió mal
          </h1>
          <p
            style={{
              opacity: 0.75,
              margin: '0 0 24px',
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            Tuvimos un problema al cargar esta página. Por favor intenta de
            nuevo; si continúa, escríbenos y lo resolvemos.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                background: '#04EE62',
                color: '#0B0B0B',
                border: 'none',
                borderRadius: 8,
                padding: '12px 22px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reintentar
            </button>
            <a
              href="/"
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,.25)',
                borderRadius: 8,
                padding: '12px 22px',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Ir al inicio
            </a>
          </div>

          {showDetail && (
            <pre
              style={{
                marginTop: 24,
                padding: 12,
                textAlign: 'left',
                background: 'rgba(255,255,255,.06)',
                borderRadius: 8,
                fontSize: 12,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowX: 'auto',
              }}
            >
              {error?.message || 'Error sin mensaje'}
              {error?.digest ? `\n\ndigest: ${error.digest}` : ''}
              {error?.stack ? `\n\n${error.stack}` : ''}
            </pre>
          )}
        </div>
      </body>
    </html>
  );
}
