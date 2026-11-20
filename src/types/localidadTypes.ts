import { LocalidadAddOn } from '@/types/addOn';

// Plantilla del boleto (fondo + posiciones de QR/nombre/documento).
export interface TicketTemplateImageEl {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface TicketTemplateTextEl {
  x: number;
  y: number;
  size: number;
  // 'center' es heredado (boleto: hoja; certificado: caja si hay ancho máx).
  align: 'left' | 'center' | 'center-box' | 'center-page' | 'right';
  color: number[]; // [r, g, b] en 0..1
  maxWidth?: number;
}
export interface TicketTemplate {
  background: string;
  elements: {
    qrCode: TicketTemplateImageEl;
    name: TicketTemplateTextEl;
    document: TicketTemplateTextEl;
  };
}

export interface LocalidadType {
  id: number;
  uuid: string;
  edition: number;
  slug: string;
  name: string;
  price: number;
  icon: string;
  features: string[];
  withMemories: boolean;
  active: boolean;
  pushable: boolean;
  sortOrder: number;
  ticketTemplate?: TicketTemplate | null;
  addOns?: LocalidadAddOn[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocalidadTypeInput {
  edition: number;
  slug: string;
  name: string;
  price: number;
  icon?: string;
  features?: string[];
  withMemories?: boolean;
  active?: boolean;
  pushable?: boolean;
  sortOrder?: number;
  ticketTemplate?: TicketTemplate | null;
}

export type UpdateLocalidadTypeInput = Partial<CreateLocalidadTypeInput>;
