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

  const categoryLabel = product.category
    ? product.category.replace("-", " ")
    : null;

const materials = Array.isArray(product.materials)
  ? product.materials.filter(Boolean)
  : product.materials;

const tabs = [
  { title: "Description", content: product.description },
  {
    title: "Materials",
    content: Array.isArray(materials)
      ? materials.length > 0 && (
          <ul className="list-disc space-y-1.5 pl-5">
            {materials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )
      : materials,
  },
].filter((tab) => tab.content);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-6 inline-block text-sm text-[#525252] transition-colors hover:text-brand"
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
            {/* {categoryLabel && (
              <span className="rounded-full bg-brand px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                {categoryLabel}
              </span>
            )} */}
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${stockBadge.className}`}
            >
              {stockBadge.label}
            </span>
          </div>

          <h1 className="font-serif text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">
            {product.name}
          </h1>

          <h1 className="font-serif leading-tight text-[#525252] sm:text-sm">
            CATEGORY: {product.category && (
              <span className=" font-semibold uppercase text-[#525252]">
                {product.category.replace("-", " ")}
              </span>
            )}
          </h1>

          <h1 className="text-4xl font-semibold text-brand">
            ৳{price.toLocaleString()}
          </h1>

          {/* <div className="flex items-center gap-2">
            <div
              className="flex text-brand"
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
            <span className="text-sm font-medium text-[#1A1A1A]">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-[#525252]">
              ({reviewCount} reviews)
            </span>
          </div> */}

          {/* <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-semibold text-brand">
              ৳{price.toLocaleString()}
            </span>
            {onSale && (
              <>
                <span className="text-lg text-[#525252] line-through">
                  ৳{compareAt.toLocaleString()}
                </span>
                <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                  {discount}% off
                </span>
              </>
            )}
          </div> */}

          {/* <p className="leading-relaxed text-[#525252]">{product.description}</p> */}

          <PurchasePanel
            productId={String(product._id)}
            name={product.name}
            price={price}
            stock={stock}
          />

          {/* Trust row */}
          <ul className="grid grid-cols-3 gap-3 border-t border-[#E5E5E5] pt-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, note }) => (
              <li
                key={title}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-[#1A1A1A]">
                  {title}
                </span>
                <span className="text-xs text-[#525252]">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Details / Shipping / Care tabs */}
      <ProductTabs tabs={tabs} />

      {/* Related products */}
      <RelatedProducts products={related} />
    </main>
  );
};

export default ProductsDetailsPage;
