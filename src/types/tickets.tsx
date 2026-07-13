// @/types/tickets.ts

import { SelectedAddOn } from '@/types/addOn';

export enum TicketType {
  DIAMOND = 'diamond',
  GOLD = 'gold',
  SILVER = 'silver',
  // Slugs legados (ediciones antiguas); se conservan por compatibilidad
  VIP = 'vip',
  GENERAL = 'general',
  STREAMING = 'streaming',
  ALLIED = 'allied',
  JOURNALIST = 'journalist',
  STAFF = 'staff',
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
  [TicketType.GOLD]: '#E0A526', // Dorado para Oro
  [TicketType.SILVER]: '#9CA3AF', // Plateado para Plata
  [TicketType.VIP]: '#FF1493', // Rosa fuerte para VIP (legado)
  [TicketType.GENERAL]: '#FFA500', // Naranja para General (legado)
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
  edition?: number;
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
  [TicketType.GOLD]: 'ORO',
  [TicketType.SILVER]: 'PLATA',
  [TicketType.VIP]: 'VIP',
  [TicketType.GENERAL]: 'GENERAL',
  [TicketType.STREAMING]: 'STREAMING',
  [TicketType.ALLIED]: 'ALIADO',
  [TicketType.JOURNALIST]: 'PRENSA',
  [TicketType.STAFF]: 'STAFF',
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
  price: number; // precio de la localidad
  addOns: SelectedAddOn[]; // complementos seleccionados para este ticket
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
  certificateUrl?: string; // URL del certificado (solo si está habilitado)
}

export interface LocalidadAddOnOption {
  id: number;
  slug: string;
  name: string;
  price: number;
  icon?: string;
  description?: string | null;
  included: boolean;
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
  addOns?: LocalidadAddOnOption[];
}

export interface CartItem {
  localidad: TicketType;
  tickets: CartTicket[]; // Lista de tickets individuales
}

export interface CartState {
  items: CartItem[];
  total: number;
  appliedDiscount?: { code: string; percentage: number } | null;
  // Edición a la que pertenece el carrito (no se mezclan localidades de ediciones distintas)
  editionId?: number | null;
  editionSlug?: string | null;
  // Código de asociado (referral) vigente: atribuye la compra y puede traer
  // descuento propio. Un discount code manual tiene prioridad en el precio.
  referral?: import('@/types/asociado').ReferralInfo | null;
}
