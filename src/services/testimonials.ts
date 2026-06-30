import apiClient, { handleError } from '@/utils/apiClient';
import {
  Testimonial,
  CreateTestimonialInput,
  UpdateTestimonialInput,
  TestimonialFilters,
} from '@/types/testimonials';

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
    
    const response = await apiClient.get(`/testimonials?${params.toString()}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getActiveTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await apiClient.get('/testimonials/active');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getTestimonialByUuid = async (uuid: string): Promise<Testimonial> => {
  try {
    const response = await apiClient.get(`/testimonials/${uuid}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Protected endpoints (require authentication)
export const createTestimonial = async (data: CreateTestimonialInput): Promise<Testimonial> => {
  try {
    const response = await apiClient.post('/testimonials', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateTestimonial = async (uuid: string, data: UpdateTestimonialInput): Promise<Testimonial> => {
  try {
    const response = await apiClient.patch(`/testimonials/${uuid}`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const toggleTestimonialActive = async (uuid: string): Promise<Testimonial> => {
  try {
    const response = await apiClient.patch(`/testimonials/${uuid}/toggle-active`, {});
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const uploadTestimonialImage = async (uuid: string, file: File): Promise<Testimonial> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/testimonials/${uuid}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteTestimonialImage = async (uuid: string): Promise<Testimonial> => {
  try {
    const response = await apiClient.delete(`/testimonials/${uuid}/image`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteTestimonial = async (uuid: string): Promise<void> => {
  try {
    await apiClient.delete(`/testimonials/${uuid}`);
  } catch (error) {
    return handleError(error);
  }
};
