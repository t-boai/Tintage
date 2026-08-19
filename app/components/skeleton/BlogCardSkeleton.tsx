import { Skeleton } from "@/components/ui/skeleton";

interface BlogCardSkeletonProps {
  count?: number;
}

export default function BlogCardSkeleton({ count = 3 }: BlogCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={`blog-skeleton-${index}`} className="flex flex-col">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-[20px] bg-neutral-100">
            <Skeleton className="h-full w-full rounded-none" />
          </div>

          <div className="mt-4 flex flex-1 flex-col justify-between">
            <div>
              <Skeleton className="h-3.5 w-20 rounded-md" />

              <div className="mt-2.5 space-y-2">
                <Skeleton className="h-5 w-full rounded-md" />
                <Skeleton className="h-5 w-3/4 rounded-md" />
              </div>

              <div className="mt-2.5 space-y-1.5">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-5/6 rounded-md" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
