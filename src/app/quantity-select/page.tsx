'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// La selección de cantidad se unificó con /boleteria; esta ruta solo
// redirige para no romper enlaces viejos (?localidad= se conserva).
export default function SeleccionCantidad() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const localidad = searchParams ? searchParams.get('localidad') : null;
    router.replace(localidad ? `/boleteria?localidad=${localidad}` : '/boleteria');
  }, [router, searchParams]);

  return null;
}
