import { AddProductModal } from "@/components/dashboard/AddProductModal";
import { ProductTable } from "@/components/dashboard/ProductTable";
import { getAdminProducts } from "@/lib/actions/products";

const AdminProductsPage = async () => {
  let products = [];
  try {
    products = await getAdminProducts();
  } catch {
    products = [];
  }
  return (
    <div>
      <div className="flex justify-between items-center my-5">
        <h1 className="truncate font-serif text-xl text-ink md:text-3xl">Products</h1>
        <AddProductModal />
      </div>
      <ProductTable products={products} />
    </div>
  );
};

export default AdminProductsPage;
