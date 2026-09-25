import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { WishlistHeartButton } from "@/components/wishlist/WishlistHeartButton";
import { ProductSearchInput } from "@/components/products/ProductSearchInput";
import { PaginationControls } from "@/components/PaginationControls";

const SERVER_URL = process.env.SERVER_URL;
const PAGE_SIZE = 20;

const AllProductsPage = async ({ searchParams }) => {
  const searchQuery = await searchParams;
  const rawSearch =
    typeof searchQuery?.search === "string"
      ? searchQuery.search
      : Array.isArray(searchQuery?.search)
        ? (searchQuery.search[0] ?? "")
        : "";
  const rawPage = Array.isArray(searchQuery?.page) ? searchQuery.page[0] : searchQuery?.page;
  const parsedPage = Number.parseInt(rawPage, 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const searchText = rawSearch.trim();
  const params = new URLSearchParams();
  if (searchText) params.set("search", searchText);
  params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));
  const res = await fetch(`${SERVER_URL}/products?${params.toString()}`, {
    cache: "no-store",
  });
  let products = [];
  let total = 0;
  let totalPages = 1;
  let currentPage = page;
  if (res.ok) {
    try {
      const data = await res.json();
      if (data && typeof data === "object" && !Array.isArray(data)) {
        products = Array.isArray(data.products) ? data.products : [];
        total = Number(data.total ?? products.length);
        totalPages = Math.max(1, Number(data.totalPages ?? 1));
        currentPage = Number(data.page ?? page);
      } else {
        // Fallback for legacy bare-array responses
        products = Array.isArray(data) ? data : [];
        total = products.length;
      }
    } catch {
      products = [];
    }
  }
  const start = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(total, currentPage * PAGE_SIZE);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl text-ink">All Products</h1>

      <Suspense>
        <ProductSearchInput initialValue={searchText} />
      </Suspense>

      {total > 0 ? (
        <p className="mb-4 text-sm text-smoke">
          Showing {start}–{end} of {total} products
        </p>
      ) : null}

      {products.length === 0 ? (
        <p className="text-smoke">
          {searchText
            ? `No products found for "${searchText}".`
            : "No products found."}{" "}
          {searchText ? (
            <Link href="/products" className="font-semibold text-brand hover:underline">
              Clear search
            </Link>
          ) : null}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((product) => (
            <article
              key={String(product._id)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-mist">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-8">
                <h2 className="text-lg font-semibold text-ink">
                  {product.name}
                </h2>
                <p className="text-sm text-smoke">
                  {product.category && (
                    <span className="mr-1.5 text-xs font-semibold uppercase ">
                      CATEGORY: {product.category.replace("-", " ")}
                    </span>
                  )}
                </p>

                <div className="mt-auto flex flex-row items-center justify-between gap-3 pt-3">
                  <span className="text-2xl font-semibold text-brand">
                    ৳{Number(product.price).toLocaleString()}
                  </span>
                  <WishlistHeartButton
                    productId={String(product._id)}
                    name={product.name}
                  />
                </div>
                <Link
                  href={`/products/${product._id}`}
                  className="block w-full rounded-full bg-brand px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-dark sm:w-auto sm:py-2"
                >
                  View Details
                </Link>
                <AddToCartButton
                  productId={String(product._id)}
                  name={product.name}
                  price={product.price}
                  image={product.image || ""}
                  stock={Number(product.stock ?? 1)}
                />
              </div>
            </article>
          ))}
        </div>
      )}
      <Suspense>
        <PaginationControls page={currentPage} totalPages={totalPages} label="Products pagination" />
      </Suspense>
    </main>
  );
};

export default AllProductsPage;
