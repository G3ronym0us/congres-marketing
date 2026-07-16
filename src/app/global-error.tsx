'use client';

import { useEffect } from 'react';

/**
 * Boundary global de Next: reemplaza el genérico "Application error: a
 * client-side exception has occurred" (que oculta el detalle) por una pantalla
 * que muestra el error real. Sirve para detectar en producción qué falló y en
 * qué navegador, sin depender de DevTools.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Queda en la consola (DevTools / logs del navegador)
    console.error('[GlobalError]', error);
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
        }}
      >
        <div style={{ maxWidth: 640, width: '100%' }}>
          <h1 style={{ fontSize: 22, margin: '0 0 8px' }}>
            Ocurrió un error inesperado
          </h1>
          <p style={{ opacity: 0.8, margin: '0 0 20px', lineHeight: 1.5 }}>
            Intenta recargar la página. Si el problema persiste, comparte esta
            pantalla con el equipo.
          </p>

          <button
            onClick={() => reset()}
            style={{
              background: '#04EE62',
              color: '#0B0B0B',
              border: 'none',
              borderRadius: 8,
              padding: '12px 20px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>

          <details style={{ marginTop: 24 }}>
            <summary
              style={{ cursor: 'pointer', opacity: 0.7, fontSize: 13 }}
            >
              Detalle técnico
            </summary>
            <pre
              style={{
                marginTop: 12,
                padding: 12,
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
          </details>
        </div>
      </body>
    </html>
  );
}
