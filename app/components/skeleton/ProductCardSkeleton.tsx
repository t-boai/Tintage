import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardSkeletonProps {
  count?: number;
}

export default function ProductCardSkeleton({
  count = 6,
}: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`product-skeleton-${index}`}
          className="flex h-full flex-col overflow-hidden rounded-[20px] border border-neutral-100 bg-white"
        >
          <div className="relative aspect-square w-full">
            <Skeleton className="h-full w-full rounded-none" />

            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <Skeleton className="h-4 w-10 rounded-full" />
            </div>
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
            <div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-3 w-12 rounded-md" />
              </div>

              <div className="mt-2 space-y-1.5">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-2/3 rounded-md" />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-4 w-8 rounded-md" />
              </div>
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
