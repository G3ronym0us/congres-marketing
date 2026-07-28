export type EditionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// Datos de presentación de la landing (reemplaza el objeto CITIES hardcodeado).
export interface EditionDisplay {
  id?: string;
  leg?: string;
  flag?: string;
  /** @deprecated Legacy: texto congelado en la BD. Usa formatEditionDateShort(). */
  dateShort?: string;
  /** @deprecated Legacy: texto congelado en la BD. Usa formatEditionDateLong(). */
  dateLong?: string;
  iso?: string;
  status?: string;
  statusType?: string;
  stat?: { a: string; b: string; c: string; d: string };
  speakers?: { confirmed: boolean; role: string }[];
  days?: {
    label: string;
    rows: { t: string; title: string; d: string; tag: string }[];
  }[];
}

export interface DiscountStage {
  startDate: string;
  endDate: string;
  percentage: number;
  label: string;
}

export interface Edition {
  id: number;
  uuid: string;
  slug: string;
  name: string;
  year: number;
  country: string;
  city?: string | null;
  venue?: string | null;
  eventStartDate?: string | null;
  eventEndDate?: string | null;
  status: EditionStatus;
  salesOpen: boolean;
  visible: boolean;
  /** Libera los certificados antes de que termine la edición. Si ya terminó, se habilitan solos. */
  certificatesEnabled: boolean;
  sortOrder: number;
  display?: EditionDisplay | null;
  discountStages?: DiscountStage[] | null;
  purchaseEmailMessage?: PurchaseEmailMessage | null;
  hotelBrochureKey?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Mensaje editable del correo de compra, por idioma.
export interface PurchaseEmailMessage {
  es?: string;
  en?: string;
}

export interface CreateEditionInput {
  slug: string;
  name: string;
  year: number;
  country: string;
  city?: string;
  venue?: string;
  eventStartDate?: string;
  eventEndDate?: string | null;
  status?: EditionStatus;
  salesOpen?: boolean;
  visible?: boolean;
  certificatesEnabled?: boolean;
  sortOrder?: number;
  display?: EditionDisplay;
  discountStages?: DiscountStage[];
  purchaseEmailMessage?: PurchaseEmailMessage;
}

export type UpdateEditionInput = Partial<CreateEditionInput>;

export interface CloneEditionInput extends CreateEditionInput {
  sourceEditionId: number;
  cloneLocalidades?: boolean;
  cloneLecturers?: boolean;
  cloneDiscountCodes?: boolean;
}

export interface SetEditionFlagsInput {
  salesOpen?: boolean;
  visible?: boolean;
  certificatesEnabled?: boolean;
}
