const BUY_NOW_KEY = "belaview:buy-now";

export function saveBuyNow(item) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      BUY_NOW_KEY,
      JSON.stringify({ ...item, ts: Date.now() })
    );
  } catch {
    // storage unavailable (private mode etc.) — query params remain source of truth
  }
}

export function readBuyNow() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(BUY_NOW_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearBuyNow() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(BUY_NOW_KEY);
  } catch {
    // ignore
  }
}

export { BUY_NOW_KEY };
