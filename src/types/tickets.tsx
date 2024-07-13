interface Seat {
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

interface Locality {
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
  
  interface Ticket {
    name: string;
    lastname: string;
    email: string;
    document: string;
    role: string;
    type: string;
    seatNumber: number;
    seatRow: string;
    amount: number;
    reference?: string;
  }
  
  interface SeatUsed {
    type: string;
    row: string;
    number: number;
  }

  interface BoldIntegrityHashInput {
    reference: string;
    amount: number;
    currency: string;
  }