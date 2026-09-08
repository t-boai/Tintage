"use client";

import * as React from "react";
import {
  Filter,
  Loader2,
  SlidersHorizontal,
  X,
  Check,
  ChevronDown,
  SearchX,
} from "lucide-react";
import { VirtuosoGrid } from "react-virtuoso";

// shad
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// skeleton and interfaces
import ProductCardSkeleton from "@/app/components/skeleton/ProductCardSkeleton";
import { ProductItem } from "@/app/interfaces/products.interfaces";
import { FiltersInfoData } from "@/app/interfaces/apiRes.interfaces";

// config
import { SORT_OPTIONS } from "@/app/config/filterSearch.config";

// com and hooks
import { useSearchFilters } from "@/app/(main)/(pages)/search/useSearchFilters";
import ProductCard from "@/app/components/productCard/productCard";
import HotDealsEmptyState from "@/app/components/hotDealsEmptyState/HotDealsEmptyState";

interface SearchContentProps {
  query: string;
  products: ProductItem[];
  hasMore: boolean;
  loadMoreProducts: () => void;
  totalItems: number;
  filtersInfo: FiltersInfoData | null;
  mobileFilterNode: React.ReactNode;
}

export default function SearchContent({
  query,
  products,
  hasMore,
  loadMoreProducts,
  totalItems,
  filtersInfo,
  mobileFilterNode,
}: SearchContentProps) {
  const {
    isPending,
    currentSort,
    activeFilters,
    handleSortSelect,
    removeActiveFilter,
    clearAllFilters,
  } = useSearchFilters(filtersInfo);

  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const sortRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node))
        setIsSortOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortValue = currentSort || (query ? "relevance" : "newest");

  return (
    <>
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-xl font-medium text-neutral-900 md:text-2xl">
              {query ? (
                <>
                  Kết quả tìm kiếm cho{" "}
                  <span className="font-bold">{`"${query}"`}</span>
                </>
              ) : (
                <span className="font-bold">Tất cả sản phẩm</span>
              )}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Hiển thị{" "}
              <span className="font-medium text-neutral-900">{totalItems}</span>{" "}
              sản phẩm
            </p>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            {/* nút lọc mobile*/}
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" className="flex-1 md:hidden" />
                }
              >
                <Filter size={16} className="mr-2" /> Lọc
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex w-full flex-col px-0 sm:w-100"
              >
                <SheetHeader className="px-6 pb-2 text-left">
                  <SheetTitle className="text-lg font-bold">BỘ LỌC</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-6">
                  {mobileFilterNode}
                </div>
              </SheetContent>
            </Sheet>

            {/* dropdown sắp xếp*/}
            <div
              className={`relative flex flex-1 items-center transition-opacity md:flex-none ${isPending ? "pointer-events-none opacity-50" : ""}`}
              ref={sortRef}
            >
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50 focus:border-(--primaryCus) md:w-50"
              >
                <div className="flex items-center gap-2">
                  {isPending ? (
                    <Loader2
                      size={14}
                      className="animate-spin text-neutral-500"
                    />
                  ) : (
                    <SlidersHorizontal size={14} className="text-neutral-500" />
                  )}
                  <span className="truncate">
                    {SORT_OPTIONS.find((o) => o.value === currentSortValue)
                      ?.label || "Sắp xếp"}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-neutral-500 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isSortOpen && (
                <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-1.5 w-full rounded-md border border-neutral-200 bg-white py-1 shadow-lg md:w-50">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setIsSortOpen(false);
                        handleSortSelect(option.value, query);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral-100 ${currentSortValue === option.value ? "bg-neutral-50 font-bold text-(--primaryCus)" : "font-medium text-neutral-700"}`}
                    >
                      {option.label}
                      {currentSortValue === option.value && (
                        <Check size={14} className="text-(--primaryCus)" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* dải badge active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            <span className="text-xs font-medium text-neutral-500">
              Đang chọn:
            </span>
            {activeFilters.map((filter) => (
              <Badge
                key={`${filter.key}-${filter.val}`}
                variant="secondary"
                onClick={() => removeActiveFilter(filter.key, filter.val)}
                className="cursor-pointer gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-neutral-200 hover:text-red-500"
              >
                {filter.display} <X size={12} className="text-neutral-400" />
              </Badge>
            ))}
            <button
              onClick={clearAllFilters}
              className="ml-2 text-xs font-medium text-(--primaryCus) hover:underline"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {isPending ? (
        <div className="mt-4 w-full">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            <ProductCardSkeleton count={8} />
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="animate-in fade-in zoom-in flex w-full flex-col items-center justify-center py-16 duration-500">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50">
              <SearchX size={36} className="text-neutral-300" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 md:text-xl">
              Không tìm thấy sản phẩm nào
            </h3>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              Rất tiếc, không có sản phẩm nào phù hợp với các tiêu chí lọc hiện
              tại. Vui lòng thử thay đổi bộ lọc hoặc dùng từ khóa khác.
            </p>
            {activeFilters.length > 0 && (
              <Button
                onClick={clearAllFilters}
                className="mt-6 bg-(--primaryCus) px-8 text-white shadow-md transition-all hover:bg-(--primaryCus)/90 hover:shadow-lg"
              >
                Xóa tất cả bộ lọc
              </Button>
            )}
          </div>

          <div className="mt-24 w-full border-t border-neutral-100 pt-16">
            <div className="mb-8 flex flex-col items-center text-center">
              <h4 className="text-lg font-bold tracking-widest text-neutral-900 uppercase">
                Gợi ý cho bạn
              </h4>
              <div className="mt-3 h-1 w-12 rounded-full bg-(--primaryCus)"></div>
            </div>

            <div className="w-full">
              <HotDealsEmptyState />
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-20 w-full">
          <VirtuosoGrid
            useWindowScroll
            data={products}
            endReached={loadMoreProducts}
            overscan={1000}
            listClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
            itemContent={(index, product) => {
              const Card = ProductCard as React.FC<{ product: ProductItem }>;
              return <Card key={`search-${product.id}`} product={product} />;
            }}
            components={{
              Footer: () =>
                hasMore ? (
                  <div className="col-span-full flex w-full items-center justify-center py-10">
                    <div className="flex items-center gap-2 rounded-full bg-neutral-50 px-6 py-2.5 text-sm font-medium text-neutral-500 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-(--primaryCus)" />
                      Đang tải thêm sản phẩm...
                    </div>
                  </div>
                ) : (
                  <div className="col-span-full mt-8 flex w-full items-center justify-center pb-26">
                    <div className="rounded-full bg-neutral-100 px-6 py-2.5 text-xs font-medium text-neutral-500 md:text-sm">
                      {"Bạn đã xem hết kết quả tìm kiếm <3"}
                    </div>
                  </div>
                ),
            }}
          />
        </div>
      )}
    </>
  );
}
