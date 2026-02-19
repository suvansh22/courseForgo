"use client";

import AdminCourseForm, {
  CourseFormValues,
} from "@/components/UI/adminCourseForm/adminCourseForm";
import { useAdminCourses } from "@/components/providers/adminCoursesProvider";
import { useSnackbar } from "@/components/providers/snackbarProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import styles from "./page.module.css";

const AdminCourseCreatePageComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const { courses, getCourseById, addCourse, updateCourse } = useAdminCourses();
  const courseId = searchParams.get("courseId");

  const editingCourse = useMemo(
    () => (courseId ? (getCourseById(courseId) ?? null) : null),
    [courseId, getCourseById, courses],
  );

  const handleSave = (values: CourseFormValues) => {
    if (courseId && editingCourse) {
      updateCourse(courseId, { ...editingCourse, ...values, id: courseId });
      showSnackbar("success", {
        content: "Course updated.",
        key: "course-save",
      });
      router.push(`/admin/courses?selected=${courseId}`);
      return;
    }

    addCourse({
      id: values.id,
      title: values.title,
      description: values.description,
      originalPrice: values.originalPrice,
      discountedPrice: values.discountedPrice,
      thumbnailUrl: values.thumbnailUrl,
      pdfName: values.pdfName,
    });
    showSnackbar("success", {
      content: "Course created.",
      key: "course-save",
    });
    router.push(`/admin/create?selected=${values.id}`);
  };

  const handleCancel = () => {
    router.push("/admin");
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Admin</p>
          <h1 className={styles.title}>
            {editingCourse ? "Edit Course" : "Create Course"}
          </h1>
        </div>
      </header>

      <AdminCourseForm
        key={editingCourse?.id ?? "new-course"}
        editingCourse={editingCourse}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminCourseCreatePageComponent;
