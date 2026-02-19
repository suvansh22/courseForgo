"use client";

import { courseCardsMock } from "@/components/mockData";
import CoursePage from "@/components/pages/coursePage";
import { use } from "react";

export default function CourseByIdPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const courseId = slug;
  const course =
    courseCardsMock.find((item) => item.id === courseId) ?? undefined;

  return <CoursePage course={course} />;
}
