// @/data/ticketsData.ts
import { LocalidadDetalle, TicketType } from '@/types/tickets';

export const localidadesData: Record<string, LocalidadDetalle> = {
  [TicketType.DIAMOND]: {
    name: 'Localidad Diamante',
    price: 700000,
    color: 'bg-gradient-to-br from-[#1C2C67]/70 to-[#4B0012]/70',
    border: 'border-blue-300',
    icon: '💎',
    features: [
      'Ingreso a todas las conferencias del evento en localidad Diamante',
      'Derecho a 4 coffee break en el evento',
      'Ingreso al cóctel oficial del evento',
      'Acceso a las memorias del evento',
      'Certificación de participación digital'
    ],
    withMemories: true
  },
  [TicketType.VIP]: {
    name: 'Localidad V.I.P.',
    price: 600000,
    color: 'bg-gradient-to-br from-[#1C2C67]/50 to-[#4B0012]/50',
    border: 'border-purple-500',
    icon: '🟣',
    features: [
      'Ingreso a todas las conferencias del evento en localidad V.I.P.',
      'Derecho a 4 coffee break en el evento',
      'Ingreso al cóctel oficial del evento',
      'Certificación de participación digital'
    ],
    withMemories: false
  },
  [TicketType.GENERAL]: {
    name: 'Localidad General',
    price: 400000,
    color: 'bg-white/10',
    border: 'border-white/20',
    icon: '🔵',
    features: [
      'Ingreso a todas las conferencias del evento en localidad General',
      'Derecho a 4 coffee break en el evento',
      'Certificación de participación digital'
    ],
    withMemories: false
  },
  [TicketType.STREAMING]: {
    name: 'Streaming del Evento',
    price: 300000,
    color: 'bg-white/10',
    border: 'border-white/20',
    icon: '🌐',
    features: [
      'Ingreso virtual a todas las jornadas del CNMP 2024',
      'Acceso por grupo cerrado de Facebook',
      'Certificación de participación digital'
    ],
    withMemories: false,
    noPermiteMemorias: true
  },
  // Añadimos opción solo memorias (no usamos el enum porque no es un tipo de ticket estándar)
  'memorias': {
    name: 'Memorias del Evento',
    price: 250000,
    color: 'bg-gradient-to-br from-[#0f4c81]/50 to-[#81640f]/50',
    border: 'border-yellow-300',
    icon: '📀',
    features: [
      'Grabación completa de todas las conferencias del evento',
      'Acceso a las presentaciones de los conferencistas',
      'Material adicional exclusivo',
      'Acceso digital permanente'
    ],
    withMemories: true
  }
};

export const PRECIO_MEMORIAS = 250000;

export const formatoPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(precio);
};