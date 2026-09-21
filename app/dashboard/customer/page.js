import Link from "next/link";
import { Heart, Package, ShoppingBag } from "lucide-react";

const stats = [
  {
    label: "My orders",
    value: "12",
    icon: ShoppingBag,
    note: "2 in transit",
  },
  {
    label: "Delivered",
    value: "9",
    icon: Package,
    note: "all time",
  },
  {
    label: "Wishlist",
    value: "5",
    icon: Heart,
    note: "saved items",
  },
];

const myOrders = [
  { id: "#DN-2041", total: "৳ 12,500", status: "Delivered", date: "Sep 16" },
  { id: "#DN-2036", total: "৳ 8,900", date: "Sep 10", status: "Shipped" },
  { id: "#DN-2031", total: "৳ 15,200", date: "Sep 02", status: "Delivered" },
  { id: "#DN-2028", total: "৳ 6,400", date: "Aug 27", status: "Delivered" },
];

const statusStyles = {
  Delivered: "bg-emerald-100 text-emerald-800",
  Shipped: "bg-sky-100 text-sky-800",
  Processing: "bg-amber-100 text-amber-800",
  Pending: "bg-stone-200 text-stone-700",
};

export default function CustomerDashboardHome() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-brand uppercase">
            My account
          </p>
          <h2 className="mt-1 font-serif text-2xl text-[#1A1A1A] md:text-3xl">
            Welcome back to your space.
          </h2>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white no-underline transition-colors hover:bg-brand-dark"
          >
            SHOP NOW
          </Link>
          <Link
            href="/dashboard/customer/orders"
            className="rounded-full border border-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-[0.12em] text-[#1A1A1A] no-underline transition-colors hover:bg-[#1A1A1A] hover:text-white"
          >
            TRACK ORDER
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <section
        aria-label="Account summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm shadow-black/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                <Icon size={18} strokeWidth={1.75} />
              </span>
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

      {/* My recent orders — full width */}
      <section
        aria-label="My recent orders"
        className="w-full overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm shadow-black/5"
      >
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-4">
          <h3 className="font-serif text-lg text-[#1A1A1A]">
            My recent orders
          </h3>
          <Link
            href="/dashboard/customer/orders"
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
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-[#E5E5E5] transition-colors hover:bg-[#FAFAFA]"
                >
                  <td className="px-5 py-3 font-semibold text-[#1A1A1A]">
                    {order.id}
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
