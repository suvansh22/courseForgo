"use client";

import CourseCard from "@/components/UI/courseCard";
import Input from "antd/es/input";
import { useMemo, useState } from "react";
import styles from "./adminCourseList.module.css";

type Course = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  pdfName?: string;
};

type Props = {
  courses: Course[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const AdminCourseList = ({ courses, onEdit, onDelete }: Props) => {
  const [query, setQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return courses;
    }
    return courses.filter((course) =>
      course.title.toLowerCase().includes(trimmed),
    );
  }, [courses, query]);

  return (
    <section className={styles.card}>
      <div className={styles.searchRow}>
        <Input
          placeholder="Search by title"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          allowClear
        />
      </div>
      <div className={styles.list}>
        {filteredCourses.length === 0 ? (
          <div className={styles.empty}>
            {courses.length === 0
              ? "No courses yet."
              : "No courses match your search."}
          </div>
        ) : (
          filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              variant="admin"
              id={course.id}
              title={course.title}
              description={course.description}
              originalPrice={course.originalPrice}
              discountedPrice={course.discountedPrice}
              thumbnailUrl={course.thumbnailUrl}
              onEdit={() => onEdit(course.id)}
              onDelete={() => onDelete(course.id)}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default AdminCourseList;
