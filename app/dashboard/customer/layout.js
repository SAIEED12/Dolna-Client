import DashboardShell from "@/components/dashboard/DashboardShell";
import { customerBasePath } from "@/lib/dashboard-nav";

export const metadata = {
  title: "My Account | dolna",
  description: "Track your orders and manage your dolna account.",
};

export default async function CustomerDashboardLayout({ children }) {
  return (
    <DashboardShell
      variant="customer"
      badge="ACCOUNT"
      basePath={customerBasePath}
    >
      {children}
    </DashboardShell>
  );
}
