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
