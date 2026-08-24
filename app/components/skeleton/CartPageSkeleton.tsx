import { Skeleton } from "@/components/ui/skeleton";

export default function CartPageSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* DANH SÁCH SẢN PHẨM & TIẾN TRÌNH */}
      <div className="space-y-4 lg:col-span-8">
        {/* Freeship Bar Skeleton */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-64 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
          <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
        </div>

        {/* SelectItems Bar Skeleton */}
        <div className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white px-5 py-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>

        {/* Cart Items List Skeleton */}
        <div className="space-y-3.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`cart-item-skel-${i}`}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-4 sm:flex-row sm:items-start sm:p-5"
            >
              {/* Checkbox */}
              <div className="pt-2">
                <Skeleton className="h-4 w-4 rounded-md" />
              </div>

              {/* Ảnh sản phẩm */}
              <Skeleton className="h-28 w-28 shrink-0 rounded-xl sm:h-32 sm:w-32" />

              {/* Chi tiết sản phẩm */}
              <div className="flex flex-1 flex-col justify-between self-stretch">
                <div className="space-y-2">
                  {/* Shop name & Giá */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-28 rounded-md" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </div>

                  {/* Brand */}
                  <Skeleton className="h-2.5 w-14 rounded-md" />

                  {/* Tên sản phẩm */}
                  <Skeleton className="h-4 w-3/4 rounded-md" />

                  {/* Tag Tình trạng & Giao hàng */}
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-5 w-24 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-3 w-40 rounded-md" />
                </div>

                {/* Nút Tăng/Giảm SL & Trash */}
                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3.5 w-20 rounded-md" />
                    <Skeleton className="h-4 w-4 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY BOX SKELETON */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-2xs">
          <Skeleton className="h-5 w-36 rounded-md" />

          <div className="mt-4 space-y-3 border-b border-neutral-100 pb-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </div>

          <div className="my-4 flex justify-between">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-6 w-28 rounded-md" />
          </div>

          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
