import * as React from "react";
import Link from "next/link";

// Components
import ProductCardSkeleton from "@/app/components/skeleton/ProductCardSkeleton";
import ProductSection from "@/app/(main)/(pages)/(home)/product-section";

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
        <ProductSection
          type="featured"
          emptyMessage="Chưa có sản phẩm nổi bật nào."
        />
      </React.Suspense>
    </section>
  );
}
