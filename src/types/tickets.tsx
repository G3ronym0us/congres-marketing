export interface Seat {
  id: number;
  uuid: string;
  type: string;
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

export interface Locality {
  name: string;
  amount: number;
  start: number;
  interval: number;
  spacing: number;
  size: number;
  inverse?: boolean;
  style?: string;
  seats: { letter: string; quantity: number }[];
}

export interface Ticket {
  name?: string;
  lastname?: string;
  email?: string;
  document?: string;
  role?: string;
  type: string;
  seatNumber: number;
  seatRow: string;
  amount: number;
  reference: string;
}

export interface SeatUsed {
  type: string;
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

export interface AdminCreateTicketInput {
  type: string;
  seatNumber: number;
  seatRow: string;
  reference: string;
}
