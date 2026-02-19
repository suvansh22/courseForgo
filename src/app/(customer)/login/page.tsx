"use client";

import LoginPage from "@/components/pages/auth/login";

const CustomerLoginPage = () => (
  <LoginPage
    title="Welcome back to The Serene Sedator"
    subtitle="Sign in to access your courses, saved cart, and updates."
    callbackUrl="/"
    audienceLabel="Customer Login"
  />
);

export default CustomerLoginPage;
