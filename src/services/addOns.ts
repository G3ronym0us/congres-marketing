import apiClient, { handleError } from '@/utils/apiClient';
import {
  AddOn,
  CreateAddOnInput,
  UpdateAddOnInput,
  LocalidadAddOnItem,
} from '@/types/addOn';

// Público: add-ons de una edición
export async function getAddOns(edition?: number): Promise<AddOn[]> {
  try {
    const res = await apiClient.get('/add-ons', {
      params: edition ? { edition } : undefined,
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching add-ons:', error);
    return [];
  }
}

// Admin
export const adminAddOnService = {
  async getAll(edition?: number): Promise<AddOn[]> {
    try {
      const res = await apiClient.get('/admin/add-ons', {
        params: edition ? { edition } : undefined,
      });
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async create(input: CreateAddOnInput): Promise<AddOn> {
    try {
      const res = await apiClient.post('/admin/add-ons', input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async update(id: number, input: UpdateAddOnInput): Promise<AddOn> {
    try {
      const res = await apiClient.patch(`/admin/add-ons/${id}`, input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/add-ons/${id}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Reemplaza los add-ons asociados a una localidad
  async setLocalidadAddOns(
    localidadTypeId: number,
    items: LocalidadAddOnItem[],
  ): Promise<void> {
    try {
      await apiClient.put(`/admin/add-ons/localidad/${localidadTypeId}`, {
        items,
      });
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
