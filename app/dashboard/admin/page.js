import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";

const stats = [
  {
    label: "Total revenue",
    value: "৳ 4,82,500",
    delta: "+12.4%",
    up: true,
    icon: Wallet,
    note: "vs last month",
  },
  {
    label: "Orders",
    value: "1,284",
    delta: "+8.1%",
    up: true,
    icon: ShoppingBag,
    note: "vs last month",
  },
  {
    label: "Products",
    value: "86",
    delta: "-2",
    up: false,
    icon: Package,
    note: "low stock alerts",
  },
  {
    label: "Customers",
    value: "932",
    delta: "+4.6%",
    up: true,
    icon: Users,
    note: "vs last month",
  },
];

const recentOrders = [
  { id: "#DN-2041", customer: "Ayesha Rahman", total: "৳ 12,500", status: "Delivered", date: "Sep 16" },
  { id: "#DN-2040", customer: "Tanvir Hasan", total: "৳ 8,900", date: "Sep 16", status: "Processing" },
  { id: "#DN-2039", customer: "Nusrat Jahan", total: "৳ 15,200", date: "Sep 15", status: "Shipped" },
  { id: "#DN-2038", customer: "Arif Chowdhury", total: "৳ 6,400", date: "Sep 15", status: "Pending" },
  { id: "#DN-2037", customer: "Mim Akter", total: "৳ 21,000", date: "Sep 14", status: "Delivered" },
];

const statusStyles = {
  Delivered: "bg-emerald-100 text-emerald-800",
  Shipped: "bg-sky-100 text-sky-800",
  Processing: "bg-amber-100 text-amber-800",
  Pending: "bg-stone-200 text-stone-700",
};

export default function AdminDashboardHome() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-brand uppercase">
            Welcome back
          </p>
          <h2 className="mt-1 font-serif text-2xl text-[#1A1A1A] md:text-3xl">
            Here&apos;s what&apos;s happening today.
          </h2>
        </div>
        <div className="flex gap-2 md:hidden">
          <Link
            href="/dashboard/admin/products"
            className="rounded-full border border-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-[0.12em] text-[#1A1A1A] no-underline transition-colors hover:bg-[#1A1A1A] hover:text-white"
          >
            ADD PRODUCT
          </Link>
          <Link
            href="/dashboard/admin/orders"
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white no-underline transition-colors hover:bg-brand-dark"
          >
            VIEW ORDERS
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <section
        aria-label="Store statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm shadow-black/5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    stat.up
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-[#F5F5F5] text-[#8A8A8A]"
                  }`}
                >
                  {stat.up ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}
                  {stat.delta}
                </span>
              </div>
              <p className="mt-4 font-serif text-3xl text-[#1A1A1A]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[#525252]">
                {stat.label} · {stat.note}
              </p>
            </div>
          );
        })}
      </section>

      {/* Recent orders — full width */}
      <section
        aria-label="Recent orders"
        className="w-full overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm shadow-black/5"
      >
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-4">
            <h3 className="font-serif text-lg text-[#1A1A1A]">Recent orders</h3>
            <Link
              href="/dashboard/admin/orders"
              className="text-xs font-semibold tracking-[0.12em] text-brand no-underline hover:underline"
            >
              VIEW ALL
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-xs tracking-[0.1em] text-[#8A8A8A] uppercase">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#E5E5E5] transition-colors hover:bg-[#FAFAFA]"
                  >
                    <td className="px-5 py-3 font-semibold text-[#1A1A1A]">
                      {order.id}
                    </td>
                    <td className="px-5 py-3 text-[#1A1A1A]">
                      {order.customer}
                    </td>
                    <td className="px-5 py-3 text-[#525252]">{order.date}</td>
                    <td className="px-5 py-3 font-medium text-[#1A1A1A]">
                      {order.total}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </section>
    </div>
  );
}
