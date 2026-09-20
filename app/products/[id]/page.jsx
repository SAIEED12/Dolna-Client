import Link from "next/link";
import { notFound } from "next/navigation";
import { RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";

import ProductGallery from "@/components/ProductGallery";
import PurchasePanel from "@/components/PurchasePanel";
import RelatedProducts from "@/components/RelatedProducts";
import ProductTabs from "@/components/ProductTabs";
const SERVER_URL = process.env.SERVER_URL;

const TRUST_ITEMS = [
  { icon: Truck, title: "Cash on delivery", note: "Pay when it arrives" },
  { icon: ShieldCheck, title: "Warranty", note: "Covered against defects" },
  { icon: RotateCcw, title: "Easy returns", note: "Simple exchange" },
];

const ProductsDetailsPage = async ({ params }) => {
  const { id } = await params;

  const [productRes, listRes] = await Promise.all([
    fetch(`${SERVER_URL}/products/${id}`, { cache: "no-store" }),
    fetch(`${SERVER_URL}/products`, { cache: "no-store" }).catch(() => null),
  ]);

  if (!productRes.ok) notFound();

  const product = await productRes.json();
  const allProducts = listRes?.ok ? await listRes.json() : [];

  // Related: same category, excluding this product, max 4
  const related = allProducts
    .filter(
      (p) =>
        product.category &&
        p.category === product.category &&
        String(p._id) !== String(product._id),
    )
    .slice(0, 4);

  // Gallery: use product.images if you have it, otherwise the single image
  const images = (
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image]
  ).filter(Boolean);

  const price = Number(product.price);
  //   const compareAt = Number(product.compareAtPrice);
  //   const onSale = compareAt > price;
  //   const discount = onSale ? Math.round((1 - price / compareAt) * 100) : 0;

  const stock = Number(product.stock) || 0;
  const stockBadge =
    stock === 0
      ? { label: "Out of stock", className: "bg-red-100 text-red-700" }
      : stock <= 5
        ? {
            label: `Only ${stock} left`,
            className: "bg-amber-100 text-amber-800",
          }
        : { label: "In stock", className: "bg-green-100 text-green-800" };

  // Static placeholders until you store real ratings
  const rating = Number(product.rating) || 4.8;
  const reviewCount = Number(product.reviewCount) || 24;

  const categoryLabel = product.category
    ? product.category.replace("-", " ")
    : null;

  const tabs = [
    { title: "Description", content: product.description }].filter((tab) => tab.content,
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-6 inline-block text-sm text-[#6B5A4E] transition-colors hover:text-[#C1633C]"
      >
        ← Back to all products
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-14">
        {/*  Gallery (left, sticky)  */}
        <div className="lg:sticky lg:top-24">
          <ProductGallery
            images={images}
            name={product.name}
          />
        </div>

        {/*  Info (right, sticky)  */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-2">
            {categoryLabel && (
              <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F5F1E8]">
                {categoryLabel}
              </span>
            )}
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${stockBadge.className}`}
            >
              {stockBadge.label}
            </span>
          </div>

          <h1 className="font-serif text-4xl leading-tight text-[#2B1C14] sm:text-5xl">
            {product.name}
          </h1>

          <h1 className="font-serif leading-tight text-[#6B5A4E] sm:text-sm">
            CATEGORY: {product.category && (
              <span className=" font-semibold uppercase text-[#6B5A4E]">
                {product.category.replace("-", " ")}
              </span>
            )}
          </h1>

          <h1 className="text-4xl font-semibold text-[#C1633C]">
            ৳{price.toLocaleString()}
          </h1>

          {/* <div className="flex items-center gap-2">
            <div
              className="flex text-[#C1633C]"
              role="img"
              aria-label={`Rated ${rating.toFixed(1)} out of 5`}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className="h-4 w-4"
                  fill={n <= Math.round(rating) ? "currentColor" : "none"}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-[#2B1C14]">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-[#6B5A4E]">
              ({reviewCount} reviews)
            </span>
          </div> */}

          {/* <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-semibold text-[#C1633C]">
              ৳{price.toLocaleString()}
            </span>
            {onSale && (
              <>
                <span className="text-lg text-[#6B5A4E] line-through">
                  ৳{compareAt.toLocaleString()}
                </span>
                <span className="rounded-full bg-[#C1633C]/10 px-2.5 py-0.5 text-xs font-semibold text-[#C1633C]">
                  {discount}% off
                </span>
              </>
            )}
          </div> */}

          {/* <p className="leading-relaxed text-[#6B5A4E]">{product.description}</p> */}

          <PurchasePanel
            productId={String(product._id)}
            name={product.name}
            price={price}
            stock={stock}
          />

          {/* Trust row */}
          <ul className="grid grid-cols-3 gap-3 border-t border-[#D8CBB4] pt-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, note }) => (
              <li
                key={title}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE4D3] text-[#2B1C14]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-[#2B1C14]">
                  {title}
                </span>
                <span className="text-xs text-[#6B5A4E]">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- Details / Shipping / Care tabs (full width) ---------- */}
      <ProductTabs tabs={tabs} />

      {/* ---------- Related products (full width) ---------- */}
      <RelatedProducts products={related} />
    </main>
  );
};

export default ProductsDetailsPage;
