import * as React from "react";
import Link from "next/link";

// Components
import ProductsFeatured from "@/app/(pages)/(home)/(HomeS3)/products-featured";
import ProductCardSkeleton from "@/app/components/skeleton/ProductCardSkeleton";

// services
import { homeService } from "@/app/services/homeService";
import { ProductItem } from "@/app/interfaces/products.interfaces";

async function FeaturedList() {
  let products: ProductItem[] = [];
  try {
    const data = await homeService.getProductsFeatured();
    if (Array.isArray(data)) products = data;
  } catch (error) {
    console.error("Home Product Featured - Lỗi fetch API:", error);
  }

  return <ProductsFeatured products={products} />;
}

export default function HomeS3() {
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

      <React.Suspense
        fallback={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            <ProductCardSkeleton count={6} />
          </div>
        }
      >
        <FeaturedList />
      </React.Suspense>
    </section>
  );
}
