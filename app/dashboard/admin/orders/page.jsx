import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { getOrders } from "@/lib/actions/orders";

export const metadata = {
  title: "Orders | Admin Dashboard",
  description: "View, filter, and manage customer orders.",
};

const AdminOrdersPage = async () => {
  let orders = [];
  let loadError = "";

  try {
    orders = await getOrders();
  } catch (err) {
    loadError = err?.message || "Failed to fetch orders";
  }

  const list = Array.isArray(orders) ? orders : [];
  const openCount = list.filter((order) =>
    ["pending"].includes(order.orderStatus)
  ).length;
  const revenue = list
    .filter((order) => order.orderStatus === "delivered")
    .reduce((sum, order) => sum + Number(order.totalAmount ?? 0), 0);

  return (
    <div>
      <div className="my-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="truncate font-serif text-xl text-ink md:text-3xl">
          All Orders
        </h1>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full border border-line bg-white px-3 py-1.5 text-smoke">
            {list.length} total
          </span>
          <span className="rounded-full bg-stone-200 px-3 py-1.5 text-stone-700">
            {openCount} needs action
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-800">
            ৳{revenue.toLocaleString()} revenue
          </span>
        </div>
      </div>

      {loadError ? (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}. Please refresh to try again.
        </p>
      ) : null}

      <OrdersTable orders={list} />
    </div>
  );
};

export default AdminOrdersPage;
