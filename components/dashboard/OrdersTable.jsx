"use client";

import { useMemo, useState } from "react";
import { Table } from "@heroui/react";
import { Ban, Eye } from "lucide-react";
import { ORDER_STATUSES } from "@/lib/order-statuses";
import { OrderCancelModal } from "./OrderCancelModal";
import { OrderDetailsModal } from "./OrderDetailsModal";

const iconButtonClassName =
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-smoke transition-colors outline-none hover:bg-brand-soft hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#525252]";

const statusStyles = {
  pending: "bg-stone-200 text-stone-700",
  confirmed: "bg-amber-100 text-amber-800",
  shipped: "bg-sky-100 text-sky-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const matchesQuery = (order, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystacks = [
    String(order._id ?? ""),
    order.customer?.name ?? "",
    order.customer?.phone ?? "",
    order.customer?.address ?? "",
  ].map((v) => v.toLowerCase());
  return haystacks.some((h) => h.includes(q));
};

export function OrdersTable({ orders }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingOrder, setViewingOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const rows = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    return list.filter((order) => {
      const statusOk =
        statusFilter === "all" || order.orderStatus === statusFilter;
      return statusOk && matchesQuery(order, query);
    });
  }, [orders, query, statusFilter]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="orders-search" className="sr-only">
          Search orders
        </label>
        <input
          id="orders-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order ID, name, or phone…"
          className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-fog outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 sm:max-w-sm"
        />
        <label htmlFor="orders-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="orders-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 sm:w-48"
        >
          <option value="all">
            All ({Array.isArray(orders) ? orders.length : 0})
          </option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {query.trim() || statusFilter !== "all" ? (
          <p className="text-sm text-smoke sm:ml-auto">
            {rows.length} of {Array.isArray(orders) ? orders.length : 0} orders
          </p>
        ) : null}
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Orders" className="min-w-190">
            <Table.Header>
              <Table.Column isRowHeader>Order</Table.Column>
              <Table.Column>Customer</Table.Column>
              <Table.Column>Items</Table.Column>
              <Table.Column>Total</Table.Column>
              <Table.Column>Date</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {rows.map((order) => {
                const id = String(order._id);
                const cancellable =
                  order.orderStatus !== "delivered" &&
                  order.orderStatus !== "cancelled";
                return (
                  <Table.Row key={id}>
                    <Table.Cell className="font-bold">
                      #{id.slice(-6).toUpperCase()}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="block font-semibold text-ink">
                        {order.customer?.name ?? "—"}
                      </span>
                      <span className="block text-xs text-smoke">
                        {order.customer?.phone ?? ""}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="font-semibold">
                      {order.itemCount ?? order.items?.length ?? 0}
                    </Table.Cell>
                    <Table.Cell className="font-semibold">
                      ৳{Number(order.totalAmount ?? 0).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell className="text-smoke">
                      {new Date(order.createdAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {<br></br>}
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.orderStatus] ?? statusStyles.pending}`}
                      >
                        {order.orderStatus}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingOrder(order)}
                          aria-label={`View order ${id}`}
                          title="View details"
                          className={iconButtonClassName}
                        >
                          <Eye size={16} strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancellingOrder(order)}
                          disabled={!cancellable}
                          aria-label={`Cancel order ${id}`}
                          title={
                            cancellable
                              ? "Cancel order"
                              : `Order is ${order.orderStatus}`
                          }
                          className={`${iconButtonClassName} hover:bg-red-50 hover:text-brand`}
                        >
                          <Ban size={16} strokeWidth={1.75} />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center text-sm text-smoke">
          No orders found. Try a different search or status filter.
        </p>
      ) : null}

      <OrderDetailsModal
        key={viewingOrder ? String(viewingOrder._id) : "none"}
        order={viewingOrder}
        isOpen={viewingOrder !== null}
        onOpenChange={(open) => {
          if (!open) setViewingOrder(null);
        }}
      />
      <OrderCancelModal
        order={cancellingOrder}
        isOpen={cancellingOrder !== null}
        onOpenChange={(open) => {
          if (!open) setCancellingOrder(null);
        }}
      />
    </>
  );
}
