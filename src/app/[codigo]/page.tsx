'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { asociadoService } from '@/services/asociado';
import { ReferralInfo } from '@/types/asociado';

/**
 * Landing de links de asociados: congreso.com/CODIGO[?lead=UUID].
 * Valida el código, guarda el referral en el carrito (atribución + posible
 * descuento + prellenado del lead) y redirige a la boletería. Un código
 * inválido cae al home sin ruido.
 */
export default function ReferralLandingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setReferral } = useCart();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // StrictMode dobla los efectos en dev
    ran.current = true;

    const run = async () => {
      const code = String(params?.codigo ?? '').toUpperCase();

      if (!code) {
        router.replace('/');
        return;
      }

      let validation;
      try {
        validation = await asociadoService.validateCode(code);
      } catch {
        validation = { isValid: false };
      }

      if (!validation.isValid) {
        router.replace('/');
        return;
      }

      const referral: ReferralInfo = {
        code,
        percentage: validation.discountPercentage ?? null,
      };

      // Lead pre-capturado por el asociado: si falla, se sigue sin prellenado
      const leadUuid = searchParams?.get('lead');
      if (leadUuid) {
        try {
          const prefill = await asociadoService.getLeadPrefill(leadUuid, code);
          referral.leadUuid = leadUuid;
          referral.prefill = prefill;
        } catch {
          // uuid inválido o no corresponde al código: se ignora
        }
      }

      setReferral(referral);
      router.replace('/boleteria');
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1A1418',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(4,238,98,.2)',
          borderTopColor: '#04EE62',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
