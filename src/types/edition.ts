export type EditionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// Datos de presentación de la landing (reemplaza el objeto CITIES hardcodeado).
export interface EditionDisplay {
  id?: string;
  leg?: string;
  flag?: string;
  dateShort?: string;
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
  sortOrder: number;
  display?: EditionDisplay | null;
  discountStages?: DiscountStage[] | null;
  createdAt: string;
  updatedAt: string;
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
  sortOrder?: number;
  display?: EditionDisplay;
  discountStages?: DiscountStage[];
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
}
