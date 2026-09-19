"use server"
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

  return result;
};