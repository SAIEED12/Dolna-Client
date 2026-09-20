"use client";

import { useState } from "react";
import { Heart, Minus, Plus, Share2 } from "lucide-react";

const PurchasePanel = ({ productId, name, price, stock }) => {
  const inStock = stock > 0;
  const maxQty = Math.max(stock, 1);

  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [copied, setCopied] = useState(false);

  const decrease = () => setQty((q) => Math.max(1, q - 1));
  const increase = () => setQty((q) => Math.min(maxQty, q + 1));

  const handleAddToCart = () => {
    // TODO: connect to your cart state/context, e.g. addToCart({ productId, quantity: qty })
  };

  const handleBuyNow = () => {
    // TODO: add to cart, then navigate to checkout, e.g. router.push("/checkout")
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      
    }
  };

  const iconButton =
    "inline-flex h-10 w-10 items-center justify-center text-[#2B1C14] transition-colors hover:text-[#C1633C] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-[#2B1C14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1633C]";

  return (
    <div className="flex flex-col gap-5">
      {/* Quantity + live subtotal */}
      <div className="flex items-center justify-between gap-4">
        <div
          className="inline-flex items-center rounded-full border border-[#D8CBB4] bg-white/60"
          role="group"
          aria-label="Quantity"
        >
          <button
            type="button"
            onClick={decrease}
            disabled={!inStock || qty <= 1}
            aria-label="Decrease quantity"
            className={`${iconButton} rounded-l-full`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            className="w-10 text-center text-sm font-semibold tabular-nums text-[#2B1C14]"
            aria-live="polite"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={increase}
            disabled={!inStock || qty >= maxQty}
            aria-label="Increase quantity"
            className={`${iconButton} rounded-r-full`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-[#6B5A4E]">
          Subtotal{" "}
          <span className="text-lg font-semibold tabular-nums text-[#2B1C14]">
            ৳{(Number(price) * qty).toLocaleString()}
          </span>
        </p>
      </div>

      {/* Primary actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="block w-full cursor-pointer flex-1 rounded-full border border-[#1A1A1A] px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-[#F5F1E8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#1A1A1A]"
        >
          Add to Cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!inStock}
          className="block w-full flex-1 cursor-pointer rounded-full bg-[#1A1A1A] px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.08em] text-[#F5F1E8] transition-colors hover:bg-[#C1633C] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#1A1A1A]"
        >
          Buy Now
        </button>
      </div>

      {/* Secondary actions */}
      <div className="flex items-center gap-5 text-sm text-[#6B5A4E]">
        <button
          type="button"
          onClick={() => setWished((w) => !w)}
          aria-pressed={wished}
          className="inline-flex cursor-pointer items-center gap-2 transition-colors hover:text-[#C1633C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1633C]"
        >
          <Heart
            className={`h-5 w-5${
              wished ? "fill-[#C1633C] text-[#C1633C]" : ""
            }`}
          />
          {wished ? "Saved to wishlist" : "Save to wishlist"}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center cursor-pointer gap-2 transition-colors hover:text-[#C1633C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1633C]"
        >
          <Share2 className="h-5 w-5" />
          Share
        </button>

        <span className="text-xs text-green-700" aria-live="polite">
          {copied ? "Link copied" : ""}
        </span>
      </div>
    </div>
  );
};

export default PurchasePanel;