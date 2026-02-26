export type Course = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  fileId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCourseInput = Omit<Course, "createdAt" | "updatedAt">;

export type UpdateCourseInput = Partial<
  Omit<Course, "id" | "createdAt" | "updatedAt">
> & { id?: string };

export type CoursesResponse = {
  courses: Course[];
};

export type CourseResponse = {
  course: Course;
};
