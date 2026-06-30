// @/types/testimonials.ts

export interface Testimonial {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  position: string;
  content: string;
  image?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialInput {
  firstName: string;
  lastName: string;
  position: string;
  content: string;
  active?: boolean;
}

export interface UpdateTestimonialInput {
  firstName?: string;
  lastName?: string;
  position?: string;
  content?: string;
  active?: boolean;
}

export interface TestimonialFilters {
  active?: boolean;
  search?: string;
}

export interface TestimonialFormData {
  firstName: string;
  lastName: string;
  position: string;
  content: string;
  active: boolean;
}
