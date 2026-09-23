"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const SERVER_URL = process.env.SERVER_URL;
const WISHLIST_PATH = "/dashboard/customer/wishlist";

async function requireUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id ? String(session.user.id) : "";
  if (!userId) {
    throw new Error("Please sign in to use your wishlist.");
  }
  return userId;
}

async function optionalUserId() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user?.id ? String(session.user.id) : null;
  } catch {
    return null;
  }
}

const normalizeIds = (value) => {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const clean = [];
  for (const entry of value) {
    const id = String(entry ?? "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    clean.push(id);
  }
  return clean;
};

export const getWishlist = async () => {
  const userId = await optionalUserId();
  if (!userId) return [];
  const response = await fetch(
    `${SERVER_URL}/wishlist/${encodeURIComponent(userId)}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }
  try {
    const data = await response.json();
    return normalizeIds(data?.productIds);
  } catch {
    return [];
  }
};

export const toggleWishlist = async (productId) => {
  const userId = await requireUserId();
  const id = String(productId ?? "").trim();
  if (!id) {
    throw new Error("Invalid product");
  }
  const response = await fetch(
    `${SERVER_URL}/wishlist/${encodeURIComponent(userId)}/toggle`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    }
  );
  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }
  if (!response.ok) {
    throw new Error(result?.error || "Failed to update wishlist");
  }
  revalidatePath(WISHLIST_PATH);
  return {
    wishlisted: Boolean(result?.wishlisted),
    productIds: normalizeIds(result?.productIds),
  };
};

export const removeWishlistItem = async (productId) => {
  const userId = await requireUserId();
  const id = String(productId ?? "").trim();
  if (!id) {
    throw new Error("Invalid product");
  }
  const response = await fetch(
    `${SERVER_URL}/wishlist/${encodeURIComponent(userId)}/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }
  if (!response.ok) {
    throw new Error(result?.error || "Failed to update wishlist");
  }
  revalidatePath(WISHLIST_PATH);
  return normalizeIds(result?.productIds);
};
