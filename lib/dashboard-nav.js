import {
  LayoutDashboard,
  LifeBuoy,
  Package,
  Settings,
  ShoppingBag,
  Tags,
  User,
  Users,
} from "lucide-react";

export const adminBasePath = "/dashboard/admin";
export const customerBasePath = "/dashboard/customer";

export function getDashboardPathByRole(role) {
  return role === "admin" ? adminBasePath : customerBasePath;
}

export const adminNavSections = [
  {
    title: "Main",
    items: [
      { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
      { label: "Orders", href: "/dashboard/admin/orders", icon: ShoppingBag },
      { label: "Products", href: "/dashboard/admin/products", icon: Package },
      { label: "Customers", href: "/dashboard/admin/customers", icon: Users },
      { label: "Categories", href: "/dashboard/admin/categories", icon: Tags },
    ],
  },
  {
    title: "General",
    items: [
      { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
      { label: "Help", href: "/dashboard/admin/help", icon: LifeBuoy },
    ],
  },
];

export const customerNavSections = [
  {
    title: "Main",
    items: [
      { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard, exact: true },
      { label: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
    ],
  },
  {
    title: "General",
    items: [
      { label: "Profile", href: "/dashboard/customer/profile", icon: User },
      { label: "Settings", href: "/dashboard/customer/settings", icon: Settings },
    ],
  },
];

export function getPageTitle(pathname) {
  const allItems = [...adminNavSections, ...customerNavSections].flatMap(
    (section) => section.items
  );
  // Longest-prefix match so nested paths resolve correctly
  const match = allItems
    .filter((item) =>
      item.exact ? pathname === item.href : pathname?.startsWith(item.href)
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "Overview";
}
