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
    const response = await api.get('/auth/refresh', {
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
