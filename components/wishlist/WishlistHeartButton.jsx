"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "./WishlistProvider";

export function WishlistHeartButton({ productId, name = "item" }) {
  const { has, toggle, togglingId } = useWishlist();
  const saved = has(productId);
  const busy = togglingId === String(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      title={saved ? "Saved to wishlist" : "Save to wishlist"}
      className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-smoke transition-colors outline-none hover:bg-brand-soft hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-wait disabled:opacity-60"
    >
      <Heart
        size={18}
        strokeWidth={1.75}
        className={saved ? "fill-brand text-brand" : ""}
      />
    </button>
  );
}
