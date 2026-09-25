"use server"
import { revalidatePath } from "next/cache";
import { authFetch } from "../auth-fetch";
const SERVER_URL = process.env.SERVER_URL;

export const addProduct = async (data) => {
  const response = await authFetch(`${SERVER_URL}/add-products`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  let result = null;
  const raw = await response.text();
  try {
    result = raw ? JSON.parse(raw) : null;
  } catch {
    throw new Error(
      `Failed to add product: ${response.status} ${response.statusText || "Invalid server response"}`
    );
  }
  if (!response.ok) {
    throw new Error(result?.error || result?.msg || `Failed to add product: ${response.status}`);
  }

  revalidatePath("/dashboard/admin/products");

  return result;
};

export const updateProduct = async (id, data) => {
  const response = await authFetch(`${SERVER_URL}/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }
  if (!response.ok) {
    throw new Error(result?.error || result?.msg || "Failed to update product");
  }

  revalidatePath("/dashboard/admin/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/products");

  return result;
};

const normalizeProduct = (product) => {
  if (!product || typeof product !== "object") return product;
  return { ...product, _id: String(product._id ?? product.id ?? "") };
};

export const getProducts = async () => {
  const response = await fetch(`${SERVER_URL}/products`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  try {
    const data = await response.json();
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch {
    return [];
  }
};

export const getAdminProducts = async () => {
  const response = await authFetch(`${SERVER_URL}/products`, {
    cache: "no-store",
  });
  if (!response.ok) {
    let message = "Failed to fetch products";
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
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch {
    return [];
  }
};

export const deleteProduct = async (id) => {
  const response = await authFetch(`${SERVER_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let message = "Failed to delete product";
    try {
      const errBody = await response.json();
      message = errBody?.error || errBody?.msg || message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  let result = null;
  try {
    result = await response.json();
  } catch {
    result = { ok: true };
  }

  revalidatePath("/dashboard/admin/products");
  revalidatePath("/products");

  return result;
};