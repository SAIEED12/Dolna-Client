"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { getWishlist, removeWishlistItem, toggleWishlist } from "@/lib/actions/wishlist";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id ? String(session.user.id) : null;

  const [ids, setIds] = useState([]);
  const [loadedFor, setLoadedFor] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Load server wishlist on login; clear on logout (client-only sync)
  useEffect(() => {
    if (isPending) return;
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIds([]);
      setLoadedFor(null);
      return;
    }
    if (loadedFor === userId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const list = await getWishlist();
        if (!cancelled) {
          setIds(list);
          setLoadedFor(userId);
        }
      } catch {
        if (!cancelled) setLoadedFor(userId);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isPending, userId, loadedFor]);

  const has = useCallback(
    (productId) => ids.includes(String(productId ?? "")),
    [ids]
  );

  const toggle = useCallback(
    async (productId) => {
      const id = String(productId ?? "").trim();
      if (!id || togglingId) return;
      if (!userId) {
        const redirect = pathname && pathname !== "/login" ? pathname : "/products";
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        return;
      }
      const wasIn = ids.includes(id);
      setTogglingId(id);
      // Optimistic update with rollback on failure
      setIds((prev) =>
        wasIn ? prev.filter((x) => x !== id) : [...prev, id]
      );
      try {
        const result = await toggleWishlist(id);
        setIds(result.productIds);
        if (!wasIn) {
          toast.success("Added to wishlist!", { duration: 5000 });
        }
      } catch {
        setIds((prev) =>
          wasIn ? [...prev, id] : prev.filter((x) => x !== id)
        );
      } finally {
        setTogglingId(null);
      }
    },
    [ids, togglingId, userId, pathname, router]
  );

  const removeItem = useCallback(
    async (productId) => {
      const id = String(productId ?? "").trim();
      if (!id || togglingId || !ids.includes(id)) return;
      setTogglingId(id);
      // Optimistic definitive removal (no toggle race on double-click)
      setIds((prev) => prev.filter((x) => x !== id));
      try {
        const list = await removeWishlistItem(id);
        setIds(list);
      } catch {
        setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      } finally {
        setTogglingId(null);
      }
    },
    [ids, togglingId]
  );

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      has,
      toggle,
      removeItem,
      togglingId,
      isGuest: !userId,
    }),
    [ids, has, toggle, removeItem, togglingId, userId]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
