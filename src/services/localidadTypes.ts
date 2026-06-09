import apiClient, { handleError } from '@/utils/apiClient';
import {
  LocalidadType,
  CreateLocalidadTypeInput,
  UpdateLocalidadTypeInput,
} from '@/types/localidadTypes';

export async function getLocalidadTypes(): Promise<LocalidadType[]> {
  try {
    const res = await apiClient.get('/localidad-types');
    return res.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function createLocalidadType(
  data: CreateLocalidadTypeInput,
): Promise<LocalidadType> {
  try {
    const res = await apiClient.post('/admin/localidad-types', data);
    return res.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateLocalidadType(
  id: number,
  data: UpdateLocalidadTypeInput,
): Promise<LocalidadType> {
  try {
    const res = await apiClient.patch(`/admin/localidad-types/${id}`, data);
    return res.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteLocalidadType(id: number): Promise<void> {
  try {
    await apiClient.delete(`/admin/localidad-types/${id}`);
  } catch (error) {
    return handleError(error);
  }
}
