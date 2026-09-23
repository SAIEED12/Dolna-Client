"use server"
import { revalidatePath } from "next/cache";
const SERVER_URL = process.env.SERVER_URL;

export const addProduct = async (data) => {
  const response = await fetch(`${SERVER_URL}/add-products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error("Failed to add product");
  }

  revalidatePath("/dashboard/admin/products");

  return result;
};

export const updateProduct = async (id, data) => {
  const response = await fetch(`${SERVER_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error("Failed to update product");
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

export const deleteProduct = async (id) => {
  const response = await fetch(`${SERVER_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
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