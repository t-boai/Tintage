import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-6">
      <div className="container mx-auto">
        {/* breadcrumb */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-3 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-3 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* info product */}
          <div className="space-y-6 lg:col-span-7">
            {/* hình ảnh */}
            <Skeleton className="aspect-square w-full rounded-2xl border-2 border-neutral-100" />

            {/* tiêu đề và hia sẻ */}
            <div className="rounded-2xl border-2 border-neutral-100 bg-white p-6">
              <div className="flex justify-between gap-4">
                <div className="w-full space-y-3">
                  <Skeleton className="h-8 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/3 rounded-md" />
                </div>
                <Skeleton className="h-10 w-10 shrink-0 rounded-md" />
              </div>
              <div className="mt-5 flex gap-3 pt-4">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-32 rounded-md" />
              </div>
            </div>

            {/* accordion */}
            <Skeleton className="h-48 w-full rounded-2xl border-2 border-neutral-100 bg-white" />

            {/* seller */}
            <Skeleton className="h-28 w-full rounded-2xl border-2 border-neutral-100 bg-white" />
          </div>

          {/* purchase product */}
          <div className="space-y-6 lg:col-span-5">
            <div className="sticky top-24 space-y-6 rounded-2xl border-2 border-neutral-100 bg-white p-6">
              {/* giá */}
              <div className="border-b-2 border-neutral-100 pb-4">
                <Skeleton className="h-10 w-1/2 rounded-md" />
                <Skeleton className="mt-2 h-4 w-1/4 rounded-md" />
              </div>

              {/* tình trạng kho */}
              <Skeleton className="h-24 w-full rounded-xl" />

              {/* nút bấm */}
              <div className="space-y-3">
                <Skeleton className="h-14 w-full rounded-md" />
                <div className="flex gap-3">
                  <Skeleton className="h-12 flex-1 rounded-md" />
                  <Skeleton className="h-12 w-12 shrink-0 rounded-md" />
                </div>
              </div>

              {/* hỗ trợ */}
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
