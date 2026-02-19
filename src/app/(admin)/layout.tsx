"use client";

import AdminAppProvider from "@/components/providers/AdminAppProvider";
import Header from "@/components/UI/header";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminAppProvider>
      <Header isAdminApp />
      <main className="flex-1">{children}</main>
    </AdminAppProvider>
  );
};

export default AdminLayout;
