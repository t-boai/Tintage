"use client";

import * as React from "react";

// services and interfaces
import { productService } from "@/app/services/productService";
import { ProductItem } from "@/app/interfaces/products.interfaces";

// com
import ProductCard from "@/app/components/productCard/productCard";
import ProductCardSkeleton from "@/app/components/skeleton/ProductCardSkeleton";

export default function HotDealsEmptyState() {
  const [products, setProducts] = React.useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const fetchHotDeals = async () => {
      try {
        const res = await productService.getRecommendations(1, 4, {});

        if (isMounted && res.data) {
          const freshItems = res.data.map((p: ProductItem) => ({
            ...p,
            image: p.image || "/placeholder-image.png",
          }));
          setProducts(freshItems);
        }
      } catch (error) {
        console.error("Lỗi khi lấy hot deals:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHotDeals();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 opacity-50 grayscale transition-all sm:grid-cols-3 xl:grid-cols-4">
        <ProductCardSkeleton count={4} />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={`hot-deal-${product.id}`} product={product} />
      ))}
    </div>
  );
}
