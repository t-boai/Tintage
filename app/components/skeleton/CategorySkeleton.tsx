import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`cat-skeleton-${index}`}
          className="relative aspect-4/5 w-full overflow-hidden rounded-[20px] bg-neutral-100 shadow-sm"
        >
          <Skeleton className="h-full w-full rounded-none" />

          <div className="absolute inset-x-0 bottom-4 flex justify-center px-3">
            <Skeleton className="h-4 w-20 rounded-md bg-neutral-300/80" />
          </div>
        </div>
      ))}
    </div>
  );
}
