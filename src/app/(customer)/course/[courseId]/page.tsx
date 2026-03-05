"use client";

import { courseCardsMock } from "@/components/mockData";
import CoursePage from "@/components/pages/coursePage";
import { Course } from "@/types/course";
import { use } from "react";

export default function CourseByIdPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const course = courseCardsMock.find((item) => item.id === courseId) as Course;
  return <CoursePage course={course} />;
}
