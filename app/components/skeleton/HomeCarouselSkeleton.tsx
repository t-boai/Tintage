import { Skeleton } from "@/components/ui/skeleton";

export default function HomeCarouselSkeleton() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[24px] bg-neutral-900 shadow-md sm:h-[60vh] md:h-[70vh]">
      <Skeleton className="h-full w-full rounded-none bg-neutral-800" />

      <div className="absolute inset-0 bg-linear-to-r from-neutral-950/90 via-neutral-950/70 to-transparent md:w-3/4 lg:w-2/3" />

      <div className="absolute inset-0 z-10 ml-[3vw] flex flex-col justify-between sm:p-10 md:p-12">
        <Skeleton className="mt-2 h-5 w-24 rounded-md bg-white/20" />

        <div className="my-auto max-w-xl pt-2">
          <Skeleton className="h-6 w-20 rounded-full bg-white/20" />

          <div className="mt-4 space-y-3">
            <Skeleton className="h-10 w-full max-w-100 rounded-lg bg-white/20 sm:h-12 md:h-14" />
            <Skeleton className="h-10 w-3/4 max-w-75 rounded-lg bg-white/20 sm:h-12 md:h-14" />
          </div>

          <div className="mt-6 space-y-2">
            <Skeleton className="h-4 w-full max-w-120 rounded-md bg-white/20" />
            <Skeleton className="h-4 w-5/6 max-w-120 rounded-md bg-white/20" />
          </div>

          <div className="mt-8 flex gap-3">
            <Skeleton className="h-11 w-32 rounded-xl bg-white/20" />
            <Skeleton className="h-11 w-32 rounded-xl bg-white/20" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-20 ml-[2vw] flex items-center gap-2 sm:left-10 md:left-12">
        <Skeleton className="h-2 w-8 rounded-full bg-white/40" />
        <Skeleton className="h-2 w-2 rounded-full bg-white/20" />
        <Skeleton className="h-2 w-2 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
