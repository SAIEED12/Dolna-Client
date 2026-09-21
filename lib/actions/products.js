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