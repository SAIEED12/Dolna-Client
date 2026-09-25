"use server";

import { revalidatePath } from "next/cache";
import { ORDER_STATUSES } from "@/lib/order-statuses";
import { authFetch } from "@/lib/auth-fetch";
import { getTokenServer } from "@/lib/getTokenServer";

const SERVER_URL = process.env.SERVER_URL;

const getOptionalAuthHeaders = async () => {
  try {
    const token = await getTokenServer();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
};

const normalizeOrder = (order) => {
  if (!order || typeof order !== "object") return order;
  const normalized = { ...order, _id: String(order._id ?? order.id ?? "") };
  if (Array.isArray(normalized.items)) {
    normalized.items = normalized.items.map((item) => ({
      ...item,
      productId: String(item.productId ?? ""),
    }));
  }
  return normalized;
};

export const createOrder = async ({ customer, items, deliveryCharge = 60, note = "", userId = null }) => {
  const payload = {
    customer: {
      name: customer.name?.trim(),
      phone: customer.phone?.trim(),
      address: customer.address?.trim(),
    },
    items: items.map((item) => ({
      productId: String(item.productId),
      quantity: Number(item.quantity),
    })),
    paymentMethod: "cod",
    deliveryCharge: Number(deliveryCharge),
    note: typeof note === "string" ? note.trim() : "",
  };

  const cleanUserId = typeof userId === "string" ? userId.trim() : "";
  if (cleanUserId) {
    payload.userId = cleanUserId;
  }

  const response = await fetch(`${SERVER_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getOptionalAuthHeaders()),
    },
    body: JSON.stringify(payload),
  });

  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.error || "Failed to place order");
  }

  return result;
};

export const getCheckoutProduct = async (id) => {
  const response = await fetch(`${SERVER_URL}/products/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const getOrders = async (phoneOrOptions) => {
  // Back-compat: getOrders("01...") still filters by phone (admin usage).
  // Pass { userId } to scope to an account, or { userId, phone } for both.
  let userId = "";
  let phone = "";
  if (typeof phoneOrOptions === "string") {
    phone = phoneOrOptions;
  } else if (phoneOrOptions && typeof phoneOrOptions === "object") {
    userId = phoneOrOptions.userId ?? "";
    phone = phoneOrOptions.phone ?? "";
  }
  const params = new URLSearchParams();
  if (userId && String(userId).trim()) {
    params.set("userId", String(userId).trim());
  }
  if (phone && String(phone).trim()) {
    params.set("phone", String(phone).trim());
  }
  const query = params.size > 0 ? `?${params.toString()}` : "";
  const response = await authFetch(`${SERVER_URL}/orders${query}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    let message = "Failed to fetch orders";
    try {
      const errBody = await response.json();
      message = errBody?.error || errBody?.msg || message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  try {
    const data = await response.json();
    return Array.isArray(data) ? data.map(normalizeOrder) : [];
  } catch {
    return [];
  }
};

export const getOrder = async (id) => {
  const response = await authFetch(`${SERVER_URL}/orders/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  try {
    return normalizeOrder(await response.json());
  } catch {
    return null;
  }
};

export const updateOrderStatus = async (id, orderStatus) => {
  const status = String(orderStatus || "").trim().toLowerCase();
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error(`orderStatus must be one of: ${ORDER_STATUSES.join(", ")}`);
  }
  const response = await authFetch(`${SERVER_URL}/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ orderStatus: status }),
  });

  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.error || "Failed to update order status");
  }

  revalidatePath("/dashboard/admin/orders");
  revalidatePath("/dashboard/customer/orders");
  revalidatePath("/dashboard/customer");

  return normalizeOrder(result);
};

export const cancelOrder = async (id) => {
  return updateOrderStatus(id, "cancelled");
};
