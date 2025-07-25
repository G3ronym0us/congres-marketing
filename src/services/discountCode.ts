// @/services/discountCode.ts

import apiClient, { handleError } from '@/utils/apiClient';
import {
  DiscountCode,
  CreateDiscountCodeInput,
  UpdateDiscountCodeInput,
  ValidateDiscountCodeInput,
  ValidateDiscountCodeResponse,
} from '@/types/discountCode';

// Servicios para el controlador público (/discount-codes)
export const discountCodeService = {
  // Validar código de descuento (público)
  async validateCode(input: ValidateDiscountCodeInput): Promise<ValidateDiscountCodeResponse> {
    try {
      const response = await apiClient.post('/discount-codes/validate', input);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

// Servicios para el controlador admin (/admin/discount-codes)
export const adminDiscountCodeService = {
  // Crear código de descuento
  async createCode(input: CreateDiscountCodeInput): Promise<DiscountCode> {
    try {
      const response = await apiClient.post('/admin/discount-codes', input);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Listar todos los códigos
  async getAllCodes(): Promise<DiscountCode[]> {
    try {
      const response = await apiClient.get('/admin/discount-codes');
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Obtener código por ID
  async getCodeById(id: number): Promise<DiscountCode> {
    try {
      const response = await apiClient.get(`/admin/discount-codes/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Actualizar código
  async updateCode(id: number, input: UpdateDiscountCodeInput): Promise<DiscountCode> {
    try {
      const response = await apiClient.patch(`/admin/discount-codes/${id}`, input);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Eliminar código
  async deleteCode(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/discount-codes/${id}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Validar código (admin)
  async validateCode(input: ValidateDiscountCodeInput): Promise<ValidateDiscountCodeResponse> {
    try {
      const response = await apiClient.post('/admin/discount-codes/validate', input);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

// Utilidades para calcular descuentos
export const discountUtils = {
  // Calcular monto de descuento
  getDiscountAmount(originalAmount: number, discountPercentage: number): number {
    return Math.round((originalAmount * discountPercentage) / 100);
  },

  // Calcular monto final con descuento
  getFinalAmount(originalAmount: number, discountPercentage: number): number {
    const discountAmount = this.getDiscountAmount(originalAmount, discountPercentage);
    return originalAmount - discountAmount;
  },

  // Formatear porcentaje para mostrar
  formatPercentage(percentage: string | number): string {
    const num = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
    return `${num}%`;
  },

  // Validar si un código ha expirado
  isCodeExpired(expiresAt: string): boolean {
    return new Date(expiresAt) < new Date();
  },

  // Validar si un código está disponible para uso
  isCodeAvailable(code: DiscountCode): boolean {
    return (
      code.isActive &&
      !this.isCodeExpired(code.expiresAt) &&
      code.currentUses < code.maxUses
    );
  },
};