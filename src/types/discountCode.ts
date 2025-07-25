// @/types/discountCode.ts

export interface DiscountCode {
  id: number;
  code: string;
  discountPercentage: string;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountCodeInput {
  code: string;
  discountPercentage: number;
  maxUses: number;
  isActive: boolean;
  expiresAt: string;
}

export interface UpdateDiscountCodeInput {
  discountPercentage?: number;
  maxUses?: number;
  isActive?: boolean;
  expiresAt?: string;
}

export interface ValidateDiscountCodeInput {
  code: string;
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