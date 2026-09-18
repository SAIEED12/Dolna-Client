import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDashboardPathByRole } from "@/lib/dashboard-nav";

export default async function DashboardRedirect() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  redirect(getDashboardPathByRole(session.user.role));
}
