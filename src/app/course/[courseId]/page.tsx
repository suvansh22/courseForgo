"use client";

import { useParams } from "next/navigation";
import CoursePage from "@/components/pages/coursePage";
import { courseCardsMock } from "@/components/mockData";

export default function CourseByIdPage() {
  const params = useParams<{ courseId?: string }>();
  const courseId = params?.courseId;
  const course =
    courseCardsMock.find((item) => item.id === courseId) ?? undefined;

  return <CoursePage course={course} />;
}
