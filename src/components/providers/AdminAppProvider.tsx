"use client";

import CommonProviders from "./CommonProvider";
import { AdminCoursesProvider } from "./adminCoursesProvider";

const AdminAppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CommonProviders>
      <AdminCoursesProvider>{children}</AdminCoursesProvider>
    </CommonProviders>
  );
};

export default AdminAppProvider;
