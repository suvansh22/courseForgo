"use client";

import AdminCourseList from "@/components/UI/adminCourseList/adminCourseList";
import { useAdminCourses } from "@/components/providers/adminCoursesProvider";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

const AdminCoursesPageComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected");
  const { courses, deleteCourse } = useAdminCourses();

  const handleEdit = (courseId: string) => {
    router.push(`/admin/create?courseId=${courseId}`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Admin</p>
          <h1 className={styles.title}>Courses</h1>
        </div>
        <p className={styles.subtitle}>
          Manage your catalog and open any course to edit.
        </p>
      </header>

      <AdminCourseList
        courses={courses}
        selectedId={selectedId}
        onSelect={handleEdit}
        onEdit={handleEdit}
        onDelete={deleteCourse}
      />
    </div>
  );
};

export default AdminCoursesPageComponent;
