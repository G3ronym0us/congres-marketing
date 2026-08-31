import apiClient from '@/utils/apiClient';

export type PaymentGatewayName = 'wompi' | 'efipay';

/**
 * Respuesta de `POST /payments`. Según la pasarela activa el backend devuelve
 * `checkoutUrl` (Efipay: se redirige al comprador) o `signature` (Wompi: firma
 * de integridad del widget).
 */
export interface CreatePaymentResponse {
  transaction: { uuid: string; reference: string; status: string };
  gateway: PaymentGatewayName;
  checkoutUrl: string | null;
  signature: string | null;
  discountApplied?: number;
}

/**
 * Pasarela con la que el backend cobra las compras nuevas. Se consulta en vez
 * de fijarla en el frontend para que un cambio de pasarela no obligue a
 * redesplegar el sitio.
 *
 * Si la consulta falla se asume Efipay, que es la pasarela activa: es el
 * camino que no depende de cargar un script de terceros.
 */
export async function getActiveGateway(): Promise<PaymentGatewayName> {
  try {
    const res = await apiClient.get('/payments/gateway');
    return res.data?.gateway === 'wompi' ? 'wompi' : 'efipay';
  } catch (error) {
    console.error('Error fetching active payment gateway:', error);
    return 'efipay';
  }
}
