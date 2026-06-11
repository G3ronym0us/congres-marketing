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

    // El backend responde 2xx incluso con credenciales malas:
    // { status: "fail", error: "User not found" | "Invalid password" }
    if (response.data.status === 'fail') {
      return { status: 'fail', error: 'Usuario o contraseña incorrectos.' };
    }
    return {
      status: 'ok',
      token: response.data.token
    };
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    const code = error.response?.status;
    let message: string;
    if (!error.response) {
      message = 'No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.';
    } else if (code === 400 || code === 401 || code === 403) {
      message = 'Usuario o contraseña incorrectos.';
    } else if (code === 429) {
      message = 'Demasiados intentos. Espera unos minutos antes de volver a intentar.';
    } else {
      message = 'Error del servidor. Intenta nuevamente en unos minutos.';
    }
    return {
      status: 'fail',
      error: message
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

export async function getAll(edition?: number): Promise<Lecturer[]> {
  const response = await apiClient
    .get('/lecturers', { params: edition ? { edition } : undefined })
    .then((res) => res.data)
    .catch((err) => {
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