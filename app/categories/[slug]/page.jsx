import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findCategoryBySlug } from "@/lib/categories";

const SERVER_URL = process.env.SERVER_URL;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${slug} | BelaView`,
    description: `Browse products in ${slug}.`,
  };
}

const CategoryDetailPage = async ({ params }) => {
  const { slug } = await params;
  const res = await fetch(`${SERVER_URL}/products`, { cache: "no-store" });
  const products = res.ok ? await res.json() : [];
  const found = findCategoryBySlug(products, slug);

  if (!found) {
    notFound();
  }

  const { group, items } = found;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/categories"
        className="text-xs font-semibold tracking-[0.12em] text-brand no-underline hover:underline"
      >
        ← ALL CATEGORIES
      </Link>
      <h1 className="mt-2 mb-2 font-serif text-3xl text-[#1A1A1A]">
        {group.name}
      </h1>
      <p className="mb-8 text-sm text-[#525252] font-semibold">
        {items.length} {items.length === 1 ? "product" : "products"}
      </p>

      {items.length === 0 ? (
        <p className="text-[#525252]">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <article
              key={String(product._id)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5]">
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
                <h2 className="text-lg font-semibold text-[#1A1A1A]">
                  {product.name}
                </h2>

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
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default CategoryDetailPage;
