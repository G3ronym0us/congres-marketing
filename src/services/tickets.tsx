import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import {
  Seat,
  Ticket,
  BoldIntegrityHashInput,
  UpdateTicketInput,
  AdminCreateTicketInput,
} from '@/types/tickets'; // Asegúrate de que estas importaciones sean correctas

const token = Cookies.get('token');

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const handleError = (error: any) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error;
};

export const getSeatsUsed = async (): Promise<Seat[]> => {
  try {
    const response = await api.get('/tickets/approved');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export async function saveTickets(data: Ticket[]) {
  try {
    const response = await api.post('/tickets/save', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getIntegrityHash(data: BoldIntegrityHashInput) {
  try {
    const response = await api.post('/tickets/generate-integrity-hash', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getTicketsApproved() {
  try {
    const response = await api.get('/admin/tickets', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateTickets(data: UpdateTicketInput) {
  try {
    const response = await api.post('admin/tickets/update', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteTickets(uuid: string) {
  try {
    const response = await api.post('admin/tickets/delete', { uuid }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function downloadTicket(uuid: string): Promise<Blob> {
  try {
    const response = await api.get(`/admin/ticket/download/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function resendEmailTicket(uuid: string): Promise<{status: string}> {
  try {
    const response = await api.get(`/admin/ticket/email/resend/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function adminSaveTickets(data: AdminCreateTicketInput[]) {
  try {
    const response = await api.post('/admin/tickets/create', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
