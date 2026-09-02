"use client";

import * as React from "react";

// interfaces
import { ProductItem } from "@/app/interfaces/products.interfaces";

// services
import { productService } from "@/app/services/productService";

// components
import ProductCard from "@/app/components/productCard/productCard";

// virtuoso
import { VirtuosoGrid } from "react-virtuoso";

// skeleton
import ProductCardSkeleton from "@/app/components/skeleton/ProductCardSkeleton";

interface InfiniteMightLikeProps {
  initialProducts: ProductItem[];
  initialFetchMode: "CATEGORY" | "ALL";
  initialNextPage: number;
  initialHasNextPage: boolean;
  categoryId?: string;
  sellerId?: string;
  excludeId?: string;
}

export default function InfiniteMightLike({
  initialProducts,
  initialFetchMode,
  initialNextPage,
  initialHasNextPage,
  categoryId,
  sellerId,
  excludeId,
}: InfiniteMightLikeProps) {
  const [products, setProducts] =
    React.useState<ProductItem[]>(initialProducts);
  const [fetchMode, setFetchMode] = React.useState<"CATEGORY" | "ALL">(
    initialFetchMode,
  );
  const [page, setPage] = React.useState(initialNextPage);
  const [canFetchMore, setCanFetchMore] = React.useState(initialHasNextPage);
  const [isFetching, setIsFetching] = React.useState(false);

  const loadMoreProducts = React.useCallback(async () => {
    if (isFetching || !canFetchMore) return;

    setIsFetching(true);

    try {
      const targetCategoryId =
        fetchMode === "CATEGORY" ? categoryId : undefined;
      const res = await productService.getRecommendations(page, 10, {
        categoryId: targetCategoryId,
        sellerId,
        excludeId,
      });

      if (res.data && res.data.length > 0) {
        const freshItems = res.data.map((p: ProductItem) => ({
          ...p,
          image: p.image || "/placeholder-image.png",
        }));

        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueItems = freshItems.filter((p) => !existingIds.has(p.id));
          return [...prev, ...uniqueItems];
        });

        if (res.pagination?.hasNextPage) {
          setPage((prev) => prev + 1);
          setCanFetchMore(true);
        } else {
          if (fetchMode === "CATEGORY") {
            setFetchMode("ALL");
            setPage(1);
            setCanFetchMore(true);
          } else {
            setCanFetchMore(false);
          }
        }
      } else {
        if (fetchMode === "CATEGORY") {
          setFetchMode("ALL");
          setPage(1);
          setCanFetchMore(true);
        } else {
          setCanFetchMore(false);
        }
      }
    } catch (error) {
      console.error("Lỗi khi load thêm sản phẩm gợi ý:", error);
      setCanFetchMore(false);
    } finally {
      setIsFetching(false);
    }
  }, [
    page,
    isFetching,
    fetchMode,
    canFetchMore,
    categoryId,
    sellerId,
    excludeId,
  ]);

  return (
    <div className="w-full pb-16">
      <VirtuosoGrid
        useWindowScroll
        data={products}
        endReached={loadMoreProducts}
        overscan={1000}
        listClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-5"
        itemContent={(index, product) => (
          <ProductCard key={`might-like-${product.id}`} product={product} />
        )}
        components={{
          Footer: () =>
            // hiện khi fetch
            isFetching && canFetchMore ? (
              <div className="col-span-full my-6 flex h-16 w-full items-center justify-center">
                <ProductCardSkeleton count={10} />
              </div>
            ) : (
              <div className="h-6 w-full" />
            ),
        }}
      />
    </div>
  );
}
