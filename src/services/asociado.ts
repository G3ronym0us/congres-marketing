// @/services/asociado.ts

import apiClient, { handleError } from '@/utils/apiClient';
import {
  Asociado,
  AsociadoLead,
  AsociadoStats,
  CreateAsociadoInput,
  UpdateAsociadoInput,
  ValidateReferralResponse,
  LeadPrefill,
} from '@/types/asociado';

// Servicios para el controlador público (/asociados)
export const asociadoService = {
  // Validar código de asociado (público). Los llamadores manejan el error:
  // en la landing /[codigo] un fallo se trata como código inválido.
  async validateCode(
    code: string,
    edition?: number,
  ): Promise<ValidateReferralResponse> {
    const response = await apiClient.get(
      `/asociados/validate/${encodeURIComponent(code)}`,
      { params: edition ? { edition } : undefined },
    );
    return response.data;
  },

  // Datos de prellenado de un lead: exige el par uuid + código (404 si no coincide)
  async getLeadPrefill(uuid: string, code: string): Promise<LeadPrefill> {
    const response = await apiClient.get(`/asociados/leads/${uuid}`, {
      params: { code },
    });
    return response.data;
  },

  // Registrar un lead (lo usan los sitios de los asociados; se expone por completitud)
  async createLead(input: {
    code: string;
    edition: number;
    name: string;
    email: string;
    lastname?: string;
    phone?: string;
    document?: string;
  }): Promise<{ uuid: string }> {
    try {
      const response = await apiClient.post('/asociados/leads', input);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

// Servicios para el controlador admin (/admin/asociados)
export const adminAsociadoService = {
  async create(input: CreateAsociadoInput): Promise<Asociado> {
    try {
      const response = await apiClient.post('/admin/asociados', input);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getAll(edition?: number): Promise<Asociado[]> {
    try {
      const response = await apiClient.get('/admin/asociados', {
        params: edition ? { edition } : undefined,
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Estadísticas de todos los asociados (una entrada por asociado)
  async getStats(edition?: number): Promise<AsociadoStats[]> {
    try {
      const response = await apiClient.get('/admin/asociados/stats', {
        params: edition ? { edition } : undefined,
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getByUuid(uuid: string): Promise<Asociado> {
    try {
      const response = await apiClient.get(`/admin/asociados/${uuid}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getStatsByUuid(uuid: string): Promise<AsociadoStats> {
    try {
      const response = await apiClient.get(`/admin/asociados/${uuid}/stats`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getLeads(uuid: string): Promise<AsociadoLead[]> {
    try {
      const response = await apiClient.get(`/admin/asociados/${uuid}/leads`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async update(uuid: string, input: UpdateAsociadoInput): Promise<Asociado> {
    try {
      const response = await apiClient.patch(`/admin/asociados/${uuid}`, input);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async remove(uuid: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/asociados/${uuid}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
