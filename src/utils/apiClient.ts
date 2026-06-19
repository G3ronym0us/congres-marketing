import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Crear una instancia de Axios con configuración común
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Función para obtener el token dinámicamente
const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Interceptor para añadir automáticamente el token de autorización
apiClient.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      config.headers.Authorization = authHeaders.Authorization;
    }
    // Idioma actual: el backend lo usa para devolver errores/validaciones
    // traducidos (resuelve por Accept-Language). Por defecto 'es'.
    config.headers['Accept-Language'] = Cookies.get('lang') || 'es';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores 401
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Si el error es 401 (Unauthorized), redirigir al login
    if (error.response?.status === 401) {
      // Limpiar el token almacenado
      Cookies.remove('token');
      
      // Solo redirigir si no estamos ya en la página de login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/auth')) {
        // En el cliente, redirigir al login
        window.location.href = '/admin/auth';
      }
    }
    
    // Re-lanzar el error para que pueda ser manejado por el código que hizo la llamada
    return Promise.reject(error);
  }
);

// Función de ayuda para manejar errores
export const handleError = (error: any) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error;
};

export default apiClient;