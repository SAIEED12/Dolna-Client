"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCartButton({
  productId,
  name = "",
  price = 0,
  image = "",
  stock = 1,
}) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inStock = Number(stock) > 0;

  const handleClick = () => {
    if (!inStock) return;
    addItem({
      productId,
      name,
      price: Number(price),
      image,
      qty: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!inStock}
      aria-live="polite"
      className="block w-full cursor-pointer rounded-full border bg-ink  px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-ink/80 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink sm:py-2"
    >
      {!inStock ? "Out of Stock" : justAdded ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
