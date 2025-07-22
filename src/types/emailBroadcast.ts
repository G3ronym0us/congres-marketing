export interface EmailBroadcast {
  id: number;
  title: string;
  sender_name: string;
  content: string;
  type: 'ALL_USERS' | 'SPECIFIC_EMAIL';
  specific_email?: string;
  attachments: string[];
  status: 'PENDING' | 'SENDING' | 'COMPLETED' | 'FAILED';
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  error_message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailBroadcastRequest {
  title: string;
  sender_name: string;
  content: string;
  type: 'ALL_USERS' | 'SPECIFIC_EMAIL';
  specific_email?: string;
  attachments?: string[];
}

export interface EmailAttachment {
  key: string;
  url: string;
}

export type EmailBroadcastStatus = 'PENDING' | 'SENDING' | 'COMPLETED' | 'FAILED';
export type EmailBroadcastType = 'ALL_USERS' | 'SPECIFIC_EMAIL';