import Image from "next/image";
import Link from "next/link";
import { groupProductsByCategory } from "@/lib/categories";

const SERVER_URL = process.env.SERVER_URL;

export const metadata = {
  title: "Categories | BelaView",
  description: "Browse products by category.",
};

const AllCategoriesPage = async () => {
  const res = await fetch(`${SERVER_URL}/products`, { cache: "no-store" });
  const products = res.ok ? await res.json() : [];
  const categories = groupProductsByCategory(products);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-serif text-3xl text-ink">Categories</h1>
      <p className="mb-8 text-sm text-smoke font-semibold">
        {categories.length === 0
          ? "No categories yet."
          : `${categories.length} ${categories.length === 1 ? "category" : "categories"}`}
      </p>

      {categories.length === 0 ? (
        <p className="text-smoke">
          No categories found. Add a product with a category to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white no-underline transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-mist">
                {category.coverImage ? (
                  <Image
                    src={category.coverImage}
                    alt={category.name}
                    fill
                    unoptimized
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-6">
                <h2 className="text-lg font-semibold text-ink">
                  {category.name}
                </h2>
                <p className="text-sm text-smoke">
                  {category.count} {category.count === 1 ? "product" : "products"}
                  {category.minPrice !== null
                    ? ` · from ৳${Number(category.minPrice).toLocaleString()}`
                    : ""}
                </p>
                <span className="mt-3 text-xs font-semibold tracking-[0.12em] text-brand">
                  VIEW PRODUCTS →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default AllCategoriesPage;
