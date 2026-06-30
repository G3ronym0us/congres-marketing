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

  async getByUuid(uuid: string): Promise<Edition> {
    try {
      const res = await apiClient.get(`/admin/editions/${uuid}`);
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

  async update(uuid: string, input: UpdateEditionInput): Promise<Edition> {
    try {
      const res = await apiClient.patch(`/admin/editions/${uuid}`, input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Sube el PDF de hoteles de la edición y devuelve la edición actualizada.
  async uploadHotelBrochure(uuid: string, file: File): Promise<Edition> {
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiClient.post(
        `/admin/editions/${uuid}/hotel-brochure`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async removeHotelBrochure(uuid: string): Promise<Edition> {
    try {
      const res = await apiClient.delete(`/admin/editions/${uuid}/hotel-brochure`);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // URL firmada para ver/descargar el brochure actual.
  async getHotelBrochureUrl(uuid: string): Promise<string | null> {
    try {
      const res = await apiClient.get(`/admin/editions/${uuid}/hotel-brochure-url`);
      return res.data?.url ?? null;
    } catch (error) {
      return handleError(error);
    }
  },

  // HTML de la vista previa del correo de compra (en el idioma indicado).
  async getPurchaseEmailPreview(uuid: string, lang: 'es' | 'en'): Promise<string> {
    const res = await apiClient.get(
      `/admin/editions/${uuid}/purchase-email-preview`,
      { params: { lang }, responseType: 'text' },
    );
    return res.data as string;
  },

  async setFlags(uuid: string, input: SetEditionFlagsInput): Promise<Edition> {
    try {
      const res = await apiClient.patch(`/admin/editions/${uuid}/flags`, input);
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async remove(uuid: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/editions/${uuid}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
