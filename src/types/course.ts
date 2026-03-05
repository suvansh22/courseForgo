import type { ACCESS_TYPE } from "@/types/purchase";

export type Course = {
  id: string;
  title: string;
  description: string;
  readPrice: number;
  readDiscountedPrice?: number;
  downloadPrice: number;
  downloadDiscountedPrice?: number;
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

export type CoursePurchaseInfo = {
  hasPurchased: boolean;
  accessType?: ACCESS_TYPE;
  purchasedAt?: string;
};

export type CourseWithPurchaseInfo = Course & {
  purchaseInfo: CoursePurchaseInfo;
};

export type CoursesWithPurchaseInfoResponse = {
  courses: CourseWithPurchaseInfo[];
};

export type CourseWithPurchaseInfoResponse = {
  course: CourseWithPurchaseInfo;
};
