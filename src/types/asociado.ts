// @/types/asociado.ts

import { DiscountCode } from './discountCode';

export interface Asociado {
  id: number;
  uuid: string;
  edition: number;
  name: string;
  company?: string | null;
  email?: string | null;
  website?: string | null;
  code: string;
  // FK al código de descuento vinculado (null = el código es solo de
  // atribución, sin descuento). En respuestas admin viene con la relación
  // cargada en `discountCode`.
  discountCodeId: number | null;
  discountCode?: DiscountCode | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAsociadoInput {
  edition: number;
  name: string;
  code: string;
  company?: string;
  email?: string;
  website?: string;
  discountCodeUuid?: string;
  isActive?: boolean;
}

export interface UpdateAsociadoInput {
  name?: string;
  code?: string;
  company?: string;
  email?: string;
  website?: string;
  discountCodeUuid?: string | null;
  isActive?: boolean;
}

export interface AsociadoStats {
  asociado: {
    uuid: string;
    name: string;
    code: string;
    edition: number;
    isActive: boolean;
  };
  leadsCount: number;
  convertedLeadsCount: number;
  approvedTransactionsCount: number;
  ticketsSold: number;
  totalAmountInCents: number;
}

export interface AsociadoLead {
  id: number;
  uuid: string;
  edition: number;
  asociadoId: number;
  name: string;
  lastname: string | null;
  email: string;
  phone: string | null;
  document: string | null;
  converted: boolean;
  convertedAt: string | null;
  createdAt: string;
}

export interface ValidateReferralResponse {
  isValid: boolean;
  discountPercentage?: number | null;
  asociadoName?: string;
  discountCode?: string | null;
  message?: string;
}

// Datos de prellenado que expone el backend para un lead (uuid + código)
export interface LeadPrefill {
  name: string;
  lastname: string | null;
  email: string;
  phone: string | null;
  document: string | null;
}

// Referral vigente del comprador, persistido junto al carrito
export interface ReferralInfo {
  code: string;
  percentage: number | null;
  asociadoName?: string;
  leadUuid?: string;
  prefill?: LeadPrefill | null;
}
