export interface LocalidadType {
  id: number;
  slug: string;
  name: string;
  price: number;
  icon: string;
  features: string[];
  withMemories: boolean;
  active: boolean;
  pushable: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocalidadTypeInput {
  slug: string;
  name: string;
  price: number;
  icon?: string;
  features?: string[];
  withMemories?: boolean;
  active?: boolean;
  pushable?: boolean;
  sortOrder?: number;
}

export type UpdateLocalidadTypeInput = Partial<CreateLocalidadTypeInput>;
