import { Suspense } from "react";
import { AddProductModal } from "@/components/dashboard/AddProductModal";
import { ProductTable } from "@/components/dashboard/ProductTable";
import { ProductSearchInput } from "@/components/products/ProductSearchInput";
import { getAdminProducts } from "@/lib/actions/products";

const AdminProductsPage = async ({ searchParams }) => {
  const query = await searchParams;
  const rawSearch =
    typeof query?.search === "string"
      ? query.search
      : Array.isArray(query?.search)
        ? (query.search[0] ?? "")
        : "";
  const searchText = rawSearch.trim();
  let products = [];
  try {
    products = await getAdminProducts(searchText);
  } catch {
    products = [];
  }
  return (
    <div>
      <div className="flex justify-between items-center my-5">
        <h1 className="truncate font-serif text-xl text-ink md:text-3xl">Products</h1>
        <AddProductModal />
      </div>
      <Suspense>
        <ProductSearchInput
          initialValue={searchText}
          placeholder="Search products by name, category, or price..."
        />
      </Suspense>
      {products.length === 0 && searchText ? (
        <p className="mb-4 text-sm text-smoke">
          No products found for &ldquo;{searchText}&rdquo;.
        </p>
      ) : null}
      <ProductTable products={products} />
    </div>
  );
};

export default AdminProductsPage;
