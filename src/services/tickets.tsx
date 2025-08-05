import apiClient, { handleError } from '@/utils/apiClient';
import {
  Seat,
  Ticket,
  BoldIntegrityHashInput,
  UpdateTicketInput,
  AdminCreateTicketInput,
  FilterGetTicketsInput,
  AdminEditTicketInput,
} from '@/types/tickets';

export const getTicket = async (uuid: string) => {
  try {
    const response = await apiClient.get(`/tickets/${uuid}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getSeatsUsed = async (): Promise<Seat[]> => {
  try {
    const response = await apiClient.get('/tickets/approved');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export async function saveTickets(data: Ticket[]) {
  try {
    const response = await apiClient.post('/tickets/save', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getIntegrityHash(data: BoldIntegrityHashInput) {
  try {
    const response = await apiClient.post('/tickets/generate-integrity-hash', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getTicketsApproved(filter: FilterGetTicketsInput) {
  try {
    const response = await apiClient.get('/admin/tickets', {
      params: filter,
      paramsSerializer: params => {
        // Crear un array para almacenar los pares clave-valor
        const queryParams: string[] = [];
        
        // Procesar los arrays correctamente
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // Para cada valor en el array, añadir un parámetro con el mismo nombre
            value.forEach(val => {
              if (val !== undefined && val !== null) {
                queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
              }
            });
          } else if (value !== undefined && value !== null) {
            // Para valores no-array, añadir el parámetro normalmente
            queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
          }
        });
        
        // Unir todos los pares con &
        return queryParams.join('&');
      }
    });
    
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateTickets(data: UpdateTicketInput) {
  try {
    const response = await apiClient.post('admin/tickets/update', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteTickets(uuid: string) {
  try {
    const response = await apiClient.post('admin/tickets/delete', { uuid });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function downloadTicket(uuid: string): Promise<Blob> {
  try {
    const response = await apiClient.get(`/admin/ticket/download/${uuid}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function resendEmailTicket(
  uuid: string,
): Promise<{ status: string }> {
  try {
    const response = await apiClient.get(`/admin/ticket/email/resend/${uuid}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function adminSaveTickets(data: AdminCreateTicketInput) {
  try {
    const response = await apiClient.post('/admin/tickets/create', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function adminEditTicket(data: AdminEditTicketInput) {
  try {
    const response = await apiClient.post('/admin/tickets/update', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function downloadCertificate(uuid: string): Promise<Blob> {
  try {
    const response = await apiClient.get(`/tickets/certificate/${uuid}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getTicketsMetrics() {
  try {
    const response = await apiClient.get('/tickets/metrics');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getCertificateStatus(): Promise<{ enabled: boolean }> {
  try {
    const response = await apiClient.get('/admin/certificates/status');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function toggleCertificates(enabled: boolean): Promise<{ enabled: boolean }> {
  try {
    const response = await apiClient.put('/admin/certificates/toggle', { enabled });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}