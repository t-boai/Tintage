"use client";

import { ProductItem } from "@/app/interfaces/products.interfaces";
import ProductCard from "@/app/components/productCard/productCard";

interface ProductsFeaturedProps {
  products: ProductItem[];
}

export default function ProductsFeatured({ products }: ProductsFeaturedProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50">
        <p className="text-sm text-neutral-400">
          Chưa có sản phẩm nổi bật nào.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
