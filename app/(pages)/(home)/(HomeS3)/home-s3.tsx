import Link from "next/link";
import ProductsFeatured from "@/app/(pages)/(home)/(HomeS3)/products-featured";

// interface
import { ProductItem } from "@/app/interfaces/products.interfaces";
import { homeService } from "@/app/services/homeService";

export default async function HomeS3() {
  let products: ProductItem[] = [];

  try {
    const data = await homeService.getProductsFeatured();
    console.log(data);
    if (Array.isArray(data) && data.length > 0) products = data;
  } catch (error) {
    console.error("Home Product Featured-Lỗi fetch Api: ", error);
  }

  return (
    <section className="w-full py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
          Sản phẩm mới nhất
        </h2>
        <Link
          href="/products"
          className="text-sm font-medium text-(--primaryCus) transition-colors hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      <ProductsFeatured products={products} />
    </section>
  );
}
