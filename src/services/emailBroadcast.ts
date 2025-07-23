import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import { EmailBroadcast, CreateEmailBroadcastRequest, ResendEmailBroadcastRequest, EmailAttachment } from '../types/emailBroadcast';

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

class EmailBroadcastService {
  async getAllBroadcasts(): Promise<EmailBroadcast[]> {
    try {
      const response = await api.get('/email-broadcasts', {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getBroadcastById(id: number): Promise<EmailBroadcast> {
    try {
      const response = await api.get(`/email-broadcasts/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async createBroadcast(broadcastData: CreateEmailBroadcastRequest): Promise<EmailBroadcast> {
    try {
      const response = await api.post('/email-broadcasts', broadcastData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async uploadAttachment(file: File): Promise<EmailAttachment> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/email-broadcasts/upload-attachment', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async resendBroadcast(id: number, resendData?: ResendEmailBroadcastRequest): Promise<void> {
    try {
      await api.post(`/email-broadcasts/${id}/resend`, resendData || {}, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      return handleError(error);
    }
  }

  async createBroadcastWithAttachments(
    broadcastData: Omit<CreateEmailBroadcastRequest, 'attachments'>,
    files: File[]
  ): Promise<EmailBroadcast> {
    try {
      // Upload attachments first
      const attachmentKeys: string[] = [];
      
      for (const file of files) {
        const { key } = await this.uploadAttachment(file);
        attachmentKeys.push(key);
      }

      // Create broadcast with attachment keys
      return await this.createBroadcast({
        ...broadcastData,
        attachments: attachmentKeys,
      });
    } catch (error) {
      return handleError(error);
    }
  }
}

export const emailBroadcastService = new EmailBroadcastService();