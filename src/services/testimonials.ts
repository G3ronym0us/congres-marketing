import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import {
  Testimonial,
  CreateTestimonialInput,
  UpdateTestimonialInput,
  TestimonialFilters,
} from '@/types/testimonials';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const handleError = (error: any) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error;
};

// Get authorization header with token
const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Public endpoints
export const getTestimonials = async (filters?: TestimonialFilters): Promise<Testimonial[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.active !== undefined) {
      params.append('active', filters.active.toString());
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    
    const response = await api.get(`/testimonials?${params.toString()}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getActiveTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await api.get('/testimonials/active');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getTestimonialById = async (id: number): Promise<Testimonial> => {
  try {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Protected endpoints (require authentication)
export const createTestimonial = async (data: CreateTestimonialInput): Promise<Testimonial> => {
  try {
    const response = await api.post('/testimonials', data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateTestimonial = async (id: number, data: UpdateTestimonialInput): Promise<Testimonial> => {
  try {
    const response = await api.patch(`/testimonials/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const toggleTestimonialActive = async (id: number): Promise<Testimonial> => {
  try {
    const response = await api.patch(`/testimonials/${id}/toggle-active`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const uploadTestimonialImage = async (id: number, file: File): Promise<Testimonial> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/testimonials/${id}/upload-image`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteTestimonialImage = async (id: number): Promise<Testimonial> => {
  try {
    const response = await api.delete(`/testimonials/${id}/image`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteTestimonial = async (id: number): Promise<void> => {
  try {
    await api.delete(`/testimonials/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    return handleError(error);
  }
};