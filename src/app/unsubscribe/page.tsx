'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/utils/apiClient';

type Status = 'loading' | 'success' | 'error';

function UnsubscribeInner() {
  const params = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    if (!token) {
      setStatus('error');
      return;
    }
    apiClient
      .post('/email/unsubscribe', null, { params: { token } })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  const title =
    status === 'loading'
      ? 'Procesando…'
      : status === 'success'
        ? 'Listo, te diste de baja'
        : 'No se pudo procesar la baja';

  const message =
    status === 'loading'
      ? 'Estamos procesando tu solicitud.'
      : status === 'success'
        ? 'No volverás a recibir correos masivos del Congreso Nacional de Marketing Político. Tus boletos y certificados seguirán llegando.'
        : 'El enlace no es válido o expiró. Si quieres darte de baja, escríbenos a cnmpcolombia@gmail.com.';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117', padding: 20 }}>
      <div style={{ maxWidth: 440, width: '100%', background: '#1a1d27', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '36px 28px', textAlign: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>
          {status === 'loading' ? '⏳' : status === 'success' ? '✅' : '⚠️'}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 10px' }}>{title}</h1>
        <p style={{ fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,.7)', margin: 0 }}>{message}</p>
        <a href="/" style={{ display: 'inline-block', marginTop: 24, color: '#04EE62', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeInner />
    </Suspense>
  );
}
