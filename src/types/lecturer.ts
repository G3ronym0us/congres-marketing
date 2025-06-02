// Tipos para los datos del backend
export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  x?: string;
  youtube?: string;
}

export interface Publication {
  id: number;
  title: string;
  editorial?: string;
  year?: number;
  role?: string;
  description?: string;
}

export interface AcademicFormation {
  id: number;
  title: string;
  institution?: string;
  year?: number;
  place?: string;
}

export interface Lecturer {
  id: number;
  firstName: string;
  lastName?: string;
  alt: string;
  title?: string;
  country: string;
  type: 'INTERNATIONAL' | 'NATIONAL';
  position?: string;
  nickname?: string;
  biography?: string;
  image: string;
  socialMedia?: SocialMedia;
  experienceAreas?: string[];
  awards?: string[];
  academicFormations?: AcademicFormation[];
  publications?: Publication[];
  createdMethodologies?: string[];
  show: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLecturerData {
  firstName: string;
  lastName?: string;
  alt: string;
  title?: string;
  country: string;
  type: 'INTERNATIONAL' | 'NATIONAL';
  position?: string;
  nickname?: string;
  biography?: string;
  image: string;
  socialMedia?: CreateSocialMedia;
  experienceAreas?: string[];
  awards?: string[];
  academicFormations?: CreateAcademicFormation[];
  publications?: CreatePublication[];
  createdMethodologies?: string[];
  show: boolean;
}

export interface CreateSocialMedia {
  instagram?: string;
  facebook?: string;
  x?: string;
  youtube?: string;
}

export interface CreatePublication {
  title: string;
  editorial?: string;
  year?: number;
  role?: string;
  description?: string;
}

export interface CreateAcademicFormation {
  title: string;
  institution?: string;
  year?: number;
  place?: string;
}

export interface UpdateLecturerData {
  firstName: string;
  lastName?: string;
  alt: string;
  title?: string;
  country: string;
  type: 'INTERNATIONAL' | 'NATIONAL';
  position?: string;
  nickname?: string;
  biography?: string;
  image: string;
  socialMedia?: CreateSocialMedia;
  experienceAreas?: string[];
  awards?: string[];
  academicFormations?: CreateAcademicFormation[];
  publications?: CreatePublication[];
  createdMethodologies?: string[];
  show: boolean;
}