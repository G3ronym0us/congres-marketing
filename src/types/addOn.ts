export interface AddOn {
  id: number;
  uuid: string;
  edition: number;
  slug: string;
  name: string;
  description?: string | null;
  price: number;
  icon?: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Asociación de un add-on a una localidad (incluido u opcional)
export interface LocalidadAddOn {
  id: number;
  included: boolean;
  addOn: AddOn;
}

export interface CreateAddOnInput {
  edition: number;
  slug: string;
  name: string;
  description?: string;
  price: number;
  icon?: string;
  active?: boolean;
  sortOrder?: number;
}

export type UpdateAddOnInput = Partial<CreateAddOnInput>;

export interface LocalidadAddOnItem {
  addOnId: number;
  included: boolean;
}

// Add-on seleccionado en un ticket del carrito (snapshot ligero)
export interface SelectedAddOn {
  id: number;
  uuid?: string;
  slug: string;
  name: string;
  price: number;
}
