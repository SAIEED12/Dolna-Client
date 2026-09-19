import { AddProductModal } from "@/components/dashboard/AddProductModal";
import { ProductTable } from "@/components/dashboard/ProductTable";
const SERVER_URL = process.env.SERVER_URL;

const AdminProductsPage = async () => {
  const res = await fetch(`${process.env.SERVER_URL}/products`);
  const products = await res.json();
  return (
    <div>
      <div className="flex justify-between items-center my-5">
        <h1 className="truncate font-serif text-xl text-[#1A1A1A] md:text-3xl">Products</h1>
        <AddProductModal />
      </div>
      <ProductTable products={products} />
    </div>
  );
};

export default AdminProductsPage;
