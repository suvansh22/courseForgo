"use client";

import { courseCardsMock } from "@/components/mockData";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminCourse = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  pdfName?: string;
};

type AdminCoursesContextValue = {
  courses: AdminCourse[];
  getCourseById: (id: string) => AdminCourse | undefined;
  addCourse: (course: AdminCourse) => void;
  updateCourse: (id: string, course: AdminCourse) => void;
  deleteCourse: (id: string) => void;
};

const AdminCoursesContext = createContext<AdminCoursesContextValue | null>(null);

const toAdminCourses = (): AdminCourse[] =>
  courseCardsMock.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    originalPrice: course.originalPrice,
    discountedPrice: course.discountedPrice,
    thumbnailUrl: course.thumbnailUrl,
  }));

export const AdminCoursesProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<AdminCourse[]>(() => toAdminCourses());

  const getCourseById = useCallback(
    (id: string) => courses.find((course) => course.id === id),
    [courses],
  );

  const addCourse = useCallback((course: AdminCourse) => {
    setCourses((prev) => [course, ...prev]);
  }, []);

  const updateCourse = useCallback((id: string, course: AdminCourse) => {
    setCourses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...course, id } : item)),
    );
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      courses,
      getCourseById,
      addCourse,
      updateCourse,
      deleteCourse,
    }),
    [courses, getCourseById, addCourse, updateCourse, deleteCourse],
  );

  return (
    <AdminCoursesContext.Provider value={value}>
      {children}
    </AdminCoursesContext.Provider>
  );
};

export const useAdminCourses = () => {
  const context = useContext(AdminCoursesContext);
  if (!context) {
    throw new Error("useAdminCourses must be used within AdminCoursesProvider.");
  }
  return context;
};
