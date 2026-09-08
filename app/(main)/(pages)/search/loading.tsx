// shad
import { Skeleton } from "@/components/ui/skeleton";

// com
import FilterSidebarSkeleton from "@/app/components/skeleton/FilterSidebarSkeleton";
import ProductCardSkeleton from "@/app/components/skeleton/ProductCardSkeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-white py-6 md:py-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* sidebar */}
          <aside className="hidden lg:col-span-3 lg:block xl:col-span-3">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-neutral-100 bg-neutral-50 p-6 shadow-sm">
              <FilterSidebarSkeleton />
            </div>
          </aside>

          {/* nội dung sản phẩm */}
          <main className="flex flex-col lg:col-span-9">
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                {/* "Kết quả tìm kiếm" */}
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64 md:w-96" />
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Sort */}
                <Skeleton className="h-10 w-full rounded-md md:w-50" />
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="w-full">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                <ProductCardSkeleton count={12} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
