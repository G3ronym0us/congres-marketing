import apiClient, { handleError } from '../utils/apiClient';
import { EmailBroadcast, CreateEmailBroadcastRequest, ResendEmailBroadcastRequest, EmailAttachment } from '../types/emailBroadcast';

class EmailBroadcastService {
  async getAllBroadcasts(): Promise<EmailBroadcast[]> {
    try {
      const response = await apiClient.get('/email-broadcasts');
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async getBroadcastByUuid(uuid: string): Promise<EmailBroadcast> {
    try {
      const response = await apiClient.get(`/email-broadcasts/${uuid}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async createBroadcast(broadcastData: CreateEmailBroadcastRequest): Promise<EmailBroadcast> {
    try {
      const response = await apiClient.post('/email-broadcasts', broadcastData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async uploadAttachment(file: File): Promise<EmailAttachment> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/email-broadcasts/upload-attachment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  async resendBroadcast(uuid: string, resendData?: ResendEmailBroadcastRequest): Promise<void> {
    try {
      await apiClient.post(`/email-broadcasts/${uuid}/resend`, resendData || {});
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
