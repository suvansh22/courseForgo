"use client";

import AuthProvider from "@/components/providers/authProvider";

const CommonProviders = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default CommonProviders;
