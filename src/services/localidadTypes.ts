import apiClient, { handleError } from '@/utils/apiClient';
import {
  LocalidadType,
  CreateLocalidadTypeInput,
  UpdateLocalidadTypeInput,
  TicketTemplate,
} from '@/types/localidadTypes';

export async function getLocalidadTypes(
  edition?: number,
): Promise<LocalidadType[]> {
  try {
    const res = await apiClient.get('/localidad-types', {
      params: edition ? { edition } : undefined,
    });
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
  uuid: string,
  data: UpdateLocalidadTypeInput,
): Promise<LocalidadType> {
  try {
    const res = await apiClient.patch(`/admin/localidad-types/${uuid}`, data);
    return res.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteLocalidadType(uuid: string): Promise<void> {
  try {
    await apiClient.delete(`/admin/localidad-types/${uuid}`);
  } catch (error) {
    return handleError(error);
  }
}

// Regenera el PDF de los boletos PAID/RESERVED de esta localidad (para aplicar
// el nuevo template). Encola el trabajo en el backend; no reenvía correos.
export async function regenerateLocalidadTickets(
  uuid: string,
): Promise<{ queued: number }> {
  try {
    const res = await apiClient.post(
      `/admin/localidad-types/${uuid}/regenerate-tickets`,
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
}

// Genera y descarga un boleto de prueba con la plantilla del editor.
export async function downloadTicketPreview(payload: {
  template: TicketTemplate;
  name: string;
  lastname?: string;
  document: string;
}): Promise<void> {
  const res = await apiClient.post(
    '/admin/localidad-types/preview-ticket',
    payload,
    { responseType: 'blob' },
  );
  const url = window.URL.createObjectURL(
    new Blob([res.data], { type: 'application/pdf' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = 'boleto-prueba.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// Sube la imagen de fondo de la plantilla del boleto y devuelve su URL pública.
export async function uploadTicketBackground(
  file: File,
): Promise<{ key: string; url: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    // OJO: no seteamos Content-Type a mano. El navegador debe ponerlo con el
    // boundary del multipart; si lo forzamos a 'multipart/form-data' sin boundary,
    // el backend no puede parsear el archivo (curl/Postman sí porque agregan el boundary).
    const res = await apiClient.post(
      '/admin/localidad-types/upload-ticket-bg',
      formData,
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
}
