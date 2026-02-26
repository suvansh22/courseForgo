"use client";

import { courseCardsMock } from "@/components/mockData";
import CourseCard from "@/components/UI/courseCard";
import { getCourses } from "@/lib/api/courses";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import styles from "./index.module.css";

const HomePage: FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  if (isLoading) {
    return <div className={styles.mainContainer}>Loading courses...</div>;
  }

  if (isError) {
    return (
      <div className={styles.mainContainer}>
        Failed to load courses. Please try again.
      </div>
    );
  }

  // const courses = data?.courses ?? [];
  const courses = courseCardsMock;

  return (
    <div className={styles.mainContainer}>
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
};
export default HomePage;
