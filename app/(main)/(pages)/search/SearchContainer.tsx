"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

// interfaces
import { ProductItem } from "@/app/interfaces/products.interfaces";
import { FiltersInfoData } from "@/app/interfaces/apiRes.interfaces";

// services
import { productService } from "@/app/services/productService";

// com
import SearchContent from "@/app/(main)/(pages)/search/SearchContent";
import FilterSidebar from "@/app/(main)/(pages)/search/FilterSidebar";

interface SearchContainerProps {
  initialQuery: string;
  initialData: ProductItem[];
  filtersInfo: FiltersInfoData | null;
  initialHasNextPage: boolean;
  totalItems: number;
}

export default function SearchContainer({
  initialQuery,
  initialData,
  filtersInfo,
  initialHasNextPage,
  totalItems,
}: SearchContainerProps) {
  const searchParams = useSearchParams();

  const [products, setProducts] = React.useState<ProductItem[]>(initialData);
  const [page, setPage] = React.useState(1);
  const [isFetching, setIsFetching] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(initialHasNextPage);

  const [prevData, setPrevData] = React.useState(initialData);

  if (initialData !== prevData) {
    setPrevData(initialData);
    setProducts(initialData || []);
    setPage(1);
    setHasMore(initialHasNextPage);
  }

  // Handle Load More
  const loadMoreProducts = React.useCallback(async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);

    try {
      const nextPage = page + 1;

      const res = await productService.searchProducts({
        keyword: initialQuery,
        category: searchParams.get("category") || undefined,
        brands: searchParams.get("brands") || undefined,
        colors: searchParams.get("colors") || undefined,
        genders: searchParams.get("genders") || undefined,
        sizes: searchParams.get("sizes") || undefined,
        condition: searchParams.get("condition") || undefined,
        minPrice: searchParams.get("minPrice") || undefined,
        maxPrice: searchParams.get("maxPrice") || undefined,
        sort: searchParams.get("sort") || undefined,
        page: nextPage,
        limit: 16,
        getFilters: false,
      });

      if (res.data && res.data.length > 0) {
        setProducts((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        setHasMore(res.pagination?.hasNextPage || false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi khi cuộn tải thêm sản phẩm:", error);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, hasMore, page, initialQuery, searchParams]);

  return (
    <div className="min-h-screen bg-white py-6 md:py-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block xl:col-span-3">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] scrollbar-gutter-stable overflow-y-auto overscroll-contain rounded-2xl border border-neutral-100 bg-neutral-50 p-6 shadow-sm [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
              <FilterSidebar filtersInfo={filtersInfo} />
            </div>
          </aside>

          <main className="flex flex-col lg:col-span-9">
            <SearchContent
              query={initialQuery}
              products={products}
              hasMore={hasMore}
              loadMoreProducts={loadMoreProducts}
              totalItems={totalItems}
              filtersInfo={filtersInfo}
              mobileFilterNode={<FilterSidebar filtersInfo={filtersInfo} />}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
