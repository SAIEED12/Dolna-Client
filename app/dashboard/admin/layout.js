import DashboardShell from "@/components/dashboard/DashboardShell";
import { adminBasePath } from "@/lib/dashboard-nav";

export const metadata = {
  title: "Admin Dashboard | dolna",
  description: "Manage orders, products, and customers for dolna.",
};

export default async function AdminDashboardLayout({ children }) {
  return (
    <DashboardShell
      variant="admin"
      badge="ADMIN"
      basePath={adminBasePath}
    >
      {children}
    </DashboardShell>
  );
}
