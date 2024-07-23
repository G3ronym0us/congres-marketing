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
export interface Ticket {
  name: string;
  lastname: string;
  email: string;
  document: string;
  role: string;
  type: Locality;
  seatNumber: number;
  seatRow: string;
  amount: number;
  reference?: string;
}

export interface SeatUsed {
  type: string;
  row: string;
  number: number;
}

export enum Locality {
  DIAMOND = 'diamond',
  GOLD = 'gold',
  VIP = 'vip',
  GENERAL = 'general',
  RIGHT_STALL = 'right_stall',
  LEFT_STALL = 'left_stall',
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

export const localityColors = {
  [Locality.DIAMOND]: '#150FBF', // Cyan para Diamante
  [Locality.GOLD]: '#FFD700', // Dorado para Oro
  [Locality.VIP]: '#FF69B4', // Rosa para VIP
  [Locality.GENERAL]: '#FFA500', // Naranja para General
  [Locality.LEFT_STALL]: '#32CD32', // Verde lima para Platea Izquierda
  [Locality.RIGHT_STALL]: '#32CD32', // Verde lima para Platea Derecha
};

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

