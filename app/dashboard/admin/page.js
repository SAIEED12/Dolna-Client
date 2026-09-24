import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Package, ShoppingBag, Users, Wallet } from "lucide-react";
import { auth } from "@/lib/auth";
import { getOrders } from "@/lib/actions/orders";
import { getProducts } from "@/lib/actions/products";
import { getCustomers } from "@/lib/actions/users";
import { ORDER_STATUSES } from "@/lib/order-statuses";
import { OrdersStatusChart } from "@/components/dashboard/OrdersStatusChart";

export const metadata = {
  title: "Overview | Admin Dashboard",
  description: "Live store statistics and recent orders.",
};

const statusStyles = {
  pending: "bg-stone-200 text-stone-700",
  confirmed: "bg-amber-100 text-amber-800",
  shipped: "bg-sky-100 text-sky-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

export default async function AdminDashboardHome() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard/customer");
  }

  const [ordersResult, productsResult, customersResult] =
    await Promise.allSettled([getOrders(), getProducts(), getCustomers()]);

  const orders =
    ordersResult.status === "fulfilled" && Array.isArray(ordersResult.value)
      ? ordersResult.value
      : [];
  const products =
    productsResult.status === "fulfilled" && Array.isArray(productsResult.value)
      ? productsResult.value
      : [];
  const customers =
    customersResult.status === "fulfilled" &&
    Array.isArray(customersResult.value)
      ? customersResult.value
      : [];

  const loadErrors = [
    ordersResult.status === "rejected" ? "orders" : null,
    productsResult.status === "rejected" ? "products" : null,
    customersResult.status === "rejected" ? "customers" : null,
  ].filter(Boolean);

  const revenue = orders
    .filter((order) => order.orderStatus === "delivered")
    .reduce((sum, order) => sum + Number(order.totalAmount ?? 0), 0);
  const pendingCount = orders.filter(
    (order) => order.orderStatus === "pending"
  ).length;

  const stats = [
    {
      label: "Total revenue",
      value: `৳${revenue.toLocaleString()}`,
      icon: Wallet,
      note: "delivered orders",
    },
    {
      label: "Orders",
      value: String(orders.length),
      icon: ShoppingBag,
      note: `${pendingCount} pending`,
    },
    {
      label: "Products",
      value: String(products.length),
      icon: Package,
      note: "in catalog",
    },
    {
      label: "Customers",
      value: String(customers.length),
      icon: Users,
      note: "registered",
    },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const ordersByStatus = ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((order) => order.orderStatus === status).length,
  }));

  const LOW_STOCK = 3;

  // Top products by revenue across non-cancelled orders
  const productById = new Map(
    products.map((p) => [String(p._id), p])
  );
  const salesByProduct = new Map();
  for (const order of orders) {
    if (order.orderStatus !== "delivered") continue;
    for (const item of order.items ?? []) {
      const pid = String(item.productId ?? "");
      if (!pid) continue;
      const entry = salesByProduct.get(pid) ?? {
        productId: pid,
        title: item.title || "",
        image: item.image || "",
        units: 0,
        revenue: 0,
      };
      entry.units += Number(item.quantity) || 0;
      entry.revenue += Number(item.subtotal) || 0;
      if (!entry.title) entry.title = item.title || "";
      if (!entry.image) entry.image = item.image || "";
      salesByProduct.set(pid, entry);
    }
  }
  const topProducts = [...salesByProduct.values()]
    .map((entry) => {
      const catalog = productById.get(entry.productId);
      return {
        ...entry,
        title: entry.title || catalog?.name || "Unknown product",
        image: entry.image || catalog?.image || "",
        stock: catalog ? Number(catalog.stock) : null,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const lowStockProducts = [...products]
    .filter((p) => Number(p.stock) <= LOW_STOCK)
    .sort((a, b) => Number(a.stock) - Number(b.stock))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-brand uppercase">
            Welcome back — {session.user.name}
          </p>
          <h2 className="mt-1 font-serif text-2xl text-ink md:text-3xl">
            Here&apos;s what&apos;s happening today.
          </h2>
        </div>
        <div className="flex gap-2 md:hidden">
          <Link
            href="/dashboard/admin/products"
            className="rounded-full border border-ink px-4 py-2 text-xs font-semibold tracking-[0.12em] text-ink no-underline transition-colors hover:bg-ink hover:text-white"
          >
            VIEW PRODUCTS
          </Link>
          <Link
            href="/dashboard/admin/orders"
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white no-underline transition-colors hover:bg-brand-dark"
          >
            VIEW ORDERS
          </Link>
        </div>
      </div>

      {loadErrors.length > 0 ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Couldn&apos;t load {loadErrors.join(", ")}. Showing available data —
          please refresh to try again.
        </p>
      ) : null}

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
              className="rounded-2xl border border-line bg-white p-5 shadow-sm shadow-black/5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
              </div>
              <p className="mt-4 font-serif text-3xl text-ink">{stat.value}</p>
              <p className="mt-1 text-sm text-fog">
                {stat.label}
              </p>
            </div>
          );
        })}
      </section>

      {/* Orders by status chart */}
      <OrdersStatusChart data={ordersByStatus} />

      {/* Top products + low stock */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section
          aria-label="Top products"
          className="w-full overflow-hidden rounded-2xl border border-line bg-white shadow-sm shadow-black/5"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="font-serif text-lg text-ink">Top products</h3>
            <Link
              href="/dashboard/admin/products"
              className="text-xs font-semibold tracking-[0.12em] text-brand no-underline hover:underline"
            >
              VIEW ALL
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-smoke">
              No sales yet.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {topProducts.map((item, index) => (
                <li
                  key={item.productId}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-mist"
                >
                  <span className="w-5 shrink-0 font-serif text-lg text-fog">
                    {index + 1}
                  </span>
                  {item.image ? (
                    <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-mist">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {item.title}
                    </span>
                    <span className="block text-xs text-fog">
                      {item.units} sold
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                    ৳{Number(item.revenue).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-label="Low stock alerts"
          className="w-full overflow-hidden rounded-2xl border border-line bg-white shadow-sm shadow-black/5"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="font-serif text-lg text-ink">Low stock</h3>
            <Link
              href="/dashboard/admin/products"
              className="text-xs font-semibold tracking-[0.12em] text-brand no-underline hover:underline"
            >
              MANAGE
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-smoke">
              All products sufficiently stocked.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {lowStockProducts.map((product) => {
                const stock = Number(product.stock);
                const id = String(product._id);
                return (
                  <li
                    key={id}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-mist"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                      {product.name}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        stock <= 0
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {stock <= 0 ? "Out of stock" : `Only ${stock} left`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Recent orders */}
      <section
        aria-label="Recent orders"
        className="w-full overflow-hidden rounded-2xl border border-line bg-white shadow-sm shadow-black/5"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="font-serif text-lg text-ink">Recent orders</h3>
          <Link
            href="/dashboard/admin/orders"
            className="text-xs font-semibold tracking-[0.12em] text-brand no-underline hover:underline"
          >
            VIEW ALL
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-140 text-left text-sm">
            <thead>
              <tr className="text-xs tracking-widest text-fog uppercase">
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const id = String(order._id);
                return (
                  <tr
                    key={id}
                    className="border-t border-line transition-colors hover:bg-mist"
                  >
                    <td className="px-5 py-3 font-semibold text-ink">
                      #{id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-ink">
                      {order.customer?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-fog">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3 font-medium text-ink">
                      ৳{Number(order.totalAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.orderStatus] ?? statusStyles.pending}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-smoke">
              No orders yet.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
