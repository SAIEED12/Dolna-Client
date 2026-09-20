import Image from "next/image";
import Link from "next/link";

const RelatedProducts = ({ products = [] }) => {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#D8CBB4] pt-10">
      <h2 className="mb-8 font-serif text-2xl text-[#2B1C14] sm:text-3xl">
        You may also like
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={String(product._id)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#D8CBB4] bg-white/60 transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-[#EDE4D3]">
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

            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="text-lg font-semibold text-[#2B1C14]">
                {product.name}
              </h3>
              <p className="line-clamp-2 text-xs font-semibold text-[#6B5A4E]">
                CATEGORY:{" "}
                {product.category && (
                  <span className="mr-1.5 text-xs font-semibold uppercase ">
                    {product.category.replace("-", " ")}
                  </span>
                )}
              </p>
                <p className="text-xs font-semibold text-[#6B5A4E]">
                  STOCK: {Number(product.stock).toLocaleString()}
                </p>

              <div className="mt-auto flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-base font-semibold text-[#C1633C]">
                  ৳{Number(product.price).toLocaleString()}
                </span>
              </div>
                <Link
                  href={`/products/${product._id}`}
                  className="block w-full rounded-full bg-[#1A1A1A] px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#F5F1E8] transition-colors hover:bg-[#C1633C] sm:w-auto sm:py-2"
                >
                  View Details
                </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;