import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold text-[#1A1A1A]">Checkout</h1>
      <p className="text-sm text-[#525252]">
        Checkout is coming soon. Your cart is saved — continue browsing or
        review your cart.
      </p>
      <div className="mt-2 flex gap-2">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white no-underline transition-colors hover:bg-brand-dark"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
