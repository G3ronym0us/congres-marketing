// @/types/tickets.ts

export enum TicketType {
  DIAMOND = 'diamond',
  VIP = 'vip',
  GENERAL = 'general',
  STREAMING = 'streaming',
}

export enum TicketStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  RESERVED = 'RESERVED',
}

export interface Seat {
  id: number;
  uuid: string;
  type: TicketType;
  reference: string;
  number: number;
  row: string;
  status: string;
  name: string;
  lastname: string;
  email: string;
  document: string;
  role: string;
}

export interface SeatUsed {
  type: TicketType;
  row: string;
  number: number;
}

export interface BoldIntegrityHashInput {
  reference: string;
  amount: number;
  currency: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface SeatRows {
  locality: string;
  row: string;
  startSeat: number;
  endSeat: number;
  cols: React.JSX.Element[];
  y: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  interval?: number;
  offset?: number;
}

export const ticketTypeColors = {
  [TicketType.DIAMOND]: '#0000FF', // Azul fuerte para Diamante
  [TicketType.VIP]: '#FF1493', // Rosa fuerte para VIP
  [TicketType.GENERAL]: '#FFA500', // Naranja-rojo para General
};

export interface SeatUsed {
  type: TicketType;
  row: string;
  number: number;
}

export interface BoldIntegrityHashInput {
  reference: string;
  amount: number;
  currency: string;
}

export interface UpdateTicketInput {
  uuid: string;
  name?: string;
  lastname?: string;
  email?: string;
  document?: string;
  role?: string;
}

export interface FilterGetTicketsInput {
  status?: TicketStatus[];
  type?: TicketType[];
}

export interface AdminCreateTicketInput {
  reference: string;
  type: TicketType;
  name?: string;
  lastname?: string;
  document?: string;
  email?: string;
  phone?: string;
  withMemories: boolean;
}

export interface AdminEditTicketInput {
  uuid: string;
  name?: string;
  lastname?: string;
  document?: string;
  email?: string;
  phone?: string;
  type?: TicketType;
  withMemories?: boolean;
}

export const traductions = {
  [TicketType.DIAMOND]: 'DIAMANTE',
  [TicketType.VIP]: 'VIP',
  [TicketType.GENERAL]: 'GENERAL',
  [TicketType.STREAMING]: 'STREAMING',
};

export interface FormDataType {
  name: string;
  lastname: string;
  document: string;
  email: string;
  phone: string;
  quantity: number;
  withMemories: boolean;
}

export interface AttendeeData {
  name: string;
  lastname: string;
  document: string;
  email: string;
  phone: string;
}

export interface CartTicket {
  id: string; // ID único por ticket
  type: TicketType; // El tipo de localidad
  withMemories: boolean;
  price: number;
  priceMemories: number;
  attendee: AttendeeData; // Cada ticket tiene UN asistente
}
export interface Ticket {
  uuid: string; // ID único por ticket
  reference: string;
  type: TicketType; // El tipo de localidad
  withMemories: boolean;
  name: string;
  lastname: string;
  document: string;
  email: string;
  phone: string;
  qrUrl: string;
}

export interface LocalidadDetalle {
  name: string;
  price: number;
  color: string;
  border: string;
  icon: string;
  features: string[];
  withMemories: boolean;
  pushable: boolean;
  noPermiteMemorias?: boolean;
}

export interface CartItem {
  localidad: TicketType;
  tickets: CartTicket[]; // Lista de tickets individuales
}

export interface CartState {
  items: CartItem[];
  total: number;
}
