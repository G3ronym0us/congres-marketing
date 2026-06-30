import apiClient, { handleError } from '@/utils/apiClient';
import {
  Edition,
  CreateEditionInput,
  UpdateEditionInput,
  CloneEditionInput,
  SetEditionFlagsInput,
} from '@/types/edition';

// Público: solo ediciones visibles
export async function getPublicEditions(): Promise<Edition[]> {
  try {
    const res = await apiClient.get('/editions');
    return res.data;
  } catch (error) {
    console.error('Error fetching public editions:', error);
    return [];
  }
}

export async function getEditionBySlug(slug: string): Promise<Edition | null> {
  try {
    const res = await apiClient.get(`/editions/${slug}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching edition by slug:', error);
    return null;
  }
}

// Admin
export const adminEditionService = {
  async getAll(): Promise<Edition[]> {
    try {
      const res = await apiClient.get('/admin/editions');
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getById(id: number): Promise<Edition> {
    try {
      const res = await apiClient.get(`/admin/editions/${id}`);
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async create(input: CreateEditionInput): Promise<Edition> {
    try {
      const res = await apiClient.post('/admin/editions', input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async clone(input: CloneEditionInput): Promise<Edition> {
    try {
      const res = await apiClient.post('/admin/editions/clone', input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async update(id: number, input: UpdateEditionInput): Promise<Edition> {
    try {
      const res = await apiClient.patch(`/admin/editions/${id}`, input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Sube el PDF de hoteles de la edición y devuelve la edición actualizada.
  async uploadHotelBrochure(id: number, file: File): Promise<Edition> {
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiClient.post(
        `/admin/editions/${id}/hotel-brochure`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async removeHotelBrochure(id: number): Promise<Edition> {
    try {
      const res = await apiClient.delete(`/admin/editions/${id}/hotel-brochure`);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // URL firmada para ver/descargar el brochure actual.
  async getHotelBrochureUrl(id: number): Promise<string | null> {
    try {
      const res = await apiClient.get(`/admin/editions/${id}/hotel-brochure-url`);
      return res.data?.url ?? null;
    } catch (error) {
      return handleError(error);
    }
  },

  // HTML de la vista previa del correo de compra (en el idioma indicado).
  async getPurchaseEmailPreview(id: number, lang: 'es' | 'en'): Promise<string> {
    const res = await apiClient.get(
      `/admin/editions/${id}/purchase-email-preview`,
      { params: { lang }, responseType: 'text' },
    );
    return res.data as string;
  },

  async setFlags(id: number, input: SetEditionFlagsInput): Promise<Edition> {
    try {
      const res = await apiClient.patch(`/admin/editions/${id}/flags`, input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/editions/${id}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
