// Envía un error de cliente al backend (queda en los logs de PM2). Best-effort:
// nunca lanza ni bloquea, y deduplica por sesión para no inundar el log.

const reported = new Set<string>();

export interface ClientErrorReport {
  message?: string;
  stack?: string;
  digest?: string;
  source: string;
}

export function reportClientError(input: ClientErrorReport): void {
  if (typeof window === 'undefined') return;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return;

  const key = `${input.source}|${input.message ?? ''}`;
  if (reported.has(key)) return;
  reported.add(key);

  const payload = {
    message: input.message?.slice(0, 2000),
    stack: input.stack?.slice(0, 8000),
    digest: input.digest?.slice(0, 200),
    source: input.source,
    url: window.location.href.slice(0, 1000),
    userAgent: navigator.userAgent.slice(0, 1000),
  };

  try {
    fetch(`${base.replace(/\/$/, '')}/client-errors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* best-effort: si el reporte falla, no hacemos nada */
    });
  } catch {
    /* fetch no disponible: ignorar */
  }
}
