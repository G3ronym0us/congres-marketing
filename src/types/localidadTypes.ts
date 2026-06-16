export interface LocalidadType {
  id: number;
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
}

export type UpdateLocalidadTypeInput = Partial<CreateLocalidadTypeInput>;
