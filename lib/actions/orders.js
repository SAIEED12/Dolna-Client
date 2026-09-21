"use server";

const SERVER_URL = process.env.SERVER_URL;

export const createOrder = async ({ customer, items, deliveryCharge = 60, note = "" }) => {
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

  const response = await fetch(`${SERVER_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
