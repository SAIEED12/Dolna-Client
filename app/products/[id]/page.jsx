import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const SERVER_URL = process.env.SERVER_URL;

const ProductsDetailsPage = async ({ params }) => {
  const { id } = await params;
  const res = await fetch(`${SERVER_URL}/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();

  const product = await res.json();
  const inStock = product.stock > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-6 inline-block text-sm text-[#6B5A4E] transition-colors hover:text-[#C1633C]"
      >
        ← Back to all products
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#D8CBB4] bg-[#EDE4D3]">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {product.category && (
            <span className="w-fit rounded-full bg-[#1A1A1A] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F5F1E8]">
              {product.category.replace("-", " ")}
            </span>
          )}

          <h1 className="font-serif text-3xl text-[#2B1C14] sm:text-4xl">
            {product.name}
          </h1>

          <p className="text-2xl font-semibold text-[#C1633C]">
            ৳{Number(product.price).toLocaleString()}
          </p>

          <p
            className={`text-sm font-medium ${
              inStock ? "text-green-700" : "text-red-600"
            }`}
          >
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <p className="leading-relaxed text-[#6B5A4E]">
            {product.description}
          </p>

          <button
            type="button"
            disabled={!inStock}
            className="mt-4 block w-full rounded-full bg-[#1A1A1A] px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.08em] text-[#F5F1E8] transition-colors hover:bg-[#C1633C] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#1A1A1A] sm:w-auto"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductsDetailsPage;
