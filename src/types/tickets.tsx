export interface Seat {
  id: number;
  uuid: string;
  type: Locality;
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
  type: Locality;
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
  [Locality.DIAMOND]: '#0000FF', // Azul fuerte para Diamante
  [Locality.GOLD]: '#FFD700', // Dorado (mantenido)
  [Locality.VIP]: '#FF1493', // Rosa fuerte para VIP
  [Locality.GENERAL]: '#FF4500', // Naranja-rojo para General
  [Locality.LEFT_STALL]: '#00FF00', // Verde brillante para Platea Izquierda
  [Locality.RIGHT_STALL]: '#00FF00', // Verde brillante para Platea Derecha
};

export interface Ticket {
  name?: string;
  lastname?: string;
  email?: string;
  document?: string;
  role?: string;
  type: Locality;
  seatNumber: number;
  seatRow: string;
  amount: number;
  reference: string;
}

export interface SeatUsed {
  type: Locality;
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
  type: Locality;
  seatNumber: number;
  seatRow: string;
  reference: string;
}

export const localities = {
  [Locality.DIAMOND]: {
    name: 'Diamante',
    amount: 500000,
    start: 101,
    interval: 1,
    spacing: 1,
    size: 3,
    inverse: true,
    seats: [
      { letter: 'A', quantity: 140 },
      { letter: 'B', quantity: 138 },
      { letter: 'C', quantity: 134 },
    ],
  },
  [Locality.GOLD]: {
    name: 'Oro',
    amount: 380000,
    start: 101,
    interval: 1,
    spacing: 1,
    size: 3,
    inverse: true,
    seats: [
      { letter: 'D', quantity: 134 },
      { letter: 'E', quantity: 132 },
    ],
  },
  [Locality.VIP]: {
    name: 'VIP',
    amount: 300000,
    start: 101,
    interval: 1,
    spacing: 1,
    size: 3,
    inverse: true,
    seats: [
      { letter: 'F', quantity: 134 },
      { letter: 'G', quantity: 132 },
      { letter: 'H', quantity: 134 },
      { letter: 'K', quantity: 137 },
      { letter: 'J', quantity: 138 },
    ],
  },
  [Locality.LEFT_STALL]: {
    name: 'Platea Izquierda',
    amount: 250000,
    start: 1,
    interval: 2,
    style: 'rotate-45',
    inverse: true,
    spacing: 2,
    size: 4,
    seats: [
      { letter: 'A', quantity: 17 },
      { letter: 'B', quantity: 25 },
      { letter: 'C', quantity: 27 },
      { letter: 'D', quantity: 35 },
      { letter: 'E', quantity: 27 },
      { letter: 'F', quantity: 17 },
      { letter: 'G', quantity: 11 },
      { letter: 'H', quantity: 11 },
      { letter: 'J', quantity: 5 },
    ],
  },
  [Locality.RIGHT_STALL]: {
    name: 'Platea Derecha',
    amount: 250000,
    start: 2,
    interval: 2,
    style: '-rotate-45',
    spacing: 2,
    size: 4,
    seats: [
      { letter: 'A', quantity: 20 },
      { letter: 'B', quantity: 28 },
      { letter: 'C', quantity: 34 },
      { letter: 'D', quantity: 40 },
      { letter: 'E', quantity: 44 },
      { letter: 'F', quantity: 46 },
      { letter: 'G', quantity: 26 },
      { letter: 'H', quantity: 20 },
      { letter: 'J', quantity: 14 },
      { letter: 'K', quantity: 6 },
    ],
  },
  [Locality.GENERAL]: {
    name: 'General',
    amount: 200000,
    start: 101,
    interval: 1,
    spacing: 2,
    size: 3,
    inverse: true,
    seats: [
      { letter: 'L', quantity: 132 },
      { letter: 'M', quantity: 126 },
      { letter: 'N', quantity: 126 },
      { letter: 'P', quantity: 126 },
      { letter: 'Q', quantity: 126 },
      { letter: 'R', quantity: 124 },
      { letter: 'S', quantity: 124 },
      { letter: 'T', quantity: 124 },
    ],
  },
};

export const traductions = {
  [Locality.DIAMOND] : 'DIAMANTE',
  [Locality.GOLD] : 'ORO',
  [Locality.VIP] : 'VIP',
  [Locality.GENERAL] : 'GENERAL',
  [Locality.RIGHT_STALL] : 'PLATEA DERECHA',
  [Locality.LEFT_STALL] : 'PLATEA IZQUIERDA', 
}
