import { CreateLecturerData, Lecturer, UpdateLecturerData } from '@/types/lecturer';
import { UpdateTicketInput } from '@/types/tickets';
import { LoginUserInput } from '@/types/user';
import apiClient, { handleError } from '@/utils/apiClient';
import Cookies from 'js-cookie';

export async function getMe(token: string) {
  try {
    // Para esta función específica necesitamos pasar el token manualmente
    const response = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function loginUser(user: LoginUserInput) {
  try {
    const response = await apiClient.post('/auth/login', user);
    
    // La respuesta real del backend: { status: "ok", token: "..." }
    return {
      status: response.data.status || 'ok',
      token: response.data.token
    };
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    return {
      status: 'fail',
      error: error.response?.data?.message || 'Credenciales inválidas'
    };
  }
}

export async function getInternationalWithTitle(): Promise<Lecturer[]> {
  try {
    const response = await apiClient
      .get('/lecturers/internationals')
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching international lecturers:', err);
        return [];
      });
    return response;
  } catch (error) {
    return handleError(error);
  }
}

export async function getNationalWithTitle(): Promise<Lecturer[]> {
  try {
    const response = await apiClient
      .get('/lecturers/nationals')
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching national lecturers:', err);
        return [];
      });
    return response;
  } catch (error) {
    return handleError(error);
  }
}

export async function getAll(): Promise<Lecturer[]> {
  const response = await apiClient.get('/lecturers').then((res) => res.data).catch((err) => {
    console.error('Error fetching lecturers:', err);
    return [];
  });
  return response;
}

export async function create(lecturer: CreateLecturerData): Promise<Lecturer> {
  const response = await apiClient.post('/lecturers', lecturer).then((res) => res.data).catch((err) => {
    console.error('Error creating lecturer:', err);
    return err;
  });
  return response;
}

export async function update(id: number, lecturer: UpdateLecturerData): Promise<Lecturer> {
  console.log(lecturer);
  const response = await apiClient.patch(`/lecturers/${id}`, lecturer).then((res) => res.data).catch((err) => {
    console.error('Error updating lecturer:', err);
    return [];
  });
  return response;
}

export async function deleteLecturer(id: number): Promise<void> {
  const response = await apiClient.delete(`/lecturers/${id}`).then((res) => res.data).catch((err) => {
    console.error('Error deleting lecturer:', err);
    return [];
  });
  return response;
}

export async function toggleShow(id: number): Promise<Lecturer> {
  const response = await apiClient.patch(`/lecturers/${id}/toggle-show`).then((res) => res.data).catch((err) => {
    console.error('Error toggling visibility:', err);
    return [];
  });
  return response;
}

export async function uploadImage(id: number, file: File): Promise<Lecturer> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post(`/lecturers/${id}/upload-image`, formData).then((res) => res.data).catch((err) => {
    console.error('Error uploading image:', err);
    return [];
  });
  return response;
}

export async function getLecturerByAlt(alt: string): Promise<Lecturer> {
  const response = await apiClient.get(`/lecturers/alt/${alt}`).then((res) => res.data).catch((err) => {
    console.error('Error fetching lecturer by alt:', err);
    return [];
  });
  return response;
}