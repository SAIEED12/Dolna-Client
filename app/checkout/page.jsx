import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout | BelaView",
  description: "Complete your purchase with cash on delivery.",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 sm:py-16">
          <h1 className="text-2xl font-semibold text-[#1A1A1A] sm:text-3xl">Checkout</h1>
          <p className="text-sm text-[#525252]">Loading checkout…</p>
        </main>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
