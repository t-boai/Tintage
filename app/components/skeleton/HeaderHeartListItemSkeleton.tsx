import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderHeartListItemSkeleton({
  count = 3,
}: {
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-3 border-b border-neutral-100 p-3">
          <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />

          <div className="flex flex-1 flex-col justify-between py-0.5">
            <Skeleton className="h-3 w-3/4 rounded-md" />
            <div className="flex items-end justify-between">
              <Skeleton className="h-3 w-1/4 rounded-md" />

              <div className="flex items-center gap-1">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
