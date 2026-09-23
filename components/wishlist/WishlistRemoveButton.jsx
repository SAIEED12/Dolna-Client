"use client";

import { useRouter } from "next/navigation";
import { useWishlist } from "./WishlistProvider";

export function WishlistRemoveButton({ productId }) {
  const router = useRouter();
  const { removeItem, togglingId } = useWishlist();
  const busy = togglingId === String(productId);

  const handleClick = async () => {
    await removeItem(productId);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="block w-full cursor-pointer rounded-full border border-red-200 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-red-700 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
    >
      {busy ? "Removing…" : "Remove"}
    </button>
  );
}
