import { CreateLecturerData, Lecturer, UpdateLecturerData } from '@/types/lecturer';
import { UpdateTicketInput } from '@/types/tickets';
import { LoginUserInput } from '@/types/user';
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

// Crear una instancia de Axios con configuración común
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Importante para CORS con credenciales
});

// Función de ayuda para manejar errores
const handleError = (error: any) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error;
};

export async function getMe(token: string) {
  try {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function loginUser(user: LoginUserInput) {
  try {
    const response = await api.post('/auth/login', user);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getInternationalWithTitle(): Promise<Lecturer[]> {
  try {
    const response = await api
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
    const response = await api
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
  const response = await api.get('/lecturers').then((res) => res.data).catch((err) => {
    console.error('Error fetching lecturers:', err);
    return [];
  });
  return response;
}

export async function create(lecturer: CreateLecturerData): Promise<Lecturer> {
  const response = await api.post('/lecturers', lecturer).then((res) => res.data).catch((err) => {
    console.error('Error creating lecturer:', err);
    return err;
  });
  return response;
}

export async function update(id: number, lecturer: UpdateLecturerData): Promise<Lecturer> {
  console.log(lecturer);
  const response = await api.patch(`/lecturers/${id}`, lecturer).then((res) => res.data).catch((err) => {
    console.error('Error updating lecturer:', err);
    return [];
  });
  return response;
}

export async function deleteLecturer(id: number): Promise<void> {
  const response = await api.delete(`/lecturers/${id}`).then((res) => res.data).catch((err) => {
    console.error('Error deleting lecturer:', err);
    return [];
  });
  return response;
}

export async function toggleShow(id: number): Promise<Lecturer> {
  const response = await api.patch(`/lecturers/${id}/toggle-show`).then((res) => res.data).catch((err) => {
    console.error('Error toggling visibility:', err);
    return [];
  });
  return response;
}

export async function uploadImage(id: number, file: File): Promise<Lecturer> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/lecturers/${id}/upload-image`, formData).then((res) => res.data).catch((err) => {
    console.error('Error uploading image:', err);
    return [];
  });
  return response;
}