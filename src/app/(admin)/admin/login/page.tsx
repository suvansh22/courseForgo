"use client";

import LoginPage from "@/components/pages/auth/login";

const AdminLoginPage = () => (
  <LoginPage
    title="Admin access for CourseForgo"
    subtitle="Sign in to manage courses, pricing, and student experience."
    callbackUrl="/admin"
    audienceLabel="Admin Portal"
  />
);

export default AdminLoginPage;
