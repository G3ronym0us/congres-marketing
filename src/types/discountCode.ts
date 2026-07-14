// @/types/discountCode.ts

export interface DiscountCode {
  id: number;
  uuid: string;
  edition: number;
  code: string;
  discountPercentage: string;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountCodeInput {
  edition: number;
  code: string;
  discountPercentage: number;
  maxUses?: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface UpdateDiscountCodeInput {
  discountPercentage?: number;
  maxUses?: number | null;
  isActive?: boolean;
  expiresAt?: string | null;
}

export interface ValidateDiscountCodeInput {
  code: string;
  edition?: number;
}

export interface ValidateDiscountCodeResponse {
  isValid: boolean;
  discountPercentage?: string;
  message?: string;
}

export interface DiscountCodeError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface AppliedDiscount {
  code: string;
  discountPercentage: number;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
}
