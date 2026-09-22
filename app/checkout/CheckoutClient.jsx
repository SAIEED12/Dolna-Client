"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { readBuyNow, clearBuyNow } from "@/lib/buy-now";
import { createOrder, getCheckoutProduct } from "@/lib/actions/orders";

const DELIVERY_CHARGE = 60;
const BD_PHONE_RE = /^01[3-9]\d{8}$/;

const inputClass =
  "w-full max-w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-base text-[#1A1A1A] placeholder:text-[#8A8A8A] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 sm:text-sm";

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const paramProductId = searchParams.get("productId") || "";
  const paramQty = Number(searchParams.get("qty") || "1");

  const [snapshot] = useState(() => readBuyNow());
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState("");

  const [qty, setQty] = useState(
    Number.isInteger(paramQty) && paramQty > 0 ? paramQty : 1
  );
  const [name, setName] = useState(() => session?.user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [order, setOrder] = useState(null);


  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!paramProductId) {
        setLoadingProduct(false);
        return;
      }
      setLoadingProduct(true);
      setProductError("");
      const live = await getCheckoutProduct(paramProductId);
      if (cancelled) return;
      if (!live) {
        setProduct(null);
        setProductError("Product not found. It may have been removed.");
      } else {
        setProduct(live);
        const stock = Number(live.stock) || 0;
        if (stock <= 0) {
          setProductError("This product is out of stock.");
        } else if (qty > stock) {
          setQty(stock);
        }
      }
      setLoadingProduct(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [paramProductId]);

  const stock = Number(product?.stock) || 0;
  const unitPrice = product ? Number(product.price) : Number(snapshot?.price) || 0;
  const displayName = product?.name || product?.title || snapshot?.name || "";
  const displayImage = product?.image || product?.images?.[0] || "";
  const outOfStock = product ? stock <= 0 : false;
  const clampedQty = stock > 0 ? Math.min(Math.max(1, qty), stock) : qty;

  const subtotal = unitPrice * clampedQty;
  const total = subtotal + DELIVERY_CHARGE;

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    const p = phone.trim();
    if (!p) e.phone = "Phone is required.";
    else if (!BD_PHONE_RE.test(p)) e.phone = "Enter a valid BD mobile (e.g. 01XXXXXXXXX).";
    if (!address.trim()) e.address = "Address is required.";
    if (!city.trim()) e.city = "City / district is required.";
    if (notes.trim().length > 500) e.notes = "Note must be at most 500 characters.";
    return e;
  }, [name, phone, address, city, notes]);

  const isValid =
    Object.keys(errors).length === 0 && !outOfStock && clampedQty > 0 && !loadingProduct;

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setTouched(true);
    setSubmitError("");
    if (!isValid || submitting) return;
    if (!paramProductId) {
      setSubmitError("No product selected for checkout.");
      return;
    }
    setSubmitting(true);
    try {
      const fullAddress = `${address.trim()}, ${city.trim()}`;
      const placed = await createOrder({
        customer: { name: name.trim(), phone: phone.trim(), address: fullAddress },
        items: [{ productId: paramProductId, quantity: clampedQty }],
        deliveryCharge: DELIVERY_CHARGE,
        note: notes,
      });
      clearBuyNow();
      setOrder(placed);
    } catch (err) {
      setSubmitError(err?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (order) {
    const orderId = String(order._id || order.id || "");
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 sm:py-16">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
          ✓
        </span>
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Order placed!</h1>
        <p className="w-full max-w-full font-semibold text-sm break-words text-[#525252]">
          Cash on Delivery · Total ৳{Number(order.totalAmount || total).toLocaleString()}
          {orderId ? <span className="block break-all sm:inline"> · Order ID: {orderId}</span> : ""}
        </p>
        <p className="w-full max-w-full font-semibold text-sm break-words text-[#525252]">
          We will call {order?.customer?.phone || phone.trim()} to confirm delivery.
        </p>
        <div className="mt-2 mb-50 flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <Link
            href="/products"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-white no-underline transition-colors hover:bg-brand-dark sm:w-auto"
          >
            Continue Shopping
          </Link>
          {/* <Link
            href={`/dashboard/customer/orders?phone=${encodeURIComponent(
              order?.customer?.phone || phone.trim()
            )}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#1A1A1A] px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[#1A1A1A] no-underline transition-colors hover:bg-[#1A1A1A] hover:text-white sm:w-auto"
          >
            Track Order
          </Link> */}
        </div>
      </main>
    );
  }

  if (!paramProductId) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 sm:py-16">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Checkout</h1>
        <p className="text-sm text-smoke">
          No product selected. Start with Buy Now from a product page.
        </p>
        <Link
          href="/products"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-white no-underline transition-colors hover:bg-brand-dark sm:w-auto"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl overflow-x-clip px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">Checkout</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 lg:grid-cols-2 lg:gap-8">
        {/* Order summary */}
        <section className="h-fit rounded-2xl border border-line bg-white p-4 self-start sm:p-5 lg:sticky lg:top-24 lg:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink">
            Order summary
          </h2>
          {loadingProduct ? (
            <p className="mt-4 text-sm text-smoke">Loading product…</p>
          ) : productError && !product ? (
            <p className="mt-4 text-sm text-red-700">{productError}</p>
          ) : (
            <div className="mt-4 flex gap-3 sm:gap-4">
              {displayImage ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F5] sm:h-20 sm:w-20">
                  <Image
                    src={displayImage}
                    alt={displayName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold break-words text-[#1A1A1A] sm:text-base">{displayName}</p>
                <p className="mt-1 text-sm font-semibold break-words text-[#525252]">
                  ৳{unitPrice.toLocaleString()}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={clampedQty <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-[#E5E5E5] text-[#1A1A1A] disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">
                    {clampedQty}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQty((q) => (stock > 0 ? Math.min(stock, q + 1) : q + 1))
                    }
                    disabled={stock > 0 && clampedQty >= stock}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-[#E5E5E5] text-[#1A1A1A] disabled:opacity-40"
                  >
                    +
                  </button>
                  {stock > 0 && clampedQty >= stock ? (
                    <span className="w-full text-xs text-amber-700 sm:w-auto">
                      Only {stock} available
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {productError && product ? (
            <p className="mt-3 text-sm text-red-700">{productError}</p>
          ) : null}

          <dl className="mt-5 space-y-2 border-t border-[#E5E5E5] pt-4 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#525252]">Subtotal</dt>
              <dd className="text-right font-semibold break-words tabular-nums">৳{subtotal.toLocaleString()}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#525252]">Delivery</dt>
              <dd className="text-right font-semibold break-words tabular-nums">৳{DELIVERY_CHARGE.toLocaleString()}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-[#E5E5E5] pt-2 text-base sm:text-lg">
              <dt className="font-semibold">Total (COD)</dt>
              <dd className="text-right font-semibold break-words tabular-nums text-brand">
                ৳{total.toLocaleString()}
              </dd>
            </div>
          </dl>
        </section>

        {/* Shipping + payment form */}
        <section className="rounded-2xl border border-[#E5E5E5] bg-white p-4 sm:p-5 lg:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1A1A1A]">
            Delivery details
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="co-name" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
                Full name
              </label>
              <input
                id="co-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                className={inputClass}
              />
              {touched && errors.name ? (
                <p className="mt-1 text-xs text-red-700">{errors.name}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="co-phone" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
                Phone Number (BD)
              </label>
              <input
                id="co-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                inputMode="numeric"
                autoComplete="tel"
                className={inputClass}
              />
              {touched && errors.phone ? (
                <p className="mt-1 text-xs text-red-700">{errors.phone}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="co-address" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
                Address
              </label>
              <textarea
                id="co-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, road, area"
                rows={3}
                autoComplete="street-address"
                className={`${inputClass} resize-y`}
              />
              {touched && errors.address ? (
                <p className="mt-1 text-xs text-red-700">{errors.address}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="co-city" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
                City / district
              </label>
              <input
                id="co-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Dhaka"
                autoComplete="address-level2"
                className={inputClass}
              />
              {touched && errors.city ? (
                <p className="mt-1 text-xs text-red-700">{errors.city}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="co-notes" className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
                Note <span className="font-normal text-[#8A8A8A]">(optional)</span>
              </label>
              <textarea
                id="co-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Delivery instructions"
                rows={2}
                maxLength={500}
                className={`${inputClass} resize-y`}
              />
              {touched && errors.notes ? (
                <p className="mt-1 text-xs text-red-700">{errors.notes}</p>
              ) : null}
            </div>

            <fieldset className="rounded-xl border border-[#E5E5E5] p-4 sm:p-5">
              <legend className="px-1 text-sm font-medium text-[#1A1A1A]">
                Payment method
              </legend>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="radio" checked readOnly className="accent-black" />
                Cash on Delivery
              </label>
            </fieldset>

            {submitError ? (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="block min-h-12 w-full cursor-pointer rounded-full bg-brand px-6 py-3 text-center text-xs font-semibold break-words whitespace-normal uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              {submitting ? "Placing order…" : `Place order · ৳${total.toLocaleString()}`}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
