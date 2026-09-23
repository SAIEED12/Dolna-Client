import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

const SERVER_URL = process.env.SERVER_URL;

const AllProductsPage = async () => {
  const res = await fetch(`${SERVER_URL}/products`, { cache: "no-store" });
  const products = res.ok ? await res.json() : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl text-ink">All Products</h1>

      {products.length === 0 ? (
        <p className="text-smoke">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                )} ,

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

                <div className="mt-auto flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-2xl font-semibold text-brand">
                    ৳{Number(product.price).toLocaleString()}
                  </span>
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
    </main>
  );
};

export default AllProductsPage;
