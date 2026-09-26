import Link from "next/link";

export const metadata = {
  title: "Page Not Found | BelaView",
  description: "The page you requested could not be found on BelaView.",
};

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
      <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10">
        <p className="text-xs font-semibold tracking-[0.15em] text-brand uppercase">
          404 — Page not found
        </p>
        <h1 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
          This page does not exist.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-smoke">
          The link may be broken or the page was removed from BelaView.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-6 py-2.5 text-xs font-semibold tracking-[0.12em] text-white no-underline transition-colors hover:bg-brand-dark"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink px-6 py-2.5 text-xs font-semibold tracking-[0.12em] text-ink no-underline transition-colors hover:bg-ink hover:text-white"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
