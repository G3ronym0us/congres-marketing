import {
  CreateLecturerData,
  Lecturer,
  PropagationTarget,
  UpdateLecturerData,
} from '@/types/lecturer';
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

// Todas las funciones de conferencistas propagan el error con handleError en
// vez de devolver []: un [] donde se espera un Lecturer hacía que el panel
// mostrara "éxito" en operaciones que en realidad habían fallado.

export async function getInternationalWithTitle(
  edition?: number,
): Promise<Lecturer[]> {
  try {
    const response = await apiClient.get('/lecturers/internationals', {
      params: edition ? { edition } : undefined,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getNationalWithTitle(
  edition?: number,
): Promise<Lecturer[]> {
  try {
    const response = await apiClient.get('/lecturers/nationals', {
      params: edition ? { edition } : undefined,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getAll(edition?: number): Promise<Lecturer[]> {
  try {
    const response = await apiClient.get('/lecturers', {
      params: edition ? { edition } : undefined,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function create(lecturer: CreateLecturerData): Promise<Lecturer> {
  try {
    const response = await apiClient.post('/lecturers', lecturer);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function update(uuid: string, lecturer: UpdateLecturerData): Promise<Lecturer> {
  try {
    const response = await apiClient.patch(`/lecturers/${uuid}`, lecturer);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function copyLecturer(
  uuid: string,
  editionId: number,
): Promise<Lecturer> {
  const response = await apiClient
    .post(`/lecturers/${uuid}/copy`, { editionId })
    .then((res) => res.data);
  return response;
}

export async function deleteLecturer(uuid: string): Promise<void> {
  try {
    const response = await apiClient.delete(`/lecturers/${uuid}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function toggleShow(uuid: string): Promise<Lecturer> {
  try {
    const response = await apiClient.patch(`/lecturers/${uuid}/toggle-show`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function uploadImage(
  uuid: string,
  file: File,
  propagate = false,
): Promise<Lecturer> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post(
      `/lecturers/${uuid}/upload-image`,
      formData,
      { params: propagate ? { propagate: 'true' } : undefined },
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

/** Ediciones POSTERIORES en las que existe la misma persona. */
export async function getPropagationTargets(
  uuid: string,
): Promise<PropagationTarget[]> {
  try {
    const response = await apiClient.get(
      `/lecturers/${uuid}/propagation-targets`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getLecturerByAlt(
  alt: string,
  edition?: number,
): Promise<Lecturer> {
  try {
    const response = await apiClient.get(`/lecturers/alt/${alt}`, {
      params: edition ? { edition } : undefined,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
