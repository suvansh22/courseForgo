export type Testimonial = {
  id: string;
  name: string;
  feedback: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateTestimonialInput = {
  name: string;
  feedback: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type UpdateTestimonialInput = Partial<CreateTestimonialInput>;

export type TestimonialUpsertInput = {
  id?: string;
  name: string;
  feedback: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type TestimonialResponse = {
  testimonial: Testimonial;
};

export type TestimonialsResponse = {
  testimonials: Testimonial[];
};

export type OverwriteTestimonialsInput = {
  testimonials: TestimonialUpsertInput[];
};
